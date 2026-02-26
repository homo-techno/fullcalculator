import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const epoxyResinCalcCalculator: CalculatorDefinition = {
  slug: "epoxy-resin-calculator",
  title: "Epoxy Resin Calculator",
  description: "Free online epoxy resin volume calculator. Calculate how much resin you need for molds, coatings, and casting projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["epoxy resin calculator", "resin volume calculator", "resin mold calculator", "casting resin calculator", "epoxy coating calculator"],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Mold / Coating",
      description: "Calculate resin for rectangular molds, table tops, or flat surfaces",
      fields: [
        { name: "length", label: "Length (inches)", type: "number", placeholder: "e.g. 12" },
        { name: "width", label: "Width (inches)", type: "number", placeholder: "e.g. 8" },
        { name: "depth", label: "Depth / Thickness (inches)", type: "number", placeholder: "e.g. 0.25" },
        { name: "mixRatio", label: "Mix Ratio (Resin:Hardener)", type: "select", options: [
          { label: "1:1 by volume", value: "1" },
          { label: "2:1 by volume", value: "2" },
          { label: "3:1 by volume", value: "3" },
        ], defaultValue: "1" },
        { name: "waste", label: "Waste/Overpour (%)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string) || 0;
        const width = parseFloat(inputs.width as string) || 0;
        const depth = parseFloat(inputs.depth as string) || 0;
        const mixRatio = parseFloat(inputs.mixRatio as string) || 1;
        const waste = parseFloat(inputs.waste as string) || 10;
        if (!length || !width || !depth) return null;

        const volumeCuIn = length * width * depth;
        const volumeWithWaste = volumeCuIn * (1 + waste / 100);
        const volumeFlOz = volumeCuIn * 0.5541;
        const totalFlOz = volumeFlOz * (1 + waste / 100);
        const totalMl = totalFlOz * 29.5735;
        const resinPart = totalFlOz * (mixRatio / (mixRatio + 1));
        const hardenerPart = totalFlOz * (1 / (mixRatio + 1));

        return {
          primary: { label: "Total Resin Needed", value: `${formatNumber(totalFlOz, 1)} fl oz` },
          details: [
            { label: "Volume (cubic inches)", value: formatNumber(volumeWithWaste, 1) },
            { label: "Volume (mL)", value: formatNumber(totalMl, 0) },
            { label: "Resin part", value: `${formatNumber(resinPart, 1)} fl oz` },
            { label: "Hardener part", value: `${formatNumber(hardenerPart, 1)} fl oz` },
            { label: "Mix ratio", value: `${mixRatio}:1` },
            { label: "Waste allowance", value: `${waste}%` },
          ],
          note: "Always mix resin and hardener by the manufacturer's recommended ratio. Temperature affects curing time.",
        };
      },
    },
    {
      id: "cylindrical",
      name: "Cylindrical Mold",
      description: "Calculate resin for cylindrical molds (coasters, paperweights, etc.)",
      fields: [
        { name: "diameter", label: "Diameter (inches)", type: "number", placeholder: "e.g. 4" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 0.5" },
        { name: "quantity", label: "Number of Pieces", type: "number", placeholder: "e.g. 4", defaultValue: 1 },
        { name: "waste", label: "Waste/Overpour (%)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const diameter = parseFloat(inputs.diameter as string) || 0;
        const depth = parseFloat(inputs.depth as string) || 0;
        const quantity = parseFloat(inputs.quantity as string) || 1;
        const waste = parseFloat(inputs.waste as string) || 10;
        if (!diameter || !depth) return null;

        const radius = diameter / 2;
        const volumePerPiece = Math.PI * radius * radius * depth;
        const totalVolume = volumePerPiece * quantity;
        const totalWithWaste = totalVolume * (1 + waste / 100);
        const totalFlOz = totalWithWaste * 0.5541;
        const totalMl = totalFlOz * 29.5735;

        return {
          primary: { label: "Total Resin Needed", value: `${formatNumber(totalFlOz, 1)} fl oz` },
          details: [
            { label: "Volume per piece", value: `${formatNumber(volumePerPiece, 2)} in³` },
            { label: "Total volume", value: `${formatNumber(totalWithWaste, 1)} in³` },
            { label: "Total (mL)", value: formatNumber(totalMl, 0) },
            { label: "Pieces", value: formatNumber(quantity, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["volume-calculator", "unit-converter"],
  faq: [
    { question: "How much epoxy resin do I need?", answer: "Measure the length, width, and depth of your mold or surface in inches. Multiply to get cubic inches, then convert to fluid ounces (1 in³ ≈ 0.554 fl oz). Add 10% extra for waste." },
    { question: "What mix ratio should I use?", answer: "Always use the ratio specified by your resin manufacturer. Most art/craft epoxies use 1:1 by volume. Some deep-pour and industrial epoxies use 2:1 or 3:1 ratios." },
    { question: "Why add extra for waste?", answer: "Resin sticks to mixing cups and stir sticks, and you may need extra to fill gaps. Adding 10-15% extra ensures you have enough to complete the project." },
  ],
  formula: "Resin (fl oz) = Length × Width × Depth × 0.554 × (1 + Waste%/100)",
};
