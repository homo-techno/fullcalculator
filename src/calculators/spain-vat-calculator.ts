import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spainVatCalculator: CalculatorDefinition = {
  slug: "spain-vat-calculator",
  title: "Spain VAT Calculator",
  description: "Free Spain VAT calculator at 21%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["spain vat calculator", "spain vat calculator", "spain tax calculator"],
  variants: [{
    id: "standard",
    name: "Spain VAT",
    description: "Free Spain VAT calculator at 21%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "€", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 21 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "€" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (21%)", value: "€" + formatNumber(vat) },
              { label: "Base amount", value: "€" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "€" + formatNumber(base) },
            details: [
              { label: "VAT amount (21%)", value: "€" + formatNumber(vat) },
              { label: "Total amount", value: "€" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Spain?", answer: "The standard VAT rate in Spain is 21%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.21. To remove VAT from total: divide by 1.21." },
  ],
  formula: "VAT = Amount × 21%",
};
