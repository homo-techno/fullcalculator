import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coloradoSalesTaxCalculator: CalculatorDefinition = {
  slug: "colorado-sales-tax-calculator",
  title: "Colorado Sales Tax Calculator",
  description: "Free Colorado sales tax calculator. Calculate Colorado sales tax on any purchase with state rate of 2.9% plus optional local taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["colorado sales tax", "colorado tax calculator", "colorado sales tax rate", "CO sales tax"],
  variants: [{
    id: "calc",
    name: "Calculate Colorado Sales Tax",
    fields: [
      { name: "amount", label: "Purchase Amount ($)", type: "number", placeholder: "e.g. 100" },
      { name: "localRate", label: "Local Tax Rate (%)", type: "number", placeholder: "e.g. 4.81 (optional)" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const localRate = (inputs.localRate as number) || 0;
      if (!amount || amount <= 0) return null;
      const stateRate = 2.9;
      const stateTax = amount * stateRate / 100;
      const localTax = amount * localRate / 100;
      const totalTax = stateTax + localTax;
      const totalPrice = amount + totalTax;
      return {
        primary: { label: "Total Price", value: "$" + formatNumber(totalPrice, 2) },
        details: [
          { label: "Purchase Amount", value: "$" + formatNumber(amount, 2) },
          { label: "State Tax (2.9%)", value: "$" + formatNumber(stateTax, 2) },
          { label: "Local Tax (" + formatNumber(localRate, 2) + "%)", value: "$" + formatNumber(localTax, 2) },
          { label: "Total Tax", value: "$" + formatNumber(totalTax, 2) },
          { label: "Effective Rate", value: formatNumber(stateRate + localRate, 3) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sales-tax-calculator"],
  faq: [
    { question: "What is the Colorado sales tax rate?", answer: "The Colorado state sales tax rate is 2.9%. Local jurisdictions may add additional taxes." },
  ],
  formula: "Colorado Sales Tax = Purchase Amount × (State Rate + Local Rate)",
};
