import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const adjustedBodyWeightCalculator: CalculatorDefinition = {
  slug: "adjusted-body-weight-calculator",
  title: "Adjusted Body Weight Calculator",
  description: "Free adjusted body weight calculator for clinical dosing and nutrition. Calculate ABW using ideal body weight and actual weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["adjusted body weight calculator", "abw calculator", "clinical dosing weight calculator"],
  variants: [{
    id: "standard",
    name: "Adjusted Body Weight",
    description: "Free adjusted body weight calculator for clinical dosing and nutrition",
    fields: [
      { name: "height", label: "Height", type: "number", suffix: "cm", min: 100, max: 250 },
      { name: "weight", label: "Actual Weight", type: "number", suffix: "kg", min: 20, max: 400 },
      { name: "sex", label: "Sex", type: "select", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }], defaultValue: "male" },
      { name: "factor", label: "Adjustment Factor", type: "number", min: 0.1, max: 1, step: 0.05, defaultValue: 0.4 },
    ],
    calculate: (inputs) => {
      const height = inputs.height as number;
      const weight = inputs.weight as number;
      const sex = inputs.sex as string;
      const factor = inputs.factor as number;
      if (!height || !weight) return null;
      const heightIn = height / 2.54;
      const ibw = sex === "male" ? 50 + 2.3 * (heightIn - 60) : 45.5 + 2.3 * (heightIn - 60);
      const abw = ibw + factor * (weight - ibw);
      const bmi = weight / Math.pow(height / 100, 2);
      return {
        primary: { label: "Adjusted Body Weight", value: formatNumber(abw) + " kg" },
        details: [
          { label: "Ideal Body Weight (Devine)", value: formatNumber(ibw) + " kg" },
          { label: "Actual weight", value: formatNumber(weight) + " kg" },
          { label: "Adjustment factor", value: String(factor) },
          { label: "BMI", value: formatNumber(bmi) },
          { label: "% over IBW", value: formatNumber(((weight - ibw) / ibw) * 100) + "%" },
        ],
        note: "ABW is used for drug dosing and nutrition in obese patients. Standard factor: 0.4 (most medications). Some drugs use 0.25 or 0.5.",
      };
    },
  }],
  relatedSlugs: ["bmi-calculator", "bmr-calculator"],
  faq: [
    { question: "When should adjusted body weight be used?", answer: "ABW is used for drug dosing (aminoglycosides, vancomycin) and calorie calculations in patients >120% of ideal body weight." },
    { question: "What adjustment factor should I use?", answer: "0.4 is standard for most clinical applications. Some drugs (like vancomycin) may use 0.3-0.5 depending on institutional protocols." },
  ],
  formula: "ABW = IBW + Factor × (Actual Weight - IBW). IBW (Devine): Male=50+2.3×(inches-60), Female=45.5+2.3×(inches-60)",
};
