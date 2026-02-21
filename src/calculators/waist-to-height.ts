import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waistToHeightCalculator: CalculatorDefinition = {
  slug: "waist-to-height-ratio-calculator",
  title: "Waist-to-Height Ratio Calculator",
  description:
    "Free waist-to-height ratio calculator. Assess your health risk based on waist circumference relative to height. A simple and reliable indicator of central obesity.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "waist to height ratio",
    "waist height ratio calculator",
    "WHtR calculator",
    "central obesity calculator",
    "waist measurement health",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Ratio",
      description: "Calculate your waist-to-height ratio",
      fields: [
        { name: "waist", label: "Waist Circumference", type: "number", placeholder: "e.g. 34", suffix: "inches" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 70", suffix: "inches" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const height = inputs.height as number;
        if (!waist || !height) return null;

        const ratio = waist / height;

        let category: string;
        let risk: string;
        if (ratio < 0.4) {
          category = "Underweight";
          risk = "May indicate being underweight — consult a healthcare provider";
        } else if (ratio <= 0.5) {
          category = "Healthy";
          risk = "Low health risk — keep it up!";
        } else if (ratio <= 0.6) {
          category = "Overweight";
          risk = "Increased health risk — consider lifestyle changes";
        } else {
          category = "Obese";
          risk = "High health risk — consult a healthcare provider";
        }

        return {
          primary: { label: "Waist-to-Height Ratio", value: formatNumber(ratio, 3) },
          details: [
            { label: "Category", value: category },
            { label: "Risk Assessment", value: risk },
            { label: "Waist", value: `${formatNumber(waist, 1)} in` },
            { label: "Height", value: `${formatNumber(height, 1)} in` },
          ],
          note: "A waist-to-height ratio below 0.5 is the recommended target. 'Keep your waist to less than half your height.'",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "waist-hip-calculator", "body-fat-calculator"],
  faq: [
    {
      question: "What is a healthy waist-to-height ratio?",
      answer:
        "A ratio of 0.4 to 0.5 is considered healthy. The general guideline is to keep your waist circumference to less than half your height.",
    },
    {
      question: "Is waist-to-height ratio better than BMI?",
      answer:
        "Many researchers consider it a better predictor of cardiovascular risk than BMI because it accounts for central (abdominal) fat distribution, which is more closely linked to health problems.",
    },
    {
      question: "How do I measure my waist correctly?",
      answer:
        "Measure your waist at the midpoint between the bottom of your lowest rib and the top of your hip bone (iliac crest), typically at the level of your navel. Use a flexible tape measure and keep it snug but not compressing the skin.",
    },
  ],
  formula: "Waist-to-Height Ratio = Waist (inches) / Height (inches)",
};
