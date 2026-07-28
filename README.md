# ghosty-marketing

The Ghosty marketing site — public pages on the apex `getghosty.dev` (home, docs, changelog,
privacy, terms), served by the Cloud Run service `marketing` in `ghosty-central`. Architecture,
content system, and dev workflow live in [CLAUDE.md](./CLAUDE.md); this file covers **build,
deploy, and the one-time service bootstrap**.

## Deploy pipeline (CI)

Pushing to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

1. **Keyless GCP auth** — Workload Identity Federation (no GitHub secrets), same provider + SA
   as the ghosty monorepo's `deploy-platform.yml`:
   provider `projects/210793865131/locations/global/workloadIdentityPools/github/providers/github-oidc`,
   SA `github-deployer@ghosty-central.iam.gserviceaccount.com`.
2. **Build** the multi-stage image on the runner ([Dockerfile](./Dockerfile): `next build` with
   no store credentials → Node 24 standalone runtime with `public/` + `.next/static` copied in).
3. **Push** `us-east1-docker.pkg.dev/ghosty-central/platform/marketing:<git-short-sha>` —
   sha tags only, never `latest`.
4. **Deploy** the `marketing` Cloud Run service (`us-east1`, min-instances 1, runtime SA
   `marketing-runtime@`, secret `MARKETING_CONTENT_TOKEN` from `marketing-content-token`).
5. **Smoke** `GET /health` on the service's `run.app` URL (switches to the apex URL after the
   cutover — see the TODO in the workflow).

None of this works until the bootstrap below has been executed once.

## Service bootstrap (one-time, operator-only — OPS O1 phase A)

Copy-pasteable commands for the operator (`gcloud` as `daniel@melonn.com`). This is step A1 of
the marketing-split cutover — `docs/runbooks/13-marketing-split.md` in the ghosty repo is the
orchestrating runbook; run these in order from a checkout of **this** repo.

```bash
PROJECT=ghosty-central
REGION=us-east1
RUNTIME_SA=marketing-runtime@ghosty-central.iam.gserviceaccount.com
DEPLOYER_SA=github-deployer@ghosty-central.iam.gserviceaccount.com
```

### 1. Runtime service account

`roles/datastore.user` on central (reads/writes the `marketing_*` content collections).
Posture note: this role is project-wide — the content store IAM model cannot scope to
collections, and the marketing content deliberately lives in the central database alongside
the platform's collections (approved marketing-split design; see the `marketing` service spec
in the ghosty repo's `infra/central/README.md`). The service's only write path into that
store is the bearer-token content API.

```bash
gcloud iam service-accounts create marketing-runtime \
  --project="$PROJECT" --display-name="Marketing site runtime"

gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:$RUNTIME_SA" \
  --role=roles/datastore.user
```

### 2. Content write token (secret `marketing-content-token`)

Random 64 url-safe bytes; the accessor grant is scoped to this one secret (the runtime SA gets
no project-wide Secret Manager role — house posture):

```bash
TOKEN="$(python3 -c 'import secrets; print(secrets.token_urlsafe(64))')"
printf '%s' "$TOKEN" | gcloud secrets create marketing-content-token \
  --project="$PROJECT" --replication-policy=automatic --data-file=-

gcloud secrets add-iam-policy-binding marketing-content-token \
  --project="$PROJECT" \
  --member="serviceAccount:$RUNTIME_SA" \
  --role=roles/secretmanager.secretAccessor
```

Keep `$TOKEN` in the shell — it is the `MARKETING_CONTENT_TOKEN` the seed step (runbook 13,
A2) and every `/rollout` publish use.

Rotation note: the service reads the secret's `latest` version at instance startup, so after
adding a new version, redeploy (or push to `main`) so all instances pick it up together —
until then old and new instances can hold different tokens.

### 3. First manual deploy (creates the service)

The CI deployer only gets **resource-scoped** grants (step 4), so the service must exist
first — this initial deploy runs as the operator. It is also the only place
`--allow-unauthenticated` is set: public access is a persistent IAM binding, CI deploys never
touch IAM.

```bash
SHA="$(git rev-parse --short HEAD)"
IMG="us-east1-docker.pkg.dev/$PROJECT/platform/marketing:$SHA"

gcloud auth configure-docker us-east1-docker.pkg.dev
docker build --platform linux/amd64 -t "$IMG" .
docker push "$IMG"

gcloud run deploy marketing \
  --project="$PROJECT" --region="$REGION" \
  --image="$IMG" \
  --service-account="$RUNTIME_SA" \
  --min-instances=1 \
  --set-secrets=MARKETING_CONTENT_TOKEN=marketing-content-token:latest \
  --allow-unauthenticated
```

Verify: `curl -si "$(gcloud run services describe marketing --project="$PROJECT" \
--region="$REGION" --format='value(status.url)')/health" | head -1` → 200.

### 4. CI deployer grants (resource-scoped, mirrors the platform posture)

The deployer SA already holds Artifact Registry writer on the `platform` repo and
project-level `roles/run.viewer` (from the platform pipeline) — nothing to add there. Grant
it deploy rights on exactly this service and impersonation of exactly this runtime SA:

```bash
gcloud run services add-iam-policy-binding marketing \
  --project="$PROJECT" --region="$REGION" \
  --member="serviceAccount:$DEPLOYER_SA" \
  --role=roles/run.developer

gcloud iam service-accounts add-iam-policy-binding "$RUNTIME_SA" \
  --project="$PROJECT" \
  --member="serviceAccount:$DEPLOYER_SA" \
  --role=roles/iam.serviceAccountUser
```

### 5. Extend WIF trust to this repo

The provider's attribute condition currently trusts only `castri1/ghosty` (pinned to
`refs/heads/main` — see ghosty `docs/deploy-speed.md` §10). **Inspect the live condition
first and preserve every existing clause** — the update below must be the live condition
with only the repository clause widened, never a replacement that drops a pin:

```bash
gcloud iam workload-identity-pools providers describe github-oidc \
  --project="$PROJECT" --location=global --workload-identity-pool=github \
  --format='value(attributeCondition)'

# Adjust to match what describe printed; expected shape (keeps the main-only ref pin —
# both repos deploy exclusively from main):
gcloud iam workload-identity-pools providers update-oidc github-oidc \
  --project="$PROJECT" --location=global --workload-identity-pool=github \
  --attribute-condition="assertion.repository in ['castri1/ghosty', 'castri1/ghosty-marketing'] && assertion.ref == 'refs/heads/main'"
```

Allow this repo's workflow identity to impersonate the deployer SA:

```bash
gcloud iam service-accounts add-iam-policy-binding "$DEPLOYER_SA" \
  --project="$PROJECT" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/210793865131/locations/global/workloadIdentityPools/github/attribute.repository/castri1/ghosty-marketing"
```

### 6. Prove the pipeline

Actions → `deploy-marketing` → Run workflow (or push any commit to `main`). Green run =
image pushed with the sha tag + service rolled + `/health` smoke OK. Then continue with
runbook 13 phase A2 (seed + diff against the live apex).

## Local image verification

```bash
docker build -t ghosty-marketing-local .
docker run --rm -p 3000:3000 ghosty-marketing-local
curl -si http://localhost:3000/ | head -1        # 200 (pages render empty without a store — expected)
curl -si http://localhost:3000/health | head -1  # 200 once M3 (CAS-97) is merged
```

The build needs no database credentials by design — see "Caching / build rules" in
[CLAUDE.md](./CLAUDE.md).
