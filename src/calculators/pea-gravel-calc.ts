import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const peaGravelCalcCalculator: CalculatorDefinition = {
  slug: "pea-gravel-calc-calculator",
  title: "Pea Gravel Calculator",
  description: "Free pea gravel calculator. Estimate tons or cubic yards of pea gravel needed for patios, walkways, driveways, and landscaping projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pea gravel calculator", "how much pea gravel do I need", "pea gravel coverage", "pea gravel tons", "pea gravel patio calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Pea Gravel Needed",
      description: "Estimate pea gravel for patios, walkways, and landscaping",
      fields: [
        { name: "length", label: "Area Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Area Width (feet)", type: "number", placeholder: "e.g. 10" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "costPerTon", label: "Cost per Ton (optional)", type: "number", placeholder: "e.g. 45", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = (inputs.depth as number) || 2;
        const costPerTon = inputs.costPerTon as number;
        if (!length || !width) return null;

        const areaSqFt = length * width;
        const cubicFeet = areaSqFt * (depth / 12);
        const cubicYards = cubicFeet / 27;

        // Pea gravel weighs approximately 2,800 lbs per cubic yard (compacted)
        const weightLbs = cubicYards * 2800;
        const tons = weightLbs / 2000;
        const tonsWithWaste = tons * 1.10;

        // Bags: 0.5 cu ft bags
        const bags50lb = Math.ceil(cubicFeet / 0.5);

        const details: { label: string; value: string }[] = [
          { label: "Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Depth", value: `${depth} inches` },
          { label: "Volume", value: `${formatNumber(cubicFeet, 1)} cubic feet` },
          { label: "Volume", value: `${formatNumber(cubicYards, 2)} cubic yards` },
          { label: "Tons (exact)", value: formatNumber(tons, 2) },
          { label: "Tons with 10% Buffer", value: formatNumber(tonsWithWaste, 2) },
          { label: "50 lb Bags (if buying bagged)", value: formatNumber(bags50lb) },
        ];

        if (costPerTon) {
          const totalCost = tonsWithWaste * costPerTon;
          details.push({ label: "Estimated Bulk Cost", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per sq ft", value: `$${formatNumber(totalCost / areaSqFt, 2)}` });
        }

        return {
          primary: { label: "Pea Gravel Needed", value: `${formatNumber(tonsWithWaste, 2)} tons (${formatNumber(cubicYards, 2)} cu yd)` },
          details,
          note: "Based on pea gravel density of ~2,800 lbs per cubic yard. Buying in bulk by the ton is much cheaper than bags for larger projects. Includes 10% buffer for settling.",
        };
      },
    },
  ],
  relatedSlugs: ["river-rock-calc-calculator", "gravel-calculator", "decomposed-granite-calc-calculator"],
  faq: [
    { question: "How deep should pea gravel be?", answer: "For walkways and patios, use 2-3 inches of pea gravel. For driveways, use 3-4 inches. For decorative ground cover in garden beds, 2 inches is sufficient. Always compact the base material underneath." },
    { question: "How much does pea gravel cost?", answer: "Bulk pea gravel costs $25-$65 per ton or $30-$80 per cubic yard, depending on your location and the quantity ordered. Bagged pea gravel costs significantly more, around $4-$8 per 50-lb bag." },
    { question: "How many square feet does a ton of pea gravel cover?", answer: "One ton of pea gravel covers approximately 100 square feet at 2 inches deep, 70 square feet at 3 inches deep, or 50 square feet at 4 inches deep." },
  ],
  formula: "Tons = Area (sq ft) x Depth (in) / 12 / 27 x 2,800 / 2,000 x 1.10",
};
