import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bmiChildrenCalculator: CalculatorDefinition = {
  slug: "bmi-children-calculator",
  title: "BMI Calculator for Children & Teens",
  description:
    "Free BMI calculator for children and teens (ages 2-19). Calculate BMI-for-age percentile based on CDC growth charts. Understand your child's weight status.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "children BMI calculator",
    "pediatric BMI",
    "BMI percentile",
    "kids BMI",
    "teen BMI",
    "BMI for age",
    "child weight status",
    "CDC growth chart",
  ],
  variants: [
    {
      id: "metric",
      name: "BMI for Children (Metric)",
      description: "Calculate BMI-for-age using kilograms and centimeters",
      fields: [
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "kg",
          min: 5,
          max: 200,
          step: 0.1,
        },
        {
          name: "height",
          label: "Height",
          type: "number",
          placeholder: "e.g. 130",
          suffix: "cm",
          min: 50,
          max: 220,
          step: 0.1,
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "years",
          min: 2,
          max: 19,
          step: 0.5,
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
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const height = inputs.height as number;
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        if (!weight || !height || !age || !sex) return null;

        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);

        // Simplified percentile estimation based on CDC LMS parameters
        // Using approximate median BMI values by age to estimate percentile
        const medianBmiByAge: Record<string, Record<number, { median: number; sd: number }>> = {
          male: {
            2: { median: 16.5, sd: 1.3 }, 3: { median: 16.0, sd: 1.2 }, 4: { median: 15.7, sd: 1.2 },
            5: { median: 15.5, sd: 1.3 }, 6: { median: 15.5, sd: 1.5 }, 7: { median: 15.7, sd: 1.7 },
            8: { median: 16.0, sd: 2.0 }, 9: { median: 16.5, sd: 2.2 }, 10: { median: 17.0, sd: 2.5 },
            11: { median: 17.6, sd: 2.7 }, 12: { median: 18.4, sd: 3.0 }, 13: { median: 19.1, sd: 3.1 },
            14: { median: 19.8, sd: 3.2 }, 15: { median: 20.5, sd: 3.3 }, 16: { median: 21.1, sd: 3.3 },
            17: { median: 21.7, sd: 3.4 }, 18: { median: 22.2, sd: 3.5 }, 19: { median: 22.7, sd: 3.5 },
          },
          female: {
            2: { median: 16.2, sd: 1.3 }, 3: { median: 15.8, sd: 1.2 }, 4: { median: 15.5, sd: 1.3 },
            5: { median: 15.4, sd: 1.4 }, 6: { median: 15.6, sd: 1.6 }, 7: { median: 15.9, sd: 1.9 },
            8: { median: 16.4, sd: 2.2 }, 9: { median: 17.0, sd: 2.5 }, 10: { median: 17.6, sd: 2.8 },
            11: { median: 18.3, sd: 3.0 }, 12: { median: 19.0, sd: 3.2 }, 13: { median: 19.7, sd: 3.3 },
            14: { median: 20.3, sd: 3.3 }, 15: { median: 20.7, sd: 3.4 }, 16: { median: 21.1, sd: 3.4 },
            17: { median: 21.5, sd: 3.4 }, 18: { median: 21.8, sd: 3.5 }, 19: { median: 22.1, sd: 3.5 },
          },
        };

        const ageRound = Math.round(age);
        const clampedAge = Math.max(2, Math.min(19, ageRound));
        const refData = medianBmiByAge[sex]?.[clampedAge];
        if (!refData) return null;

        // Z-score approximation
        const zScore = (bmi - refData.median) / refData.sd;
        // Convert z-score to percentile using approximation
        const percentile = Math.min(99.9, Math.max(0.1, 50 * (1 + (zScore / Math.sqrt(1 + zScore * zScore / 4)) * (1 + 0.04 * zScore * zScore / 4))));
        // Better approximation using error function estimate
        const erfApprox = (x: number) => {
          const t = 1 / (1 + 0.3275911 * Math.abs(x));
          const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
          const result = 1 - poly * Math.exp(-x * x);
          return x >= 0 ? result : -result;
        };
        const normalCdf = (z: number) => 0.5 * (1 + erfApprox(z / Math.sqrt(2)));
        const pct = normalCdf(zScore) * 100;
        const clampedPct = Math.min(99.9, Math.max(0.1, pct));

        let category: string;
        if (clampedPct < 5) category = "Underweight (below 5th percentile)";
        else if (clampedPct < 85) category = "Healthy weight (5th to 84th percentile)";
        else if (clampedPct < 95) category = "Overweight (85th to 94th percentile)";
        else category = "Obese (95th percentile or above)";

        return {
          primary: { label: "BMI Percentile", value: `${formatNumber(clampedPct, 0)}th` },
          details: [
            { label: "BMI", value: formatNumber(bmi, 1) },
            { label: "Percentile", value: `${formatNumber(clampedPct, 1)}th percentile` },
            { label: "Weight status", value: category },
            { label: "Z-score", value: formatNumber(zScore, 2) },
            { label: "Age-sex median BMI", value: formatNumber(refData.median, 1) },
          ],
          note: "This uses approximate CDC growth chart reference data. For children and teens, BMI is interpreted using age- and sex-specific percentiles. Consult your pediatrician for an accurate assessment using actual CDC growth charts.",
        };
      },
    },
    {
      id: "imperial",
      name: "BMI for Children (Imperial)",
      description: "Calculate BMI-for-age using pounds, feet and inches",
      fields: [
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 66",
          suffix: "lbs",
          min: 10,
          max: 450,
          step: 0.5,
        },
        {
          name: "feet",
          label: "Height (feet)",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "ft",
          min: 1,
          max: 7,
        },
        {
          name: "inches",
          label: "Height (inches)",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "in",
          min: 0,
          max: 11,
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "years",
          min: 2,
          max: 19,
          step: 0.5,
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
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const feet = inputs.feet as number;
        const inches = (inputs.inches as number) || 0;
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        if (!weight || !feet || !age || !sex) return null;

        const totalInches = feet * 12 + inches;
        const bmi = (weight / (totalInches * totalInches)) * 703;

        const heightCm = totalInches * 2.54;
        const weightKg = weight * 0.453592;

        const medianBmiByAge: Record<string, Record<number, { median: number; sd: number }>> = {
          male: {
            2: { median: 16.5, sd: 1.3 }, 3: { median: 16.0, sd: 1.2 }, 4: { median: 15.7, sd: 1.2 },
            5: { median: 15.5, sd: 1.3 }, 6: { median: 15.5, sd: 1.5 }, 7: { median: 15.7, sd: 1.7 },
            8: { median: 16.0, sd: 2.0 }, 9: { median: 16.5, sd: 2.2 }, 10: { median: 17.0, sd: 2.5 },
            11: { median: 17.6, sd: 2.7 }, 12: { median: 18.4, sd: 3.0 }, 13: { median: 19.1, sd: 3.1 },
            14: { median: 19.8, sd: 3.2 }, 15: { median: 20.5, sd: 3.3 }, 16: { median: 21.1, sd: 3.3 },
            17: { median: 21.7, sd: 3.4 }, 18: { median: 22.2, sd: 3.5 }, 19: { median: 22.7, sd: 3.5 },
          },
          female: {
            2: { median: 16.2, sd: 1.3 }, 3: { median: 15.8, sd: 1.2 }, 4: { median: 15.5, sd: 1.3 },
            5: { median: 15.4, sd: 1.4 }, 6: { median: 15.6, sd: 1.6 }, 7: { median: 15.9, sd: 1.9 },
            8: { median: 16.4, sd: 2.2 }, 9: { median: 17.0, sd: 2.5 }, 10: { median: 17.6, sd: 2.8 },
            11: { median: 18.3, sd: 3.0 }, 12: { median: 19.0, sd: 3.2 }, 13: { median: 19.7, sd: 3.3 },
            14: { median: 20.3, sd: 3.3 }, 15: { median: 20.7, sd: 3.4 }, 16: { median: 21.1, sd: 3.4 },
            17: { median: 21.5, sd: 3.4 }, 18: { median: 21.8, sd: 3.5 }, 19: { median: 22.1, sd: 3.5 },
          },
        };

        const ageRound = Math.round(age);
        const clampedAge = Math.max(2, Math.min(19, ageRound));
        const refData = medianBmiByAge[sex]?.[clampedAge];
        if (!refData) return null;

        const zScore = (bmi - refData.median) / refData.sd;
        const erfApprox = (x: number) => {
          const t = 1 / (1 + 0.3275911 * Math.abs(x));
          const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
          const result = 1 - poly * Math.exp(-x * x);
          return x >= 0 ? result : -result;
        };
        const normalCdf = (z: number) => 0.5 * (1 + erfApprox(z / Math.sqrt(2)));
        const pct = normalCdf(zScore) * 100;
        const clampedPct = Math.min(99.9, Math.max(0.1, pct));

        let category: string;
        if (clampedPct < 5) category = "Underweight (below 5th percentile)";
        else if (clampedPct < 85) category = "Healthy weight (5th to 84th percentile)";
        else if (clampedPct < 95) category = "Overweight (85th to 94th percentile)";
        else category = "Obese (95th percentile or above)";

        return {
          primary: { label: "BMI Percentile", value: `${formatNumber(clampedPct, 0)}th` },
          details: [
            { label: "BMI", value: formatNumber(bmi, 1) },
            { label: "Percentile", value: `${formatNumber(clampedPct, 1)}th percentile` },
            { label: "Weight status", value: category },
            { label: "Z-score", value: formatNumber(zScore, 2) },
          ],
          note: "This uses approximate CDC growth chart reference data. For children and teens, BMI must be interpreted using age- and sex-specific percentiles. Consult your pediatrician for accurate growth chart assessment.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator", "calorie-calculator"],
  faq: [
    {
      question: "Why is BMI calculated differently for children?",
      answer:
        "Children's body composition changes as they grow. Adult BMI categories don't apply. Instead, a child's BMI is compared to other children of the same age and sex using CDC growth charts, resulting in a percentile ranking.",
    },
    {
      question: "What are the BMI percentile categories for children?",
      answer:
        "Underweight: below 5th percentile. Healthy weight: 5th to 84th percentile. Overweight: 85th to 94th percentile. Obese: 95th percentile or above. These are based on CDC growth charts for ages 2-19.",
    },
    {
      question: "Is BMI accurate for children?",
      answer:
        "BMI is a useful screening tool but not diagnostic. Active, muscular children may have a high BMI without excess fat. Your pediatrician considers BMI along with growth patterns, diet, activity level, and family history.",
    },
  ],
  formula:
    "BMI = weight (kg) / height (m)^2 | Percentile is determined by comparing BMI to CDC age- and sex-specific reference data using Z-scores: Z = (BMI - median) / SD",
};
