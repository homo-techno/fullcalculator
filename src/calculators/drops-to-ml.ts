import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dropsToMlConverter: CalculatorDefinition = {
  slug: "drops-to-ml-converter",
  title: "Drops to Milliliters Converter",
  description: "Free drops to mL converter. Convert drops to milliliters for medications, essential oils, and liquid measurements.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["drops to ml", "drops to milliliters", "drop converter", "how many drops in a ml", "medication drops"],
  variants: [
    {
      id: "convert",
      name: "Convert Drops to mL",
      fields: [
        { name: "value", label: "Number of Drops", type: "number", placeholder: "e.g. 20" },
        { name: "dropType", label: "Drop Type", type: "select", options: [
          { label: "Medical/Standard (0.05 mL)", value: "0.05" },
          { label: "Essential Oil (0.03 mL)", value: "0.03" },
          { label: "Eye Drop (0.04 mL)", value: "0.04" },
          { label: "Dropper Bottle (0.05 mL)", value: "0.05" },
          { label: "IV Drip - Macro (0.0667 mL)", value: "0.0667" },
          { label: "IV Drip - Micro (0.0167 mL)", value: "0.0167" },
        ], defaultValue: "0.05" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Drops to mL", value: "drops_to_ml" },
          { label: "mL to Drops", value: "ml_to_drops" },
        ], defaultValue: "drops_to_ml" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const dropSize = parseFloat(inputs.dropType as string);
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        if (direction === "ml_to_drops") {
          const drops = value / dropSize;
          return {
            primary: { label: `${formatNumber(value)} mL`, value: `${formatNumber(drops, 1)} drops` },
            details: [
              { label: "Drops", value: formatNumber(drops, 1) },
              { label: "Teaspoons", value: formatNumber(value / 4.929, 4) },
              { label: "Tablespoons", value: formatNumber(value / 14.787, 4) },
              { label: "Drop size used", value: `${dropSize} mL/drop` },
            ],
          };
        }
        const ml = value * dropSize;
        return {
          primary: { label: `${formatNumber(value)} drops`, value: `${formatNumber(ml, 4)} mL` },
          details: [
            { label: "Milliliters (mL)", value: formatNumber(ml, 4) },
            { label: "Teaspoons", value: formatNumber(ml / 4.929, 4) },
            { label: "Fluid Ounces", value: formatNumber(ml / 29.5735, 6) },
            { label: "Drop size used", value: `${dropSize} mL/drop` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "mg-to-ml-converter", "mcg-to-mg-converter"],
  faq: [
    { question: "How many drops are in 1 mL?", answer: "There are approximately 20 drops in 1 mL using the standard medical dropper (0.05 mL per drop). This can vary depending on dropper type, liquid viscosity, and dropper tip size." },
    { question: "How many drops of essential oil are in 1 mL?", answer: "Approximately 33 drops of essential oil per 1 mL, as essential oil droppers typically produce smaller drops (~0.03 mL each)." },
  ],
  formula: "Standard: 1 mL = 20 drops (0.05 mL/drop) | Essential oil: 1 mL ≈ 33 drops | IV macro: 1 mL = 15 drops | IV micro: 1 mL = 60 drops",
};
