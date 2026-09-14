import type { ReactNode } from 'react';

/**
 * Content shell: docs, changelog, blog, glossary, deploy guides, and legal
 * pages keep the `.mkt` scope (the verbatim console-ported marketing CSS in
 * styles/marketing.css) and its centered shell. The site chrome (nav + footer,
 * ported from the design lab) lives in the root layout, outside `.mkt`, so
 * `.mkt`'s element rules cannot leak into it; the top padding clears the
 * fixed nav.
 */
export default function ContentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mkt">
      <div className="mkt-atmosphere" />
      <div className="shell">{children}</div>
    </div>
  );
}
