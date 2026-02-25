import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hipCircumferenceCalculator: CalculatorDefinition = {
  slug: "hip-circumference-calculator",
  title: "Hip Circumference Health Calculator",
  description: "Free hip circumference health calculator. Assess health indicators from hip measurements including waist-to-hip ratio and body shape classification.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["hip circumference", "hip measurement health", "waist hip ratio", "body shape", "pear shape apple shape", "hip size"],
  variants: [
    {
      id: "whr",
      name: "Waist-to-Hip Ratio",
      description: "Calculate WHR and health risk assessment",
      fields: [
        { name: "waist", label: "Waist Circumference", type: "number", placeholder: "e.g. 80", suffix: "cm" },
        { name: "hip", label: "Hip Circumference (widest point)", type: "number", placeholder: "e.g. 100", suffix: "cm" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
        { name: "age", label: "Age (optional)", type: "number", placeholder: "e.g. 35" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const hip = inputs.hip as number;
        const gender = inputs.gender as string;
        const age = inputs.age as number;
        if (!waist || !hip) return null;
        const whr = waist / hip;
        const isMale = gender === "male";
        let healthRisk: string;
        if (isMale) {
          if (whr < 0.90) healthRisk = "Low risk";
          else if (whr < 0.95) healthRisk = "Moderate risk";
          else if (whr < 1.0) healthRisk = "High risk";
          else healthRisk = "Very high risk";
        } else {
          if (whr < 0.80) healthRisk = "Low risk";
          else if (whr < 0.85) healthRisk = "Moderate risk";
          else if (whr < 0.90) healthRisk = "High risk";
          else healthRisk = "Very high risk";
        }
        let bodyShape: string;
        if (isMale) {
          bodyShape = whr > 0.95 ? "Apple shape (central obesity)" : "Balanced distribution";
        } else {
          if (whr < 0.75) bodyShape = "Pear shape (lower body)";
          else if (whr < 0.85) bodyShape = "Hourglass / balanced";
          else bodyShape = "Apple shape (central obesity)";
        }
        const details: { label: string; value: string }[] = [
          { label: "Waist-to-Hip Ratio", value: formatNumber(whr, 3) },
          { label: "Health Risk", value: healthRisk },
          { label: "Body Shape", value: bodyShape },
          { label: "Waist", value: `${formatNumber(waist, 1)} cm` },
          { label: "Hip", value: `${formatNumber(hip, 1)} cm` },
          { label: "Ideal WHR", value: isMale ? "< 0.90" : "< 0.80" },
        ];
        if (age) {
          details.push({ label: "Age", value: `${age}` });
        }
        return {
          primary: { label: "Waist-to-Hip Ratio", value: formatNumber(whr, 3) },
          details,
          note: "WHO defines abdominal obesity as WHR > 0.90 (men) or > 0.85 (women). Central obesity increases risk of cardiovascular disease, type 2 diabetes, and metabolic syndrome.",
        };
      },
    },
    {
      id: "hip-reference",
      name: "Hip Size Health Reference",
      description: "Check your hip circumference against health reference ranges",
      fields: [
        { name: "hip", label: "Hip Circumference", type: "number", placeholder: "e.g. 100", suffix: "cm" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 170", suffix: "cm" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
      ],
      calculate: (inputs) => {
        const hip = inputs.hip as number;
        const height = inputs.height as number;
        const gender = inputs.gender as string;
        if (!hip || !height) return null;
        const hipToHeight = hip / height;
        const isMale = gender === "male";
        let assessment: string;
        if (isMale) {
          if (hipToHeight < 0.52) assessment = "Below average hip size";
          else if (hipToHeight < 0.58) assessment = "Average range";
          else assessment = "Above average hip size";
        } else {
          if (hipToHeight < 0.55) assessment = "Below average hip size";
          else if (hipToHeight < 0.64) assessment = "Average range";
          else assessment = "Above average hip size";
        }
        return {
          primary: { label: "Hip-to-Height Ratio", value: formatNumber(hipToHeight, 3) },
          details: [
            { label: "Assessment", value: assessment },
            { label: "Hip Circumference", value: `${formatNumber(hip, 1)} cm (${formatNumber(hip / 2.54, 1)} in)` },
            { label: "Height", value: `${formatNumber(height, 1)} cm` },
          ],
          note: "Research suggests larger hip circumference may be protective against cardiovascular disease, independent of waist size. Very small hips may indicate low bone density.",
        };
      },
    },
  ],
  relatedSlugs: ["waist-hip-calculator", "bmi-calculator", "body-fat-calculator"],
  faq: [
    { question: "How do I measure my hip circumference?", answer: "Stand with feet together, looking straight ahead. Wrap the tape measure around the widest part of your hips/buttocks, keeping it level. The tape should be snug but not compressing the skin. Measure in underwear or thin clothing." },
    { question: "What is a healthy waist-to-hip ratio?", answer: "WHO guidelines: Men should have WHR < 0.90 and women < 0.85. Higher ratios indicate central obesity and increased cardiovascular risk. A pear shape (lower WHR) is generally healthier than an apple shape." },
  ],
  formula: "WHR = Waist circumference / Hip circumference | Risk: Men >0.90, Women >0.85",
};
