import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fetalWeightPercentileCalculator: CalculatorDefinition = {
  slug: "fetal-weight-percentile-calculator",
  title: "Fetal Weight Percentile Calculator",
  description: "Determine the estimated fetal weight percentile based on ultrasound measurements and gestational age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["fetal weight percentile", "fetal growth chart", "baby weight in utero"],
  variants: [{
    id: "standard",
    name: "Fetal Weight Percentile",
    description: "Determine the estimated fetal weight percentile based on ultrasound measurements and gestational age",
    fields: [
      { name: "gestationalWeeks", label: "Gestational Age", type: "number", suffix: "weeks", min: 20, max: 42, defaultValue: 30 },
      { name: "estimatedWeight", label: "Estimated Fetal Weight", type: "number", suffix: "grams", min: 100, max: 6000, defaultValue: 1500 },
      { name: "gender", label: "Fetal Sex", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"},{value:"unknown",label:"Unknown"}], defaultValue: "unknown" },
    ],
    calculate: (inputs) => {
      const weeks = inputs.gestationalWeeks as number;
      const weight = inputs.estimatedWeight as number;
      const gender = inputs.gender as string;
      if (!weeks || !weight || weight <= 0) return null;
      const medianWeights: Record<number, number> = {20:310,22:430,24:600,26:760,28:1000,30:1320,32:1700,34:2150,36:2620,38:3080,40:3460,42:3600};
      const keys = Object.keys(medianWeights).map(Number).sort((a,b)=>a-b);
      let median = medianWeights[30];
      for (let i = 0; i < keys.length - 1; i++) {
        if (weeks >= keys[i] && weeks <= keys[i+1]) {
          const t = (weeks - keys[i]) / (keys[i+1] - keys[i]);
          median = medianWeights[keys[i]] * (1 - t) + medianWeights[keys[i+1]] * t;
          break;
        }
      }
      if (gender === "male") median *= 1.03;
      if (gender === "female") median *= 0.97;
      const sd = median * 0.15;
      const zScore = (weight - median) / sd;
      const percentile = Math.min(99, Math.max(1, Math.round(50 * (1 + zScore / 3) * 2) / 2));
      const classification = percentile < 10 ? "Small for gestational age" : percentile > 90 ? "Large for gestational age" : "Appropriate for gestational age";
      return {
        primary: { label: "Estimated Percentile", value: formatNumber(Math.round(percentile)) + "th percentile" },
        details: [
          { label: "Median Weight at " + weeks + " Weeks", value: formatNumber(Math.round(median)) + " grams" },
          { label: "Entered Weight", value: formatNumber(weight) + " grams" },
          { label: "Classification", value: classification },
        ],
      };
    },
  }],
  relatedSlugs: ["birth-weight-percentile-calculator", "child-height-prediction-calculator"],
  faq: [
    { question: "What fetal weight percentile is considered normal?", answer: "Fetal weights between the 10th and 90th percentile are generally considered appropriate for gestational age. Weights below the 10th percentile may indicate growth restriction." },
    { question: "How accurate are ultrasound weight estimates?", answer: "Ultrasound estimates of fetal weight have a margin of error of about 10 to 15 percent. The accuracy can vary based on fetal position and gestational age." },
  ],
  formula: "Percentile = Z-Score based on (Estimated Weight - Median Weight) / Standard Deviation",
};
