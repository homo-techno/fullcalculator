import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mexicoVatCalculator: CalculatorDefinition = {
  slug: "mexico-vat-calculator",
  title: "Mexico VAT Calculator",
  description: "Free Mexico VAT calculator at 16%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mexico vat calculator", "mexico vat calculator", "mexico tax calculator"],
  variants: [{
    id: "standard",
    name: "Mexico VAT",
    description: "Free Mexico VAT calculator at 16%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "MX$", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 16 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "MX$" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (16%)", value: "MX$" + formatNumber(vat) },
              { label: "Base amount", value: "MX$" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "MX$" + formatNumber(base) },
            details: [
              { label: "VAT amount (16%)", value: "MX$" + formatNumber(vat) },
              { label: "Total amount", value: "MX$" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Mexico?", answer: "The standard VAT rate in Mexico is 16%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.16. To remove VAT from total: divide by 1.16." },
  ],
  formula: "VAT = Amount × 16%",
};
