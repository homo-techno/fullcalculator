import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const polandVatCalculator: CalculatorDefinition = {
  slug: "poland-vat-calculator",
  title: "Poland VAT Calculator",
  description: "Free Poland VAT calculator at 23%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["poland vat calculator", "poland vat calculator", "poland tax calculator"],
  variants: [{
    id: "standard",
    name: "Poland VAT",
    description: "Free Poland VAT calculator at 23%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "zł", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 23 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "zł" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (23%)", value: "zł" + formatNumber(vat) },
              { label: "Base amount", value: "zł" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "zł" + formatNumber(base) },
            details: [
              { label: "VAT amount (23%)", value: "zł" + formatNumber(vat) },
              { label: "Total amount", value: "zł" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Poland?", answer: "The standard VAT rate in Poland is 23%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.23. To remove VAT from total: divide by 1.23." },
  ],
  formula: "VAT = Amount × 23%",
};
