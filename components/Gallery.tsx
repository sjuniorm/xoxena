import { useTranslations } from "next-intl";

const ITEM_STYLES = [
  { card: "bg-white -rotate-2 md:col-span-4", swatch: "bg-peach" },
  {
    card: "bg-cream-2 rotate-[1.5deg] md:col-span-5",
    swatch: "bg-mint",
  },
  { card: "bg-white -rotate-1 md:col-span-3", swatch: "bg-lavender" },
  { card: "bg-rose rotate-2 md:col-span-3", swatch: "bg-sky" },
  {
    card: "bg-white -rotate-[1.5deg] md:col-span-5",
    swatch: "bg-rose",
  },
  { card: "bg-cream-2 rotate-1 md:col-span-4", swatch: "bg-butter" },
];

export function Gallery() {
  const t = useTranslations("gallery");
  const items = t.raw("items") as { placeholder: string; caption: string }[];

  return (
    <section id="gallery">
      <div className="max-w-[1180px] mx-auto px-7 py-20">
        <div className="text-center mb-[50px]">
          <div className="eyebrow mb-2">{t("eyebrow")}</div>
          <h2 className="mb-2.5">{t("heading")}</h2>
          <p className="text-brown-2 text-base max-w-[520px] mx-auto">
            {t("sub")}
          </p>
        </div>
        <div className="grid grid-cols-12 gap-[22px]">
          {items.map((item, i) => (
            <Photo
              key={i}
              cardClass={ITEM_STYLES[i].card}
              swatchClass={ITEM_STYLES[i].swatch}
              placeholder={item.placeholder}
              caption={item.caption}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Photo({
  cardClass,
  swatchClass,
  placeholder,
  caption,
}: {
  cardClass: string;
  swatchClass: string;
  placeholder: string;
  caption: string;
}) {
  return (
    <div
      className={
        "relative rounded-[6px] shadow-[0_8px_24px_-10px_rgba(92,68,56,0.22)] pt-2.5 px-2.5 pb-9 transition-transform duration-200 hover:-translate-y-1 sm:col-span-6 col-span-12 " +
        cardClass
      }
    >
      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 -rotate-[4deg] w-20 h-[22px] bg-white/75 border border-dashed border-[rgba(184,147,128,0.4)] z-10" />
      <div
        className={
          "aspect-square rounded-[4px] flex items-center justify-center relative " +
          swatchClass
        }
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.45) 0 4px, transparent 4px 12px)",
        }}
      >
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.15em] bg-white/85 px-2.5 py-1.5 rounded-[3px] text-brown-soft text-center">
          {placeholder}
        </span>
      </div>
      <div className="font-[var(--font-display)] text-[22px] text-brown-2 text-center mt-2 leading-none">
        {caption}
      </div>
    </div>
  );
}
