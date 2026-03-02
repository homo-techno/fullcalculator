import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const oshaNoiseExposureCalculator: CalculatorDefinition = {
  slug: "osha-noise-exposure-calculator",
  title: "OSHA Noise Exposure Calculator",
  description: "Calculate noise dose and time-weighted average for OSHA.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["OSHA noise","noise exposure calculator","TWA noise"],
  variants: [{
    id: "standard",
    name: "OSHA Noise Exposure",
    description: "Calculate noise dose and time-weighted average for OSHA.",
    fields: [
      { name: "noiseLevel", label: "Noise Level (dBA)", type: "number", min: 60, max: 140, defaultValue: 90 },
      { name: "hours", label: "Exposure Hours", type: "number", min: 0.25, max: 16, defaultValue: 8 },
      { name: "noiseLevel2", label: "Second Noise Level (dBA)", type: "number", min: 0, max: 140, defaultValue: 0 },
      { name: "hours2", label: "Second Exposure Hours", type: "number", min: 0, max: 16, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const db1 = inputs.noiseLevel as number;
      const h1 = inputs.hours as number;
      const db2 = inputs.noiseLevel2 as number;
      const h2 = inputs.hours2 as number;
      if (!db1 || !h1) return null;
      const allowed1 = 8 / Math.pow(2, (db1 - 90) / 5);
      const dose1 = (h1 / allowed1) * 100;
      let totalDose = dose1;
      if (db2 > 0 && h2 > 0) {
        const allowed2 = 8 / Math.pow(2, (db2 - 90) / 5);
        totalDose += (h2 / allowed2) * 100;
      }
      const twa = 90 + 16.61 * Math.log10(totalDose / 100);
      return {
        primary: { label: "Noise Dose", value: formatNumber(Math.round(totalDose * 10) / 10) + "%" },
        details: [
          { label: "TWA (8-hr)", value: formatNumber(Math.round(twa * 10) / 10) + " dBA" },
          { label: "OSHA Limit", value: totalDose <= 100 ? "Within Limit" : "EXCEEDS LIMIT" },
          { label: "Allowed Time at " + db1 + " dBA", value: formatNumber(Math.round(allowed1 * 100) / 100) + " hrs" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the OSHA noise exposure limit?", answer: "OSHA allows 90 dBA for 8 hours with a 5 dB exchange rate." },
    { question: "What is a noise dose?", answer: "Noise dose is the percentage of allowable exposure received during a work shift." },
  ],
  formula: "Dose = (Hours / Allowed Hours) x 100; TWA = 90 + 16.61 x log10(Dose/100)",
};
