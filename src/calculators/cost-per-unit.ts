import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const costPerUnitCalculator: CalculatorDefinition = {
  slug: "cost-per-unit-calculator",
  title: "Cost Per Unit Calculator",
  description: "Free cost per unit calculator. Compare unit prices to find the best deal when shopping. Calculate price per ounce, per item, etc.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cost per unit calculator", "unit price calculator", "price per ounce", "price comparison", "best deal calculator"],
  variants: [
    {
      id: "single",
      name: "Single Item Unit Price",
      fields: [
        { name: "price", label: "Total Price", type: "number", prefix: "$", placeholder: "e.g. 5.99" },
        { name: "quantity", label: "Quantity / Size", type: "number", placeholder: "e.g. 32" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "oz", value: "oz" }, { label: "lbs", value: "lbs" },
          { label: "items", value: "items" }, { label: "liters", value: "L" },
        ]},
      ],
      calculate: (inputs) => {
        const price = inputs.price as number, qty = inputs.quantity as number;
        const unit = (inputs.unit as string) || "oz";
        if (!price || !qty) return null;
        const perUnit = price / qty;
        return {
          primary: { label: `Price per ${unit}`, value: `$${formatNumber(perUnit, 4)}` },
          details: [
            { label: "Total price", value: `$${formatNumber(price, 2)}` },
            { label: "Quantity", value: `${qty} ${unit}` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Compare Two Products",
      fields: [
        { name: "price1", label: "Product A: Price", type: "number", prefix: "$", placeholder: "e.g. 3.99" },
        { name: "qty1", label: "Product A: Quantity", type: "number", placeholder: "e.g. 16" },
        { name: "price2", label: "Product B: Price", type: "number", prefix: "$", placeholder: "e.g. 5.49" },
        { name: "qty2", label: "Product B: Quantity", type: "number", placeholder: "e.g. 32" },
      ],
      calculate: (inputs) => {
        const p1 = inputs.price1 as number, q1 = inputs.qty1 as number;
        const p2 = inputs.price2 as number, q2 = inputs.qty2 as number;
        if (!p1 || !q1 || !p2 || !q2) return null;
        const cpu1 = p1 / q1, cpu2 = p2 / q2;
        const better = cpu1 < cpu2 ? "A" : cpu2 < cpu1 ? "B" : "Same";
        const savings = Math.abs(cpu1 - cpu2) / Math.max(cpu1, cpu2) * 100;
        return {
          primary: { label: "Better Deal", value: `Product ${better}` },
          details: [
            { label: "Product A unit price", value: `$${formatNumber(cpu1, 4)}` },
            { label: "Product B unit price", value: `$${formatNumber(cpu2, 4)}` },
            { label: "Savings", value: `${formatNumber(savings, 1)}% cheaper` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["discount-calculator", "sales-tax-calculator", "tip-calculator"],
  faq: [{ question: "How do I calculate unit price?", answer: "Unit price = Total Price / Quantity. Compare unit prices of different sizes to find the best deal. A $5.99 32oz bottle ($0.187/oz) is better than a $3.99 16oz bottle ($0.249/oz)." }],
  formula: "Unit Price = Total Price / Quantity",
};
