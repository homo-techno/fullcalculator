import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soapMakingCalcCalculator: CalculatorDefinition = {
  slug: "soap-making-calculator",
  title: "Soap Making Lye Calculator",
  description: "Free online soap making lye calculator. Calculate sodium hydroxide (NaOH) and potassium hydroxide (KOH) amounts for cold process soap using saponification values.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["soap making calculator", "lye calculator", "saponification calculator", "NaOH calculator", "cold process soap calculator"],
  variants: [
    {
      id: "naoh",
      name: "NaOH (Bar Soap)",
      description: "Calculate sodium hydroxide needed for cold process bar soap",
      fields: [
        { name: "oilType", label: "Primary Oil/Fat", type: "select", options: [
          { label: "Olive Oil (SAP 0.135)", value: "0.135" },
          { label: "Coconut Oil (SAP 0.178)", value: "0.178" },
          { label: "Palm Oil (SAP 0.141)", value: "0.141" },
          { label: "Shea Butter (SAP 0.128)", value: "0.128" },
          { label: "Castor Oil (SAP 0.128)", value: "0.128" },
          { label: "Sweet Almond Oil (SAP 0.136)", value: "0.136" },
          { label: "Lard (SAP 0.138)", value: "0.138" },
        ], defaultValue: "0.135" },
        { name: "oilWeight", label: "Oil Weight (oz)", type: "number", placeholder: "e.g. 32" },
        { name: "superfat", label: "Superfat (%)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
        { name: "waterRatio", label: "Water:Lye Ratio", type: "select", options: [
          { label: "2:1 (standard)", value: "2" },
          { label: "1.5:1 (less water)", value: "1.5" },
          { label: "2.5:1 (more water)", value: "2.5" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const sapValue = parseFloat(inputs.oilType as string) || 0.135;
        const oilWeight = parseFloat(inputs.oilWeight as string) || 0;
        const superfat = parseFloat(inputs.superfat as string) || 5;
        const waterRatio = parseFloat(inputs.waterRatio as string) || 2;
        if (!oilWeight) return null;

        const lyeNeeded = oilWeight * sapValue;
        const lyeWithSuperfat = lyeNeeded * (1 - superfat / 100);
        const waterNeeded = lyeWithSuperfat * waterRatio;
        const totalBatchWeight = oilWeight + lyeWithSuperfat + waterNeeded;

        return {
          primary: { label: "NaOH (Lye) Needed", value: `${formatNumber(lyeWithSuperfat, 2)} oz` },
          details: [
            { label: "Lye before superfat", value: `${formatNumber(lyeNeeded, 2)} oz` },
            { label: "Superfat discount", value: `${superfat}%` },
            { label: "Water needed", value: `${formatNumber(waterNeeded, 2)} oz` },
            { label: "Oil weight", value: `${formatNumber(oilWeight, 1)} oz` },
            { label: "Total batch weight", value: `${formatNumber(totalBatchWeight, 1)} oz` },
          ],
          note: "Always add lye to water, never water to lye. Use safety equipment (goggles, gloves). Verify with a dedicated lye calculator before your first batch.",
        };
      },
    },
    {
      id: "koh",
      name: "KOH (Liquid Soap)",
      description: "Calculate potassium hydroxide needed for liquid soap",
      fields: [
        { name: "oilType", label: "Primary Oil/Fat", type: "select", options: [
          { label: "Olive Oil (SAP 0.190)", value: "0.190" },
          { label: "Coconut Oil (SAP 0.250)", value: "0.250" },
          { label: "Palm Oil (SAP 0.199)", value: "0.199" },
          { label: "Castor Oil (SAP 0.180)", value: "0.180" },
          { label: "Sunflower Oil (SAP 0.189)", value: "0.189" },
        ], defaultValue: "0.190" },
        { name: "oilWeight", label: "Oil Weight (oz)", type: "number", placeholder: "e.g. 16" },
        { name: "superfat", label: "Superfat (%)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const sapValue = parseFloat(inputs.oilType as string) || 0.190;
        const oilWeight = parseFloat(inputs.oilWeight as string) || 0;
        const superfat = parseFloat(inputs.superfat as string) || 3;
        if (!oilWeight) return null;

        const kohNeeded = oilWeight * sapValue;
        const kohWithSuperfat = kohNeeded * (1 - superfat / 100);
        const waterNeeded = kohWithSuperfat * 2.5;

        return {
          primary: { label: "KOH Needed", value: `${formatNumber(kohWithSuperfat, 2)} oz` },
          details: [
            { label: "KOH before superfat", value: `${formatNumber(kohNeeded, 2)} oz` },
            { label: "Superfat discount", value: `${superfat}%` },
            { label: "Water needed", value: `${formatNumber(waterNeeded, 2)} oz` },
          ],
          note: "KOH for liquid soap uses a higher water ratio. Liquid soap paste must be diluted after cooking.",
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "ratio-calculator"],
  faq: [
    { question: "What is saponification?", answer: "Saponification is the chemical reaction between fats/oils and a strong base (lye) that produces soap and glycerin. Each oil has a unique SAP value indicating how much lye is needed to fully convert it." },
    { question: "What does superfat mean?", answer: "Superfat is the percentage of oils left unsaponified in the finished soap. A 5% superfat means 5% of the oils won't react with lye, resulting in a more moisturizing bar. Most soap makers use 3-8% superfat." },
    { question: "Why is safety important with lye?", answer: "Sodium hydroxide (NaOH) and potassium hydroxide (KOH) are caustic substances that can cause severe burns. Always wear gloves, goggles, and long sleeves. Work in a ventilated area and always add lye to water." },
  ],
  formula: "Lye (oz) = Oil Weight (oz) × SAP Value × (1 - Superfat%/100)",
};
