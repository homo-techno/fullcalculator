import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const topsoilCalculator: CalculatorDefinition = {
  slug: "topsoil-calculator",
  title: "Topsoil Calculator",
  description: "Free topsoil calculator. Calculate how many cubic yards and tons of topsoil you need for your garden, lawn, or landscaping project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["topsoil calculator", "how much topsoil do I need", "topsoil cubic yards", "topsoil tons", "garden soil calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Topsoil Needed",
      description: "Calculate cubic yards and tons of topsoil for your area",
      fields: [
        { name: "area", label: "Area (sq ft)", type: "number", placeholder: "e.g. 500" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const depth = (inputs.depth as number) || 4;
        if (!area) return null;

        const cubicFeet = area * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const tons = cubicYards * 1.1;
        const cubicYardsWithWaste = cubicYards * 1.05;
        const tonsWithWaste = cubicYardsWithWaste * 1.1;

        return {
          primary: { label: "Topsoil Needed", value: `${formatNumber(cubicYards, 2)} cubic yards` },
          details: [
            { label: "Cubic yards (exact)", value: formatNumber(cubicYards, 2) },
            { label: "With 5% extra", value: `${formatNumber(cubicYardsWithWaste, 2)} cu yd` },
            { label: "Weight (tons)", value: `${formatNumber(tons, 2)} tons` },
            { label: "Weight with extra", value: `${formatNumber(tonsWithWaste, 2)} tons` },
            { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
            { label: "Coverage area", value: `${formatNumber(area)} sq ft` },
            { label: "Depth", value: `${depth} inches` },
          ],
          note: "1 cubic yard of topsoil weighs approximately 1.1 tons (2,200 lbs). Order slightly more to account for settling and compaction.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "gravel-calculator", "soil-mulch-calculator"],
  faq: [
    { question: "How do I calculate how much topsoil I need?", answer: "Multiply your area in square feet by the desired depth in inches, divide by 12 to convert to feet, then divide by 27 to get cubic yards. For example, 500 sq ft at 4 inches deep = 500 x 4/12 / 27 = 6.17 cubic yards." },
    { question: "How much does a cubic yard of topsoil weigh?", answer: "One cubic yard of topsoil weighs approximately 1.1 tons (2,200 lbs), though this varies with moisture content. Wet topsoil can weigh up to 1.5 tons per cubic yard." },
    { question: "How deep should topsoil be for a new lawn?", answer: "For a new lawn, apply 4-6 inches of topsoil. For garden beds, use 6-12 inches. For topdressing an existing lawn, 1-2 inches is sufficient." },
  ],
  formula: "Cubic Yards = Area (sq ft) x Depth (in) / 12 / 27 | Tons = Cubic Yards x 1.1",
};
