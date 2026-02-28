import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indonesiaVatCalculator: CalculatorDefinition = {
  slug: "indonesia-vat-calculator",
  title: "Indonesia VAT Calculator",
  description: "Free Indonesia VAT calculator at 12%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["indonesia vat calculator", "indonesia vat calculator", "indonesia tax calculator"],
  variants: [{
    id: "standard",
    name: "Indonesia VAT",
    description: "Free Indonesia VAT calculator at 12%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "Rp", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 12 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "Rp" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (12%)", value: "Rp" + formatNumber(vat) },
              { label: "Base amount", value: "Rp" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "Rp" + formatNumber(base) },
            details: [
              { label: "VAT amount (12%)", value: "Rp" + formatNumber(vat) },
              { label: "Total amount", value: "Rp" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Indonesia?", answer: "The standard VAT rate in Indonesia is 12%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.12. To remove VAT from total: divide by 1.12." },
  ],
  formula: "VAT = Amount × 12%",
};
