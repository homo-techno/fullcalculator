import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wilks2Calculator: CalculatorDefinition = {
  slug: "wilks-2-calculator",
  title: "Wilks 2.0 Score Calculator",
  description: "Free Wilks 2.0 score calculator for powerlifting. Compare strength performance across weight classes using the updated Wilks2 coefficient system.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["wilks 2", "wilks 2.0", "wilks2 calculator", "powerlifting wilks", "wilks coefficient", "strength score", "wilks updated"],
  variants: [
    {
      id: "wilks2-total",
      name: "Wilks2 from Total",
      description: "Calculate Wilks 2.0 score from powerlifting total and bodyweight",
      fields: [
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
        { name: "bodyWeight", label: "Body Weight", type: "number", placeholder: "e.g. 83", suffix: "kg" },
        { name: "total", label: "Powerlifting Total (SBD)", type: "number", placeholder: "e.g. 600", suffix: "kg" },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const bw = inputs.bodyWeight as number;
        const total = inputs.total as number;
        if (!bw || !total) return null;
        let coeff: number;
        if (gender === "male") {
          const a = 47.46178854;
          const b = 8.472061379;
          const c = 0.07369410346;
          const d = -0.001395833811;
          const e = 7.07665973070743e-6;
          const f = -1.20804336482315e-8;
          coeff = 600 / (a + b * bw + c * Math.pow(bw, 2) + d * Math.pow(bw, 3) + e * Math.pow(bw, 4) + f * Math.pow(bw, 5));
        } else {
          const a = -125.4255398;
          const b = 13.71219419;
          const c = -0.03307250631;
          const d = -0.001050400051;
          const e = 9.38773881462799e-6;
          const f = -2.3334613884954e-8;
          coeff = 600 / (a + b * bw + c * Math.pow(bw, 2) + d * Math.pow(bw, 3) + e * Math.pow(bw, 4) + f * Math.pow(bw, 5));
        }
        const wilks2 = total * coeff;
        let rating: string;
        if (gender === "male") {
          if (wilks2 < 300) rating = "Beginner";
          else if (wilks2 < 400) rating = "Intermediate";
          else if (wilks2 < 500) rating = "Advanced";
          else if (wilks2 < 600) rating = "Elite";
          else rating = "World-class";
        } else {
          if (wilks2 < 200) rating = "Beginner";
          else if (wilks2 < 300) rating = "Intermediate";
          else if (wilks2 < 400) rating = "Advanced";
          else if (wilks2 < 500) rating = "Elite";
          else rating = "World-class";
        }
        return {
          primary: { label: "Wilks2 Score", value: formatNumber(wilks2, 1) },
          details: [
            { label: "Wilks2 Coefficient", value: formatNumber(coeff, 4) },
            { label: "Level", value: rating },
            { label: "Body Weight", value: `${formatNumber(bw, 1)} kg` },
            { label: "Total", value: `${formatNumber(total, 1)} kg` },
          ],
        };
      },
    },
    {
      id: "wilks2-compare",
      name: "Compare Wilks2 vs DOTS",
      description: "Calculate both Wilks 2.0 and DOTS scores for comparison",
      fields: [
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
        { name: "bodyWeight", label: "Body Weight", type: "number", placeholder: "e.g. 83", suffix: "kg" },
        { name: "total", label: "Powerlifting Total", type: "number", placeholder: "e.g. 600", suffix: "kg" },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const bw = inputs.bodyWeight as number;
        const total = inputs.total as number;
        if (!bw || !total) return null;
        let wilksCoeff: number;
        let dotsCoeff: number;
        if (gender === "male") {
          const wa = 47.46178854, wb = 8.472061379, wc = 0.07369410346;
          const wd = -0.001395833811, we = 7.07665973070743e-6, wf = -1.20804336482315e-8;
          wilksCoeff = 600 / (wa + wb * bw + wc * Math.pow(bw, 2) + wd * Math.pow(bw, 3) + we * Math.pow(bw, 4) + wf * Math.pow(bw, 5));
          const da = -0.000001093, db = 0.0007391293, dc = -0.1918759221;
          const dd = 24.0900756, de = -307.75076;
          dotsCoeff = 500 / (da * Math.pow(bw, 4) + db * Math.pow(bw, 3) + dc * Math.pow(bw, 2) + dd * bw + de);
        } else {
          const wa = -125.4255398, wb = 13.71219419, wc = -0.03307250631;
          const wd = -0.001050400051, we = 9.38773881462799e-6, wf = -2.3334613884954e-8;
          wilksCoeff = 600 / (wa + wb * bw + wc * Math.pow(bw, 2) + wd * Math.pow(bw, 3) + we * Math.pow(bw, 4) + wf * Math.pow(bw, 5));
          const da = -0.0000010706, db = 0.0005158568, dc = -0.1126655495;
          const dd = 13.6175032, de = -57.96288;
          dotsCoeff = 500 / (da * Math.pow(bw, 4) + db * Math.pow(bw, 3) + dc * Math.pow(bw, 2) + dd * bw + de);
        }
        const wilks2 = total * wilksCoeff;
        const dots = total * dotsCoeff;
        return {
          primary: { label: "Wilks2 Score", value: formatNumber(wilks2, 1) },
          details: [
            { label: "DOTS Score", value: formatNumber(dots, 1) },
            { label: "Difference", value: formatNumber(wilks2 - dots, 1) },
            { label: "Wilks2 Coefficient", value: formatNumber(wilksCoeff, 4) },
            { label: "DOTS Coefficient", value: formatNumber(dotsCoeff, 4) },
            { label: "Body Weight", value: `${formatNumber(bw, 1)} kg` },
            { label: "Total", value: `${formatNumber(total, 1)} kg` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dots-calculator", "one-rep-max-calculator", "relative-strength-calculator"],
  faq: [
    { question: "What is the Wilks 2.0 score?", answer: "Wilks 2.0 (Wilks2) is an updated version of the original Wilks formula used in powerlifting to compare lifters across weight classes. It uses a 5th-degree polynomial with updated coefficients recalculated from modern competition data." },
    { question: "Is Wilks 2.0 better than the original Wilks?", answer: "Wilks 2.0 better handles extreme weight classes (very light and super heavyweight). The original Wilks tended to favor certain weight classes. DOTS is another popular alternative. Different federations use different scoring systems." },
  ],
  formula: "Wilks2 = Total x Coefficient | Coefficient = 600 / (a + b*BW + c*BW^2 + d*BW^3 + e*BW^4 + f*BW^5)",
};
