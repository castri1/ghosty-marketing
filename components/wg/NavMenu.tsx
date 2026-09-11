"use client";

import { useEffect, useId, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/wg-copy";
import { localizeHref } from "@/lib/wg-copy";
import type { NavGroup } from "@/lib/i18n/en";

/**
 * One dropdown of the top nav (Product, Resources). A disclosure, not an ARIA
 * menu: the trigger is a button with aria-expanded/aria-controls and the panel
 * holds plain links, so Tab walks through them like any other content.
 *
 * Opens on hover with a little intent (so crossing the bar does not flash
 * panels) and on click / Enter / Space. Closes on Escape, on a pointer down
 * outside, when focus leaves, and after picking a link. Which panel is open
 * lives in AltNav so only one is ever open at a time.
 *
 * Hand-rolled on purpose: the repo has no headless-UI dependency and the nav
 * ships on every page, so this stays small and CSS-animated.
 */
export function NavMenu({
  label,
  groups,
  locale,
  open,
  onOpen,
  onClose,
}: {
  label: string;
  groups: NavGroup[];
  locale: Locale;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | null>(null);
  const panelId = useId();

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };
  const enter = () => {
    clearTimer();
    timer.current = window.setTimeout(onOpen, 80);
  };
  const leave = () => {
    clearTimer();
    timer.current = window.setTimeout(onClose, 160);
  };

  useEffect(() => clearTimer, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onClose]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) onClose();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? onClose() : onOpen())}
        className={cn(
          "px-label flex items-center gap-1.5 py-2 transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald",
          open ? "text-ink" : "text-muted"
        )}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn("h-3 w-3 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* The pt-3 keeps the panel inside the hover area so crossing the gap
          between trigger and panel does not close it. */}
      <div
        id={panelId}
        className={cn(
          "absolute left-0 top-full pt-3 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        )}
      >
        <div className="flex gap-12 border border-line bg-surface p-6 shadow-[4px_4px_0_0_rgba(5,150,105,0.25)]">
          {groups.map((group) => (
            <div key={group.heading} className="shrink-0">
              <p className="px-label text-muted">{group.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={localizeHref(link.href, locale)}
                      onClick={onClose}
                      className="whitespace-nowrap text-sm text-ink/90 transition-colors duration-200 hover:text-emerald focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
