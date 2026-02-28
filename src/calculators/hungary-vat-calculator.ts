import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hungaryVatCalculator: CalculatorDefinition = {
  slug: "hungary-vat-calculator",
  title: "Hungary VAT Calculator",
  description: "Free Hungary VAT calculator at 27%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hungary vat calculator", "hungary vat calculator", "hungary tax calculator"],
  variants: [{
    id: "standard",
    name: "Hungary VAT",
    description: "Free Hungary VAT calculator at 27%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "Ft", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 27 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "Ft" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (27%)", value: "Ft" + formatNumber(vat) },
              { label: "Base amount", value: "Ft" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "Ft" + formatNumber(base) },
            details: [
              { label: "VAT amount (27%)", value: "Ft" + formatNumber(vat) },
              { label: "Total amount", value: "Ft" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Hungary?", answer: "The standard VAT rate in Hungary is 27%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.27. To remove VAT from total: divide by 1.27." },
  ],
  formula: "VAT = Amount × 27%",
};
