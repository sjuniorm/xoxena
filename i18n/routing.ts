import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "nl"],
  defaultLocale: "en",
  localePrefix: "always",
});
