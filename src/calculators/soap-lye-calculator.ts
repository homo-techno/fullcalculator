import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soapLyeCalculator: CalculatorDefinition = {
  slug: "soap-lye-calculator",
  title: "Soap Lye Calculator",
  description: "Calculate lye and water for cold process soap making.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["soap lye","lye calculator cold process"],
  variants: [{
    id: "standard",
    name: "Soap Lye",
    description: "Calculate lye and water for cold process soap making.",
    fields: [
      { name: "oilWeight", label: "Oil Weight (oz)", type: "number", min: 4, max: 500, defaultValue: 32 },
      { name: "sapValue", label: "SAP Value (NaOH)", type: "number", min: 0.05, max: 0.2, defaultValue: 0.135 },
      { name: "superfat", label: "Superfat (%)", type: "number", min: 0, max: 20, defaultValue: 5 },
      { name: "waterPct", label: "Water as % of Oils", type: "number", min: 25, max: 45, defaultValue: 33 },
    ],
    calculate: (inputs) => {
      const oil = inputs.oilWeight as number;
      const sap = inputs.sapValue as number;
      const sf = inputs.superfat as number;
      const wp = inputs.waterPct as number;
      if (!oil || !sap) return null;
      const lye = Math.round(oil * sap * (1 - sf / 100) * 100) / 100;
      const water = Math.round(oil * wp / 100 * 100) / 100;
      const totalBatch = Math.round((oil + lye + water) * 100) / 100;
      return {
        primary: { label: "Lye (NaOH)", value: formatNumber(lye) + " oz" },
        details: [
          { label: "Water", value: formatNumber(water) + " oz" },
          { label: "Superfat", value: sf + "%" },
          { label: "Total Batch Weight", value: formatNumber(totalBatch) + " oz" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is superfatting in soap making?", answer: "Superfatting leaves extra oil in soap for a moisturizing bar." },
    { question: "Can I substitute KOH for NaOH?", answer: "Yes, but KOH makes liquid soap. Multiply lye amount by 1.4." },
  ],
  formula: "Lye = Oil Weight x SAP Value x (1 - Superfat% / 100)",
};
