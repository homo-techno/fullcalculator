import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const washingtonSalesTaxCalculator: CalculatorDefinition = {
  slug: "washington-sales-tax-calculator",
  title: "Washington Sales Tax Calculator",
  description: "Free Washington sales tax calculator. Calculate Washington sales tax on any purchase with state rate of 6.5% plus optional local taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["washington sales tax", "washington tax calculator", "washington sales tax rate", "WA sales tax"],
  variants: [{
    id: "calc",
    name: "Calculate Washington Sales Tax",
    fields: [
      { name: "amount", label: "Purchase Amount ($)", type: "number", placeholder: "e.g. 100" },
      { name: "localRate", label: "Local Tax Rate (%)", type: "number", placeholder: "e.g. 3.6 (optional)" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const localRate = (inputs.localRate as number) || 0;
      if (!amount || amount <= 0) return null;
      const stateRate = 6.5;
      const stateTax = amount * stateRate / 100;
      const localTax = amount * localRate / 100;
      const totalTax = stateTax + localTax;
      const totalPrice = amount + totalTax;
      return {
        primary: { label: "Total Price", value: "$" + formatNumber(totalPrice, 2) },
        details: [
          { label: "Purchase Amount", value: "$" + formatNumber(amount, 2) },
          { label: "State Tax (6.5%)", value: "$" + formatNumber(stateTax, 2) },
          { label: "Local Tax (" + formatNumber(localRate, 2) + "%)", value: "$" + formatNumber(localTax, 2) },
          { label: "Total Tax", value: "$" + formatNumber(totalTax, 2) },
          { label: "Effective Rate", value: formatNumber(stateRate + localRate, 3) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sales-tax-calculator"],
  faq: [
    { question: "What is the Washington sales tax rate?", answer: "The Washington state sales tax rate is 6.5%. Local jurisdictions may add additional taxes." },
  ],
  formula: "Washington Sales Tax = Purchase Amount × (State Rate + Local Rate)",
};
