import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';

/** Operator UI primitives for /admin: plain, inline-styled, no brand system. */

export const card: CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: '20px 24px',
  background: '#fff',
};

export const th: CSSProperties = {
  textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid #cbd5e1',
  fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', whiteSpace: 'nowrap',
};
export const td: CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontSize: 14, verticalAlign: 'top' };
export const muted: CSSProperties = { fontSize: 13, color: '#64748b' };
export const mono: CSSProperties = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 };

export function Card({ title, children, right }: { title?: string; children: ReactNode; right?: ReactNode }) {
  return (
    <section style={card}>
      {(title || right) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          {title && <h2 style={{ fontSize: 18, margin: '0 0 12px' }}>{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>{children}</table>
    </div>
  );
}

const badgeBase: CSSProperties = {
  display: 'inline-block', padding: '1px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600,
  lineHeight: '18px', whiteSpace: 'nowrap',
};

export function PotencialBadge({ n }: { n: 1 | 2 | 3 }) {
  const c = { 1: ['#f1f5f9', '#475569'], 2: ['#fef3c7', '#92400e'], 3: ['#dcfce7', '#166534'] }[n];
  return <span style={{ ...badgeBase, background: c[0], color: c[1] }}>P{n}</span>;
}

export function EstadoBadge({ estado }: { estado: 'activa' | 'descartada' }) {
  const on = estado === 'activa';
  return <span style={{ ...badgeBase, background: on ? '#e0f2fe' : '#fee2e2', color: on ? '#075985' : '#991b1b' }}>{estado}</span>;
}

export function CeldaBadge({ estado, extra }: { estado: 'sin-medir' | 'nombra' | 'no' | 'sin-pregunta'; extra?: string }) {
  const map = {
    nombra: ['#dcfce7', '#166534', 'NOS NOMBRA'],
    no: ['#fff', '#64748b', 'no'],
    'sin-medir': ['#fef9c3', '#854d0e', 'sin medir'],
    'sin-pregunta': ['#f8fafc', '#94a3b8', '-'],
  }[estado];
  return (
    <span>
      <span style={{ ...badgeBase, background: map[0], color: map[1], border: estado === 'no' ? '1px solid #e2e8f0' : 'none' }}>{map[2]}</span>
      {extra && <span style={{ ...muted, marginLeft: 6 }}>{extra}</span>}
    </span>
  );
}

export function LangBadge({ lang }: { lang: string }) {
  return <span style={{ ...badgeBase, background: '#f1f5f9', color: '#334155', fontWeight: 500 }}>{lang.toUpperCase()}</span>;
}

const TABS = [
  ['/admin', 'Resumen'],
  ['/admin/preguntas', 'Preguntas'],
  ['/admin/competidores', 'Competidores'],
  ['/admin/corridas', 'Corridas'],
] as const;

export function AdminNav() {
  return (
    <nav style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e2e8f0', marginBottom: 24, flexWrap: 'wrap' }}>
      {TABS.map(([href, label]) => (
        <Link key={href} href={href} style={{ padding: '10px 14px', fontSize: 14, color: '#0f172a', textDecoration: 'none', borderBottom: '2px solid transparent' }}>
          {label}
        </Link>
      ))}
      <span style={{ marginLeft: 'auto', ...muted, alignSelf: 'center' }}>whiteghost.ai admin</span>
    </nav>
  );
}

export function Crumbs({ items }: { items: Array<[string, string] | string> }) {
  return (
    <p style={{ ...muted, margin: '0 0 8px' }}>
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && ' / '}
          {typeof it === 'string' ? it : <Link href={it[0]} style={{ color: '#475569' }}>{it[1]}</Link>}
        </span>
      ))}
    </p>
  );
}
