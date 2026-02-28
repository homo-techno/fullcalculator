import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicalMalpracticeCalculator: CalculatorDefinition = {
  slug: "medical-malpractice-calculator",
  title: "Medical Malpractice Damages Calculator",
  description: "Free medical malpractice damages estimator. Calculate potential compensation including medical costs, lost income, and pain multipliers.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["medical malpractice calculator", "medical malpractice settlement estimator", "malpractice damages calculator"],
  variants: [{
    id: "standard",
    name: "Medical Malpractice Damages",
    description: "Free medical malpractice damages estimator",
    fields: [
      { name: "medicalCosts", label: "Additional Medical Costs", type: "number", prefix: "$", min: 0 },
      { name: "lostIncome", label: "Lost Income", type: "number", prefix: "$", min: 0, defaultValue: 0 },
      { name: "futureCareCost", label: "Future Care Costs", type: "number", prefix: "$", min: 0, defaultValue: 0 },
      { name: "severity", label: "Injury Severity", type: "select", options: [{ label: "Minor (2x)", value: "2" }, { label: "Moderate (3x)", value: "3" }, { label: "Severe/Permanent (5x)", value: "5" }], defaultValue: "3" },
    ],
    calculate: (inputs) => {
      const medical = inputs.medicalCosts as number;
      const income = (inputs.lostIncome as number) || 0;
      const future = (inputs.futureCareCost as number) || 0;
      const mult = parseFloat(inputs.severity as string);
      if (!medical || medical <= 0) return null;
      const economic = medical + income + future;
      const nonEconomic = medical * mult;
      const total = economic + nonEconomic;
      return {
        primary: { label: "Estimated Damages", value: "$" + formatNumber(total) },
        details: [
          { label: "Economic damages", value: "$" + formatNumber(economic) },
          { label: "Non-economic (pain/suffering)", value: "$" + formatNumber(nonEconomic) },
          { label: "Medical costs", value: "$" + formatNumber(medical) },
          { label: "Lost income", value: "$" + formatNumber(income) },
          { label: "Future care", value: "$" + formatNumber(future) },
        ],
        note: "Many states cap non-economic damages in malpractice cases. This is an estimate only — consult a medical malpractice attorney.",
      };
    },
  }],
  relatedSlugs: ["personal-injury-calculator", "wrongful-death-calculator"],
  faq: [
    { question: "What damages can you claim in a malpractice case?", answer: "Economic (medical bills, lost wages, future care) and non-economic (pain, suffering, loss of quality of life). Some states cap non-economic damages." },
    { question: "How is the multiplier determined?", answer: "Based on severity: minor injuries 1.5-2x, moderate 2-3x, severe/permanent 4-5x of medical costs." },
  ],
  formula: "Damages = Economic (Medical + Income + Future Care) + Non-Economic (Medical × Severity)",
};
