import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const navyBodyFatCalculator: CalculatorDefinition = {
  slug: "navy-body-fat-calculator",
  title: "Navy Body Fat Calculator",
  description:
    "Free U.S. Navy body fat percentage calculator. Estimate body fat using the Navy circumference method for men and women. Uses waist, neck, and hip measurements.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "navy body fat calculator",
    "us navy body fat",
    "navy method body fat",
    "military body fat calculator",
    "circumference body fat",
  ],
  variants: [
    {
      id: "male",
      name: "Male",
      description: "Navy body fat formula for men",
      fields: [
        { name: "waist", label: "Waist (at navel)", type: "number", placeholder: "e.g. 36", suffix: "inches" },
        { name: "neck", label: "Neck", type: "number", placeholder: "e.g. 16", suffix: "inches" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 70", suffix: "inches" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const neck = inputs.neck as number;
        const height = inputs.height as number;
        if (!waist || !neck || !height) return null;
        if (waist <= neck) return null;

        const bodyFat =
          495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;

        let category: string;
        if (bodyFat < 6) category = "Essential fat";
        else if (bodyFat < 14) category = "Athletes";
        else if (bodyFat < 18) category = "Fitness";
        else if (bodyFat < 25) category = "Average";
        else category = "Obese";

        return {
          primary: { label: "Body Fat Percentage", value: `${formatNumber(bodyFat, 1)}%` },
          details: [
            { label: "Category", value: category },
            { label: "Waist - Neck", value: `${formatNumber(waist - neck, 1)} in` },
            { label: "Lean Body Mass", value: `Estimated from body fat %` },
          ],
          note: "Navy standards: men must be under 26% body fat (varies by age). This is an estimate; DEXA scans provide more accuracy.",
        };
      },
    },
    {
      id: "female",
      name: "Female",
      description: "Navy body fat formula for women",
      fields: [
        { name: "waist", label: "Waist (at narrowest)", type: "number", placeholder: "e.g. 30", suffix: "inches" },
        { name: "hip", label: "Hip (at widest)", type: "number", placeholder: "e.g. 40", suffix: "inches" },
        { name: "neck", label: "Neck", type: "number", placeholder: "e.g. 13", suffix: "inches" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 65", suffix: "inches" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const hip = inputs.hip as number;
        const neck = inputs.neck as number;
        const height = inputs.height as number;
        if (!waist || !hip || !neck || !height) return null;
        if (waist + hip <= neck) return null;

        const bodyFat =
          495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(height)) - 450;

        let category: string;
        if (bodyFat < 14) category = "Essential fat";
        else if (bodyFat < 21) category = "Athletes";
        else if (bodyFat < 25) category = "Fitness";
        else if (bodyFat < 32) category = "Average";
        else category = "Obese";

        return {
          primary: { label: "Body Fat Percentage", value: `${formatNumber(bodyFat, 1)}%` },
          details: [
            { label: "Category", value: category },
            { label: "Waist + Hip - Neck", value: `${formatNumber(waist + hip - neck, 1)} in` },
            { label: "Lean Body Mass", value: `Estimated from body fat %` },
          ],
          note: "Navy standards: women must be under 36% body fat (varies by age). This is an estimate; DEXA scans provide more accuracy.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator", "army-body-fat-calculator", "waist-hip-calculator"],
  faq: [
    {
      question: "How accurate is the Navy body fat method?",
      answer:
        "The Navy method is accurate within about 3-4% of DEXA scan results for most people. It is one of the most widely used circumference-based body fat estimation methods.",
    },
    {
      question: "Why do women need a hip measurement?",
      answer:
        "Women tend to carry more fat in the hip/thigh area. Including the hip measurement improves the accuracy of the estimate for women by accounting for sex-specific fat distribution patterns.",
    },
    {
      question: "What body fat percentage is healthy?",
      answer:
        "For men: 14-17% is fit, 18-24% is average. For women: 21-24% is fit, 25-31% is average. Essential fat is 2-5% for men and 10-13% for women. Going below essential fat is dangerous.",
    },
  ],
  formula:
    "Male: BF% = 495 / (1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)) - 450 | Female: BF% = 495 / (1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)) - 450",
};
