import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const slipAndFallCalculator: CalculatorDefinition = {
  slug: "slip-and-fall-calculator",
  title: "Slip and Fall Settlement Calculator",
  description: "Free slip and fall (premises liability) settlement estimator. Calculate potential compensation with comparative negligence adjustment.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["slip and fall calculator", "premises liability calculator", "trip and fall settlement estimator"],
  variants: [{
    id: "standard",
    name: "Slip and Fall Settlement",
    description: "Free slip and fall (premises liability) settlement estimator",
    fields: [
      { name: "medicalBills", label: "Medical Bills", type: "number", prefix: "$", min: 0 },
      { name: "lostWages", label: "Lost Wages", type: "number", prefix: "$", min: 0, defaultValue: 0 },
      { name: "severity", label: "Injury Severity", type: "select", options: [{ label: "Minor (1.5x)", value: "1.5" }, { label: "Moderate (3x)", value: "3" }, { label: "Severe - fracture/surgery (4x)", value: "4" }], defaultValue: "3" },
      { name: "negligence", label: "Your Comparative Negligence %", type: "number", suffix: "%", min: 0, max: 100, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const medical = inputs.medicalBills as number;
      const wages = (inputs.lostWages as number) || 0;
      const mult = parseFloat(inputs.severity as string);
      const neg = (inputs.negligence as number) || 0;
      if (!medical || medical <= 0) return null;
      const economic = medical + wages;
      const pain = medical * mult;
      const gross = economic + pain;
      const reduction = gross * (neg / 100);
      const net = gross - reduction;
      return {
        primary: { label: "Estimated Settlement", value: "$" + formatNumber(net) },
        details: [
          { label: "Economic damages", value: "$" + formatNumber(economic) },
          { label: "Pain & suffering", value: "$" + formatNumber(pain) },
          { label: "Gross total", value: "$" + formatNumber(gross) },
          { label: "Negligence reduction (" + neg + "%)", value: "-$" + formatNumber(reduction) },
        ],
        note: "In modified comparative negligence states, you cannot recover if your fault exceeds 50-51%. Pure comparative states allow recovery at any fault level. This is an estimate only.",
      };
    },
  }],
  relatedSlugs: ["personal-injury-calculator", "car-accident-settlement-calculator"],
  faq: [
    { question: "What is comparative negligence?", answer: "Your settlement is reduced by your percentage of fault. If you are 30% at fault and damages are $100K, you receive $70K. Some states bar recovery above 50-51% fault." },
    { question: "What makes a strong slip and fall case?", answer: "Property owner knew about the hazard, failed to fix/warn, the hazard caused your injury, and you were lawfully present and not negligent yourself." },
  ],
  formula: "Settlement = (Medical + Wages + Pain×Multiplier) × (1 - Your Negligence%)",
};
