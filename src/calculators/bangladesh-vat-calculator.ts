import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bangladeshVatCalculator: CalculatorDefinition = {
  slug: "bangladesh-vat-calculator",
  title: "Bangladesh VAT Calculator",
  description: "Free Bangladesh VAT calculator at 15%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bangladesh vat calculator", "bangladesh vat calculator", "bangladesh tax calculator"],
  variants: [{
    id: "standard",
    name: "Bangladesh VAT",
    description: "Free Bangladesh VAT calculator at 15%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "৳", min: 0 },
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
            primary: { label: "Total incl. VAT", value: "৳" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (15%)", value: "৳" + formatNumber(vat) },
              { label: "Base amount", value: "৳" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "৳" + formatNumber(base) },
            details: [
              { label: "VAT amount (15%)", value: "৳" + formatNumber(vat) },
              { label: "Total amount", value: "৳" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Bangladesh?", answer: "The standard VAT rate in Bangladesh is 15%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.15. To remove VAT from total: divide by 1.15." },
  ],
  formula: "VAT = Amount × 15%",
};
