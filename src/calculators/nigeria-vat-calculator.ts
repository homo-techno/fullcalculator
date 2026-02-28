import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nigeriaVatCalculator: CalculatorDefinition = {
  slug: "nigeria-vat-calculator",
  title: "Nigeria VAT Calculator",
  description: "Free Nigeria VAT calculator at 7.5%. Calculate VAT amount and total price including tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["nigeria vat calculator", "nigeria vat calculator", "nigeria tax calculator"],
  variants: [{
    id: "standard",
    name: "Nigeria VAT",
    description: "Free Nigeria VAT calculator at 7",
    fields: [
      { name: "amount", label: "Amount (excl. VAT)", type: "number", prefix: "₦", min: 0 },
      { name: "mode", label: "Calculation", type: "select", options: [{ label: "Add VAT", value: "add" }, { label: "Remove VAT", value: "remove" }], defaultValue: "add" },
    ],
    calculate: (inputs) => {
        const amount = inputs.amount as number;
        const mode = inputs.mode as string;
        if (!amount || amount <= 0) return null;
        const rate = 7.5 / 100;
        if (mode === "add") {
          const vat = amount * rate;
          return {
            primary: { label: "Total incl. VAT", value: "₦" + formatNumber(amount + vat) },
            details: [
              { label: "VAT amount (7.5%)", value: "₦" + formatNumber(vat) },
              { label: "Base amount", value: "₦" + formatNumber(amount) },
            ],
          };
        } else {
          const base = amount / (1 + rate);
          const vat = amount - base;
          return {
            primary: { label: "Amount excl. VAT", value: "₦" + formatNumber(base) },
            details: [
              { label: "VAT amount (7.5%)", value: "₦" + formatNumber(vat) },
              { label: "Total amount", value: "₦" + formatNumber(amount) },
            ],
          };
        }
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the VAT rate in Nigeria?", answer: "The standard VAT rate in Nigeria is 7.5%." },
    { question: "How to calculate VAT?", answer: "To add VAT: multiply amount by 0.075. To remove VAT from total: divide by 1.075." },
  ],
  formula: "VAT = Amount × 7.5%",
};
