import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pottingSoilCalculator: CalculatorDefinition = {
  slug: "potting-soil-calculator",
  title: "Potting Soil Volume Calculator",
  description: "Free potting soil calculator. Calculate how much potting soil you need for containers, pots, window boxes, and hanging baskets of any size or shape.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["potting soil calculator", "how much soil for pot", "container soil calculator", "pot volume calculator", "soil for planters"],
  variants: [
    {
      id: "round-pot",
      name: "Round Pot/Container",
      description: "Calculate soil for round pots, buckets, and barrels",
      fields: [
        { name: "diameter", label: "Pot Diameter (inches)", type: "number", placeholder: "e.g. 12" },
        { name: "height", label: "Pot Height (inches)", type: "number", placeholder: "e.g. 10" },
        { name: "numPots", label: "Number of Pots", type: "number", placeholder: "e.g. 5", defaultValue: 1, min: 1 },
        { name: "fillLevel", label: "Fill Level", type: "select", options: [
          { label: "Full (100%)", value: "100" },
          { label: "With Drainage Layer (85%)", value: "85" },
          { label: "Half Pot (50%)", value: "50" },
        ], defaultValue: "85" },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const height = inputs.height as number;
        const numPots = inputs.numPots as number;
        const fillPct = parseInt(inputs.fillLevel as string);
        if (!diameter || !height || !numPots) return null;

        const radiusIn = diameter / 2;
        const volumeCuIn = Math.PI * radiusIn * radiusIn * height * (fillPct / 100);
        const volumePerPot = volumeCuIn;
        const totalVolumeCuIn = volumePerPot * numPots;
        const cubicFeet = totalVolumeCuIn / 1728;
        const quarts = cubicFeet * 25.71;
        const gallons = quarts / 4;
        const liters = gallons * 3.785;
        const bags8qt = Math.ceil(quarts / 8);
        const bags16qt = Math.ceil(quarts / 16);
        const bags1cuft = Math.ceil(cubicFeet);

        return {
          primary: { label: "Potting Soil Needed", value: `${formatNumber(quarts, 1)} quarts (${formatNumber(gallons, 1)} gallons)` },
          details: [
            { label: "Per pot", value: `${formatNumber(volumePerPot / 1728 * 25.71, 1)} quarts` },
            { label: "Total volume", value: `${formatNumber(cubicFeet, 2)} cubic feet` },
            { label: "Liters", value: formatNumber(liters, 1) },
            { label: "8-qt bags needed", value: `${bags8qt}` },
            { label: "16-qt bags needed", value: `${bags16qt}` },
            { label: "1 cu ft bags needed", value: `${bags1cuft}` },
            { label: "Number of pots", value: `${numPots}` },
          ],
          note: "Never use garden soil in containers - it compacts and drains poorly. Use quality potting mix with perlite for drainage. Leave 1 inch from the rim for watering.",
        };
      },
    },
    {
      id: "rectangular",
      name: "Rectangular Planter/Window Box",
      description: "Calculate soil for rectangular planters and window boxes",
      fields: [
        { name: "length", label: "Length (inches)", type: "number", placeholder: "e.g. 24" },
        { name: "width", label: "Width (inches)", type: "number", placeholder: "e.g. 8" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 8" },
        { name: "numPlanters", label: "Number of Planters", type: "number", placeholder: "e.g. 3", defaultValue: 1, min: 1 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        const num = inputs.numPlanters as number;
        if (!length || !width || !height || !num) return null;

        const volumePerPlanter = length * width * height * 0.85;
        const totalCuIn = volumePerPlanter * num;
        const cubicFeet = totalCuIn / 1728;
        const quarts = cubicFeet * 25.71;
        const gallons = quarts / 4;

        return {
          primary: { label: "Potting Soil Needed", value: `${formatNumber(quarts, 1)} quarts` },
          details: [
            { label: "Per planter", value: `${formatNumber(volumePerPlanter / 1728 * 25.71, 1)} quarts` },
            { label: "Total cubic feet", value: formatNumber(cubicFeet, 2) },
            { label: "Total gallons", value: formatNumber(gallons, 1) },
            { label: "8-qt bags needed", value: `${Math.ceil(quarts / 8)}` },
            { label: "16-qt bags needed", value: `${Math.ceil(quarts / 16)}` },
            { label: "Number of planters", value: `${num}` },
          ],
          note: "For window boxes, use a lightweight potting mix with extra perlite. The weight of wet soil matters on windowsills and balcony railings.",
        };
      },
    },
    {
      id: "common-sizes",
      name: "By Common Pot Size",
      description: "Quick lookup for standard pot sizes",
      fields: [
        { name: "potSize", label: "Pot Size", type: "select", options: [
          { label: "4-inch pot (0.5 qt)", value: "4" },
          { label: "6-inch pot (1.5 qt)", value: "6" },
          { label: "8-inch pot (3 qt)", value: "8" },
          { label: "10-inch pot (6 qt)", value: "10" },
          { label: "12-inch pot (8 qt)", value: "12" },
          { label: "14-inch pot (12 qt)", value: "14" },
          { label: "16-inch pot (20 qt)", value: "16" },
          { label: "18-inch pot (25 qt)", value: "18" },
          { label: "5-gallon bucket (18 qt)", value: "5gal" },
          { label: "Half wine barrel (30 qt)", value: "barrel" },
          { label: "Grow bag 5-gallon (18 qt)", value: "grow5" },
          { label: "Grow bag 10-gallon (35 qt)", value: "grow10" },
        ], defaultValue: "12" },
        { name: "numPots", label: "Number of Pots", type: "number", placeholder: "e.g. 6", defaultValue: 1, min: 1 },
      ],
      calculate: (inputs) => {
        const size = inputs.potSize as string;
        const num = inputs.numPots as number;
        if (!size || !num) return null;

        const quartsPerPot: Record<string, number> = {
          "4": 0.5, "6": 1.5, "8": 3, "10": 6, "12": 8,
          "14": 12, "16": 20, "18": 25, "5gal": 18, barrel: 30,
          grow5: 18, grow10: 35,
        };

        const qts = quartsPerPot[size] || 8;
        const totalQts = qts * num;
        const cubicFeet = totalQts / 25.71;
        const bags8 = Math.ceil(totalQts / 8);
        const bags16 = Math.ceil(totalQts / 16);
        const bags1cf = Math.ceil(cubicFeet);
        const costBagged = bags8 * 6;
        const costBulk = bags1cf * 10;

        return {
          primary: { label: "Total Soil Needed", value: `${formatNumber(totalQts, 1)} quarts` },
          details: [
            { label: "Per pot", value: `${qts} quarts` },
            { label: "Total cubic feet", value: formatNumber(cubicFeet, 2) },
            { label: "8-qt bags", value: `${bags8} ($${formatNumber(costBagged, 0)} est.)` },
            { label: "16-qt bags", value: `${bags16}` },
            { label: "1 cu ft bags", value: `${bags1cf} ($${formatNumber(costBulk, 0)} est.)` },
          ],
          note: "Buying larger bags is more economical. A 1 cubic foot bag equals about 25.7 quarts. Reuse potting soil by refreshing with 25% new compost and perlite each season.",
        };
      },
    },
  ],
  relatedSlugs: ["raised-bed-soil-calculator", "topsoil-calculator", "garden-bed-cost-calculator"],
  faq: [
    { question: "How many quarts of soil for a 12-inch pot?", answer: "A standard 12-inch diameter pot needs about 8 quarts (2 gallons) of potting soil. This is based on an average pot depth of 10 inches, filled to 85% capacity to allow room for watering." },
    { question: "Can I reuse potting soil?", answer: "Yes, potting soil can be reused for 2-3 seasons. Refresh by mixing in 25% new compost, adding perlite for drainage, and optionally adding slow-release fertilizer. Remove old roots and check for pests. Do not reuse soil from diseased plants." },
    { question: "What is the difference between potting soil and garden soil?", answer: "Potting soil (potting mix) is lightweight, well-draining, and designed for containers. It typically contains peat moss, perlite, and compost. Garden soil is heavier, denser, and compacts in pots, leading to poor drainage and root rot. Never use garden soil in containers." },
  ],
  formula: "Round Pot: Volume = π × r² × height | Rectangular: Volume = L × W × H | 1 cu ft ≈ 25.7 quarts ≈ 6.4 gallons",
};
