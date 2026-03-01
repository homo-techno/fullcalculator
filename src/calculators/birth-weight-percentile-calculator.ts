import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const birthWeightPercentileCalculator: CalculatorDefinition = {
  slug: "birth-weight-percentile-calculator",
  title: "Birth Weight Percentile Calculator",
  description: "Determine the birth weight percentile of a newborn based on weight, gestational age, and sex.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["birth weight percentile", "newborn weight chart", "baby weight percentile"],
  variants: [{
    id: "standard",
    name: "Birth Weight Percentile",
    description: "Determine the birth weight percentile of a newborn based on weight, gestational age, and sex",
    fields: [
      { name: "birthWeight", label: "Birth Weight", type: "number", suffix: "grams", min: 500, max: 6000, defaultValue: 3400 },
      { name: "gestationalAge", label: "Gestational Age at Birth", type: "number", suffix: "weeks", min: 34, max: 42, defaultValue: 39 },
      { name: "sex", label: "Sex", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" },
    ],
    calculate: (inputs) => {
      const weight = inputs.birthWeight as number;
      const ga = inputs.gestationalAge as number;
      const sex = inputs.sex as string;
      if (!weight || !ga || weight <= 0) return null;
      const baseMean: Record<number, number> = {34:2200,35:2400,36:2620,37:2860,38:3080,39:3290,40:3460,41:3540,42:3600};
      const keys = Object.keys(baseMean).map(Number).sort((a,b)=>a-b);
      let mean = baseMean[39];
      for (let i = 0; i < keys.length - 1; i++) {
        if (ga >= keys[i] && ga <= keys[i+1]) {
          const t = (ga - keys[i]) / (keys[i+1] - keys[i]);
          mean = baseMean[keys[i]] * (1 - t) + baseMean[keys[i+1]] * t;
          break;
        }
      }
      if (sex === "male") mean *= 1.03;
      else mean *= 0.97;
      const sd = mean * 0.13;
      const zScore = (weight - mean) / sd;
      const percentile = Math.min(99, Math.max(1, Math.round(50 + zScore * 16)));
      const category = percentile < 10 ? "Low birth weight" : percentile > 90 ? "High birth weight" : "Normal birth weight";
      return {
        primary: { label: "Birth Weight Percentile", value: formatNumber(percentile) + "th percentile" },
        details: [
          { label: "Expected Mean Weight", value: formatNumber(Math.round(mean)) + " grams" },
          { label: "Category", value: category },
          { label: "Weight in Pounds", value: formatNumber(Math.round(weight / 453.592 * 10) / 10) + " lbs" },
        ],
      };
    },
  }],
  relatedSlugs: ["fetal-weight-percentile-calculator", "pediatric-bmi-percentile-calculator"],
  faq: [
    { question: "What is a normal birth weight range?", answer: "A normal full-term birth weight is generally between 2,500 and 4,000 grams (5.5 to 8.8 pounds). Babies below 2,500 grams are considered low birth weight." },
    { question: "Does birth weight differ between males and females?", answer: "Yes, male newborns tend to weigh slightly more than female newborns on average, typically by about 100 to 150 grams at the same gestational age." },
  ],
  formula: "Percentile = Normal Distribution of (Birth Weight - Mean for GA and Sex) / Standard Deviation",
};
