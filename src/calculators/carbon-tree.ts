import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const lifestyleOptions = [
  { label: "Eco-conscious (6 tons CO2/yr)", value: "6" },
  { label: "Average American (16 tons CO2/yr)", value: "16" },
  { label: "Frequent flyer (25 tons CO2/yr)", value: "25" },
  { label: "High consumer (35 tons CO2/yr)", value: "35" },
  { label: "Custom (enter below)", value: "custom" },
];

const treeTypeOptions = [
  { label: "Deciduous (hardwood, ~22 kg/yr)", value: "22" },
  { label: "Coniferous (softwood, ~15 kg/yr)", value: "15" },
  { label: "Tropical (fast-growing, ~30 kg/yr)", value: "30" },
  { label: "Urban tree (avg, ~18 kg/yr)", value: "18" },
];

export const carbonTreeCalculator: CalculatorDefinition = {
  slug: "carbon-tree-calculator",
  title: "Trees to Offset Carbon Calculator",
  description:
    "Free trees to offset carbon calculator. Find out how many trees you need to plant to offset your annual carbon footprint based on your lifestyle and tree type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "trees offset carbon",
    "plant trees carbon",
    "carbon offset trees",
    "tree planting calculator",
    "carbon neutral trees",
    "environmental calculator",
  ],
  variants: [
    {
      id: "trees-needed",
      name: "Trees Needed",
      description:
        "Calculate how many trees to plant to offset your carbon footprint",
      fields: [
        {
          name: "lifestyle",
          label: "Lifestyle / Carbon Footprint",
          type: "select",
          options: lifestyleOptions,
        },
        {
          name: "customCO2",
          label: "Custom CO2 (tons/year) — if Custom selected",
          type: "number",
          placeholder: "e.g. 20",
          min: 0,
          max: 200,
        },
        {
          name: "treeType",
          label: "Tree Type",
          type: "select",
          options: treeTypeOptions,
        },
        {
          name: "offsetPercent",
          label: "How Much to Offset?",
          type: "select",
          options: [
            { label: "25%", value: "25" },
            { label: "50%", value: "50" },
            { label: "75%", value: "75" },
            { label: "100% (carbon neutral)", value: "100" },
            { label: "200% (carbon negative)", value: "200" },
          ],
        },
      ],
      calculate: (inputs) => {
        const lifestyleStr = (inputs.lifestyle as string) || "16";
        const customCO2 = (inputs.customCO2 as number) || 0;
        const treeStr = (inputs.treeType as string) || "22";
        const offsetStr = (inputs.offsetPercent as string) || "100";

        let co2Tons: number;
        if (lifestyleStr === "custom") {
          co2Tons = customCO2;
        } else {
          co2Tons = parseFloat(lifestyleStr);
        }

        if (co2Tons <= 0) return null;

        const treeAbsorptionKgYear = parseFloat(treeStr);
        const offsetPercent = parseFloat(offsetStr);

        const co2Kg = co2Tons * 1000;
        const co2ToOffset = co2Kg * (offsetPercent / 100);
        const treesNeeded = Math.ceil(co2ToOffset / treeAbsorptionKgYear);

        // Space needed: avg tree needs ~100 sq ft
        const sqFeetNeeded = treesNeeded * 100;
        const acres = sqFeetNeeded / 43560;

        // Cost estimate: $1-3 per tree for seedlings
        const costLow = treesNeeded * 1;
        const costHigh = treesNeeded * 3;

        // 10-year impact
        const tenYearAbsorption = (treesNeeded * treeAbsorptionKgYear * 10) / 1000;

        const treeLabel =
          treeTypeOptions.find((o) => o.value === treeStr)?.label ?? "Tree";

        return {
          primary: {
            label: "Trees Needed",
            value: formatNumber(treesNeeded),
            suffix: "trees",
          },
          details: [
            { label: "Annual carbon footprint", value: `${formatNumber(co2Tons, 1)} tons CO2` },
            { label: "Offset target", value: `${offsetPercent}%` },
            { label: "CO2 to offset", value: `${formatNumber(co2ToOffset, 0)} kg/year` },
            { label: "Tree type", value: treeLabel },
            { label: "Absorption per tree", value: `${treeAbsorptionKgYear} kg CO2/year` },
            { label: "Land needed", value: `${formatNumber(acres, 2)} acres` },
            { label: "Estimated seedling cost", value: `$${formatNumber(costLow)} - $${formatNumber(costHigh)}` },
            { label: "10-year absorption", value: `${formatNumber(tenYearAbsorption, 1)} tons CO2` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "carbon-footprint-calculator",
    "carbon-offset-cost-calculator",
    "tree-planting-calculator",
  ],
  faq: [
    {
      question: "How much CO2 does one tree absorb per year?",
      answer:
        "A mature tree absorbs about 22 kg (48 lbs) of CO2 per year on average. Fast-growing tropical trees can absorb up to 30 kg, while slower-growing conifers absorb about 15 kg.",
    },
    {
      question: "Can I really offset my carbon footprint by planting trees?",
      answer:
        "Planting trees is one part of carbon offsetting but should be combined with reducing emissions. The average American produces 16 tons of CO2 per year, which would require roughly 730 mature trees to fully offset.",
    },
  ],
  formula:
    "Trees Needed = (CO2 tons x 1000 x Offset%) / kg CO2 absorbed per tree per year. Land = Trees x 100 sq ft / 43,560.",
};
