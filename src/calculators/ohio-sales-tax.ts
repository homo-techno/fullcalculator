import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ohioSalesTaxCalculator: CalculatorDefinition = {
  slug: "ohio-sales-tax-calculator",
  title: "Ohio Sales Tax Calculator",
  description: "Free Ohio sales tax calculator. Calculate Ohio sales tax on any purchase with state rate of 5.75% plus optional local taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ohio sales tax", "ohio tax calculator", "ohio sales tax rate", "OH sales tax"],
  variants: [{
    id: "calc",
    name: "Calculate Ohio Sales Tax",
    fields: [
      { name: "amount", label: "Purchase Amount ($)", type: "number", placeholder: "e.g. 100" },
      { name: "localRate", label: "Local Tax Rate (%)", type: "number", placeholder: "e.g. 2.25 (optional)" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const localRate = (inputs.localRate as number) || 0;
      if (!amount || amount <= 0) return null;
      const stateRate = 5.75;
      const stateTax = amount * stateRate / 100;
      const localTax = amount * localRate / 100;
      const totalTax = stateTax + localTax;
      const totalPrice = amount + totalTax;
      return {
        primary: { label: "Total Price", value: "$" + formatNumber(totalPrice, 2) },
        details: [
          { label: "Purchase Amount", value: "$" + formatNumber(amount, 2) },
          { label: "State Tax (5.75%)", value: "$" + formatNumber(stateTax, 2) },
          { label: "Local Tax (" + formatNumber(localRate, 2) + "%)", value: "$" + formatNumber(localTax, 2) },
          { label: "Total Tax", value: "$" + formatNumber(totalTax, 2) },
          { label: "Effective Rate", value: formatNumber(stateRate + localRate, 3) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sales-tax-calculator"],
  faq: [
    { question: "What is the Ohio sales tax rate?", answer: "The Ohio state sales tax rate is 5.75%. Local jurisdictions may add additional taxes." },
  ],
  formula: "Ohio Sales Tax = Purchase Amount × (State Rate + Local Rate)",
};
