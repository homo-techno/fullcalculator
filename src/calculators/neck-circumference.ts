import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const neckCircumferenceCalculator: CalculatorDefinition = {
  slug: "neck-circumference-calculator",
  title: "Neck Circumference Health Calculator",
  description: "Free neck circumference health calculator. Assess health risks associated with neck size including sleep apnea risk and metabolic syndrome indicators.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["neck circumference", "neck size health", "sleep apnea risk", "neck measurement", "metabolic syndrome neck"],
  variants: [
    {
      id: "neck-health",
      name: "Neck Size Health Assessment",
      description: "Evaluate health risks based on neck circumference",
      fields: [
        { name: "neck", label: "Neck Circumference", type: "number", placeholder: "e.g. 40", suffix: "cm" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
        { name: "height", label: "Height (optional)", type: "number", placeholder: "e.g. 178", suffix: "cm" },
        { name: "weight", label: "Weight (optional)", type: "number", placeholder: "e.g. 80", suffix: "kg" },
      ],
      calculate: (inputs) => {
        const neck = inputs.neck as number;
        const gender = inputs.gender as string;
        const height = inputs.height as number;
        const weight = inputs.weight as number;
        if (!neck) return null;
        const isMale = gender === "male";
        const threshold = isMale ? 37 : 34;
        const highRisk = isMale ? 43 : 38;
        let sleepApneaRisk: string;
        if (neck > highRisk) sleepApneaRisk = "High risk - screening recommended";
        else if (neck > threshold) sleepApneaRisk = "Moderate risk";
        else sleepApneaRisk = "Low risk";
        let metabolicRisk: string;
        const metThreshold = isMale ? 38 : 35;
        if (neck > metThreshold + 3) metabolicRisk = "Elevated risk for metabolic syndrome";
        else if (neck > metThreshold) metabolicRisk = "Borderline";
        else metabolicRisk = "Normal range";
        const details: { label: string; value: string }[] = [
          { label: "Neck Circumference", value: `${formatNumber(neck, 1)} cm` },
          { label: "Sleep Apnea Risk", value: sleepApneaRisk },
          { label: "Metabolic Syndrome Indicator", value: metabolicRisk },
          { label: "Normal Range", value: `< ${threshold} cm (${gender})` },
          { label: "High Risk Threshold", value: `> ${highRisk} cm (${gender})` },
        ];
        if (height) {
          const neckToHeight = (neck / height) * 100;
          details.push({ label: "Neck-to-Height Ratio", value: `${formatNumber(neckToHeight, 1)}%` });
        }
        if (weight && height) {
          const bmi = weight / Math.pow(height / 100, 2);
          details.push({ label: "BMI (reference)", value: formatNumber(bmi, 1) });
        }
        return {
          primary: { label: "Neck Health Status", value: neck > threshold ? "Above Normal" : "Normal Range" },
          details,
          note: "Neck circumference above normal thresholds is associated with increased risk of obstructive sleep apnea and metabolic syndrome. This is a screening tool, not a diagnosis.",
        };
      },
    },
    {
      id: "collar-size",
      name: "Shirt Collar Size Guide",
      description: "Convert neck measurement to dress shirt collar size",
      fields: [
        { name: "neck", label: "Neck Circumference", type: "number", placeholder: "e.g. 40", suffix: "cm" },
        { name: "fit", label: "Preferred Fit", type: "select", options: [
          { label: "Slim Fit", value: "slim" },
          { label: "Regular Fit", value: "regular" },
          { label: "Comfort Fit", value: "comfort" },
        ], defaultValue: "regular" },
      ],
      calculate: (inputs) => {
        const neck = inputs.neck as number;
        const fit = inputs.fit as string;
        if (!neck) return null;
        const adjustment: Record<string, number> = { slim: 0.5, regular: 1.5, comfort: 2.5 };
        const adj = adjustment[fit] || 1.5;
        const collarCm = neck + adj;
        const collarInches = collarCm / 2.54;
        const nearestHalf = Math.round(collarInches * 2) / 2;
        return {
          primary: { label: "Collar Size", value: `${formatNumber(nearestHalf, 1)}"` },
          details: [
            { label: "Neck Measurement", value: `${formatNumber(neck, 1)} cm` },
            { label: "Collar (cm)", value: `${formatNumber(collarCm, 1)} cm` },
            { label: "Collar (inches)", value: `${formatNumber(collarInches, 1)}"` },
            { label: "Fit Adjustment", value: `+${adj} cm (${fit})` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator", "waist-hip-calculator"],
  faq: [
    { question: "What does neck circumference indicate?", answer: "Neck circumference is a simple screening tool correlated with obesity, sleep apnea, and metabolic syndrome. Men with necks >43 cm and women >38 cm have significantly higher health risks. It reflects upper body fat distribution." },
    { question: "How to measure neck circumference?", answer: "Measure at the level of the Adam's apple (thyroid cartilage), keeping the tape horizontal. Stand relaxed, looking straight ahead. Do not flex neck muscles. Record to the nearest 0.5 cm." },
  ],
  formula: "Sleep apnea risk: Men >37cm moderate, >43cm high | Women >34cm moderate, >38cm high",
};
