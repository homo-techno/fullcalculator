import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const switzerlandVatCalculator: CalculatorDefinition = {
  slug: "switzerland-vat-calculator",
  title: "Switzerland VAT Calculator",
  description: "Free Switzerland VAT calculator at 8.1%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["switzerland vat calculator", "switzerland vat calculator", "switzerland tax calculator"],
  variants: [{
    id: "standard",
    name: "Switzerland VAT",
    description: "Free Switzerland VAT calculator at 8",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "CHF", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 8.1 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "CHF" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (8.1%)", value: "CHF" + formatNumber(vat) },
              { label: "Base amount", value: "CHF" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "CHF" + formatNumber(base) },
            details: [
              { label: "VAT amount (8.1%)", value: "CHF" + formatNumber(vat) },
              { label: "Total amount", value: "CHF" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Switzerland?", answer: "The standard VAT rate in Switzerland is 8.1%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.081. To remove VAT from total: divide by 1.081." },
  ],
  formula: "VAT = Amount × 8.1%",
};
