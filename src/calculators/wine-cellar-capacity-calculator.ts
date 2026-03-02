import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wineCellarCapacityCalculator: CalculatorDefinition = {
  slug: "wine-cellar-capacity-calculator",
  title: "Wine Cellar Capacity Calculator",
  description: "Estimate the number of bottles a wine cellar can hold.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wine","cellar","capacity","bottles"],
  variants: [{
    id: "standard",
    name: "Wine Cellar Capacity",
    description: "Estimate the number of bottles a wine cellar can hold.",
    fields: [
      { name: "length", label: "Cellar Length (ft)", type: "number", min: 3, max: 40, defaultValue: 10 },
      { name: "width", label: "Cellar Width (ft)", type: "number", min: 3, max: 40, defaultValue: 8 },
      { name: "wallCoverage", label: "Wall Rack Coverage (%)", type: "number", min: 10, max: 100, defaultValue: 70 },
      { name: "rackDepth", label: "Rack Depth (bottles)", type: "number", min: 1, max: 5, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const wallCoverage = inputs.wallCoverage as number;
    const rackDepth = inputs.rackDepth as number;
    const perimeter = 2 * (length + width);
    const rackWallFt = perimeter * (wallCoverage / 100);
    const bottlesPerFt = 12;
    const totalBottles = Math.floor(rackWallFt * bottlesPerFt * rackDepth);
    return {
      primary: { label: "Bottle Capacity", value: formatNumber(totalBottles) + " bottles" },
      details: [
        { label: "Rack Wall Length", value: formatNumber(rackWallFt) + " ft" },
        { label: "Cellar Area", value: formatNumber(length * width) + " sq ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["bookshelf-capacity-calculator","kitchen-island-size-calculator"],
  faq: [
    { question: "How many bottles per linear foot of racking?", answer: "Standard wine racks hold about 12 bottles per linear foot." },
    { question: "What temperature is best for wine storage?", answer: "Wine should be stored between 55 and 58 degrees Fahrenheit." },
  ],
  formula: "Bottles = Rack Wall Length x 12 bottles per ft x Rack Depth",
};
