import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soilPhAmendmentCalculator: CalculatorDefinition = {
  slug: "soil-ph-amendment-calculator",
  title: "Soil pH Amendment Calculator",
  description: "Calculate the amount of lime or sulfur needed to adjust soil pH to the target level for optimal crop growth.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["soil ph amendment","lime calculator","soil sulfur calculator","ph correction"],
  variants: [{
    id: "standard",
    name: "Soil pH Amendment",
    description: "Calculate the amount of lime or sulfur needed to adjust soil pH to the target level for optimal crop growth.",
    fields: [
      { name: "currentPH", label: "Current Soil pH", type: "number", min: 3, max: 10, defaultValue: 5.5 },
      { name: "targetPH", label: "Target Soil pH", type: "number", min: 4, max: 9, defaultValue: 6.5 },
      { name: "soilType", label: "Soil Texture", type: "select", options: [{ value: "1", label: "Sandy" }, { value: "2", label: "Loam" }, { value: "3", label: "Clay" }], defaultValue: "2" },
      { name: "acres", label: "Area (acres)", type: "number", min: 0.01, max: 10000, defaultValue: 10 },
      { name: "depth", label: "Incorporation Depth (inches)", type: "number", min: 3, max: 12, defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const cp = inputs.currentPH as number;
      const tp = inputs.targetPH as number;
      const st = inputs.soilType as number;
      const ac = inputs.acres as number;
      const dep = inputs.depth as number;
      if (!cp || !tp || !ac || !dep) return null;
      var phChange = tp - cp;
      var isLime = phChange > 0;
      var absChange = Math.abs(phChange);
      var baseLbPerAcre = 0;
      if (isLime) {
        var bufferFactor = st == 1 ? 1000 : st == 2 ? 2000 : 3500;
        baseLbPerAcre = Math.round(absChange * bufferFactor * (dep / 6));
      } else {
        var sulfurFactor = st == 1 ? 100 : st == 2 ? 150 : 200;
        baseLbPerAcre = Math.round(absChange * sulfurFactor * (dep / 6));
      }
      var totalLbs = Math.round(baseLbPerAcre * ac);
      var totalTons = Math.round(totalLbs / 2000 * 100) / 100;
      var amendment = isLime ? "Ag Lime" : "Elemental Sulfur";
      return {
        primary: { label: amendment + " Per Acre", value: formatNumber(baseLbPerAcre) + " lb" },
        details: [
          { label: "Amendment Type", value: amendment },
          { label: "pH Change Needed", value: (isLime ? "+" : "") + formatNumber(Math.round(phChange * 10) / 10) },
          { label: "Total Needed", value: formatNumber(totalLbs) + " lb" },
          { label: "Total Tons", value: formatNumber(totalTons) },
        ],
      };
  },
  }],
  relatedSlugs: ["fertilizer-application-rate-calculator","raised-bed-soil-calculator"],
  faq: [
    { question: "How long does it take for lime to change soil pH?", answer: "Agricultural lime typically takes 3 to 12 months to fully react with soil. Finer ground lime reacts faster. For quicker results, pelleted lime or liquid lime can begin working within weeks." },
    { question: "What pH do most crops prefer?", answer: "Most field crops and vegetables grow best in soil pH 6.0 to 7.0. Blueberries prefer acidic soil at pH 4.5 to 5.5, while alfalfa prefers slightly alkaline soil at pH 6.5 to 7.5." },
  ],
  formula: "Lime Needed = pH Change x Buffer Factor x (Depth / 6); Sulfur Needed = pH Change x Sulfur Factor x (Depth / 6); Buffer Factor varies by soil texture (sandy < loam < clay)",
};
