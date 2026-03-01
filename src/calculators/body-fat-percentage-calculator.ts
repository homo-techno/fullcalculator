import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bodyFatPercentageCalculator: CalculatorDefinition = {
  slug: "body-fat-percentage-calculator",
  title: "Body Fat Percentage Calculator",
  description: "Estimate body fat percentage from body measurements",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["body fat percentage","body fat calculator","body composition"],
  variants: [{
    id: "standard",
    name: "Body Fat Percentage",
    description: "Estimate body fat percentage from body measurements",
    fields: [
      { name: "waist", label: "Waist Circumference (inches)", type: "number", defaultValue: 34, min: 20, max: 60, step: 0.5 },
      { name: "neck", label: "Neck Circumference (inches)", type: "number", defaultValue: 15, min: 10, max: 25, step: 0.5 },
      { name: "height", label: "Height (inches)", type: "number", defaultValue: 70, min: 48, max: 84, step: 1 },
      { name: "weight", label: "Weight (lbs)", type: "number", defaultValue: 180, min: 80, max: 400, step: 1 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const waist = inputs.waist as number || 34;
      const neck = inputs.neck as number || 15;
      const height = inputs.height as number || 70;
      const weight = inputs.weight as number || 180;
      const bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
      const clampedBF = Math.max(3, Math.min(50, bodyFat));
      const fatMass = weight * (clampedBF / 100);
      const leanMass = weight - fatMass;
      let category = "Obese";
      if (clampedBF < 6) category = "Essential Fat";
      else if (clampedBF < 14) category = "Athletic";
      else if (clampedBF < 18) category = "Fit";
      else if (clampedBF < 25) category = "Average";
      return {
        primary: { label: "Body Fat Percentage", value: formatNumber(Math.round(clampedBF * 10) / 10) + "%" },
        details: [
          { label: "Category", value: category },
          { label: "Fat Mass", value: formatNumber(Math.round(fatMass * 10) / 10) + " lbs" },
          { label: "Lean Mass", value: formatNumber(Math.round(leanMass * 10) / 10) + " lbs" },
          { label: "Fat-to-Lean Ratio", value: formatNumber(Math.round(fatMass / leanMass * 100) / 100) }
        ]
      };
    },
  }],
  relatedSlugs: ["lean-body-mass-calculator"],
  faq: [
    { question: "How accurate is this body fat estimate?", answer: "The US Navy method is accurate within 3-4%. For precise measurements, use DEXA or hydrostatic weighing." },
    { question: "What is a healthy body fat percentage?", answer: "For men, 10-20% is healthy. For women, 18-28% is considered a healthy range." },
  ],
  formula: "BF% = 86.01 x log10(Waist - Neck) - 70.041 x log10(Height) + 36.76 (US Navy method)",
};
