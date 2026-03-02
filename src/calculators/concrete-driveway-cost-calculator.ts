import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concreteDrivewayCostCalculator: CalculatorDefinition = {
  slug: "concrete-driveway-cost-calculator",
  title: "Concrete Driveway Cost Calculator",
  description: "Estimate the cost of a concrete driveway by area and thickness.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["concrete","driveway","cost","paving"],
  variants: [{
    id: "standard",
    name: "Concrete Driveway Cost",
    description: "Estimate the cost of a concrete driveway by area and thickness.",
    fields: [
      { name: "length", label: "Driveway Length (ft)", type: "number", min: 10, max: 200, defaultValue: 40 },
      { name: "width", label: "Driveway Width (ft)", type: "number", min: 8, max: 50, defaultValue: 16 },
      { name: "thickness", label: "Thickness (inches)", type: "number", min: 3, max: 8, defaultValue: 4 },
      { name: "pricePerYard", label: "Price per Cubic Yard ($)", type: "number", min: 50, max: 500, defaultValue: 150 },
    ],
    calculate: (inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const thickness = inputs.thickness as number;
    const pricePerYard = inputs.pricePerYard as number;
    const areaSqFt = length * width;
    const volumeCuFt = areaSqFt * (thickness / 12);
    const cubicYards = volumeCuFt / 27;
    const totalCost = cubicYards * pricePerYard;
    return {
      primary: { label: "Estimated Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Area", value: formatNumber(areaSqFt) + " sq ft" },
        { label: "Cubic Yards Needed", value: formatNumber(cubicYards) }
      ]
    };
  },
  }],
  relatedSlugs: ["epoxy-floor-calculator","countertop-square-footage-calculator"],
  faq: [
    { question: "How thick should a concrete driveway be?", answer: "A residential driveway should be at least 4 inches thick." },
    { question: "How long does concrete take to cure?", answer: "Concrete reaches full strength in about 28 days." },
  ],
  formula: "Volume = Length x Width x (Thickness / 12); Cost = (Volume / 27) x Price per Cubic Yard",
};
