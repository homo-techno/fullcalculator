import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retailDiscountCalculator: CalculatorDefinition = {
  slug: "retail-discount-calculator",
  title: "Retail Discount & Markdown Calculator",
  description: "Free retail discount calculator. Calculate sale prices, percentage off, and stacked discounts for retail pricing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["retail discount calculator", "sale price calculator", "percentage off calculator"],
  variants: [{
    id: "standard",
    name: "Retail Discount & Markdown",
    description: "Free retail discount calculator",
    fields: [
      { name: "originalPrice", label: "Original Price", type: "number", prefix: "$", min: 0 },
      { name: "discount1", label: "First Discount", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 20 },
      { name: "discount2", label: "Additional Discount (stacked)", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const price = inputs.originalPrice as number;
      const d1 = (inputs.discount1 as number) / 100;
      const d2 = (inputs.discount2 as number) / 100;
      if (!price || price <= 0) return null;
      const afterFirst = price * (1 - d1);
      const afterSecond = d2 > 0 ? afterFirst * (1 - d2) : afterFirst;
      const totalSaved = price - afterSecond;
      const effectiveDiscount = (totalSaved / price) * 100;
      return {
        primary: { label: "Final Price", value: "$" + formatNumber(afterSecond) },
        details: [
          { label: "Original price", value: "$" + formatNumber(price) },
          { label: "After " + (d1 * 100) + "% off", value: "$" + formatNumber(afterFirst) },
          ...(d2 > 0 ? [{ label: "After additional " + (d2 * 100) + "% off", value: "$" + formatNumber(afterSecond) }] : []),
          { label: "Total savings", value: "$" + formatNumber(totalSaved) },
          { label: "Effective discount", value: formatNumber(effectiveDiscount) + "%" },
        ],
        note: d2 > 0 ? "Note: Stacked discounts are applied sequentially, not added. 20% + 10% ≠ 30%. Effective: " + formatNumber(effectiveDiscount) + "%" : "",
      };
    },
  }],
  relatedSlugs: ["profit-margin-calculator", "tip-calculator"],
  faq: [
    { question: "How do stacked discounts work?", answer: "Each discount applies to the already-reduced price, not the original. 20% off then 10% off = 28% total (not 30%). Order doesn not matter for the final price." },
    { question: "How to calculate percentage off?", answer: "Sale Price = Original × (1 - Discount%). For $100 at 25% off: $100 × 0.75 = $75." },
  ],
  formula: "Final Price = Original × (1 - Discount1%) × (1 - Discount2%)",
};
