import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const discountPercentageCalculator: CalculatorDefinition = {
  slug: "discount-percentage-calculator",
  title: "Discount Percentage Calculator",
  description: "Free discount percentage calculator. Calculate the discount percentage, sale price, or original price for any discount.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["discount percentage calculator", "percent off calculator", "sale price calculator", "discount calculator", "percentage discount"],
  variants: [
    {
      id: "findDiscount",
      name: "Find Discount Percentage",
      description: "Calculate the discount percentage from original and sale prices",
      fields: [
        { name: "originalPrice", label: "Original Price", type: "number", placeholder: "e.g. 89.99", prefix: "$", step: 0.01 },
        { name: "salePrice", label: "Sale Price", type: "number", placeholder: "e.g. 59.99", prefix: "$", step: 0.01 },
      ],
      calculate: (inputs) => {
        const original = inputs.originalPrice as number;
        const sale = inputs.salePrice as number;
        if (!original || sale === undefined) return null;
        const discount = original - sale;
        const discountPct = (discount / original) * 100;
        return {
          primary: { label: "Discount Percentage", value: formatNumber(discountPct), suffix: "% off" },
          details: [
            { label: "You Save", value: `$${formatNumber(discount)}` },
            { label: "Original Price", value: `$${formatNumber(original)}` },
            { label: "Sale Price", value: `$${formatNumber(sale)}` },
          ],
        };
      },
    },
    {
      id: "findSalePrice",
      name: "Find Sale Price",
      description: "Calculate the sale price from original price and discount percentage",
      fields: [
        { name: "originalPrice", label: "Original Price", type: "number", placeholder: "e.g. 89.99", prefix: "$", step: 0.01 },
        { name: "discountPct", label: "Discount Percentage", type: "number", placeholder: "e.g. 25", suffix: "%" },
      ],
      calculate: (inputs) => {
        const original = inputs.originalPrice as number;
        const pct = inputs.discountPct as number;
        if (!original || !pct) return null;
        const discount = original * (pct / 100);
        const salePrice = original - discount;
        return {
          primary: { label: "Sale Price", value: `$${formatNumber(salePrice)}` },
          details: [
            { label: "You Save", value: `$${formatNumber(discount)}` },
            { label: "Original Price", value: `$${formatNumber(original)}` },
            { label: "Discount", value: `${formatNumber(pct)}%` },
          ],
        };
      },
    },
    {
      id: "findOriginal",
      name: "Find Original Price",
      description: "Calculate the original price from the sale price and discount percentage",
      fields: [
        { name: "salePrice", label: "Sale Price", type: "number", placeholder: "e.g. 59.99", prefix: "$", step: 0.01 },
        { name: "discountPct", label: "Discount Percentage", type: "number", placeholder: "e.g. 25", suffix: "%" },
      ],
      calculate: (inputs) => {
        const sale = inputs.salePrice as number;
        const pct = inputs.discountPct as number;
        if (!sale || !pct || pct >= 100) return null;
        const original = sale / (1 - pct / 100);
        const discount = original - sale;
        return {
          primary: { label: "Original Price", value: `$${formatNumber(original)}` },
          details: [
            { label: "Discount Amount", value: `$${formatNumber(discount)}` },
            { label: "Sale Price", value: `$${formatNumber(sale)}` },
            { label: "Discount", value: `${formatNumber(pct)}%` },
          ],
        };
      },
    },
    {
      id: "stackedDiscount",
      name: "Stacked Discounts",
      description: "Calculate the total discount when multiple discounts are applied in sequence",
      fields: [
        { name: "originalPrice", label: "Original Price", type: "number", placeholder: "e.g. 100", prefix: "$", step: 0.01 },
        { name: "discount1", label: "First Discount %", type: "number", placeholder: "e.g. 20", suffix: "%" },
        { name: "discount2", label: "Second Discount %", type: "number", placeholder: "e.g. 10", suffix: "%" },
      ],
      calculate: (inputs) => {
        const original = inputs.originalPrice as number;
        const d1 = inputs.discount1 as number;
        const d2 = inputs.discount2 as number;
        if (!original || !d1 || !d2) return null;
        const afterFirst = original * (1 - d1 / 100);
        const finalPrice = afterFirst * (1 - d2 / 100);
        const totalDiscount = original - finalPrice;
        const totalPct = (totalDiscount / original) * 100;
        return {
          primary: { label: "Final Price", value: `$${formatNumber(finalPrice)}` },
          details: [
            { label: "Total Discount", value: `${formatNumber(totalPct)}%` },
            { label: "Total Savings", value: `$${formatNumber(totalDiscount)}` },
            { label: "After First Discount", value: `$${formatNumber(afterFirst)}` },
            { label: "Simple Sum Would Be", value: `${formatNumber(d1 + d2)}% (incorrect)` },
          ],
          note: "Stacked discounts are NOT simply added together. Each discount applies to the reduced price.",
        };
      },
    },
  ],
  relatedSlugs: ["discount-calculator", "percentage-calculator", "margin-calculator"],
  faq: [
    { question: "How do you calculate discount percentage?", answer: "Discount Percentage = ((Original Price - Sale Price) / Original Price) × 100. For example, an item marked down from $80 to $60: ((80-60)/80) × 100 = 25% off." },
    { question: "Can you add stacked discounts together?", answer: "No. A 20% discount followed by a 10% discount is NOT 30% off. The second discount applies to the already-reduced price. 20% + 10% stacked = 28% total discount. Each subsequent discount has a smaller dollar impact." },
    { question: "How do I find the original price before a discount?", answer: "Original Price = Sale Price / (1 - Discount%/100). For example, if an item is $60 after 25% off: $60 / (1 - 0.25) = $60 / 0.75 = $80." },
  ],
  formula: "Discount % = ((Original - Sale) / Original) × 100 | Sale Price = Original × (1 - Discount%/100) | Stacked: Final = Price × (1 - D1/100) × (1 - D2/100)",
};
