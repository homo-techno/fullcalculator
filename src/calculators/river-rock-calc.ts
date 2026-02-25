import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const riverRockCalcCalculator: CalculatorDefinition = {
  slug: "river-rock-calc-calculator",
  title: "River Rock Coverage Calculator",
  description: "Free river rock calculator. Estimate tons of river rock needed for landscaping, ground cover, dry creek beds, and decorative projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["river rock calculator", "river stone calculator", "how much river rock do I need", "river rock coverage", "river rock tons calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate River Rock Coverage",
      description: "Estimate river rock for landscaping and ground cover",
      fields: [
        { name: "length", label: "Area Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Area Width (feet)", type: "number", placeholder: "e.g. 10" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "rockSize", label: "Rock Size", type: "select", options: [{ label: "1-2 inch (small)", value: "small" }, { label: "2-4 inch (medium)", value: "medium" }, { label: "4-8 inch (large)", value: "large" }], defaultValue: "medium" },
        { name: "costPerTon", label: "Cost per Ton (optional)", type: "number", placeholder: "e.g. 120", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = (inputs.depth as number) || 3;
        const rockSize = (inputs.rockSize as string) || "medium";
        const costPerTon = inputs.costPerTon as number;
        if (!length || !width) return null;

        const areaSqFt = length * width;
        const cubicFeet = areaSqFt * (depth / 12);
        const cubicYards = cubicFeet / 27;

        // River rock weight varies by size: small ~2600 lbs/yd3, medium ~2400, large ~2200
        const weightPerYd3 = rockSize === "small" ? 2600 : rockSize === "medium" ? 2400 : 2200;
        const weightLbs = cubicYards * weightPerYd3;
        const tons = weightLbs / 2000;
        const tonsWithWaste = tons * 1.10;

        const details: { label: string; value: string }[] = [
          { label: "Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Depth", value: `${depth} inches` },
          { label: "Rock Size", value: rockSize === "small" ? "1-2 inch" : rockSize === "medium" ? "2-4 inch" : "4-8 inch" },
          { label: "Volume", value: `${formatNumber(cubicYards, 2)} cubic yards` },
          { label: "Weight", value: `${formatNumber(weightLbs, 0)} lbs` },
          { label: "Tons (exact)", value: formatNumber(tons, 2) },
          { label: "Tons with 10% Buffer", value: formatNumber(tonsWithWaste, 2) },
        ];

        if (costPerTon) {
          const totalCost = tonsWithWaste * costPerTon;
          details.push({ label: "Estimated Cost", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per sq ft", value: `$${formatNumber(totalCost / areaSqFt, 2)}` });
        }

        return {
          primary: { label: "River Rock Needed", value: `${formatNumber(tonsWithWaste, 2)} tons` },
          details,
          note: "River rock weight varies by size and moisture content. Smaller rocks pack tighter and weigh more per cubic yard. Includes 10% buffer for settling and uneven coverage.",
        };
      },
    },
  ],
  relatedSlugs: ["pea-gravel-calc-calculator", "gravel-calculator", "landscape-stone-calculator"],
  faq: [
    { question: "How deep should river rock be for landscaping?", answer: "For ground cover and landscaping, 2-4 inches of river rock is standard. Use 2 inches minimum for decorative beds and 3-4 inches for walkways and drainage areas." },
    { question: "How much does river rock weigh per cubic yard?", answer: "River rock weighs approximately 2,200-2,600 pounds per cubic yard depending on size. Smaller rocks are denser (2,600 lbs/yd3) while larger rocks have more air gaps (2,200 lbs/yd3)." },
    { question: "What size river rock should I use?", answer: "Use 1-2 inch rocks for decorative beds and borders, 2-4 inch rocks for ground cover and dry creek beds, and 4-8 inch rocks for drainage, retaining features, and bold accent areas." },
  ],
  formula: "Tons = Area (sq ft) x Depth (in) / 12 / 27 x Weight per cu yd / 2,000",
};
