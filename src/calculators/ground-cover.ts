import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const groundCoverCalculator: CalculatorDefinition = {
  slug: "ground-cover-calculator",
  title: "Ground Cover Plants Calculator",
  description: "Free ground cover plants calculator. Calculate how many ground cover plants you need to fill an area based on plant type and spacing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ground cover calculator", "ground cover plants per square foot", "how many ground cover plants", "ground cover spacing", "ground cover planner"],
  variants: [
    {
      id: "by-area",
      name: "Plants for an Area",
      description: "Calculate ground cover plants needed for a specific area",
      fields: [
        { name: "area", label: "Area to Cover (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "plantType", label: "Ground Cover Type", type: "select", options: [
          { label: "Creeping Thyme (6\" spacing)", value: "6" },
          { label: "Ajuga / Bugleweed (8\" spacing)", value: "8" },
          { label: "Vinca / Periwinkle (12\" spacing)", value: "12" },
          { label: "Pachysandra (8\" spacing)", value: "8" },
          { label: "Sedum / Stonecrop (10\" spacing)", value: "10" },
          { label: "Liriope (12\" spacing)", value: "12" },
          { label: "Creeping Juniper (24\" spacing)", value: "24" },
          { label: "Sweet Woodruff (10\" spacing)", value: "10" },
          { label: "Clover (6\" spacing)", value: "6" },
          { label: "English Ivy (12\" spacing)", value: "12" },
        ], defaultValue: "12" },
        { name: "fillSpeed", label: "Desired Fill Speed", type: "select", options: [
          { label: "Standard (recommended spacing)", value: "1.0" },
          { label: "Faster fill (25% closer spacing)", value: "0.75" },
          { label: "Budget (25% wider spacing)", value: "1.25" },
        ], defaultValue: "1.0" },
        { name: "pricePerPlant", label: "Price per Plant (optional)", type: "number", placeholder: "e.g. 3", prefix: "$" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const baseSpacing = parseInt(inputs.plantType as string) || 12;
        const fillMod = parseFloat(inputs.fillSpeed as string) || 1.0;
        const price = inputs.pricePerPlant as number;
        if (!area) return null;

        const adjustedSpacing = baseSpacing * fillMod;
        const spacingSqFt = (adjustedSpacing / 12) * (adjustedSpacing / 12);
        const plantsNeeded = Math.ceil(area / spacingSqFt);
        const extra = Math.ceil(plantsNeeded * 0.1);
        const totalWithExtra = plantsNeeded + extra;

        const details = [
          { label: "Plants needed", value: `${plantsNeeded}` },
          { label: "Extra (10% buffer)", value: `+${extra}` },
          { label: "Total recommended", value: `${totalWithExtra}` },
          { label: "Effective spacing", value: `${formatNumber(adjustedSpacing, 1)} inches` },
          { label: "Area to cover", value: `${formatNumber(area)} sq ft` },
        ];
        if (price) {
          details.push({ label: "Estimated plant cost", value: `$${formatNumber(totalWithExtra * price)}` });
        }

        return {
          primary: { label: "Plants Needed", value: `${totalWithExtra} (incl. 10% extra)` },
          details,
          note: "Ground covers typically take 1-3 seasons to fully fill in. Mulch between plants to suppress weeds while they establish.",
        };
      },
    },
    {
      id: "slope",
      name: "Slope / Hillside Coverage",
      description: "Calculate ground cover for slopes with adjusted spacing",
      fields: [
        { name: "slopeLength", label: "Slope Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "slopeWidth", label: "Slope Width (feet)", type: "number", placeholder: "e.g. 15" },
        { name: "slopeAngle", label: "Slope Steepness", type: "select", options: [
          { label: "Gentle (under 15\u00B0)", value: "1.05" },
          { label: "Moderate (15-30\u00B0)", value: "1.15" },
          { label: "Steep (30-45\u00B0)", value: "1.3" },
        ], defaultValue: "1.15" },
        { name: "spacing", label: "Plant Spacing (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const length = inputs.slopeLength as number;
        const width = inputs.slopeWidth as number;
        const slopeMod = parseFloat(inputs.slopeAngle as string) || 1.15;
        const spacing = (inputs.spacing as number) || 12;
        if (!length || !width) return null;

        const flatArea = length * width;
        const slopeArea = flatArea * slopeMod;
        const spacingSqFt = (spacing / 12) * (spacing / 12);
        const plants = Math.ceil(slopeArea / spacingSqFt);

        return {
          primary: { label: "Plants Needed", value: `${plants}` },
          details: [
            { label: "Flat area", value: `${formatNumber(flatArea)} sq ft` },
            { label: "Slope-adjusted area", value: `${formatNumber(slopeArea)} sq ft` },
            { label: "Slope factor", value: `\u00D7${slopeMod}` },
            { label: "Plant spacing", value: `${spacing} inches` },
          ],
          note: "Plant in staggered rows on slopes to reduce erosion. Consider using jute netting to hold soil until plants establish. Water uphill plants more.",
        };
      },
    },
  ],
  relatedSlugs: ["flower-bed-calculator", "hedge-spacing-calculator", "garden-path-calculator"],
  faq: [
    { question: "How far apart should ground cover plants be?", answer: "Most ground covers are spaced 6-12 inches apart. Fast-spreading types (creeping thyme, clover) can be spaced wider. Slow-spreading types (pachysandra, liriope) should be planted closer." },
    { question: "How long does it take for ground cover to fill in?", answer: "Fast growers (clover, vinca) fill in within one season. Medium growers (ajuga, sedum) take 1-2 seasons. Slow growers (pachysandra, juniper) may take 2-3 seasons." },
  ],
  formula: "Plants = Area / (Spacing/12)\u00B2 | Slope Area = Flat Area \u00D7 Slope Factor",
};
