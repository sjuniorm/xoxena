import Image from "next/image";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="max-w-[1180px] mx-auto px-7 pt-[60px] pb-[30px] grid md:grid-cols-[1.05fr_1fr] gap-[50px] items-center relative">
      <div>
        <div className="inline-flex items-center gap-2.5 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-brown-soft bg-white px-4 py-2 rounded-full border border-dashed border-brown-soft mb-6">
          <span className="w-[7px] h-[7px] rounded-full bg-coral" />
          {t("eyebrow")}
        </div>
        <h1 className="font-[var(--font-display)] text-[clamp(64px,8vw,108px)] leading-[0.95] text-coral-dark mb-3">
          {t("headline")}
          <br />
          {t("name")}
          <span className="inline-block text-coral -rotate-6 text-[0.85em] ml-1">
            ♡
          </span>
        </h1>
        <div className="font-[var(--font-display)] text-[38px] text-brown-2 leading-none mb-[22px]">
          {t("tagline")}{" "}
          <span className="relative inline-block">
            {t("taglineUnderlined")}
            <span
              className="absolute left-0 right-0 -bottom-1 h-2 bg-no-repeat bg-[length:100%_100%]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 8'><path d='M2 5 Q 25 1 50 4 T 98 5' stroke='%23E08A8A' stroke-width='2.5' fill='none' stroke-linecap='round'/></svg>\")",
              }}
            />
          </span>
        </div>
        <p className="text-[17px] text-brown max-w-[460px] mb-7">{t("copy")}</p>
        <div className="flex gap-3.5 flex-wrap">
          <a href="#gallery" className="btn btn-primary">
            {t("ctaPrimary")}
          </a>
          <a href="#custom" className="btn btn-ghost">
            {t("ctaGhost")}
          </a>
        </div>
      </div>
      <div className="relative flex items-center justify-center min-h-[480px]">
        <div className="relative w-full max-w-[460px] aspect-square bg-white rounded-full p-3.5 -rotate-2 shadow-[0_18px_40px_-16px_rgba(92,68,56,0.28)]">
          <div className="absolute inset-0 rounded-full border border-dashed border-coral opacity-50 scale-[1.06] pointer-events-none" />
          <Image
            src="/logo.png"
            alt="XO Xena — Homemade with Love"
            width={460}
            height={460}
            className="w-full h-full rounded-full object-cover"
            priority
          />
        </div>
        <Yarn className="w-[90px] h-[90px] top-[4%] -right-2.5 bg-mint animate-[floaty_8s_ease-in-out_infinite]" />
        <Yarn className="w-[60px] h-[60px] bottom-[18%] -left-2.5 bg-sky animate-[floaty_7s_ease-in-out_-2s_infinite]" />
        <Yarn className="w-[70px] h-[70px] top-[38%] right-[18px] bg-butter animate-[floaty_9s_ease-in-out_-4s_infinite]" />
        <Yarn className="w-[50px] h-[50px] bottom-[4%] right-[30%] bg-lavender animate-[floaty_6s_ease-in-out_-1s_infinite]" />
        <Sparkle className="top-[6%] left-[4%]" />
        <Sparkle className="bottom-[12%] right-[6%] [animation-delay:-1.5s]" />
        <Sparkle className="top-1/2 -left-[2%] [animation-delay:-0.7s]" />
      </div>
    </section>
  );
}

function Yarn({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "absolute rounded-full shadow-[inset_-6px_-8px_0_rgba(0,0,0,0.04),0_8px_24px_-10px_rgba(92,68,56,0.22)] " +
        className
      }
    >
      <div className="absolute inset-[8%] rounded-full border border-dashed border-white/60" />
      <div className="absolute inset-[20%] rounded-full border border-dashed border-white/60 rotate-45" />
    </div>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <span
      className={
        "absolute font-[var(--font-display)] text-coral text-2xl pointer-events-none animate-[twinkle_3s_ease-in-out_infinite] " +
        className
      }
    >
      ✦
    </span>
  );
}
