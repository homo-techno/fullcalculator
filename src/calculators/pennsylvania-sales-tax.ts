import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pennsylvaniaSalesTaxCalculator: CalculatorDefinition = {
  slug: "pennsylvania-sales-tax-calculator",
  title: "Pennsylvania Sales Tax Calculator",
  description: "Free Pennsylvania sales tax calculator. Calculate Pennsylvania sales tax on any purchase with state rate of 6% plus optional local taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pennsylvania sales tax", "pennsylvania tax calculator", "pennsylvania sales tax rate", "PA sales tax"],
  variants: [{
    id: "calc",
    name: "Calculate Pennsylvania Sales Tax",
    fields: [
      { name: "amount", label: "Purchase Amount ($)", type: "number", placeholder: "e.g. 100" },
      { name: "localRate", label: "Local Tax Rate (%)", type: "number", placeholder: "e.g. 2 (optional)" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const localRate = (inputs.localRate as number) || 0;
      if (!amount || amount <= 0) return null;
      const stateRate = 6;
      const stateTax = amount * stateRate / 100;
      const localTax = amount * localRate / 100;
      const totalTax = stateTax + localTax;
      const totalPrice = amount + totalTax;
      return {
        primary: { label: "Total Price", value: "$" + formatNumber(totalPrice, 2) },
        details: [
          { label: "Purchase Amount", value: "$" + formatNumber(amount, 2) },
          { label: "State Tax (6%)", value: "$" + formatNumber(stateTax, 2) },
          { label: "Local Tax (" + formatNumber(localRate, 2) + "%)", value: "$" + formatNumber(localTax, 2) },
          { label: "Total Tax", value: "$" + formatNumber(totalTax, 2) },
          { label: "Effective Rate", value: formatNumber(stateRate + localRate, 3) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sales-tax-calculator"],
  faq: [
    { question: "What is the Pennsylvania sales tax rate?", answer: "The Pennsylvania state sales tax rate is 6%. Local jurisdictions may add additional taxes." },
  ],
  formula: "Pennsylvania Sales Tax = Purchase Amount × (State Rate + Local Rate)",
};
