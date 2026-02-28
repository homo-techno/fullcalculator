import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const romaniaVatCalculator: CalculatorDefinition = {
  slug: "romania-vat-calculator",
  title: "Romania VAT Calculator",
  description: "Free Romania VAT calculator at 19%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["romania vat calculator", "romania vat calculator", "romania tax calculator"],
  variants: [{
    id: "standard",
    name: "Romania VAT",
    description: "Free Romania VAT calculator at 19%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "lei", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 19 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "lei" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (19%)", value: "lei" + formatNumber(vat) },
              { label: "Base amount", value: "lei" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "lei" + formatNumber(base) },
            details: [
              { label: "VAT amount (19%)", value: "lei" + formatNumber(vat) },
              { label: "Total amount", value: "lei" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Romania?", answer: "The standard VAT rate in Romania is 19%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.19. To remove VAT from total: divide by 1.19." },
  ],
  formula: "VAT = Amount × 19%",
};
