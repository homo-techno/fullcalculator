import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carpetCalculator: CalculatorDefinition = {
  slug: "carpet-calculator",
  title: "Carpet Calculator",
  description: "Free carpet calculator. Calculate how much carpet you need in square feet and square yards, and estimate the total cost.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["carpet calculator", "carpet cost calculator", "flooring calculator", "carpet square yards", "carpet estimator"],
  variants: [
    {
      id: "room",
      name: "Single Room",
      fields: [
        { name: "length", label: "Room Length (ft)", type: "number", placeholder: "e.g. 15" },
        { name: "width", label: "Room Width (ft)", type: "number", placeholder: "e.g. 12" },
        { name: "waste", label: "Waste Factor (%)", type: "number", suffix: "%", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "price", label: "Price per sq ft", type: "number", prefix: "$", placeholder: "e.g. 3.50" },
        { name: "padPrice", label: "Pad Price per sq ft", type: "number", prefix: "$", placeholder: "e.g. 0.75", defaultValue: 0 },
        { name: "installPrice", label: "Install per sq ft", type: "number", prefix: "$", placeholder: "e.g. 1.00", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const l = inputs.length as number, w = inputs.width as number;
        const waste = (inputs.waste as number) || 10;
        const price = (inputs.price as number) || 0;
        const pad = (inputs.padPrice as number) || 0;
        const install = (inputs.installPrice as number) || 0;
        if (!l || !w) return null;
        const sqft = l * w;
        const withWaste = sqft * (1 + waste / 100);
        const sqyd = withWaste / 9;
        const totalPerSqft = price + pad + install;
        const totalCost = withWaste * totalPerSqft;
        return {
          primary: { label: "Carpet Needed", value: `${formatNumber(withWaste, 0)} sq ft (${formatNumber(sqyd, 1)} sq yd)` },
          details: [
            { label: "Room area", value: `${formatNumber(sqft, 0)} sq ft` },
            { label: "With waste", value: `${formatNumber(withWaste, 0)} sq ft` },
            { label: "Square yards", value: formatNumber(sqyd, 1) },
            ...(price ? [
              { label: "Carpet cost", value: `$${formatNumber(withWaste * price, 2)}` },
              ...(pad ? [{ label: "Padding cost", value: `$${formatNumber(withWaste * pad, 2)}` }] : []),
              ...(install ? [{ label: "Installation cost", value: `$${formatNumber(withWaste * install, 2)}` }] : []),
              { label: "Total cost", value: `$${formatNumber(totalCost, 2)}` },
            ] : []),
          ],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "tile-calculator", "paint-calculator"],
  faq: [{ question: "How do I calculate carpet needed?", answer: "Multiply length × width to get square feet. Add 10% for waste (cuts and seams). Divide by 9 to convert to square yards. Carpet is typically sold by the square yard." }],
  formula: "Carpet = L × W × (1 + waste%) | 1 sq yd = 9 sq ft",
};
