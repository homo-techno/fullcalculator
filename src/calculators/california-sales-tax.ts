import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const californiaSalesTaxCalculator: CalculatorDefinition = {
  slug: "california-sales-tax-calculator",
  title: "California Sales Tax Calculator",
  description: "Free California sales tax calculator. Calculate California sales tax on any purchase with state rate of 7.25% plus optional local taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["california sales tax", "california tax calculator", "california sales tax rate", "CA sales tax"],
  variants: [{
    id: "calc",
    name: "Calculate California Sales Tax",
    fields: [
      { name: "amount", label: "Purchase Amount ($)", type: "number", placeholder: "e.g. 100" },
      { name: "localRate", label: "Local Tax Rate (%)", type: "number", placeholder: "e.g. 2.5 (optional)" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const localRate = (inputs.localRate as number) || 0;
      if (!amount || amount <= 0) return null;
      const stateRate = 7.25;
      const stateTax = amount * stateRate / 100;
      const localTax = amount * localRate / 100;
      const totalTax = stateTax + localTax;
      const totalPrice = amount + totalTax;
      return {
        primary: { label: "Total Price", value: "$" + formatNumber(totalPrice, 2) },
        details: [
          { label: "Purchase Amount", value: "$" + formatNumber(amount, 2) },
          { label: "State Tax (7.25%)", value: "$" + formatNumber(stateTax, 2) },
          { label: "Local Tax (" + formatNumber(localRate, 2) + "%)", value: "$" + formatNumber(localTax, 2) },
          { label: "Total Tax", value: "$" + formatNumber(totalTax, 2) },
          { label: "Effective Rate", value: formatNumber(stateRate + localRate, 3) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sales-tax-calculator"],
  faq: [
    { question: "What is the California sales tax rate?", answer: "The California state sales tax rate is 7.25%. Local jurisdictions may add additional taxes." },
  ],
  formula: "California Sales Tax = Purchase Amount × (State Rate + Local Rate)",
};
