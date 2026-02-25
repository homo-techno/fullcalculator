import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const newYorkSalesTaxCalculator: CalculatorDefinition = {
  slug: "new-york-sales-tax-calculator",
  title: "New York Sales Tax Calculator",
  description: "Free New York sales tax calculator. Calculate New York sales tax on any purchase with state rate of 4% plus optional local taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["new york sales tax", "new york tax calculator", "new york sales tax rate", "NY sales tax"],
  variants: [{
    id: "calc",
    name: "Calculate New York Sales Tax",
    fields: [
      { name: "amount", label: "Purchase Amount ($)", type: "number", placeholder: "e.g. 100" },
      { name: "localRate", label: "Local Tax Rate (%)", type: "number", placeholder: "e.g. 4.5 (optional)" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const localRate = (inputs.localRate as number) || 0;
      if (!amount || amount <= 0) return null;
      const stateRate = 4;
      const stateTax = amount * stateRate / 100;
      const localTax = amount * localRate / 100;
      const totalTax = stateTax + localTax;
      const totalPrice = amount + totalTax;
      return {
        primary: { label: "Total Price", value: "$" + formatNumber(totalPrice, 2) },
        details: [
          { label: "Purchase Amount", value: "$" + formatNumber(amount, 2) },
          { label: "State Tax (4%)", value: "$" + formatNumber(stateTax, 2) },
          { label: "Local Tax (" + formatNumber(localRate, 2) + "%)", value: "$" + formatNumber(localTax, 2) },
          { label: "Total Tax", value: "$" + formatNumber(totalTax, 2) },
          { label: "Effective Rate", value: formatNumber(stateRate + localRate, 3) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sales-tax-calculator"],
  faq: [
    { question: "What is the New York sales tax rate?", answer: "The New York state sales tax rate is 4%. Local jurisdictions may add additional taxes." },
  ],
  formula: "New York Sales Tax = Purchase Amount × (State Rate + Local Rate)",
};
