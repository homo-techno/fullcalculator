import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const egyptVatCalculator: CalculatorDefinition = {
  slug: "egypt-vat-calculator",
  title: "Egypt VAT Calculator",
  description: "Free Egypt VAT calculator at 14%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["egypt vat calculator", "egypt vat calculator", "egypt tax calculator"],
  variants: [{
    id: "standard",
    name: "Egypt VAT",
    description: "Free Egypt VAT calculator at 14%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "EGP", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 14 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "EGP" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (14%)", value: "EGP" + formatNumber(vat) },
              { label: "Base amount", value: "EGP" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "EGP" + formatNumber(base) },
            details: [
              { label: "VAT amount (14%)", value: "EGP" + formatNumber(vat) },
              { label: "Total amount", value: "EGP" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Egypt?", answer: "The standard VAT rate in Egypt is 14%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.14. To remove VAT from total: divide by 1.1400000000000001." },
  ],
  formula: "VAT = Amount × 14%",
};
