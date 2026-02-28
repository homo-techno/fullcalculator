import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pakistanVatCalculator: CalculatorDefinition = {
  slug: "pakistan-vat-calculator",
  title: "Pakistan VAT Calculator",
  description: "Free Pakistan VAT calculator at 18%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pakistan vat calculator", "pakistan vat calculator", "pakistan tax calculator"],
  variants: [{
    id: "standard",
    name: "Pakistan VAT",
    description: "Free Pakistan VAT calculator at 18%",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "Rs", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 18 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "Rs" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (18%)", value: "Rs" + formatNumber(vat) },
              { label: "Base amount", value: "Rs" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "Rs" + formatNumber(base) },
            details: [
              { label: "VAT amount (18%)", value: "Rs" + formatNumber(vat) },
              { label: "Total amount", value: "Rs" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Pakistan?", answer: "The standard VAT rate in Pakistan is 18%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.18. To remove VAT from total: divide by 1.18." },
  ],
  formula: "VAT = Amount × 18%",
};
