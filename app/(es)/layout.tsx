import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ROOT_METADATA, ROOT_VIEWPORT, RootShell } from '@/components/wg/RootShell';
import { es } from '@/lib/i18n/es';

export const metadata: Metadata = {
  ...ROOT_METADATA,
  title: es.meta.home.title,
  description: es.meta.home.description,
};
export const viewport = ROOT_VIEWPORT;

/** Root layout of the Spanish site (/es and everything under it). */
export default function EsRootLayout({ children }: { children: ReactNode }) {
  return <RootShell lang="es">{children}</RootShell>;
}
