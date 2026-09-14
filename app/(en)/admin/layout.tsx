import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AdminNav } from '@/components/admin/ui';

/**
 * Operator dashboard shell (Basic Auth via middleware.ts; noindex). Always
 * dynamic: no cached admin data, and the credential-less build never
 * prerenders it.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin - White Ghost',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px 64px', display: 'grid', gap: 24, alignContent: 'start' }}>
      <AdminNav />
      {children}
    </main>
  );
}
