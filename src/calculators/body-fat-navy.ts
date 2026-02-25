import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bodyFatNavyCalculator: CalculatorDefinition = {
  slug: "body-fat-navy-calculator",
  title: "Body Fat Navy Method Calculator",
  description: "Free body fat calculator using the US Navy circumference method. Separate formulas for men and women with detailed body composition categories.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["body fat navy", "navy method body fat", "circumference body fat", "military body fat", "body composition navy"],
  variants: [
    {
      id: "navy-male",
      name: "Navy Method (Male)",
      description: "US Navy body fat estimation for men using waist, neck, and height",
      fields: [
        { name: "unit", label: "Unit System", type: "select", options: [
          { label: "Metric (cm)", value: "metric" }, { label: "Imperial (in)", value: "imperial" },
        ], defaultValue: "metric" },
        { name: "waist", label: "Waist at Navel", type: "number", placeholder: "e.g. 85", suffix: "cm/in" },
        { name: "neck", label: "Neck at Narrowest", type: "number", placeholder: "e.g. 38", suffix: "cm/in" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 178", suffix: "cm/in" },
        { name: "weight", label: "Weight (optional)", type: "number", placeholder: "e.g. 80", suffix: "kg/lbs" },
      ],
      calculate: (inputs) => {
        let waist = inputs.waist as number;
        let neck = inputs.neck as number;
        let height = inputs.height as number;
        const weight = inputs.weight as number;
        const unit = inputs.unit as string;
        if (!waist || !neck || !height) return null;
        if (unit === "imperial") {
          waist *= 2.54;
          neck *= 2.54;
          height *= 2.54;
        }
        const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        const bfClamped = Math.max(0, bf);
        let category: string;
        if (bfClamped < 6) category = "Essential Fat (<6%)";
        else if (bfClamped < 14) category = "Athletes (6-13%)";
        else if (bfClamped < 18) category = "Fitness (14-17%)";
        else if (bfClamped < 25) category = "Average (18-24%)";
        else category = "Above Average (25%+)";
        const details: { label: string; value: string }[] = [
          { label: "Category", value: category },
        ];
        if (weight) {
          const weightKg = unit === "imperial" ? weight * 0.4536 : weight;
          const fatMass = weightKg * bfClamped / 100;
          const leanMass = weightKg - fatMass;
          details.push(
            { label: "Fat Mass", value: `${formatNumber(fatMass, 1)} kg` },
            { label: "Lean Mass", value: `${formatNumber(leanMass, 1)} kg` },
          );
        }
        return {
          primary: { label: "Body Fat %", value: formatNumber(bfClamped, 1), suffix: "%" },
          details,
        };
      },
    },
    {
      id: "navy-female",
      name: "Navy Method (Female)",
      description: "US Navy body fat estimation for women using waist, hip, neck, and height",
      fields: [
        { name: "unit", label: "Unit System", type: "select", options: [
          { label: "Metric (cm)", value: "metric" }, { label: "Imperial (in)", value: "imperial" },
        ], defaultValue: "metric" },
        { name: "waist", label: "Waist at Narrowest", type: "number", placeholder: "e.g. 75", suffix: "cm/in" },
        { name: "hip", label: "Hip at Widest", type: "number", placeholder: "e.g. 100", suffix: "cm/in" },
        { name: "neck", label: "Neck at Narrowest", type: "number", placeholder: "e.g. 34", suffix: "cm/in" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 165", suffix: "cm/in" },
        { name: "weight", label: "Weight (optional)", type: "number", placeholder: "e.g. 65", suffix: "kg/lbs" },
      ],
      calculate: (inputs) => {
        let waist = inputs.waist as number;
        let hip = inputs.hip as number;
        let neck = inputs.neck as number;
        let height = inputs.height as number;
        const weight = inputs.weight as number;
        const unit = inputs.unit as string;
        if (!waist || !hip || !neck || !height) return null;
        if (unit === "imperial") {
          waist *= 2.54;
          hip *= 2.54;
          neck *= 2.54;
          height *= 2.54;
        }
        const bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
        const bfClamped = Math.max(0, bf);
        let category: string;
        if (bfClamped < 14) category = "Essential Fat (<14%)";
        else if (bfClamped < 21) category = "Athletes (14-20%)";
        else if (bfClamped < 25) category = "Fitness (21-24%)";
        else if (bfClamped < 32) category = "Average (25-31%)";
        else category = "Above Average (32%+)";
        const details: { label: string; value: string }[] = [
          { label: "Category", value: category },
        ];
        if (weight) {
          const weightKg = unit === "imperial" ? weight * 0.4536 : weight;
          const fatMass = weightKg * bfClamped / 100;
          const leanMass = weightKg - fatMass;
          details.push(
            { label: "Fat Mass", value: `${formatNumber(fatMass, 1)} kg` },
            { label: "Lean Mass", value: `${formatNumber(leanMass, 1)} kg` },
          );
        }
        return {
          primary: { label: "Body Fat %", value: formatNumber(bfClamped, 1), suffix: "%" },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator", "ideal-weight-calculator"],
  faq: [
    { question: "How accurate is the US Navy body fat method?", answer: "The US Navy method is accurate to within 1-3% for most people. It's one of the most reliable non-laboratory circumference methods and is used by the US military for fitness assessments." },
    { question: "Where should I measure for the Navy method?", answer: "Men: waist at navel level, neck at narrowest point. Women: waist at narrowest point, hip at widest point, neck at narrowest point. All measurements should be taken on bare skin, standing relaxed." },
  ],
  formula: "Men: BF% = 495/(1.0324 - 0.19077*log10(waist-neck) + 0.15456*log10(height)) - 450 | Women: BF% = 495/(1.29579 - 0.35004*log10(waist+hip-neck) + 0.22100*log10(height)) - 450",
};
