import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wisconsinSalesTaxCalculator: CalculatorDefinition = {
  slug: "wisconsin-sales-tax-calculator",
  title: "Wisconsin Sales Tax Calculator",
  description: "Free Wisconsin sales tax calculator. Calculate Wisconsin sales tax on any purchase with state rate of 5% plus optional local taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["wisconsin sales tax", "wisconsin tax calculator", "wisconsin sales tax rate", "WI sales tax"],
  variants: [{
    id: "calc",
    name: "Calculate Wisconsin Sales Tax",
    fields: [
      { name: "amount", label: "Purchase Amount ($)", type: "number", placeholder: "e.g. 100" },
      { name: "localRate", label: "Local Tax Rate (%)", type: "number", placeholder: "e.g. 0.5 (optional)" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const localRate = (inputs.localRate as number) || 0;
      if (!amount || amount <= 0) return null;
      const stateRate = 5;
      const stateTax = amount * stateRate / 100;
      const localTax = amount * localRate / 100;
      const totalTax = stateTax + localTax;
      const totalPrice = amount + totalTax;
      return {
        primary: { label: "Total Price", value: "$" + formatNumber(totalPrice, 2) },
        details: [
          { label: "Purchase Amount", value: "$" + formatNumber(amount, 2) },
          { label: "State Tax (5%)", value: "$" + formatNumber(stateTax, 2) },
          { label: "Local Tax (" + formatNumber(localRate, 2) + "%)", value: "$" + formatNumber(localTax, 2) },
          { label: "Total Tax", value: "$" + formatNumber(totalTax, 2) },
          { label: "Effective Rate", value: formatNumber(stateRate + localRate, 3) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sales-tax-calculator"],
  faq: [
    { question: "What is the Wisconsin sales tax rate?", answer: "The Wisconsin state sales tax rate is 5%. Local jurisdictions may add additional taxes." },
  ],
  formula: "Wisconsin Sales Tax = Purchase Amount × (State Rate + Local Rate)",
};
