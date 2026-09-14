import type { Metadata } from 'next';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'Terms of Service — White Ghost',
  description:
    'The terms that govern use of the White Ghost platform, command-line tool, and websites under whiteghost.ai.',
  path: '/terms',
});

// Bounded CDN TTL — see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Terms of Service — ported as-is from the console's marketing/Terms.tsx. */
export default function Terms() {
  return (
    <main className="legal">
      <h1>Terms of Service</h1>
      <p className="meta">Effective June 11, 2026</p>

      <p>
        These Terms of Service (&quot;Terms&quot;) govern access to and use of the White Ghost
        platform, command-line tool, and websites operated under <strong>whiteghost.ai</strong>{' '}
        (the &quot;Service&quot;) by the company that registers for the Service (the
        &quot;Customer&quot;) and the individual users it authorizes (&quot;Users&quot;). By
        using the Service you agree to these Terms.
      </p>

      <h2>1. The Service</h2>
      <p>
        White Ghost provides a managed platform on which Customers&apos; authorized Users can build,
        deploy, and operate internal applications inside a dedicated, isolated cloud environment
        that White Ghost provisions and operates on the Customer&apos;s behalf.
      </p>

      <h2>2. Accounts and access</h2>
      <ul>
        <li>
          Users sign in with Google. Access to a Customer&apos;s environment is restricted to
          email domains the Customer approves.
        </li>
        <li>
          The Customer is responsible for designating its administrators and for the actions of
          its Users within its environment.
        </li>
        <li>You must keep credentials secure and must not share accounts.</li>
      </ul>

      <h2>3. Customer content and code</h2>
      <ul>
        <li>
          Application source code is stored in repositories within the Customer&apos;s own GitHub
          organization and belongs to the Customer.
        </li>
        <li>
          Data stored in databases provisioned for the Customer&apos;s applications belongs to
          the Customer.
        </li>
        <li>
          The Customer grants White Ghost the rights necessary to host, build, deploy, and operate
          this code and data solely to provide the Service.
        </li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>
        You agree not to use the Service to: violate any law; infringe others&apos; rights;
        distribute malware or conduct attacks; mine cryptocurrency; send spam; attempt to access
        other customers&apos; environments; resell the Service without our written agreement; or
        place workloads on the Service that are designed to circumvent its isolation or resource
        controls.
      </p>

      <h2>5. Fees</h2>
      <p>
        Fees, if applicable, are set out in the ordering document or plan the Customer agrees to.
        During early access, the Service may be provided free of charge; we may introduce or
        change fees with at least 30 days&apos; notice to the Customer.
      </p>

      <h2>6. Availability and support</h2>
      <p>
        We aim for high availability but the Service is provided without a guaranteed service
        level during early access. We may modify features with reasonable notice of material
        changes.
      </p>

      <h2>7. Suspension and termination</h2>
      <ul>
        <li>
          The Customer may stop using the Service at any time and may request deletion of its
          environment.
        </li>
        <li>
          We may suspend or terminate access for material breach of these Terms, for security
          reasons, or where required by law.
        </li>
        <li>
          Upon termination, the Customer retains its code (already in its GitHub organization).
          We will make application data available for export for 30 days, after which the
          environment is deleted.
        </li>
      </ul>

      <h2>8. Intellectual property</h2>
      <p>
        White Ghost retains all rights in the Service, including its software, templates, and
        documentation. Scaffolded application code generated into the Customer&apos;s
        repositories is licensed to the Customer without restriction.
      </p>

      <h2>9. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;. TO THE MAXIMUM
        EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOSS OF PROFITS, REVENUE, OR
        DATA. OUR AGGREGATE LIABILITY UNDER THESE TERMS IS LIMITED TO THE AMOUNTS PAID BY THE
        CUSTOMER FOR THE SERVICE IN THE 12 MONTHS BEFORE THE CLAIM, OR USD 100 IF NO FEES WERE
        PAID.
      </p>

      <h2>11. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. We will post the updated version on this
        page and, for material changes, notify Customer administrators by email at least 14 days
        before they take effect.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these Terms:{' '}
        <a href="mailto:hello@whiteghost.ai">hello@whiteghost.ai</a>.
      </p>
    </main>
  );
}
