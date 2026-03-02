import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const settlementValueEstimatorCalculator: CalculatorDefinition = {
  slug: "settlement-value-estimator-calculator",
  title: "Settlement Value Estimator Calculator",
  description: "Estimate potential settlement value for personal injury and civil cases.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["settlement value","case settlement","personal injury settlement","claim value"],
  variants: [{
    id: "standard",
    name: "Settlement Value Estimator",
    description: "Estimate potential settlement value for personal injury and civil cases.",
    fields: [
      { name: "medicalExpenses", label: "Total Medical Expenses ($)", type: "number", min: 0, max: 5000000, defaultValue: 25000 },
      { name: "lostWages", label: "Lost Wages ($)", type: "number", min: 0, max: 1000000, defaultValue: 10000 },
      { name: "painMultiplier", label: "Injury Severity", type: "select", options: [{ value: "1.5", label: "Minor Injury" }, { value: "3", label: "Moderate Injury" }, { value: "5", label: "Severe Injury" }, { value: "7", label: "Life-Altering Injury" }], defaultValue: "3" },
      { name: "liability", label: "Defendant Liability Strength", type: "select", options: [{ value: "0.5", label: "Weak (50%)" }, { value: "0.75", label: "Moderate (75%)" }, { value: "1", label: "Strong (100%)" }], defaultValue: "0.75" },
    ],
    calculate: (inputs) => {
    const medicalExpenses = inputs.medicalExpenses as number;
    const lostWages = inputs.lostWages as number;
    const painMultiplier = parseFloat(inputs.painMultiplier as string);
    const liability = parseFloat(inputs.liability as string);
    const painAndSuffering = medicalExpenses * painMultiplier;
    const totalDamages = medicalExpenses + lostWages + painAndSuffering;
    const adjustedValue = totalDamages * liability;
    const lowEstimate = adjustedValue * 0.75;
    const highEstimate = adjustedValue * 1.25;
    return {
      primary: { label: "Estimated Settlement Value", value: "$" + formatNumber(adjustedValue) },
      details: [
        { label: "Medical Expenses", value: "$" + formatNumber(medicalExpenses) },
        { label: "Lost Wages", value: "$" + formatNumber(lostWages) },
        { label: "Pain & Suffering", value: "$" + formatNumber(painAndSuffering) },
        { label: "Settlement Range", value: "$" + formatNumber(lowEstimate) + " - $" + formatNumber(highEstimate) }
      ]
    };
  },
  }],
  relatedSlugs: ["legal-fee-estimator-calculator","contract-breach-damages-calculator","legal-malpractice-damages-calculator"],
  faq: [
    { question: "How is settlement value calculated?", answer: "Settlements typically consider medical expenses, lost wages, pain and suffering (often a multiplier of medical costs), and the strength of liability evidence." },
    { question: "What is the pain and suffering multiplier?", answer: "The multiplier method multiplies medical expenses by 1.5 to 5 or more depending on injury severity to estimate non-economic damages." },
    { question: "How long does it take to settle a case?", answer: "Most personal injury cases settle within 1 to 3 years, though complex cases can take longer." },
  ],
  formula: "Settlement = (Medical + Lost Wages + Medical x Pain Multiplier) x Liability Factor",
};
