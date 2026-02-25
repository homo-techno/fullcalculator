import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flagstonePatioCalculator: CalculatorDefinition = {
  slug: "flagstone-patio-calculator",
  title: "Flagstone Patio Calculator",
  description: "Free flagstone patio calculator. Estimate how many tons of flagstone, sand base, and joint filler you need for your patio project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["flagstone calculator", "flagstone patio calculator", "how much flagstone do I need", "natural stone patio calculator", "flagstone cost calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Flagstone Patio Materials",
      description: "Estimate flagstone, base, and filler for a patio",
      fields: [
        { name: "length", label: "Patio Length (feet)", type: "number", placeholder: "e.g. 15" },
        { name: "width", label: "Patio Width (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "thickness", label: "Stone Thickness (inches)", type: "select", options: [{ label: "1 inch", value: "1" }, { label: "1.5 inches", value: "1.5" }, { label: "2 inches", value: "2" }], defaultValue: "1.5" },
        { name: "costPerTon", label: "Flagstone Cost per Ton (optional)", type: "number", placeholder: "e.g. 350", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const thickness = parseFloat((inputs.thickness as string) || "1.5");
        const costPerTon = inputs.costPerTon as number;
        if (!length || !width) return null;

        const areaSqFt = length * width;

        // Flagstone coverage: approximately 80-90 sq ft per ton at 1.5" thick
        const sqFtPerTonBase = 85;
        const sqFtPerTon = sqFtPerTonBase * (1.5 / thickness);
        const tonsNeeded = areaSqFt / sqFtPerTon;
        const tonsWithWaste = tonsNeeded * 1.15;

        // Sand base: 1 inch deep for setting bed
        const sandCubicFt = areaSqFt * (1 / 12);
        const sandTons = sandCubicFt * 100 / 2000; // sand ~100 lbs/cu ft

        // Gravel base: 4 inches deep
        const gravelCubicFt = areaSqFt * (4 / 12);
        const gravelTons = gravelCubicFt * 95 / 2000;

        // Polymeric sand for joints: 1 bag per ~60 sq ft
        const polymerSandBags = Math.ceil(areaSqFt / 60);

        const details: { label: string; value: string }[] = [
          { label: "Patio Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Stone Thickness", value: `${thickness} inches` },
          { label: "Flagstone (exact)", value: `${formatNumber(tonsNeeded, 2)} tons` },
          { label: "Flagstone with 15% Waste", value: `${formatNumber(tonsWithWaste, 2)} tons` },
          { label: "Sand Base (1\" deep)", value: `${formatNumber(sandTons, 2)} tons` },
          { label: "Gravel Base (4\" deep)", value: `${formatNumber(gravelTons, 2)} tons` },
          { label: "Polymeric Sand Bags", value: formatNumber(polymerSandBags) },
        ];

        if (costPerTon) {
          const stoneCost = tonsWithWaste * costPerTon;
          const sandCost = sandTons * 40;
          const gravelCost = gravelTons * 35;
          const polyCost = polymerSandBags * 25;
          const totalCost = stoneCost + sandCost + gravelCost + polyCost;
          details.push({ label: "Flagstone Cost", value: `$${formatNumber(stoneCost, 2)}` });
          details.push({ label: "Base Materials Cost", value: `$${formatNumber(sandCost + gravelCost + polyCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per sq ft", value: `$${formatNumber(totalCost / areaSqFt, 2)}` });
        }

        return {
          primary: { label: "Flagstone Needed", value: `${formatNumber(tonsWithWaste, 2)} tons` },
          details,
          note: "Coverage based on approximately 85 sq ft per ton at 1.5\" thickness. Irregular flagstone requires 10-15% extra for cutting waste. Includes 4\" gravel base and 1\" sand setting bed.",
        };
      },
    },
  ],
  relatedSlugs: ["patio-paver-calc-calculator", "gravel-calculator", "concrete-calculator"],
  faq: [
    { question: "How much flagstone do I need per square foot?", answer: "At 1.5 inches thick, you need approximately 1 ton per 85 square feet. Thicker stone covers less area per ton. Add 10-15% for cutting waste and irregular shapes." },
    { question: "What base do I need under a flagstone patio?", answer: "A typical flagstone patio needs a 4-inch compacted gravel base topped with a 1-inch sand setting bed. This provides proper drainage and a level surface for the stone." },
    { question: "How much does a flagstone patio cost?", answer: "Flagstone ranges from $200-$700 per ton depending on type and region. A typical 150 sq ft patio costs $700-$2,500 for materials. Professional installation adds $8-$20 per square foot for labor." },
  ],
  formula: "Tons = (Area sq ft / 85) x (1.5 / Thickness in) x 1.15 waste factor",
};
