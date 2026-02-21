import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bodyFatCalculator: CalculatorDefinition = {
  slug: "body-fat-calculator",
  title: "Body Fat Calculator",
  description: "Free body fat calculator. Estimate your body fat percentage using the US Navy method with waist, neck, and hip measurements.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["body fat calculator", "body fat percentage", "navy body fat calculator", "body composition calculator"],
  variants: [
    {
      id: "navy-male",
      name: "Body Fat % (Male)",
      description: "US Navy method for men — measure waist at navel, neck at narrowest",
      fields: [
        { name: "waist", label: "Waist (at navel)", type: "number", placeholder: "e.g. 85", suffix: "cm" },
        { name: "neck", label: "Neck (at narrowest)", type: "number", placeholder: "e.g. 38", suffix: "cm" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 178", suffix: "cm" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const neck = inputs.neck as number;
        const height = inputs.height as number;
        if (!waist || !neck || !height) return null;
        const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
        let category: string;
        if (bf < 6) category = "Essential fat";
        else if (bf < 14) category = "Athletes";
        else if (bf < 18) category = "Fitness";
        else if (bf < 25) category = "Average";
        else category = "Above average";
        return {
          primary: { label: "Body Fat", value: formatNumber(Math.max(0, bf), 1), suffix: "%" },
          details: [{ label: "Category", value: category }],
        };
      },
    },
    {
      id: "navy-female",
      name: "Body Fat % (Female)",
      description: "US Navy method for women — measure waist, hip, and neck",
      fields: [
        { name: "waist", label: "Waist (at narrowest)", type: "number", placeholder: "e.g. 75", suffix: "cm" },
        { name: "hip", label: "Hip (at widest)", type: "number", placeholder: "e.g. 100", suffix: "cm" },
        { name: "neck", label: "Neck (at narrowest)", type: "number", placeholder: "e.g. 34", suffix: "cm" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 165", suffix: "cm" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const hip = inputs.hip as number;
        const neck = inputs.neck as number;
        const height = inputs.height as number;
        if (!waist || !hip || !neck || !height) return null;
        const bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
        let category: string;
        if (bf < 14) category = "Essential fat";
        else if (bf < 21) category = "Athletes";
        else if (bf < 25) category = "Fitness";
        else if (bf < 32) category = "Average";
        else category = "Above average";
        return {
          primary: { label: "Body Fat", value: formatNumber(Math.max(0, bf), 1), suffix: "%" },
          details: [{ label: "Category", value: category }],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "ideal-weight-calculator", "calorie-calculator"],
  faq: [
    { question: "How accurate is the US Navy body fat method?", answer: "The US Navy method is accurate to within 1-3% for most people. It is one of the most reliable non-laboratory methods and is used by the US military for fitness assessments." },
    { question: "What is a healthy body fat percentage?", answer: "Men: 10-20% is healthy (6-13% athletes, 14-17% fitness). Women: 18-28% is healthy (14-20% athletes, 21-24% fitness). Essential fat is 2-5% for men and 10-13% for women." },
  ],
  formula: "Men: BF% = 495/(1.0324 - 0.19077*log10(waist-neck) + 0.15456*log10(height)) - 450",
};
