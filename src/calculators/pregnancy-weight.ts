import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pregnancyWeightCalculator: CalculatorDefinition = {
  slug: "pregnancy-weight-calculator",
  title: "Pregnancy Weight Gain Calculator",
  description:
    "Free pregnancy weight gain calculator. Estimate recommended weight gain based on pre-pregnancy BMI and current gestational week.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pregnancy weight gain",
    "gestational weight",
    "prenatal BMI",
    "pregnancy calculator",
  ],
  variants: [
    {
      id: "weightGain",
      name: "Recommended Weight Gain",
      fields: [
        {
          name: "preWeight",
          label: "Pre-Pregnancy Weight (kg)",
          type: "number",
          placeholder: "e.g. 65",
        },
        {
          name: "height",
          label: "Height (cm)",
          type: "number",
          placeholder: "e.g. 165",
        },
        {
          name: "currentWeek",
          label: "Current Week of Pregnancy",
          type: "number",
          placeholder: "e.g. 20",
        },
      ],
      calculate: (inputs) => {
        const preWeight = inputs.preWeight as number;
        const height = inputs.height as number;
        const currentWeek = inputs.currentWeek as number;
        if (!preWeight || !height || !currentWeek) return null;

        const heightM = height / 100;
        const bmi = preWeight / (heightM * heightM);

        let category: string;
        let minGainLb: number;
        let maxGainLb: number;

        if (bmi < 18.5) {
          category = "Underweight";
          minGainLb = 28;
          maxGainLb = 40;
        } else if (bmi < 25) {
          category = "Normal weight";
          minGainLb = 25;
          maxGainLb = 35;
        } else if (bmi < 30) {
          category = "Overweight";
          minGainLb = 15;
          maxGainLb = 25;
        } else {
          category = "Obese";
          minGainLb = 11;
          maxGainLb = 20;
        }

        const minGainKg = minGainLb * 0.453592;
        const maxGainKg = maxGainLb * 0.453592;

        const weekFraction = Math.min(currentWeek / 40, 1);
        const estimatedMinGainKg = minGainKg * weekFraction;
        const estimatedMaxGainKg = maxGainKg * weekFraction;

        return {
          primary: {
            label: "Recommended Total Gain",
            value: `${formatNumber(minGainLb, 0)}\u2013${formatNumber(maxGainLb, 0)} lbs (${formatNumber(minGainKg, 1)}\u2013${formatNumber(maxGainKg, 1)} kg)`,
          },
          details: [
            { label: "Pre-Pregnancy BMI", value: `${formatNumber(bmi, 1)} (${category})` },
            {
              label: `Expected Gain by Week ${currentWeek}`,
              value: `${formatNumber(estimatedMinGainKg, 1)}\u2013${formatNumber(estimatedMaxGainKg, 1)} kg`,
            },
            { label: "Pre-Pregnancy Weight", value: `${formatNumber(preWeight, 1)} kg` },
            { label: "Height", value: `${formatNumber(height, 1)} cm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-percentile-calculator", "body-surface-area-calculator"],
  faq: [
    {
      question: "How much weight should I gain during pregnancy?",
      answer:
        "Recommended weight gain depends on your pre-pregnancy BMI: Underweight (BMI < 18.5) 28\u201340 lbs, Normal (18.5\u201324.9) 25\u201335 lbs, Overweight (25\u201329.9) 15\u201325 lbs, Obese (30+) 11\u201320 lbs.",
    },
    {
      question: "When does most pregnancy weight gain occur?",
      answer:
        "Most weight gain occurs in the second and third trimesters. During the first trimester, only about 1\u20134 pounds of gain is typical.",
    },
  ],
  formula:
    "Recommended gain based on pre-pregnancy BMI category: Underweight 28\u201340 lb, Normal 25\u201335 lb, Overweight 15\u201325 lb, Obese 11\u201320 lb.",
};
