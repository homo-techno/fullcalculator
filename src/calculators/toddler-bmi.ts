import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const toddlerBmiCalculator: CalculatorDefinition = {
  slug: "toddler-bmi-calculator",
  title: "Toddler BMI Calculator",
  description:
    "Free toddler BMI calculator. Calculate BMI-for-age percentile for children aged 2-5 using CDC growth charts.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "toddler BMI",
    "child BMI calculator",
    "BMI for age",
    "pediatric BMI",
    "toddler weight check",
  ],
  variants: [
    {
      id: "toddler-bmi",
      name: "Toddler BMI-for-Age",
      description: "Calculate BMI percentile for children aged 2-5",
      fields: [
        {
          name: "gender",
          label: "Child's Gender",
          type: "select",
          options: [
            { label: "Boy", value: "boy" },
            { label: "Girl", value: "girl" },
          ],
          defaultValue: "boy",
        },
        {
          name: "ageMonths",
          label: "Child's Age (months)",
          type: "number",
          placeholder: "e.g. 30",
          min: 24,
          max: 60,
        },
        {
          name: "weight",
          label: "Weight (lbs)",
          type: "number",
          placeholder: "e.g. 28",
          min: 15,
          max: 80,
        },
        {
          name: "height",
          label: "Height (inches)",
          type: "number",
          placeholder: "e.g. 34",
          min: 25,
          max: 50,
        },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const ageMonths = inputs.ageMonths as number;
        const weightLbs = inputs.weight as number;
        const heightIn = inputs.height as number;
        if (!ageMonths || !weightLbs || !heightIn) return null;
        if (ageMonths < 24 || ageMonths > 60) return null;

        const weightKg = weightLbs * 0.453592;
        const heightM = heightIn * 0.0254;
        const bmi = weightKg / (heightM * heightM);

        // CDC median BMI by age (approximate) - Boys
        const boyMedianBmi: Record<number, number> = {
          24: 16.5, 30: 16.2, 36: 16.0, 42: 15.8, 48: 15.6, 54: 15.5, 60: 15.4,
        };
        // Girls
        const girlMedianBmi: Record<number, number> = {
          24: 16.3, 30: 16.0, 36: 15.8, 42: 15.6, 48: 15.4, 54: 15.3, 60: 15.2,
        };

        const medianMap = gender === "girl" ? girlMedianBmi : boyMedianBmi;
        const keys = Object.keys(medianMap).map(Number).sort((a, b) => a - b);
        let closest = keys[0];
        for (const k of keys) {
          if (Math.abs(k - ageMonths) < Math.abs(closest - ageMonths)) closest = k;
        }

        const medianBmi = medianMap[closest];
        const sd = 1.3;
        const zScore = (bmi - medianBmi) / sd;

        let category: string;
        let percentileRange: string;
        if (zScore < -2) { category = "Underweight"; percentileRange = "Below 5th"; }
        else if (zScore < -0.67) { category = "Healthy weight (lower)"; percentileRange = "5th - 25th"; }
        else if (zScore < 0.67) { category = "Healthy weight"; percentileRange = "25th - 75th"; }
        else if (zScore < 1.04) { category = "Healthy weight (upper)"; percentileRange = "75th - 85th"; }
        else if (zScore < 1.65) { category = "Overweight"; percentileRange = "85th - 95th"; }
        else { category = "Obese"; percentileRange = "Above 95th"; }

        return {
          primary: {
            label: "BMI",
            value: formatNumber(bmi, 1),
          },
          details: [
            { label: "BMI-for-Age Percentile", value: percentileRange },
            { label: "Weight Category", value: category },
            { label: "Z-Score (approx)", value: formatNumber(zScore, 2) },
            { label: `CDC Median BMI (${closest}mo)`, value: formatNumber(medianBmi, 1) },
            { label: "Weight", value: `${formatNumber(weightLbs, 1)} lbs (${formatNumber(weightKg, 1)} kg)` },
            { label: "Height", value: `${formatNumber(heightIn, 1)} in (${formatNumber(heightIn * 2.54, 1)} cm)` },
          ],
          note: "For children aged 2-5, BMI-for-age percentile is used instead of adult BMI categories. Underweight: <5th percentile, Healthy: 5th-85th, Overweight: 85th-95th, Obese: >95th. Always consult your pediatrician.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "baby-weight-percentile-calculator", "baby-height-percentile-calculator"],
  faq: [
    {
      question: "Why is BMI-for-age used for toddlers instead of regular BMI?",
      answer:
        "Children's body composition changes as they grow, so BMI is interpreted differently than for adults. BMI-for-age uses age- and gender-specific percentiles from CDC growth charts to determine if a child's weight is healthy relative to their height and age.",
    },
    {
      question: "What is a healthy BMI for a 3-year-old?",
      answer:
        "For a 3-year-old, a healthy BMI typically falls between 14.5 and 17.5, but the exact range depends on gender. What matters is the percentile: between the 5th and 85th percentile is considered healthy weight.",
    },
    {
      question: "At what age can you start calculating BMI for children?",
      answer:
        "CDC BMI-for-age charts begin at age 2 (24 months). Before age 2, weight-for-length is used instead of BMI to assess growth. Your pediatrician tracks both metrics at well-child visits.",
    },
  ],
  formula:
    "BMI = Weight (kg) / Height (m)² | Weight: lbs × 0.4536 = kg | Height: in × 0.0254 = m | Percentile based on CDC BMI-for-age growth charts.",
};
