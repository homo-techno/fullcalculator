import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drCongoVatCalculator: CalculatorDefinition = {
  slug: "dr-congo-vat-calculator",
  title: "DR Congo VAT Calculator",
  description: "Free DR Congo VAT calculator at 16%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dr congo vat calculator", "dr-congo vat calculator", "dr congo tax calculator"],
  variants: [{
    id: "standard",
    name: "DR Congo VAT",
    description: "Free DR Congo VAT calculator at 16%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "CDF", min: 0 },
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
            primary: { label: "Total incl. VAT", value: "CDF" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (16%)", value: "CDF" + formatNumber(vat) },
              { label: "Base amount", value: "CDF" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "CDF" + formatNumber(base) },
            details: [
              { label: "VAT amount (16%)", value: "CDF" + formatNumber(vat) },
              { label: "Total amount", value: "CDF" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in DR Congo?", answer: "The standard VAT rate in DR Congo is 16%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.16. To remove VAT from total: divide by 1.16." },
  ],
  formula: "VAT = Amount × 16%",
};
