import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const decomposedGraniteCalcCalculator: CalculatorDefinition = {
  slug: "decomposed-granite-calc-calculator",
  title: "Decomposed Granite Calculator",
  description: "Free decomposed granite calculator. Estimate tons or cubic yards of DG needed for pathways, patios, driveways, and landscaping projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["decomposed granite calculator", "DG calculator", "how much decomposed granite do I need", "decomposed granite coverage", "DG path calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Decomposed Granite Needed",
      description: "Estimate DG materials for paths, patios, and ground cover",
      fields: [
        { name: "length", label: "Area Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "width", label: "Area Width (feet)", type: "number", placeholder: "e.g. 4" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "dgType", label: "DG Type", type: "select", options: [{ label: "Loose DG", value: "loose" }, { label: "Stabilized DG (with resin)", value: "stabilized" }], defaultValue: "loose" },
        { name: "costPerTon", label: "Cost per Ton (optional)", type: "number", placeholder: "e.g. 50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = (inputs.depth as number) || 3;
        const dgType = (inputs.dgType as string) || "loose";
        const costPerTon = inputs.costPerTon as number;
        if (!length || !width) return null;

        const areaSqFt = length * width;
        const cubicFeet = areaSqFt * (depth / 12);
        const cubicYards = cubicFeet / 27;

        // DG weighs approximately 3,000 lbs per cubic yard (compacted)
        const weightPerYd3 = 3000;
        const weightLbs = cubicYards * weightPerYd3;
        const tons = weightLbs / 2000;
        const tonsWithWaste = tons * 1.10;

        // Stabilizer if needed: ~1 gallon per 50 sq ft per inch of depth
        const stabilizerGallons = dgType === "stabilized" ? Math.ceil(areaSqFt / 50 * (depth / 1)) : 0;

        const details: { label: string; value: string }[] = [
          { label: "Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Depth", value: `${depth} inches` },
          { label: "DG Type", value: dgType === "loose" ? "Loose DG" : "Stabilized DG" },
          { label: "Volume", value: `${formatNumber(cubicYards, 2)} cubic yards` },
          { label: "Tons (exact)", value: formatNumber(tons, 2) },
          { label: "Tons with 10% Buffer", value: formatNumber(tonsWithWaste, 2) },
        ];

        if (dgType === "stabilized") {
          details.push({ label: "Stabilizer Needed", value: `${formatNumber(stabilizerGallons)} gallons` });
        }

        if (costPerTon) {
          const dgCost = tonsWithWaste * costPerTon;
          const stabCost = stabilizerGallons * 40;
          const totalCost = dgCost + stabCost;
          details.push({ label: "DG Material Cost", value: `$${formatNumber(dgCost, 2)}` });
          if (dgType === "stabilized") {
            details.push({ label: "Stabilizer Cost", value: `$${formatNumber(stabCost, 2)}` });
          }
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per sq ft", value: `$${formatNumber(totalCost / areaSqFt, 2)}` });
        }

        return {
          primary: { label: "Decomposed Granite Needed", value: `${formatNumber(tonsWithWaste, 2)} tons` },
          details,
          note: "Based on DG density of ~3,000 lbs per compacted cubic yard. Stabilized DG uses a resin binder to create a firmer surface and reduce erosion. Includes 10% buffer for compaction and settling.",
        };
      },
    },
  ],
  relatedSlugs: ["pea-gravel-calc-calculator", "gravel-calculator", "flagstone-patio-calculator"],
  faq: [
    { question: "How deep should decomposed granite be?", answer: "For pathways, use 2-3 inches of DG over a compacted subgrade. For patios and driveways, use 3-4 inches. For decorative ground cover, 2 inches is sufficient." },
    { question: "What is stabilized decomposed granite?", answer: "Stabilized DG has a natural resin binder mixed in that, when compacted and watered, creates a firm, erosion-resistant surface. It is more durable than loose DG and suitable for higher-traffic areas." },
    { question: "How much does decomposed granite cost?", answer: "Bulk DG costs $30-$70 per ton depending on color and region. Stabilized DG costs more due to the binder additive, typically $50-$100 per ton including stabilizer." },
  ],
  formula: "Tons = Area (sq ft) x Depth (in) / 12 / 27 x 3,000 / 2,000 x 1.10",
};
