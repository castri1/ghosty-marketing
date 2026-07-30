import type { Dictionary } from "@/lib/wg-copy";

function Run({ items }: { items: Dictionary["home"]["marquee"]["items"] }) {
  return (
    <span className="flex shrink-0 items-center">
      {[...items, ...items].map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-label whitespace-nowrap text-muted">{item}</span>
          <span className="mx-8 h-1.5 w-1.5 shrink-0 bg-emerald/60" aria-hidden="true" />
        </span>
      ))}
    </span>
  );
}

export function AltMarquee({ dict }: { dict: Dictionary["home"]["marquee"] }) {
  return (
    <section
      className="overflow-hidden border-y border-line bg-paper py-5"
      aria-label={dict.aria}
    >
      <div className="flex w-max animate-marquee" aria-hidden="true">
        <Run items={dict.items} />
        <Run items={dict.items} />
      </div>
    </section>
  );
}
