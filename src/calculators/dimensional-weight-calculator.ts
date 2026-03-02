import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dimensionalWeightCalculator: CalculatorDefinition = {
  slug: "dimensional-weight-calculator",
  title: "Dimensional Weight Calculator",
  description: "Calculate DIM weight for shipping packages.",
  category: "Everyday",
  categorySlug: "~",
  icon: "Package",
  keywords: ["dimensional","weight","DIM","shipping","package"],
  variants: [{
    id: "standard",
    name: "Dimensional Weight",
    description: "Calculate DIM weight for shipping packages.",
    fields: [
      { name: "length", label: "Length (in)", type: "number", min: 1, max: 200, defaultValue: 20 },
      { name: "width", label: "Width (in)", type: "number", min: 1, max: 200, defaultValue: 15 },
      { name: "height", label: "Height (in)", type: "number", min: 1, max: 200, defaultValue: 10 },
      { name: "actualWeight", label: "Actual Weight (lbs)", type: "number", min: 0.1, max: 5000, defaultValue: 25 },
      { name: "dimFactor", label: "DIM Factor", type: "number", min: 100, max: 250, defaultValue: 139 },
    ],
    calculate: (inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const actualWeight = inputs.actualWeight as number;
    const dimFactor = inputs.dimFactor as number;
    const cubicInches = length * width * height;
    const dimWeight = cubicInches / dimFactor;
    const billableWeight = Math.max(actualWeight, dimWeight);
    const useDim = dimWeight > actualWeight;
    return {
      primary: { label: "Billable Weight (lbs)", value: formatNumber(billableWeight) },
      details: [
        { label: "Dimensional Weight (lbs)", value: formatNumber(dimWeight) },
        { label: "Actual Weight (lbs)", value: formatNumber(actualWeight) },
        { label: "Cubic Inches", value: formatNumber(cubicInches) },
        { label: "Billed By", value: useDim ? "DIM Weight" : "Actual Weight" }
      ]
    };
  },
  }],
  relatedSlugs: ["freight-class-calculator","container-load-calculator","cbm-calculator"],
  faq: [
    { question: "What is dimensional weight?", answer: "A pricing method based on package volume rather than actual weight." },
    { question: "What DIM factor should I use?", answer: "UPS and FedEx typically use 139 for domestic shipments." },
  ],
  formula: "DIM Weight = (L x W x H) / DIM Factor",
};
