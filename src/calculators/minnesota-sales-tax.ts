import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const minnesotaSalesTaxCalculator: CalculatorDefinition = {
  slug: "minnesota-sales-tax-calculator",
  title: "Minnesota Sales Tax Calculator",
  description: "Free Minnesota sales tax calculator. Calculate Minnesota sales tax on any purchase with state rate of 6.875% plus optional local taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["minnesota sales tax", "minnesota tax calculator", "minnesota sales tax rate", "MN sales tax"],
  variants: [{
    id: "calc",
    name: "Calculate Minnesota Sales Tax",
    fields: [
      { name: "amount", label: "Purchase Amount ($)", type: "number", placeholder: "e.g. 100" },
      { name: "localRate", label: "Local Tax Rate (%)", type: "number", placeholder: "e.g. 1.5 (optional)" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const localRate = (inputs.localRate as number) || 0;
      if (!amount || amount <= 0) return null;
      const stateRate = 6.875;
      const stateTax = amount * stateRate / 100;
      const localTax = amount * localRate / 100;
      const totalTax = stateTax + localTax;
      const totalPrice = amount + totalTax;
      return {
        primary: { label: "Total Price", value: "$" + formatNumber(totalPrice, 2) },
        details: [
          { label: "Purchase Amount", value: "$" + formatNumber(amount, 2) },
          { label: "State Tax (6.875%)", value: "$" + formatNumber(stateTax, 2) },
          { label: "Local Tax (" + formatNumber(localRate, 2) + "%)", value: "$" + formatNumber(localTax, 2) },
          { label: "Total Tax", value: "$" + formatNumber(totalTax, 2) },
          { label: "Effective Rate", value: formatNumber(stateRate + localRate, 3) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sales-tax-calculator"],
  faq: [
    { question: "What is the Minnesota sales tax rate?", answer: "The Minnesota state sales tax rate is 6.875%. Local jurisdictions may add additional taxes." },
  ],
  formula: "Minnesota Sales Tax = Purchase Amount × (State Rate + Local Rate)",
};
