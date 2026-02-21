import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const discountCalculator: CalculatorDefinition = {
  slug: "discount-calculator",
  title: "Discount Calculator",
  description:
    "Free discount calculator. Calculate sale prices, savings, and discount percentages. Perfect for shopping, sales tax, and price comparisons.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "discount calculator",
    "sale price calculator",
    "percent off calculator",
    "savings calculator",
    "markdown calculator",
  ],
  variants: [
    {
      id: "percent-off",
      name: "Percent Off",
      description: "Calculate the sale price after a percentage discount",
      fields: [
        {
          name: "price",
          label: "Original Price",
          type: "number",
          placeholder: "e.g. 79.99",
          prefix: "$",
          min: 0,
        },
        {
          name: "discount",
          label: "Discount",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "%",
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const price = inputs.price as number;
        const disc = inputs.discount as number;
        if (!price || !disc) return null;
        const savings = price * (disc / 100);
        const salePrice = price - savings;
        return {
          primary: { label: "Sale Price", value: `$${formatNumber(salePrice)}` },
          details: [
            { label: "You save", value: `$${formatNumber(savings)}` },
            { label: "Original price", value: `$${formatNumber(price)}` },
          ],
        };
      },
    },
    {
      id: "find-percent",
      name: "Find Discount %",
      description: "Find the discount percentage from original and sale prices",
      fields: [
        {
          name: "original",
          label: "Original Price",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
          min: 0,
        },
        {
          name: "sale",
          label: "Sale Price",
          type: "number",
          placeholder: "e.g. 65",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const original = inputs.original as number;
        const sale = inputs.sale as number;
        if (!original || sale === undefined) return null;
        const savings = original - sale;
        const discountPct = (savings / original) * 100;
        return {
          primary: { label: "Discount", value: formatNumber(discountPct), suffix: "% off" },
          details: [
            { label: "You save", value: `$${formatNumber(savings)}` },
          ],
        };
      },
    },
    {
      id: "double-discount",
      name: "Double Discount",
      description: "Calculate price after two successive discounts (e.g. 30% off + extra 15% off)",
      fields: [
        {
          name: "price",
          label: "Original Price",
          type: "number",
          placeholder: "e.g. 120",
          prefix: "$",
          min: 0,
        },
        {
          name: "discount1",
          label: "First Discount",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "%",
          min: 0,
          max: 100,
        },
        {
          name: "discount2",
          label: "Second Discount",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "%",
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const price = inputs.price as number;
        const d1 = inputs.discount1 as number;
        const d2 = inputs.discount2 as number;
        if (!price || !d1 || !d2) return null;

        const afterFirst = price * (1 - d1 / 100);
        const afterSecond = afterFirst * (1 - d2 / 100);
        const totalSavings = price - afterSecond;
        const effectiveDiscount = (totalSavings / price) * 100;

        return {
          primary: { label: "Final Price", value: `$${formatNumber(afterSecond)}` },
          details: [
            { label: "After first discount", value: `$${formatNumber(afterFirst)}` },
            { label: "Total savings", value: `$${formatNumber(totalSavings)}` },
            { label: "Effective discount", value: `${formatNumber(effectiveDiscount)}%` },
          ],
          note: `Note: ${d1}% + ${d2}% does not equal ${d1 + d2}%. The effective discount is ${formatNumber(effectiveDiscount)}%.`,
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator", "salary-calculator"],
  faq: [
    {
      question: "How do I calculate a discount?",
      answer:
        "Sale Price = Original Price x (1 - Discount/100). For example, 30% off $80: $80 x 0.70 = $56.",
    },
    {
      question: "Why is 30% + 15% off not 45% off?",
      answer:
        "Successive discounts multiply, not add. 30% off $100 = $70, then 15% off $70 = $59.50. The effective discount is 40.5%, not 45%. The second discount applies to the already-reduced price.",
    },
  ],
  formula: "Sale Price = Original x (1 - Discount%/100)",
};
