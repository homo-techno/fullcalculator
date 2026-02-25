import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const northCarolinaSalesTaxCalculator: CalculatorDefinition = {
  slug: "north-carolina-sales-tax-calculator",
  title: "North Carolina Sales Tax Calculator",
  description: "Free North Carolina sales tax calculator. Calculate North Carolina sales tax on any purchase with state rate of 4.75% plus optional local taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["north carolina sales tax", "north carolina tax calculator", "north carolina sales tax rate", "NC sales tax"],
  variants: [{
    id: "calc",
    name: "Calculate North Carolina Sales Tax",
    fields: [
      { name: "amount", label: "Purchase Amount ($)", type: "number", placeholder: "e.g. 100" },
      { name: "localRate", label: "Local Tax Rate (%)", type: "number", placeholder: "e.g. 2.25 (optional)" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const localRate = (inputs.localRate as number) || 0;
      if (!amount || amount <= 0) return null;
      const stateRate = 4.75;
      const stateTax = amount * stateRate / 100;
      const localTax = amount * localRate / 100;
      const totalTax = stateTax + localTax;
      const totalPrice = amount + totalTax;
      return {
        primary: { label: "Total Price", value: "$" + formatNumber(totalPrice, 2) },
        details: [
          { label: "Purchase Amount", value: "$" + formatNumber(amount, 2) },
          { label: "State Tax (4.75%)", value: "$" + formatNumber(stateTax, 2) },
          { label: "Local Tax (" + formatNumber(localRate, 2) + "%)", value: "$" + formatNumber(localTax, 2) },
          { label: "Total Tax", value: "$" + formatNumber(totalTax, 2) },
          { label: "Effective Rate", value: formatNumber(stateRate + localRate, 3) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sales-tax-calculator"],
  faq: [
    { question: "What is the North Carolina sales tax rate?", answer: "The North Carolina state sales tax rate is 4.75%. Local jurisdictions may add additional taxes." },
  ],
  formula: "North Carolina Sales Tax = Purchase Amount × (State Rate + Local Rate)",
};
