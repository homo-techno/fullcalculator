import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tennesseeSalesTaxCalculator: CalculatorDefinition = {
  slug: "tennessee-sales-tax-calculator",
  title: "Tennessee Sales Tax Calculator",
  description: "Free Tennessee sales tax calculator. Calculate Tennessee sales tax on any purchase with state rate of 7% plus optional local taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tennessee sales tax", "tennessee tax calculator", "tennessee sales tax rate", "TN sales tax"],
  variants: [{
    id: "calc",
    name: "Calculate Tennessee Sales Tax",
    fields: [
      { name: "amount", label: "Purchase Amount ($)", type: "number", placeholder: "e.g. 100" },
      { name: "localRate", label: "Local Tax Rate (%)", type: "number", placeholder: "e.g. 2.75 (optional)" },
    ],
    calculate: (inputs) => {
      const amount = inputs.amount as number;
      const localRate = (inputs.localRate as number) || 0;
      if (!amount || amount <= 0) return null;
      const stateRate = 7;
      const stateTax = amount * stateRate / 100;
      const localTax = amount * localRate / 100;
      const totalTax = stateTax + localTax;
      const totalPrice = amount + totalTax;
      return {
        primary: { label: "Total Price", value: "$" + formatNumber(totalPrice, 2) },
        details: [
          { label: "Purchase Amount", value: "$" + formatNumber(amount, 2) },
          { label: "State Tax (7%)", value: "$" + formatNumber(stateTax, 2) },
          { label: "Local Tax (" + formatNumber(localRate, 2) + "%)", value: "$" + formatNumber(localTax, 2) },
          { label: "Total Tax", value: "$" + formatNumber(totalTax, 2) },
          { label: "Effective Rate", value: formatNumber(stateRate + localRate, 3) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["sales-tax-calculator"],
  faq: [
    { question: "What is the Tennessee sales tax rate?", answer: "The Tennessee state sales tax rate is 7%. Local jurisdictions may add additional taxes." },
  ],
  formula: "Tennessee Sales Tax = Purchase Amount × (State Rate + Local Rate)",
};
