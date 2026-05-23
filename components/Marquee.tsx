import { useTranslations } from "next-intl";

export function Marquee() {
  const t = useTranslations("marquee");
  const items = t.raw("items") as string[];
  const line = items.join(" ♡ ");

  return (
    <div className="bg-coral text-cream py-3.5 overflow-hidden relative mt-10 -rotate-[1.2deg] border-y border-coral-dark">
      <div className="flex gap-10 whitespace-nowrap animate-[scroll-x_30s_linear_infinite] font-[var(--font-display)] text-[28px]">
        <span className="inline-flex items-center gap-10 shrink-0">
          {line} ♡
        </span>
        <span
          className="inline-flex items-center gap-10 shrink-0"
          aria-hidden
        >
          {line} ♡
        </span>
      </div>
    </div>
  );
}
