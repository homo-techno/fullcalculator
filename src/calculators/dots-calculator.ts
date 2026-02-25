import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dotsCalculator: CalculatorDefinition = {
  slug: "dots-calculator",
  title: "DOTS Score Calculator",
  description: "Free DOTS score calculator for powerlifting. Compare strength across weight classes using the modern DOTS coefficient system.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["dots score", "dots calculator", "powerlifting dots", "dots coefficient", "strength comparison", "powerlifting score"],
  variants: [
    {
      id: "dots",
      name: "DOTS Score",
      description: "Calculate DOTS score from powerlifting total and bodyweight",
      fields: [
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
        { name: "bodyWeight", label: "Body Weight", type: "number", placeholder: "e.g. 82.5", suffix: "kg" },
        { name: "total", label: "Powerlifting Total", type: "number", placeholder: "e.g. 550", suffix: "kg" },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const bw = inputs.bodyWeight as number;
        const total = inputs.total as number;
        if (!bw || !total) return null;
        let coeff: number;
        if (gender === "male") {
          const a = -0.000001093;
          const b = 0.0007391293;
          const c = -0.1918759221;
          const d = 24.0900756;
          const e = -307.75076;
          coeff = 500 / (a * Math.pow(bw, 4) + b * Math.pow(bw, 3) + c * Math.pow(bw, 2) + d * bw + e);
        } else {
          const a = -0.0000010706;
          const b = 0.0005158568;
          const c = -0.1126655495;
          const d = 13.6175032;
          const e = -57.96288;
          coeff = 500 / (a * Math.pow(bw, 4) + b * Math.pow(bw, 3) + c * Math.pow(bw, 2) + d * bw + e);
        }
        const dots = total * coeff;
        let rating: string;
        if (gender === "male") {
          if (dots < 300) rating = "Beginner";
          else if (dots < 400) rating = "Intermediate";
          else if (dots < 500) rating = "Advanced";
          else if (dots < 600) rating = "Elite";
          else rating = "World-class";
        } else {
          if (dots < 200) rating = "Beginner";
          else if (dots < 300) rating = "Intermediate";
          else if (dots < 400) rating = "Advanced";
          else if (dots < 500) rating = "Elite";
          else rating = "World-class";
        }
        return {
          primary: { label: "DOTS Score", value: formatNumber(dots, 1) },
          details: [
            { label: "DOTS Coefficient", value: formatNumber(coeff, 4) },
            { label: "Level", value: rating },
            { label: "Body Weight", value: `${formatNumber(bw, 1)} kg` },
            { label: "Total", value: `${formatNumber(total, 1)} kg` },
          ],
        };
      },
    },
    {
      id: "dots-single",
      name: "DOTS for Single Lift",
      description: "Calculate DOTS-adjusted score for an individual lift",
      fields: [
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
        { name: "bodyWeight", label: "Body Weight", type: "number", placeholder: "e.g. 82.5", suffix: "kg" },
        { name: "liftWeight", label: "Lift Weight", type: "number", placeholder: "e.g. 200", suffix: "kg" },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const bw = inputs.bodyWeight as number;
        const liftWeight = inputs.liftWeight as number;
        if (!bw || !liftWeight) return null;
        let coeff: number;
        if (gender === "male") {
          const a = -0.000001093;
          const b = 0.0007391293;
          const c = -0.1918759221;
          const d = 24.0900756;
          const e = -307.75076;
          coeff = 500 / (a * Math.pow(bw, 4) + b * Math.pow(bw, 3) + c * Math.pow(bw, 2) + d * bw + e);
        } else {
          const a = -0.0000010706;
          const b = 0.0005158568;
          const c = -0.1126655495;
          const d = 13.6175032;
          const e = -57.96288;
          coeff = 500 / (a * Math.pow(bw, 4) + b * Math.pow(bw, 3) + c * Math.pow(bw, 2) + d * bw + e);
        }
        const dots = liftWeight * coeff;
        return {
          primary: { label: "DOTS Score (Single Lift)", value: formatNumber(dots, 1) },
          details: [
            { label: "DOTS Coefficient", value: formatNumber(coeff, 4) },
            { label: "Body Weight", value: `${formatNumber(bw, 1)} kg` },
            { label: "Lift Weight", value: `${formatNumber(liftWeight, 1)} kg` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["one-rep-max-calculator", "relative-strength-calculator", "wilks-2-calculator"],
  faq: [
    { question: "What is a DOTS score?", answer: "DOTS (Dynamic Objective Team Scoring) is a modern coefficient system used in powerlifting to compare lifters across different weight classes. It replaced the Wilks formula in some federations and is considered more accurate for extreme weight classes." },
    { question: "What is a good DOTS score?", answer: "For men: 300 is intermediate, 400+ is advanced, 500+ is elite. For women: 200 is intermediate, 300+ is advanced, 400+ is elite. World-class lifters score 600+ (men) or 500+ (women)." },
  ],
  formula: "DOTS = Total * Coefficient | Coefficient = 500 / (a*BW^4 + b*BW^3 + c*BW^2 + d*BW + e)",
};
