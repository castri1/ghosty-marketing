import type { ReactNode } from 'react';

/** Spanish content shell: same `.mkt` scope as app/(content)/layout.tsx. */
export default function EsContentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mkt">
      <div className="mkt-atmosphere" />
      <div className="shell">{children}</div>
    </div>
  );
}
