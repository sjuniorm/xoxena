import { useTranslations } from "next-intl";

export function About() {
  const t = useTranslations("about");

  return (
    <section
      id="about"
      className="bg-[linear-gradient(180deg,transparent_0%,var(--color-cream-2)_30%,var(--color-cream-2)_70%,transparent_100%)]"
    >
      <div className="max-w-[1180px] mx-auto px-7 py-20">
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-[60px] items-center">
          <Portrait label={t("portraitLabel")} />
          <div>
            <div className="eyebrow">{t("eyebrow")}</div>
            <h2 className="mb-5">{t("heading")}</h2>
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <div className="font-[var(--font-display)] text-4xl text-coral mt-3">
              {t("signature")}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-7">
              <Fact n={t("fact1Number")} l={t("fact1Label")} />
              <Fact n={t("fact2Number")} l={t("fact2Label")} />
              <Fact n={t("fact3Number")} l={t("fact3Label")} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Portrait({ label }: { label: string }) {
  return (
    <div
      className="relative aspect-[4/5] rounded-[6px] -rotate-3 shadow-[0_18px_40px_-16px_rgba(92,68,56,0.28)] flex items-end justify-center p-5 text-coral-dark"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(224,138,138,0.12) 0 6px, transparent 6px 14px)",
        backgroundColor: "var(--color-rose)",
      }}
    >
      <span className="absolute -top-4 left-[30%] w-[110px] h-7 bg-white/65 -rotate-6 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" />
      <span className="absolute -bottom-3.5 right-[22%] w-[90px] h-[26px] rotate-[4deg] shadow-[0_2px_6px_rgba(0,0,0,0.08)] bg-peach/85" />
      <span className="font-[var(--font-mono)] text-[11px] tracking-[0.15em] uppercase bg-white px-3.5 py-2 rounded text-brown-soft">
        {label}
      </span>
    </div>
  );
}

function Fact({ n, l }: { n: string; l: string }) {
  return (
    <div className="bg-white rounded-[14px] py-4 px-4 text-center shadow-[0_8px_24px_-10px_rgba(92,68,56,0.22)] border border-dashed border-[rgba(184,147,128,0.4)]">
      <div className="font-[var(--font-display)] text-[38px] text-coral-dark leading-none">
        {n}
      </div>
      <div className="text-[12px] text-brown-soft mt-1.5 tracking-[0.1em] uppercase font-[var(--font-mono)]">
        {l}
      </div>
    </div>
  );
}
