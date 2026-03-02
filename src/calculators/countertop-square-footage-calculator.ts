import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const countertopSquareFootageCalculator: CalculatorDefinition = {
  slug: "countertop-square-footage-calculator",
  title: "Countertop Square Footage Calculator",
  description: "Calculate total countertop area for your kitchen.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["countertop","square","footage","kitchen"],
  variants: [{
    id: "standard",
    name: "Countertop Square Footage",
    description: "Calculate total countertop area for your kitchen.",
    fields: [
      { name: "sections", label: "Number of Sections", type: "number", min: 1, max: 10, defaultValue: 3 },
      { name: "avgLength", label: "Avg Section Length (ft)", type: "number", min: 1, max: 20, defaultValue: 6 },
      { name: "depth", label: "Counter Depth (inches)", type: "number", min: 12, max: 36, defaultValue: 25 },
      { name: "pricePerSqFt", label: "Price per Sq Ft ($)", type: "number", min: 5, max: 300, defaultValue: 60 },
    ],
    calculate: (inputs) => {
    const sections = inputs.sections as number;
    const avgLength = inputs.avgLength as number;
    const depth = inputs.depth as number;
    const pricePerSqFt = inputs.pricePerSqFt as number;
    const depthFt = depth / 12;
    const totalSqFt = sections * avgLength * depthFt;
    const totalCost = totalSqFt * pricePerSqFt;
    return {
      primary: { label: "Total Countertop Area", value: formatNumber(totalSqFt) + " sq ft" },
      details: [
        { label: "Depth in Feet", value: formatNumber(depthFt) + " ft" },
        { label: "Estimated Cost", value: "$" + formatNumber(totalCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["kitchen-island-size-calculator","cabinet-hardware-calculator"],
  faq: [
    { question: "What is a standard countertop depth?", answer: "Standard kitchen countertop depth is 25 inches." },
    { question: "How much does granite countertop cost?", answer: "Granite costs about 40 to 100 dollars per square foot installed." },
  ],
  formula: "Total Sq Ft = Sections x Avg Length x (Depth / 12); Cost = Sq Ft x Price",
};
