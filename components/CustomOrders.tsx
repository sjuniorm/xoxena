import { useTranslations } from "next-intl";
import { OrderForm } from "./OrderForm";

export function CustomOrders() {
  const t = useTranslations("custom");
  const checklistKeys = [
    "checklist1",
    "checklist2",
    "checklist3",
    "checklist4",
  ] as const;

  return (
    <section id="custom">
      <div className="max-w-[1180px] mx-auto px-7 py-20">
        <div className="grid md:grid-cols-2 gap-[60px] items-center">
          <div>
            <div className="eyebrow">{t("eyebrow")}</div>
            <h2 className="mb-4">
              {t("heading1")}
              <br />
              {t("heading2")}
            </h2>
            <p className="text-brown text-[17px]">{t("copy")}</p>
            <ul className="list-none p-0 m-0 mt-4">
              {checklistKeys.map((k) => (
                <li
                  key={k}
                  className="py-2 pl-8 relative text-brown text-[15px]"
                >
                  <span className="absolute left-1 top-[6px] text-coral text-[16px]">
                    ♡
                  </span>
                  {t(k)}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative bg-white rounded-[26px] p-9 shadow-[0_18px_40px_-16px_rgba(92,68,56,0.28)] border-[1.5px] border-dashed border-[rgba(224,138,138,0.4)]">
            <span className="absolute inset-2 border border-dashed border-[rgba(184,147,128,0.25)] rounded-[20px] pointer-events-none" />
            <OrderForm />
          </div>
        </div>
      </div>
    </section>
  );
}
