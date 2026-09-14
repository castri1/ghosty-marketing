import type { ReactNode } from 'react';
import { ROOT_METADATA, ROOT_VIEWPORT, RootShell } from '@/components/wg/RootShell';

export const metadata = ROOT_METADATA;
export const viewport = ROOT_VIEWPORT;

/** Root layout of the English site (every path outside /es). */
export default function EnRootLayout({ children }: { children: ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
