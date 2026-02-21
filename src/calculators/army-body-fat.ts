import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const armyBodyFatCalculator: CalculatorDefinition = {
  slug: "army-body-fat-calculator",
  title: "Army Body Fat Calculator",
  description: "Free Army body fat calculator. Calculate body fat percentage using the U.S. Army tape test method (DoD formula).",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["army body fat calculator", "military body fat", "tape test calculator", "DoD body fat", "army fitness"],
  variants: [
    {
      id: "male",
      name: "Male",
      fields: [
        { name: "neck", label: "Neck Circumference (inches)", type: "number", placeholder: "e.g. 15.5" },
        { name: "waist", label: "Waist Circumference (inches)", type: "number", placeholder: "e.g. 34" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 70" },
      ],
      calculate: (inputs) => {
        const neck = inputs.neck as number, waist = inputs.waist as number, height = inputs.height as number;
        if (!neck || !waist || !height) return null;
        const bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
        let standard = "Pass";
        if (bf > 26) standard = "Exceeds standard";
        else if (bf > 20) standard = "Within standard (17-20% goal)";
        return {
          primary: { label: "Body Fat %", value: `${formatNumber(bf, 1)}%` },
          details: [
            { label: "Army standard", value: standard },
            { label: "Max allowed (varies by age)", value: "20-26%" },
          ],
        };
      },
    },
    {
      id: "female",
      name: "Female",
      fields: [
        { name: "neck", label: "Neck Circumference (inches)", type: "number", placeholder: "e.g. 13" },
        { name: "waist", label: "Waist Circumference (inches)", type: "number", placeholder: "e.g. 28" },
        { name: "hip", label: "Hip Circumference (inches)", type: "number", placeholder: "e.g. 38" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 64" },
      ],
      calculate: (inputs) => {
        const neck = inputs.neck as number, waist = inputs.waist as number;
        const hip = inputs.hip as number, height = inputs.height as number;
        if (!neck || !waist || !hip || !height) return null;
        const bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
        let standard = "Pass";
        if (bf > 36) standard = "Exceeds standard";
        else if (bf > 30) standard = "Within standard (24-30% goal)";
        return {
          primary: { label: "Body Fat %", value: `${formatNumber(bf, 1)}%` },
          details: [
            { label: "Army standard", value: standard },
            { label: "Max allowed (varies by age)", value: "30-36%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["body-fat-calculator", "bmi-calculator", "lean-body-mass-calculator"],
  faq: [{ question: "How does the Army tape test work?", answer: "The U.S. Army uses the DoD circumference method. Males: measure neck and waist. Females: measure neck, waist, and hips. Body fat % is calculated using logarithmic formulas and height. Measurements are taken at specific anatomical points." }],
  formula: "Male: 86.01×log₁₀(waist-neck) - 70.04×log₁₀(height) + 36.76",
};
