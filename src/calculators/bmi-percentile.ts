import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bmiPercentileCalculator: CalculatorDefinition = {
  slug: "bmi-percentile-calculator",
  title: "BMI Percentile Calculator",
  description:
    "Free BMI percentile calculator for children and teens aged 2\u201320. Determine BMI category based on age, sex, height, and weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["BMI percentile", "children BMI", "pediatric BMI", "growth chart"],
  variants: [
    {
      id: "bmiPercentile",
      name: "BMI Percentile (Ages 2\u201320)",
      fields: [
        {
          name: "age",
          label: "Age (years, 2\u201320)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "height",
          label: "Height (cm)",
          type: "number",
          placeholder: "e.g. 140",
        },
        {
          name: "weight",
          label: "Weight (kg)",
          type: "number",
          placeholder: "e.g. 35",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        const height = inputs.height as number;
        const weight = inputs.weight as number;
        if (!age || !sex || !height || !weight) return null;
        if (age < 2 || age > 20) return null;

        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);

        // Approximate median BMI by age for classification
        // Using simplified CDC-based reference ranges
        const medianBmi: Record<string, number> = {
          male: 15.5 + (age - 2) * 0.5,
          female: 15.4 + (age - 2) * 0.55,
        };

        const median = medianBmi[sex] || 17;
        const zScore = (bmi - median) / (median * 0.15);

        let percentileCategory: string;
        let percentileRange: string;

        if (zScore < -1.65) {
          percentileCategory = "Underweight";
          percentileRange = "Below 5th percentile";
        } else if (zScore < 1.04) {
          percentileCategory = "Normal weight";
          percentileRange = "5th to 85th percentile";
        } else if (zScore < 1.65) {
          percentileCategory = "Overweight";
          percentileRange = "85th to 95th percentile";
        } else {
          percentileCategory = "Obese";
          percentileRange = "Above 95th percentile";
        }

        return {
          primary: {
            label: "BMI",
            value: `${formatNumber(bmi, 1)} kg/m\u00B2`,
          },
          details: [
            { label: "Category", value: percentileCategory },
            { label: "Percentile Range", value: percentileRange },
            { label: "Age", value: `${formatNumber(age, 0)} years` },
            { label: "Sex", value: sex === "male" ? "Male" : "Female" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["body-surface-area-calculator", "pregnancy-weight-calculator"],
  faq: [
    {
      question: "Why is BMI percentile used for children instead of standard BMI?",
      answer:
        "Children's body composition changes as they grow, so BMI is interpreted relative to age and sex using percentile charts rather than fixed adult categories.",
    },
    {
      question: "What BMI percentile categories are used for children?",
      answer:
        "Underweight: below 5th percentile; Normal weight: 5th to 85th percentile; Overweight: 85th to 95th percentile; Obese: above 95th percentile.",
    },
  ],
  formula:
    "BMI = weight(kg) / height(m)\u00B2. Percentile categories: <5th underweight, 5\u201385th normal, 85\u201395th overweight, >95th obese.",
};
