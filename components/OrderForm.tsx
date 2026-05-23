"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { sendOrder } from "@/app/actions/send-order";

const TYPE_KEYS = [
  "typePlushie",
  "typeHat",
  "typeBag",
  "typeBlanket",
  "typeScrunchie",
  "typeOther",
] as const;

const PALETTE_KEYS = [
  { id: "rose", label: "pRose", color: "var(--color-rose)" },
  { id: "mint", label: "pMint", color: "var(--color-mint)" },
  { id: "sky", label: "pSky", color: "var(--color-sky)" },
  { id: "peach", label: "pPeach", color: "var(--color-peach)" },
  { id: "butter", label: "pButter", color: "var(--color-butter)" },
  { id: "lavender", label: "pLavender", color: "var(--color-lavender)" },
  { id: "cream", label: "pCream", color: "var(--color-cream-2)" },
] as const;

const BUDGET_KEYS = [
  "budget1",
  "budget2",
  "budget3",
  "budget4",
  "budget5",
] as const;

type TypeKey = (typeof TYPE_KEYS)[number];
type BudgetKey = (typeof BUDGET_KEYS)[number];

export function OrderForm() {
  const t = useTranslations("custom");
  const [type, setType] = useState<TypeKey>("typePlushie");
  const [palette, setPalette] = useState<Set<string>>(new Set(["rose"]));
  const [budget, setBudget] = useState<BudgetKey>("budget2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function togglePalette(id: string) {
    setPalette((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("type", t(type));
    palette.forEach((p) => fd.append("palette", p));
    fd.set("budget", t(budget));
    fd.set("idea", idea);

    startTransition(async () => {
      const result = await sendOrder(fd);
      if (result.ok) {
        setSent(true);
      } else if (result.error === "config") {
        setError(t("errorConfig"));
      } else {
        setError(t("errorSend"));
      }
    });
  }

  if (sent) {
    return (
      <div className="text-center px-2.5 py-10 relative z-10">
        <div className="text-7xl">♡</div>
        <h3 className="font-[var(--font-display)] text-[42px] text-coral-dark mb-2.5">
          {t("successHeading")}
        </h3>
        <p className="text-brown-2">{t("successCopy")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative z-10">
      <div className="eyebrow mb-3.5">{t("formIntro")}</div>

      <Field label={t("name")}>
        <input
          type="text"
          required
          placeholder={t("namePh")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={t("email")}>
        <input
          type="email"
          required
          placeholder={t("emailPh")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label={t("whatLabel")}>
        <div className="flex flex-wrap gap-2">
          {TYPE_KEYS.map((k) => (
            <Chip key={k} on={type === k} onClick={() => setType(k)}>
              {t(k)}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label={t("paletteLabel")}>
        <div className="flex flex-wrap gap-2">
          {PALETTE_KEYS.map((p) => {
            const on = palette.has(p.id);
            return (
              <Chip key={p.id} on={on} onClick={() => togglePalette(p.id)}>
                {!on && (
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle"
                    style={{
                      background: p.color,
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
                  />
                )}
                {t(p.label)}
              </Chip>
            );
          })}
        </div>
      </Field>

      <Field label={t("budgetLabel")}>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value as BudgetKey)}
          className={inputClass}
        >
          {BUDGET_KEYS.map((k) => (
            <option key={k} value={k}>
              {t(k)}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t("ideaLabel")}>
        <textarea
          placeholder={t("ideaPh")}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className={inputClass + " resize-y min-h-[90px]"}
        />
      </Field>

      {error && (
        <div className="text-sm text-coral-dark mb-3">{error}</div>
      )}

      <div className="flex items-center justify-between mt-5 gap-3.5 flex-wrap">
        <div className="font-[var(--font-display)] text-brown-2 text-[22px]">
          {t("priceHint")}
        </div>
        <button
          type="submit"
          className="btn btn-primary disabled:opacity-60"
          disabled={pending}
        >
          {pending ? "…" : t("submit")}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full border-[1.5px] border-cream-3 bg-cream rounded-[12px] py-3 px-3.5 text-[15px] text-brown outline-none transition focus:border-coral focus:bg-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 relative">
      <label className="block font-[var(--font-mono)] text-[10px] tracking-[0.18em] uppercase text-brown-soft mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "border-[1.5px] rounded-full px-3.5 py-1.5 text-[13px] font-semibold cursor-pointer transition-all " +
        (on
          ? "bg-coral text-white border-coral"
          : "bg-cream text-brown border-cream-3 hover:border-coral")
      }
    >
      {children}
    </button>
  );
}
