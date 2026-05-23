import { useTranslations } from "next-intl";
import { contact } from "@/lib/contact";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");

  return (
    <footer className="mt-10 bg-brown text-cream px-7 pt-[60px] pb-[30px] relative">
      <span
        className="absolute -top-4 left-0 right-0 h-4 bg-repeat-x"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 16' preserveAspectRatio='none'><path d='M0 16 Q 10 0 20 16 Q 30 0 40 16 Z' fill='%235C4438'/></svg>\")",
          backgroundSize: "40px 16px",
        }}
      />
      <div className="max-w-[1180px] mx-auto grid md:grid-cols-[1.4fr_1fr_1fr] grid-cols-1 gap-10">
        <div>
          <div className="font-[var(--font-display)] text-[38px] text-rose leading-tight">
            {t("brand")}
          </div>
          <div className="text-sm text-cream-3 mt-2">{t("tag")}</div>
        </div>
        <FooterCol heading={t("wanderHeading")}>
          <FooterLink href="#about">{tn("about")}</FooterLink>
          <FooterLink href="#gallery">{tn("gallery")}</FooterLink>
          <FooterLink href="#custom">{tn("custom")}</FooterLink>
        </FooterCol>
        <FooterCol heading={t("sayHiHeading")}>
          <FooterLink href={contact.instagram}>instagram</FooterLink>
          <FooterLink href={contact.whatsapp}>whatsapp</FooterLink>
          <FooterLink href={contact.email}>email</FooterLink>
          <FooterLink href="#">{t("shippingLink")}</FooterLink>
        </FooterCol>
      </div>
      <div className="max-w-[1180px] mx-auto mt-10 pt-6 border-t border-dashed border-white/15 flex justify-between flex-wrap gap-2.5 text-xs text-cream-3">
        <div>{t("copyright")}</div>
        <div>{t("footerNote")}</div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-rose m-0 mb-3.5">
        {heading}
      </h4>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="block text-cream-2 no-underline text-sm mb-2 hover:text-rose"
    >
      {children}
    </a>
  );
}
