import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waistHipCalculator: CalculatorDefinition = {
  slug: "waist-to-hip-ratio-calculator",
  title: "Waist-to-Hip Ratio Calculator",
  description: "Free waist-to-hip ratio calculator. Assess health risk based on body fat distribution. A key indicator of cardiovascular health.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["waist to hip ratio", "WHR calculator", "waist hip ratio", "body shape calculator", "health risk calculator"],
  variants: [
    {
      id: "whr",
      name: "Waist-to-Hip Ratio",
      fields: [
        { name: "waist", label: "Waist Circumference", type: "number", placeholder: "e.g. 32" },
        { name: "hip", label: "Hip Circumference", type: "number", placeholder: "e.g. 40" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" }, { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const hip = inputs.hip as number;
        const gender = inputs.gender as string;
        if (!waist || !hip) return null;
        const ratio = waist / hip;
        let risk: string;
        if (gender === "male") {
          risk = ratio < 0.90 ? "Low risk" : ratio < 1.0 ? "Moderate risk" : "High risk";
        } else {
          risk = ratio < 0.80 ? "Low risk" : ratio < 0.85 ? "Moderate risk" : "High risk";
        }
        const shape = ratio > (gender === "male" ? 0.95 : 0.85) ? "Apple (central obesity)" : "Pear (lower body fat)";
        return {
          primary: { label: "Waist-to-Hip Ratio", value: formatNumber(ratio, 3) },
          details: [
            { label: "Health risk", value: risk },
            { label: "Body shape", value: shape },
            { label: "WHO threshold", value: gender === "male" ? "< 0.90 (low risk)" : "< 0.80 (low risk)" },
          ],
          note: "WHO guidelines: Men > 0.90 and Women > 0.85 indicate higher risk for cardiovascular disease, diabetes, and other conditions.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator", "ideal-weight-calculator"],
  faq: [
    { question: "How do I measure waist and hip?", answer: "Waist: measure at the narrowest point between ribs and hips (usually at navel level). Hip: measure at the widest point of your buttocks. Stand straight, breathe normally, don't suck in." },
  ],
  formula: "WHR = Waist Circumference / Hip Circumference",
};
