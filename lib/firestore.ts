import { Firestore } from '@google-cloud/firestore';

/**
 * Content store client — the `ghosty-central` Firestore database (the
 * marketing collections are additive alongside the platform's tenants/events).
 * Auth is ADC: the runtime service account in prod, `gcloud auth
 * application-default login` locally. `FIRESTORE_EMULATOR_HOST` (used by the
 * test flow) is honored automatically by the client library.
 */
let db: Firestore | undefined;

export function getDb(): Firestore {
  db ??= new Firestore({
    projectId: process.env.MARKETING_FIRESTORE_PROJECT ?? 'ghosty-central',
  });
  return db;
}
