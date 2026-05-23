import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Caveat, Quicksand, DM_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export const metadata = {
  title: "XO Xena — Homemade with Love",
  description:
    "Hand-crocheted softies, accessories and keepsakes — made one stitch at a time, with love.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${caveat.variable} ${quicksand.variable} ${dmMono.variable}`}
    >
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
