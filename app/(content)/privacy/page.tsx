import type { Metadata } from 'next';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'Privacy Policy — White Ghost',
  description:
    'How White Ghost collects, uses, and protects information across the platform, the CLI, and the websites under whiteghost.ai.',
  path: '/privacy',
});

// Bounded CDN TTL — see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Privacy Policy — ported as-is from the console's marketing/Privacy.tsx. */
export default function Privacy() {
  return (
    <main className="legal">
      <h1>Privacy Policy</h1>
      <p className="meta">Effective July 21, 2026</p>

      <p>
        This Privacy Policy describes how White Ghost (&quot;White Ghost&quot;, &quot;we&quot;,
        &quot;us&quot;) collects, uses, and protects information when you use the White Ghost
        platform, the White Ghost command-line tool, and the websites we operate under{' '}
        <strong>whiteghost.ai</strong> (together, the &quot;Service&quot;).
      </p>

      <h2>Who we are</h2>
      <p>
        White Ghost is a deployment platform that lets companies give their employees a safe, isolated
        environment to build and ship internal applications. Each customer company operates in
        its own dedicated cloud environment.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Account information via Google Sign-In.</strong> When you sign in with Google,
          we receive your basic profile information: your name, email address, and profile
          picture. We request only the <code>openid</code>, <code>email</code>, and{' '}
          <code>profile</code> scopes. We do not request access to your Gmail, Drive, Calendar,
          contacts, or any other Google service data.
        </li>
        <li>
          <strong>Workspace activity.</strong> When you build or manage applications on the
          Service, we record the operations you perform (for example: app creation, deployments,
          configuration changes, and database console queries) so your company has an audit
          trail.
        </li>
        <li>
          <strong>GitHub organization metadata.</strong> When a company connects its GitHub
          organization, we store the organization name and the installation identifier of the
          White Ghost GitHub App. Application source code remains in the company&apos;s own GitHub
          organization.
        </li>
        <li>
          <strong>Technical data.</strong> Standard server logs (IP address, browser type,
          timestamps) used for security and reliability.
        </li>
        <li>
          <strong>Product analytics.</strong> We use PostHog to understand how whiteghost.ai is
          used — the pages you visit, the features you use, and session replays of console
          activity. Replays mask everything you type, and we never track the applications you
          build or the data inside them. If you&apos;d like your activity excluded, email{' '}
          <a href="mailto:hello@whiteghost.ai">hello@whiteghost.ai</a>.
        </li>
      </ul>

      <h2>How we use information</h2>
      <ul>
        <li>To authenticate you and associate you with your company&apos;s environment.</li>
        <li>
          To restrict access to your company&apos;s environment to email domains your company has
          approved.
        </li>
        <li>To provision and operate the applications and infrastructure your company creates.</li>
        <li>
          To provide audit logs, deployment history, and usage information to your company&apos;s
          administrators.
        </li>
        <li>To secure, maintain, and improve the Service.</li>
      </ul>

      <h2>Google user data</h2>
      <p>
        White Ghost&apos;s use and transfer of information received from Google APIs adheres to the{' '}
        <a href="https://developers.google.com/terms/api-services-user-data-policy" rel="noopener">
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements. Specifically:
      </p>
      <ul>
        <li>
          We use Google user data (name, email address, profile picture) only to authenticate you
          and operate your account.
        </li>
        <li>
          We do not sell Google user data, use it for advertising, or transfer it to third
          parties except as necessary to provide the Service, comply with applicable law, or as
          part of a merger or acquisition with notice to you.
        </li>
        <li>
          Humans do not read this data except with your permission, for security purposes, or to
          comply with applicable law.
        </li>
      </ul>

      <h2>How information is shared</h2>
      <ul>
        <li>
          <strong>With your company.</strong> Your company&apos;s administrators can see your
          name, email, the applications you own, and your activity within their environment.
        </li>
        <li>
          <strong>Service providers.</strong> We run on Google Cloud Platform; data is processed
          and stored there. We use GitHub (to create and manage application repositories in your
          company&apos;s organization), npm (to distribute our CLI), and PostHog (product
          analytics and session replay).
        </li>
        <li>
          <strong>Legal.</strong> We may disclose information if required by law or to protect
          the rights, safety, and security of White Ghost, our customers, or the public.
        </li>
      </ul>
      <p>We do not sell personal information.</p>

      <h2>Data retention &amp; deletion</h2>
      <p>
        We retain personal information for as long as your account is active or as needed to
        provide the Service to your company. When a company offboards, its environment —
        including databases, secrets, and logs — is deleted. You may request deletion of your
        personal data at any time by emailing{' '}
        <a href="mailto:hello@whiteghost.ai">hello@whiteghost.ai</a>; we will respond within 30
        days.
      </p>

      <h2>Security</h2>
      <p>
        Each customer company runs in an isolated cloud project with separate databases, secrets,
        and networking. Credentials are stored in a managed secret store, never in source code.
        Access to production systems is limited and audited.
      </p>

      <h2>Children</h2>
      <p>
        The Service is intended for business use and is not directed to children under 16. We do
        not knowingly collect personal information from children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will post the updated version on this
        page with a new effective date, and for material changes we will notify customer
        administrators by email.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or your data:{' '}
        <a href="mailto:hello@whiteghost.ai">hello@whiteghost.ai</a>.
      </p>
    </main>
  );
}
