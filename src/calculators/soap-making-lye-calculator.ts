import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soapMakingLyeCalculator: CalculatorDefinition = {
  slug: "soap-making-lye-calculator",
  title: "Soap Making Lye Calculator",
  description: "Calculate the correct amount of lye (sodium hydroxide) and water needed for cold process soap making based on oil weights and SAP values.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["soap lye calculator","saponification","cold process soap","NaOH calculator"],
  variants: [{
    id: "standard",
    name: "Soap Making Lye",
    description: "Calculate the correct amount of lye (sodium hydroxide) and water needed for cold process soap making based on oil weights and SAP values.",
    fields: [
      { name: "oilWeight", label: "Total Oil Weight (oz)", type: "number", min: 4, max: 200, defaultValue: 32 },
      { name: "oilType", label: "Primary Oil", type: "select", options: [{ value: "1", label: "Olive Oil" }, { value: "2", label: "Coconut Oil" }, { value: "3", label: "Palm Oil" }, { value: "4", label: "Lard/Tallow" }, { value: "5", label: "Castor Oil" }], defaultValue: "1" },
      { name: "superfat", label: "Superfat (%)", type: "number", min: 0, max: 20, defaultValue: 5 },
      { name: "waterRatio", label: "Water:Lye Ratio", type: "select", options: [{ value: "1.5", label: "1.5:1 (Less Water)" }, { value: "2", label: "2:1 (Standard)" }, { value: "2.5", label: "2.5:1 (More Water)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const oilWeight = inputs.oilWeight as number;
    const oilType = parseInt(inputs.oilType as string);
    const superfat = inputs.superfat as number;
    const waterRatio = parseFloat(inputs.waterRatio as string);
    const sapValues = { 1: 0.1353, 2: 0.1910, 3: 0.1413, 4: 0.1405, 5: 0.1286 };
    const sap = sapValues[oilType] || 0.1353;
    const lyeNeeded = oilWeight * sap * (1 - superfat / 100);
    const waterNeeded = lyeNeeded * waterRatio;
    const totalBatchWeight = oilWeight + lyeNeeded + waterNeeded;
    return {
      primary: { label: "Lye (NaOH) Needed", value: formatNumber(Math.round(lyeNeeded * 100) / 100) + " oz" },
      details: [
        { label: "Water Needed", value: formatNumber(Math.round(waterNeeded * 100) / 100) + " oz" },
        { label: "SAP Value Used", value: formatNumber(sap) },
        { label: "Total Batch Weight", value: formatNumber(Math.round(totalBatchWeight * 100) / 100) + " oz" },
        { label: "Superfat Amount", value: formatNumber(superfat) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["candle-making-wax-calculator","resin-art-volume-calculator"],
  faq: [
    { question: "What is the SAP value?", answer: "SAP (saponification value) indicates how much lye is needed to convert one ounce of a specific oil into soap. Each oil has a unique SAP value." },
    { question: "Why do I need superfat?", answer: "Superfatting leaves a percentage of oils unsaponified in the finished soap. This makes the soap more moisturizing and provides a safety margin to ensure no excess lye remains." },
    { question: "Is lye dangerous?", answer: "Yes, sodium hydroxide is a caustic chemical. Always wear gloves and eye protection. Add lye to water, never water to lye, to avoid a dangerous exothermic reaction." },
  ],
  formula: "Lye = Oil Weight x SAP Value x (1 - Superfat% / 100)
Water = Lye x Water:Lye Ratio
Total Batch Weight = Oil + Lye + Water",
};
