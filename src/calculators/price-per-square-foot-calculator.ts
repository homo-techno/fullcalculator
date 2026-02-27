import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pricePerSquareFootCalculator: CalculatorDefinition = {
  slug: "price-per-square-foot-calculator",
  title: "Price Per Square Foot Calculator",
  description: "Free price per square foot calculator. Get instant results with our easy-to-use calculator.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["price per square foot calculator", "calculator", "online tool"],
  variants: [
    {
      id: "standard",
      name: "Price Per Square Foot",
      description: "Calculate price per square foot",
      fields: [
        {
          name: "price",
          label: "Property Price",
          type: "number",
          placeholder: "e.g. 350000",
          prefix: "$",
          min: 0,
        },
        {
          name: "sqft",
          label: "Square Footage",
          type: "number",
          placeholder: "e.g. 1800",
          suffix: "sq ft",
          min: 1,
        }
      ],
      calculate: (inputs) => {
        const price = inputs.price as number;
        const sqft = inputs.sqft as number;
        if (!price || !sqft) return null;
        const ppsf = price / sqft;
        return {
          primary: { label: "Price per Sq Ft", value: "$" + formatNumber(ppsf) },
          details: [
            { label: "Total price", value: "$" + formatNumber(price) },
            { label: "Total area", value: formatNumber(sqft) + " sq ft" },
            { label: "Price per sq meter", value: "$" + formatNumber(ppsf * 10.764) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How does the price per square foot calculator work?", answer: "Enter your values and the calculator instantly computes the result using standard formulas." },
    { question: "How accurate is this?", answer: "This calculator uses established formulas and provides reliable estimates for planning purposes." },
  ],
  formula: "Based on standard formulas",
};
