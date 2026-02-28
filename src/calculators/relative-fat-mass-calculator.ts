import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const relativeFatMassCalculator: CalculatorDefinition = {
  slug: "relative-fat-mass-calculator",
  title: "Relative Fat Mass (RFM) Calculator",
  description: "Free RFM calculator. Estimate body fat percentage using only height and waist circumference — no calipers or scales needed.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["rfm calculator", "relative fat mass calculator", "body fat waist height calculator"],
  variants: [{
    id: "standard",
    name: "Relative Fat Mass (RFM)",
    description: "Free RFM calculator",
    fields: [
      { name: "height", label: "Height", type: "number", suffix: "cm", min: 100, max: 250 },
      { name: "waist", label: "Waist Circumference", type: "number", suffix: "cm", min: 40, max: 200 },
      { name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }], defaultValue: "male" },
    ],
    calculate: (inputs) => {
      const height = inputs.height as number;
      const waist = inputs.waist as number;
      const sex = inputs.sex as string;
      if (!height || !waist) return null;
      const rfm = sex === "male" ? 64 - (20 * height / waist) : 76 - (20 * height / waist);
      let category;
      if (sex === "male") {
        if (rfm < 6) category = "Essential fat";
        else if (rfm < 14) category = "Athletic";
        else if (rfm < 18) category = "Fitness";
        else if (rfm < 25) category = "Average";
        else category = "Above average";
      } else {
        if (rfm < 14) category = "Essential fat";
        else if (rfm < 21) category = "Athletic";
        else if (rfm < 25) category = "Fitness";
        else if (rfm < 32) category = "Average";
        else category = "Above average";
      }
      return {
        primary: { label: "Body Fat (RFM)", value: formatNumber(rfm) + "%" },
        details: [
          { label: "Category", value: category },
          { label: "Height/Waist ratio", value: formatNumber(height / waist) },
        ],
        note: "RFM correlates well with DXA-measured body fat (r=0.85+). Developed by Woolcott & Bergman (2018). More accurate than BMI for estimating adiposity.",
      };
    },
  }],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator"],
  faq: [
    { question: "What is RFM?", answer: "Relative Fat Mass estimates body fat using only height and waist circumference. Its more accurate than BMI, correlating ~85% with DXA scans." },
    { question: "How accurate is RFM?", answer: "RFM correlates better with DXA-measured body fat than BMI (r=0.85 vs r=0.65). It captures abdominal adiposity which BMI misses." },
  ],
  formula: "Male: RFM = 64 - 20×(Height/Waist). Female: RFM = 76 - 20×(Height/Waist)",
};
