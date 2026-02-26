import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paintMixingRatioCalculator: CalculatorDefinition = {
  slug: "paint-mixing-ratio-calculator",
  title: "Paint Mixing Ratio Calculator",
  description: "Free online paint mixing ratio calculator. Calculate exact amounts for multi-part paint mixes, color mixing, and automotive paint ratios.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["paint mixing ratio calculator", "paint ratio calculator", "automotive paint mixer", "color mixing calculator", "paint proportion calculator"],
  variants: [
    {
      id: "ratio-mix",
      name: "Multi-Part Ratio Mix",
      description: "Calculate amounts for 2-part or 3-part paint mixing ratios",
      fields: [
        { name: "totalAmount", label: "Total Amount Needed (oz)", type: "number", placeholder: "e.g. 16" },
        { name: "partA", label: "Part A Ratio", type: "number", placeholder: "e.g. 4" },
        { name: "partB", label: "Part B Ratio (Hardener/Activator)", type: "number", placeholder: "e.g. 1" },
        { name: "partC", label: "Part C Ratio (Reducer, 0 if none)", type: "number", placeholder: "e.g. 1", defaultValue: 0 },
        { name: "unit", label: "Measurement Unit", type: "select", options: [
          { label: "Fluid ounces", value: "fl oz" },
          { label: "Milliliters", value: "mL" },
          { label: "Cups", value: "cups" },
          { label: "Pints", value: "pints" },
        ], defaultValue: "fl oz" },
      ],
      calculate: (inputs) => {
        const total = parseFloat(inputs.totalAmount as string) || 0;
        const partA = parseFloat(inputs.partA as string) || 0;
        const partB = parseFloat(inputs.partB as string) || 0;
        const partC = parseFloat(inputs.partC as string) || 0;
        const unit = inputs.unit as string;
        if (!total || !partA || !partB) return null;

        const totalParts = partA + partB + partC;
        const perPart = total / totalParts;
        const amountA = perPart * partA;
        const amountB = perPart * partB;
        const amountC = perPart * partC;

        const ratioStr = partC > 0 ? `${partA}:${partB}:${partC}` : `${partA}:${partB}`;
        const details: { label: string; value: string }[] = [
          { label: "Mix ratio", value: ratioStr },
          { label: "Part A (Paint/Base)", value: `${formatNumber(amountA, 2)} ${unit}` },
          { label: "Part B (Hardener)", value: `${formatNumber(amountB, 2)} ${unit}` },
        ];
        if (partC > 0) {
          details.push({ label: "Part C (Reducer)", value: `${formatNumber(amountC, 2)} ${unit}` });
        }
        details.push(
          { label: "Total parts", value: formatNumber(totalParts, 0) },
          { label: "Amount per part", value: `${formatNumber(perPart, 2)} ${unit}` },
        );

        return {
          primary: { label: "Total Mixed Amount", value: `${formatNumber(total, 1)} ${unit}` },
          details,
          note: "Always follow manufacturer specifications. Mix thoroughly and use within the pot life window.",
        };
      },
    },
    {
      id: "color-blend",
      name: "Two-Color Blend",
      description: "Calculate paint amounts for blending two colors at a given ratio",
      fields: [
        { name: "totalPaint", label: "Total Paint Needed (oz)", type: "number", placeholder: "e.g. 8" },
        { name: "color1Pct", label: "Color 1 Percentage (%)", type: "number", placeholder: "e.g. 70" },
        { name: "color1Name", label: "Color 1 Name", type: "number", placeholder: "e.g. White" },
        { name: "color2Name", label: "Color 2 Name", type: "number", placeholder: "e.g. Blue" },
      ],
      calculate: (inputs) => {
        const total = parseFloat(inputs.totalPaint as string) || 0;
        const color1Pct = parseFloat(inputs.color1Pct as string) || 0;
        const color1Name = (inputs.color1Name as string) || "Color 1";
        const color2Name = (inputs.color2Name as string) || "Color 2";
        if (!total || !color1Pct) return null;

        const color2Pct = 100 - color1Pct;
        const amount1 = total * (color1Pct / 100);
        const amount2 = total * (color2Pct / 100);
        const ratioSimplified = color1Pct / (color2Pct || 1);

        return {
          primary: { label: "Mix Amounts", value: `${formatNumber(amount1, 2)} + ${formatNumber(amount2, 2)} oz` },
          details: [
            { label: `${color1Name}`, value: `${formatNumber(amount1, 2)} oz (${color1Pct}%)` },
            { label: `${color2Name}`, value: `${formatNumber(amount2, 2)} oz (${color2Pct}%)` },
            { label: "Ratio", value: `${formatNumber(ratioSimplified, 1)}:1` },
            { label: "Total paint", value: `${formatNumber(total, 1)} oz` },
          ],
          note: "Mix small test batches first. Colors may shift when dry. Keep notes on exact ratios for reproducibility.",
        };
      },
    },
  ],
  relatedSlugs: ["ratio-calculator", "paint-calculator"],
  faq: [
    { question: "What does a 4:1:1 paint ratio mean?", answer: "A 4:1:1 ratio means 4 parts paint/base, 1 part hardener, and 1 part reducer. For 12 oz total, you would use 8 oz base, 2 oz hardener, and 2 oz reducer." },
    { question: "How do I measure paint ratios accurately?", answer: "Use graduated mixing cups with ratio markings, or a digital scale for weight-based mixing. For automotive paint, paint mixing sticks with ratio markings are the industry standard." },
    { question: "Does the ratio change based on temperature?", answer: "Some products require more or less reducer based on temperature. In hot weather, use slower reducer. In cold weather, use faster reducer. Always check the product's Technical Data Sheet (TDS)." },
  ],
  formula: "Part Amount = Total × (Part Ratio / Sum of All Ratios)",
};
