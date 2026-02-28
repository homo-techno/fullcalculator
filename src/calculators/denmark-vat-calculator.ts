import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const denmarkVatCalculator: CalculatorDefinition = {
  slug: "denmark-vat-calculator",
  title: "Denmark VAT Calculator",
  description: "Free Denmark VAT calculator at 25%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["denmark vat calculator", "denmark vat calculator", "denmark tax calculator"],
  variants: [{
    id: "standard",
    name: "Denmark VAT",
    description: "Free Denmark VAT calculator at 25%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "kr", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 25 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "kr" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (25%)", value: "kr" + formatNumber(vat) },
              { label: "Base amount", value: "kr" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "kr" + formatNumber(base) },
            details: [
              { label: "VAT amount (25%)", value: "kr" + formatNumber(vat) },
              { label: "Total amount", value: "kr" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Denmark?", answer: "The standard VAT rate in Denmark is 25%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.25. To remove VAT from total: divide by 1.25." },
  ],
  formula: "VAT = Amount × 25%",
};
