import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const legalMalpracticeDamagesCalculator: CalculatorDefinition = {
  slug: "legal-malpractice-damages-calculator",
  title: "Legal Malpractice Damages Calculator",
  description: "Estimate potential damages in a legal malpractice claim.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["legal malpractice","attorney malpractice","malpractice damages","legal negligence"],
  variants: [{
    id: "standard",
    name: "Legal Malpractice Damages",
    description: "Estimate potential damages in a legal malpractice claim.",
    fields: [
      { name: "originalCaseValue", label: "Original Case Value Lost ($)", type: "number", min: 0, max: 50000000, defaultValue: 100000 },
      { name: "legalFeesLost", label: "Legal Fees Paid to Negligent Attorney ($)", type: "number", min: 0, max: 1000000, defaultValue: 15000 },
      { name: "additionalCosts", label: "Additional Costs Incurred ($)", type: "number", min: 0, max: 1000000, defaultValue: 5000 },
      { name: "provability", label: "Case Provability", type: "select", options: [{ value: "0.3", label: "Difficult (30%)" }, { value: "0.5", label: "Moderate (50%)" }, { value: "0.7", label: "Strong (70%)" }, { value: "0.9", label: "Very Strong (90%)" }], defaultValue: "0.5" },
    ],
    calculate: (inputs) => {
    const originalCaseValue = inputs.originalCaseValue as number;
    const legalFeesLost = inputs.legalFeesLost as number;
    const additionalCosts = inputs.additionalCosts as number;
    const provability = parseFloat(inputs.provability as string);
    const totalDamages = originalCaseValue + legalFeesLost + additionalCosts;
    const adjustedDamages = totalDamages * provability;
    const lowRange = adjustedDamages * 0.7;
    const highRange = adjustedDamages * 1.3;
    const malpracticeLegalFees = adjustedDamages * 0.33;
    const netRecovery = adjustedDamages - malpracticeLegalFees;
    return {
      primary: { label: "Estimated Adjusted Damages", value: "$" + formatNumber(adjustedDamages) },
      details: [
        { label: "Total Raw Damages", value: "$" + formatNumber(totalDamages) },
        { label: "Provability Adjustment", value: formatNumber(provability * 100) + "%" },
        { label: "Estimated Range", value: "$" + formatNumber(lowRange) + " - $" + formatNumber(highRange) },
        { label: "Contingency Fee (33%)", value: "$" + formatNumber(malpracticeLegalFees) },
        { label: "Estimated Net Recovery", value: "$" + formatNumber(netRecovery) }
      ]
    };
  },
  }],
  relatedSlugs: ["settlement-value-estimator-calculator","contract-breach-damages-calculator","legal-fee-estimator-calculator"],
  faq: [
    { question: "What is legal malpractice?", answer: "Legal malpractice occurs when an attorney fails to meet the standard of care, causing measurable harm to the client, such as missing deadlines, conflicts of interest, or negligent case handling." },
    { question: "How hard is it to prove legal malpractice?", answer: "You must prove the case within a case: that the attorney was negligent AND that you would have won the underlying case but for their negligence." },
    { question: "What is the statute of limitations for legal malpractice?", answer: "It varies by state, typically 1 to 6 years from when the malpractice was discovered or should have been discovered." },
  ],
  formula: "Adjusted Damages = (Case Value Lost + Fees Lost + Additional Costs) x Provability Factor",
};
