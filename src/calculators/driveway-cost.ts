import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drivewayCostCalculator: CalculatorDefinition = {
  slug: "driveway-cost-calculator",
  title: "Driveway Cost Calculator",
  description: "Free driveway cost calculator. Estimate the cost of installing or replacing a driveway by material, size, and preparation needed.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["driveway cost calculator", "concrete driveway cost", "asphalt driveway cost", "driveway installation cost", "new driveway cost"],
  variants: [
    {
      id: "driveway",
      name: "Driveway Installation",
      fields: [
        { name: "length", label: "Driveway Length (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "width", label: "Driveway Width (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "material", label: "Driveway Material", type: "select", options: [
          { label: "Concrete ($6-15/sq ft)", value: "10" },
          { label: "Asphalt ($3-8/sq ft)", value: "5.5" },
          { label: "Gravel ($1-3/sq ft)", value: "2" },
          { label: "Pavers ($10-25/sq ft)", value: "17" },
          { label: "Stamped concrete ($10-20/sq ft)", value: "15" },
          { label: "Exposed aggregate ($8-16/sq ft)", value: "12" },
          { label: "Cobblestone ($15-35/sq ft)", value: "25" },
        ], defaultValue: "10" },
        { name: "grading", label: "Site Preparation", type: "select", options: [
          { label: "Minimal (flat, no removal)", value: "0" },
          { label: "Remove existing driveway ($2-4/sq ft)", value: "3" },
          { label: "Grading + removal ($4-8/sq ft)", value: "6" },
        ], defaultValue: "3" },
        { name: "drainage", label: "Drainage", type: "select", options: [
          { label: "Standard grading only", value: "0" },
          { label: "French drain ($500-$1,500)", value: "1000" },
          { label: "Channel drain ($300-$800)", value: "550" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const materialCost = parseFloat(inputs.material as string) || 10;
        const gradingCost = parseFloat(inputs.grading as string) || 0;
        const drainageCost = parseInt(inputs.drainage as string) || 0;
        if (!length || !width) return null;
        const sqft = length * width;
        const materialTotal = sqft * materialCost;
        const gradingTotal = sqft * gradingCost;
        const base = sqft * 1.5; // gravel base
        const totalCost = materialTotal + gradingTotal + base + drainageCost;
        return {
          primary: { label: "Estimated Driveway Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Driveway area", value: `${formatNumber(sqft)} sq ft` },
            { label: "Material & installation", value: `$${formatNumber(materialTotal)}` },
            { label: "Site preparation", value: gradingCost > 0 ? `$${formatNumber(gradingTotal)}` : "Minimal" },
            { label: "Base material", value: `$${formatNumber(base)}` },
            { label: "Drainage", value: drainageCost > 0 ? `$${formatNumber(drainageCost)}` : "Standard" },
            { label: "Dimensions", value: `${length}' × ${width}'` },
            { label: "Cost per sq ft", value: `$${formatNumber(totalCost / sqft)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "patio-cost-calculator", "garage-door-cost-calculator"],
  faq: [
    { question: "How much does a new driveway cost?", answer: "Gravel: $500-$2,000. Asphalt: $2,000-$6,000. Concrete: $3,000-$10,000. Pavers: $5,000-$15,000. For a standard 2-car driveway (16×40 ft = 640 sq ft): concrete runs $4,000-$8,000, asphalt $2,500-$5,000. Removing an old driveway adds $1,000-$3,000." },
  ],
  formula: "Total = (Sq Ft × Material/SqFt) + Site Prep + Base + Drainage",
};
