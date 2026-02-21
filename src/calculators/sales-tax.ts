import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const salesTaxCalculator: CalculatorDefinition = {
  slug: "sales-tax-calculator",
  title: "Sales Tax Calculator",
  description: "Free sales tax calculator. Calculate sales tax amount and total price, or reverse-calculate the pre-tax price.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sales tax calculator", "tax calculator", "reverse sales tax", "pre-tax price", "after tax price"],
  variants: [
    {
      id: "addTax",
      name: "Add Sales Tax",
      fields: [
        { name: "price", label: "Pre-Tax Price", type: "number", prefix: "$", placeholder: "e.g. 49.99" },
        { name: "rate", label: "Tax Rate (%)", type: "number", suffix: "%", placeholder: "e.g. 8.25" },
      ],
      calculate: (inputs) => {
        const price = inputs.price as number, rate = inputs.rate as number;
        if (!price || !rate) return null;
        const tax = price * (rate / 100);
        return {
          primary: { label: "Total Price", value: `$${formatNumber(price + tax, 2)}` },
          details: [
            { label: "Tax amount", value: `$${formatNumber(tax, 2)}` },
            { label: "Pre-tax price", value: `$${formatNumber(price, 2)}` },
          ],
        };
      },
    },
    {
      id: "reverseTax",
      name: "Reverse Sales Tax",
      fields: [
        { name: "total", label: "Total (with tax)", type: "number", prefix: "$", placeholder: "e.g. 54.12" },
        { name: "rate", label: "Tax Rate (%)", type: "number", suffix: "%", placeholder: "e.g. 8.25" },
      ],
      calculate: (inputs) => {
        const total = inputs.total as number, rate = inputs.rate as number;
        if (!total || !rate) return null;
        const preTax = total / (1 + rate / 100);
        const tax = total - preTax;
        return {
          primary: { label: "Pre-Tax Price", value: `$${formatNumber(preTax, 2)}` },
          details: [
            { label: "Tax amount", value: `$${formatNumber(tax, 2)}` },
            { label: "Total paid", value: `$${formatNumber(total, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tax-calculator", "tip-calculator", "discount-calculator"],
  faq: [{ question: "How do I calculate sales tax?", answer: "Sales tax = Price × Tax Rate. For a $49.99 item at 8.25%: $49.99 × 0.0825 = $4.12 tax, total = $54.11. To find pre-tax price from total: Pre-tax = Total / (1 + Rate)." }],
  formula: "Tax = Price × Rate | Pre-tax = Total / (1 + Rate)",
};
