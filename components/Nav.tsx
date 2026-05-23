import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Nav() {
  const t = useTranslations("nav");

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(253,245,236,0.82)] border-b border-dashed border-[rgba(184,147,128,0.35)]">
      <div className="max-w-[1180px] mx-auto px-7 py-3.5 flex items-center justify-between gap-7">
        <a
          href="#top"
          className="flex items-center gap-2.5 font-[var(--font-display)] text-[28px] text-coral-dark no-underline"
        >
          <span>XO</span>
          <span className="text-coral">♡</span>
          <span>Xena</span>
        </a>
        <div className="hidden md:flex gap-7 items-center">
          <NavLink href="#about">{t("about")}</NavLink>
          <NavLink href="#gallery">{t("gallery")}</NavLink>
          <NavLink href="#custom">{t("custom")}</NavLink>
        </div>
        <LanguageSwitcher />
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-brown no-underline font-medium text-[15px] py-1 px-0.5 hover:text-coral-dark"
    >
      {children}
    </a>
  );
}
