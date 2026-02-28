import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iranVatCalculator: CalculatorDefinition = {
  slug: "iran-vat-calculator",
  title: "Iran VAT Calculator",
  description: "Free Iran VAT calculator at 10%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["iran vat calculator", "iran vat calculator", "iran tax calculator"],
  variants: [{
    id: "standard",
    name: "Iran VAT",
    description: "Free Iran VAT calculator at 10%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "IRR", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 10 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "IRR" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (10%)", value: "IRR" + formatNumber(vat) },
              { label: "Base amount", value: "IRR" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "IRR" + formatNumber(base) },
            details: [
              { label: "VAT amount (10%)", value: "IRR" + formatNumber(vat) },
              { label: "Total amount", value: "IRR" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Iran?", answer: "The standard VAT rate in Iran is 10%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.1. To remove VAT from total: divide by 1.1." },
  ],
  formula: "VAT = Amount × 10%",
};
