import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stoneWallCalculator: CalculatorDefinition = {
  slug: "stone-wall-calculator",
  title: "Stone Wall Calculator",
  description: "Free stone wall calculator. Estimate tons of natural stone, fieldstone, or manufactured stone veneer needed for retaining walls, garden walls, and accent walls.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["stone wall calculator", "retaining wall stone calculator", "how much stone for a wall", "fieldstone wall calculator", "natural stone wall calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Stone Wall Materials",
      description: "Estimate stone, base, and backfill for a stone wall",
      fields: [
        { name: "length", label: "Wall Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "height", label: "Wall Height (feet)", type: "number", placeholder: "e.g. 3" },
        { name: "thickness", label: "Wall Thickness (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "stoneType", label: "Stone Type", type: "select", options: [{ label: "Natural Fieldstone", value: "fieldstone" }, { label: "Cut/Ashlar Stone", value: "cut" }, { label: "Stone Veneer (thin)", value: "veneer" }], defaultValue: "fieldstone" },
        { name: "costPerTon", label: "Cost per Ton (optional)", type: "number", placeholder: "e.g. 250", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const height = inputs.height as number;
        const thicknessIn = (inputs.thickness as number) || 12;
        const stoneType = (inputs.stoneType as string) || "fieldstone";
        const costPerTon = inputs.costPerTon as number;
        if (!length || !height) return null;

        const faceAreaSqFt = length * height;
        const thicknessFt = thicknessIn / 12;
        const volumeCuFt = faceAreaSqFt * thicknessFt;
        const cubicYards = volumeCuFt / 27;

        // Weight per cubic foot varies by stone type
        // Fieldstone: ~100 lbs/cu ft but ~60% stone, 40% air
        // Cut stone: ~150 lbs/cu ft with mortar
        // Veneer: just face area, ~15 lbs/sq ft
        let tons = 0;
        let wastePercent = 0;

        if (stoneType === "veneer") {
          const lbsPerSqFt = 15;
          tons = (faceAreaSqFt * lbsPerSqFt) / 2000;
          wastePercent = 0.10;
        } else if (stoneType === "cut") {
          const lbsPerCuFt = 150;
          tons = (volumeCuFt * lbsPerCuFt) / 2000;
          wastePercent = 0.05;
        } else {
          // Fieldstone - random shapes, more waste
          const lbsPerCuFt = 100;
          tons = (volumeCuFt * lbsPerCuFt) / 2000;
          wastePercent = 0.15;
        }

        const tonsWithWaste = tons * (1 + wastePercent);

        // Gravel backfill for retaining walls: behind the wall
        const backfillCuFt = length * height * 1; // 1 foot of gravel behind
        const backfillTons = (backfillCuFt * 95) / 2000;

        const details: { label: string; value: string }[] = [
          { label: "Wall Face Area", value: `${formatNumber(faceAreaSqFt)} sq ft` },
          { label: "Stone Type", value: stoneType === "fieldstone" ? "Natural Fieldstone" : stoneType === "cut" ? "Cut/Ashlar Stone" : "Stone Veneer" },
          { label: "Wall Thickness", value: `${thicknessIn} inches` },
        ];

        if (stoneType !== "veneer") {
          details.push({ label: "Wall Volume", value: `${formatNumber(cubicYards, 2)} cubic yards` });
        }

        details.push(
          { label: "Stone (exact)", value: `${formatNumber(tons, 2)} tons` },
          { label: `Stone with ${wastePercent * 100}% Waste`, value: `${formatNumber(tonsWithWaste, 2)} tons` },
          { label: "Gravel Backfill (if retaining)", value: `${formatNumber(backfillTons, 2)} tons` },
        );

        if (costPerTon) {
          const stoneCost = tonsWithWaste * costPerTon;
          const backfillCost = backfillTons * 35;
          const totalCost = stoneCost + backfillCost;
          details.push({ label: "Stone Cost", value: `$${formatNumber(stoneCost, 2)}` });
          details.push({ label: "Backfill Cost", value: `$${formatNumber(backfillCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
        }

        return {
          primary: { label: "Stone Needed", value: `${formatNumber(tonsWithWaste, 2)} tons` },
          details,
          note: "Fieldstone requires more material (15% waste) due to irregular shapes. Cut stone is more efficient (5% waste). Retaining walls over 4 feet typically require engineering. Check local codes.",
        };
      },
    },
  ],
  relatedSlugs: ["cinder-block-wall-calculator", "concrete-calculator", "landscape-stone-calculator"],
  faq: [
    { question: "How much stone do I need for a wall?", answer: "For a fieldstone wall, plan on approximately 1 ton per 8-10 cubic feet of wall volume, accounting for air gaps and irregular shapes. Cut stone is denser at about 150 lbs per cubic foot." },
    { question: "How high can a stone wall be without engineering?", answer: "Most building codes allow dry-stacked retaining walls up to 3-4 feet without engineering. Walls over 4 feet typically require engineered plans, proper drainage, and a building permit." },
    { question: "Does a stone retaining wall need drainage?", answer: "Yes, proper drainage is critical. Install perforated drain pipe at the base, gravel backfill behind the wall, and weep holes. Poor drainage is the number one cause of retaining wall failure." },
  ],
  formula: "Tons = Wall Length x Height x Thickness (ft) x Stone Density (lbs/cu ft) / 2,000 x Waste Factor",
};
