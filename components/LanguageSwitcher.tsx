"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/lib/i18n";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "nl", label: "NL" },
] as const;

export function LanguageSwitcher() {
  const current = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex gap-1 items-center bg-white rounded-full p-1 border border-dashed border-brown-soft">
      {LOCALES.map((l) => {
        const active = l.code === current;
        return (
          <Link
            key={l.code}
            href={pathname}
            locale={l.code}
            className={
              "px-3 py-1 rounded-full text-xs font-semibold transition-colors " +
              (active
                ? "bg-coral text-white"
                : "text-brown hover:bg-cream-2")
            }
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
