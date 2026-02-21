import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function getBmiCategory(bmi: number): { category: string; color: string } {
  if (bmi < 18.5) return { category: "Underweight", color: "text-blue-600" };
  if (bmi < 25) return { category: "Normal weight", color: "text-green-600" };
  if (bmi < 30) return { category: "Overweight", color: "text-yellow-600" };
  return { category: "Obese", color: "text-red-600" };
}

export const bmiCalculator: CalculatorDefinition = {
  slug: "bmi-calculator",
  title: "BMI Calculator",
  description:
    "Free Body Mass Index (BMI) calculator. Calculate your BMI using metric or imperial units. Understand your BMI category and what it means for your health.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["bmi calculator", "body mass index", "bmi", "weight calculator", "health calculator"],
  variants: [
    {
      id: "metric",
      name: "BMI (Metric)",
      description: "Calculate BMI using kilograms and centimeters",
      fields: [
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 1,
          max: 500,
        },
        {
          name: "height",
          label: "Height",
          type: "number",
          placeholder: "e.g. 175",
          suffix: "cm",
          min: 50,
          max: 300,
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const height = inputs.height as number;
        if (!weight || !height) return null;
        const heightM = height / 100;
        const bmi = weight / (heightM * heightM);
        const { category } = getBmiCategory(bmi);
        return {
          primary: { label: "Your BMI", value: formatNumber(bmi, 1) },
          details: [
            { label: "Category", value: category },
            { label: "Healthy range", value: "18.5 - 24.9" },
          ],
        };
      },
    },
    {
      id: "imperial",
      name: "BMI (Imperial)",
      description: "Calculate BMI using pounds and inches",
      fields: [
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 154",
          suffix: "lbs",
          min: 1,
          max: 1000,
        },
        {
          name: "feet",
          label: "Height (feet)",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "ft",
          min: 1,
          max: 9,
        },
        {
          name: "inches",
          label: "Height (inches)",
          type: "number",
          placeholder: "e.g. 9",
          suffix: "in",
          min: 0,
          max: 11,
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const feet = inputs.feet as number;
        const inches = (inputs.inches as number) || 0;
        if (!weight || !feet) return null;
        const totalInches = feet * 12 + inches;
        const bmi = (weight / (totalInches * totalInches)) * 703;
        const { category } = getBmiCategory(bmi);
        return {
          primary: { label: "Your BMI", value: formatNumber(bmi, 1) },
          details: [
            { label: "Category", value: category },
            { label: "Healthy range", value: "18.5 - 24.9" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "age-calculator"],
  faq: [
    {
      question: "What is BMI?",
      answer:
        "BMI (Body Mass Index) is a measure of body fat based on height and weight. It applies to adult men and women. BMI = weight (kg) / height (m) squared.",
    },
    {
      question: "What is a healthy BMI?",
      answer:
        "A BMI between 18.5 and 24.9 is considered normal/healthy weight. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is obese.",
    },
    {
      question: "Is BMI accurate?",
      answer:
        "BMI is a useful screening tool but has limitations. It does not distinguish between muscle and fat mass, so very muscular people may have a high BMI despite low body fat. For a complete health assessment, consult a healthcare professional.",
    },
  ],
  formula: "BMI = weight (kg) / height (m)^2",
};
