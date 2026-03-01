import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const whiplashSettlementCalculator: CalculatorDefinition = {
  slug: "whiplash-settlement-calculator",
  title: "Whiplash Settlement Calculator",
  description: "Estimate a whiplash injury settlement value based on treatment costs and recovery time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["whiplash settlement", "whiplash claim value", "neck injury settlement"],
  variants: [{
    id: "standard",
    name: "Whiplash Settlement",
    description: "Estimate a whiplash injury settlement value based on treatment costs and recovery time",
    fields: [
      { name: "medicalCosts", label: "Medical Treatment Costs", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 8000 },
      { name: "recoveryWeeks", label: "Recovery Time", type: "number", suffix: "weeks", min: 1, max: 104, defaultValue: 12 },
      { name: "lostWages", label: "Lost Wages", type: "number", prefix: "$", min: 0, max: 200000, defaultValue: 5000 },
    ],
    calculate: (inputs) => {
      const medical = inputs.medicalCosts as number;
      const weeks = inputs.recoveryWeeks as number;
      const wages = inputs.lostWages as number;
      if (!medical || medical <= 0) return null;
      const multiplier = weeks <= 8 ? 1.5 : weeks <= 26 ? 2.5 : weeks <= 52 ? 3.5 : 5;
      const painSuffering = medical * multiplier;
      const total = medical + wages + painSuffering;
      const netAfterFees = total * 0.67;
      return {
        primary: { label: "Estimated Settlement", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Pain and Suffering", value: "$" + formatNumber(Math.round(painSuffering)) },
          { label: "Multiplier Used", value: multiplier + "x" },
          { label: "Economic Damages", value: "$" + formatNumber(medical + wages) },
          { label: "Net After Attorney (33%)", value: "$" + formatNumber(Math.round(netAfterFees)) },
        ],
      };
    },
  }],
  relatedSlugs: ["pain-and-suffering-multiplier-calculator", "truck-accident-settlement-calculator"],
  faq: [
    { question: "How much is a whiplash settlement worth?", answer: "Whiplash settlements typically range from $10,000 to $50,000, but severe cases with long recovery can exceed $100,000." },
    { question: "How long does a whiplash claim take?", answer: "Most whiplash claims settle within 6 to 12 months, though complex cases may take longer if litigation is needed." },
  ],
  formula: "Settlement = Medical Costs + Lost Wages + (Medical Costs x Recovery Multiplier)",
};
