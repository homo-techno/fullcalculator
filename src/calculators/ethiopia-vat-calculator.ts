import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ethiopiaVatCalculator: CalculatorDefinition = {
  slug: "ethiopia-vat-calculator",
  title: "Ethiopia VAT Calculator",
  description: "Free Ethiopia VAT calculator at 15%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ethiopia vat calculator", "ethiopia vat calculator", "ethiopia tax calculator"],
  variants: [{
    id: "standard",
    name: "Ethiopia VAT",
    description: "Free Ethiopia VAT calculator at 15%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "ETB", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 15 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "ETB" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (15%)", value: "ETB" + formatNumber(vat) },
              { label: "Base amount", value: "ETB" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "ETB" + formatNumber(base) },
            details: [
              { label: "VAT amount (15%)", value: "ETB" + formatNumber(vat) },
              { label: "Total amount", value: "ETB" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Ethiopia?", answer: "The standard VAT rate in Ethiopia is 15%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.15. To remove VAT from total: divide by 1.15." },
  ],
  formula: "VAT = Amount × 15%",
};
