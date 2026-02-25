import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fatFreeMassIndexCalculator: CalculatorDefinition = {
  slug: "fat-free-mass-index-calculator",
  title: "Fat-Free Mass Index Calculator",
  description: "Free FFMI calculator. Calculate your Fat-Free Mass Index to evaluate your muscular development relative to your height, normalized for body size.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["ffmi calculator", "fat free mass index", "muscle mass index", "lean mass index", "muscular development"],
  variants: [
    {
      id: "ffmi",
      name: "FFMI from Body Fat %",
      description: "Calculate FFMI using weight, height, and body fat percentage",
      fields: [
        { name: "unit", label: "Unit System", type: "select", options: [
          { label: "Metric (kg/cm)", value: "metric" }, { label: "Imperial (lbs/in)", value: "imperial" },
        ], defaultValue: "metric" },
        { name: "weight", label: "Weight", type: "number", placeholder: "e.g. 80" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 178" },
        { name: "bodyFat", label: "Body Fat %", type: "number", placeholder: "e.g. 15", suffix: "%" },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit as string;
        let weight = inputs.weight as number;
        let height = inputs.height as number;
        const bf = inputs.bodyFat as number;
        if (!weight || !height || bf === undefined || bf === null) return null;
        if (unit === "imperial") {
          weight *= 0.4536;
          height *= 2.54;
        }
        const heightM = height / 100;
        const leanMass = weight * (1 - bf / 100);
        const ffmi = leanMass / (heightM * heightM);
        const adjustedFfmi = ffmi + 6.1 * (1.8 - heightM);
        let rating: string;
        if (adjustedFfmi < 18) rating = "Below average";
        else if (adjustedFfmi < 20) rating = "Average";
        else if (adjustedFfmi < 22) rating = "Above average";
        else if (adjustedFfmi < 23) rating = "Excellent";
        else if (adjustedFfmi < 26) rating = "Superior / near genetic limit";
        else rating = "Likely above natural limit (26+)";
        return {
          primary: { label: "FFMI", value: formatNumber(ffmi, 1) },
          details: [
            { label: "Adjusted FFMI", value: formatNumber(adjustedFfmi, 1) },
            { label: "Lean Body Mass", value: `${formatNumber(leanMass, 1)} kg` },
            { label: "Fat Mass", value: `${formatNumber(weight - leanMass, 1)} kg` },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
    {
      id: "ffmi-direct",
      name: "FFMI from Lean Mass",
      description: "Calculate FFMI directly from lean body mass and height",
      fields: [
        { name: "unit", label: "Unit System", type: "select", options: [
          { label: "Metric (kg/cm)", value: "metric" }, { label: "Imperial (lbs/in)", value: "imperial" },
        ], defaultValue: "metric" },
        { name: "leanMass", label: "Lean Body Mass", type: "number", placeholder: "e.g. 68" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 178" },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit as string;
        let leanMass = inputs.leanMass as number;
        let height = inputs.height as number;
        if (!leanMass || !height) return null;
        if (unit === "imperial") {
          leanMass *= 0.4536;
          height *= 2.54;
        }
        const heightM = height / 100;
        const ffmi = leanMass / (heightM * heightM);
        const adjustedFfmi = ffmi + 6.1 * (1.8 - heightM);
        let rating: string;
        if (adjustedFfmi < 18) rating = "Below average";
        else if (adjustedFfmi < 20) rating = "Average";
        else if (adjustedFfmi < 22) rating = "Above average";
        else if (adjustedFfmi < 23) rating = "Excellent";
        else if (adjustedFfmi < 26) rating = "Superior / near genetic limit";
        else rating = "Likely above natural limit (26+)";
        return {
          primary: { label: "FFMI", value: formatNumber(ffmi, 1) },
          details: [
            { label: "Adjusted FFMI", value: formatNumber(adjustedFfmi, 1) },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator", "body-fat-navy-calculator"],
  faq: [
    { question: "What is FFMI?", answer: "Fat-Free Mass Index (FFMI) measures your lean body mass relative to your height. It is similar to BMI but focuses on muscle mass. An FFMI of 25 is considered near the natural limit for men." },
    { question: "What is a good FFMI score?", answer: "For men: 18-20 is average, 20-22 is above average, 22-25 is excellent to superior. For women: 14-16 is average, 16-18 is above average, 18-20 is excellent. Values above 25 (men) or 22 (women) may indicate anabolic steroid use." },
  ],
  formula: "FFMI = Lean Mass (kg) / Height (m)^2 | Adjusted FFMI = FFMI + 6.1 * (1.8 - height_m)",
};
