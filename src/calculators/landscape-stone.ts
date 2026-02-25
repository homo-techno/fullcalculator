import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landscapeStoneCalculator: CalculatorDefinition = {
  slug: "landscape-stone-calculator",
  title: "Landscape Rock Calculator",
  description: "Free landscape rock calculator. Estimate tons of decorative stone, lava rock, marble chips, or crushed stone needed for beds, borders, and ground cover.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["landscape rock calculator", "decorative stone calculator", "how much landscape rock do I need", "lava rock calculator", "crushed stone coverage calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Landscape Rock",
      description: "Estimate decorative rock for landscaping projects",
      fields: [
        { name: "length", label: "Area Length (feet)", type: "number", placeholder: "e.g. 25" },
        { name: "width", label: "Area Width (feet)", type: "number", placeholder: "e.g. 10" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "rockType", label: "Rock Type", type: "select", options: [{ label: "Crushed Granite/Stone", value: "crushed" }, { label: "Lava Rock", value: "lava" }, { label: "Marble Chips", value: "marble" }, { label: "Slate Chips", value: "slate" }, { label: "River Rock (mixed)", value: "river" }], defaultValue: "crushed" },
        { name: "costPerTon", label: "Cost per Ton (optional)", type: "number", placeholder: "e.g. 80", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = (inputs.depth as number) || 3;
        const rockType = (inputs.rockType as string) || "crushed";
        const costPerTon = inputs.costPerTon as number;
        if (!length || !width) return null;

        const areaSqFt = length * width;
        const cubicFeet = areaSqFt * (depth / 12);
        const cubicYards = cubicFeet / 27;

        // Weight per cubic yard varies by rock type
        let weightPerCuYd = 2400;
        let rockLabel = "";
        if (rockType === "crushed") {
          weightPerCuYd = 2700;
          rockLabel = "Crushed Granite/Stone";
        } else if (rockType === "lava") {
          weightPerCuYd = 1200;
          rockLabel = "Lava Rock";
        } else if (rockType === "marble") {
          weightPerCuYd = 2400;
          rockLabel = "Marble Chips";
        } else if (rockType === "slate") {
          weightPerCuYd = 2600;
          rockLabel = "Slate Chips";
        } else {
          weightPerCuYd = 2400;
          rockLabel = "River Rock (mixed)";
        }

        const weightLbs = cubicYards * weightPerCuYd;
        const tons = weightLbs / 2000;
        const tonsWithWaste = tons * 1.10;

        // Coverage per ton at this depth
        const sqFtPerTon = areaSqFt / tonsWithWaste;

        const details: { label: string; value: string }[] = [
          { label: "Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Depth", value: `${depth} inches` },
          { label: "Rock Type", value: rockLabel },
          { label: "Volume", value: `${formatNumber(cubicYards, 2)} cubic yards` },
          { label: "Weight", value: `${formatNumber(weightLbs, 0)} lbs` },
          { label: "Tons (exact)", value: formatNumber(tons, 2) },
          { label: "Tons with 10% Buffer", value: formatNumber(tonsWithWaste, 2) },
          { label: "Coverage Rate", value: `${formatNumber(sqFtPerTon, 0)} sq ft/ton at ${depth}\" deep` },
        ];

        if (costPerTon) {
          const totalCost = tonsWithWaste * costPerTon;
          details.push({ label: "Estimated Cost", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per sq ft", value: `$${formatNumber(totalCost / areaSqFt, 2)}` });
        }

        return {
          primary: { label: "Landscape Rock Needed", value: `${formatNumber(tonsWithWaste, 2)} tons` },
          details,
          note: "Lava rock is significantly lighter than other stone types, covering more area per ton. Always install landscape fabric underneath decorative rock to prevent weed growth and rock sinking. Includes 10% buffer.",
        };
      },
    },
  ],
  relatedSlugs: ["river-rock-calc-calculator", "pea-gravel-calc-calculator", "mulch-calculator"],
  faq: [
    { question: "How deep should landscape rock be?", answer: "For decorative ground cover, 2-3 inches is standard. Use 3-4 inches for weed suppression. Lighter rocks like lava rock can be 2 inches, while heavier crushed stone should be at least 2-3 inches." },
    { question: "How much does landscape rock cost?", answer: "Prices vary widely: crushed granite $30-$50/ton, lava rock $50-$120/ton, marble chips $70-$150/ton, slate chips $80-$130/ton. Bulk delivery is much cheaper than buying bags." },
    { question: "Should I put fabric under landscape rock?", answer: "Yes, always install landscape fabric under decorative rock. It prevents weeds from growing up through the rock and keeps the rock from sinking into the soil over time." },
  ],
  formula: "Tons = Area (sq ft) x Depth (in) / 12 / 27 x Weight per cu yd / 2,000 x 1.10",
};
