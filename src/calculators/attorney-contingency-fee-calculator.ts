import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const attorneyContingencyFeeCalculator: CalculatorDefinition = {
  slug: "attorney-contingency-fee-calculator",
  title: "Attorney Contingency Fee Calculator",
  description: "Calculate attorney fees and your net recovery under a contingency fee agreement.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["contingency fee calculator", "attorney fee calculator", "lawyer percentage fee"],
  variants: [{
    id: "standard",
    name: "Attorney Contingency Fee",
    description: "Calculate attorney fees and your net recovery under a contingency fee agreement",
    fields: [
      { name: "settlementAmount", label: "Settlement Amount", type: "number", prefix: "$", min: 0, max: 50000000, defaultValue: 100000 },
      { name: "feePercentage", label: "Contingency Fee Percentage", type: "number", suffix: "%", min: 10, max: 50, defaultValue: 33 },
      { name: "expenses", label: "Case Expenses", type: "number", prefix: "$", min: 0, max: 500000, defaultValue: 5000 },
    ],
    calculate: (inputs) => {
      const settlement = inputs.settlementAmount as number;
      const feePct = (inputs.feePercentage as number) / 100;
      const expenses = inputs.expenses as number;
      if (!settlement || settlement <= 0) return null;
      const attorneyFee = settlement * feePct;
      const netToClient = settlement - attorneyFee - expenses;
      const effectiveRate = ((attorneyFee + expenses) / settlement * 100);
      return {
        primary: { label: "Net to Client", value: "$" + formatNumber(Math.round(netToClient)) },
        details: [
          { label: "Attorney Fee", value: "$" + formatNumber(Math.round(attorneyFee)) },
          { label: "Case Expenses", value: "$" + formatNumber(expenses) },
          { label: "Total Deductions", value: "$" + formatNumber(Math.round(attorneyFee + expenses)) },
          { label: "Effective Cost Rate", value: effectiveRate.toFixed(1) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["pain-and-suffering-multiplier-calculator", "structured-settlement-payout-calculator"],
  faq: [
    { question: "What is a typical contingency fee?", answer: "Most personal injury attorneys charge 33% if settled before trial and 40% if the case goes to trial." },
    { question: "Are case expenses separate from the contingency fee?", answer: "Yes, case expenses like filing fees, expert witnesses, and medical records are usually deducted separately from the settlement." },
  ],
  formula: "Net to Client = Settlement - (Settlement x Fee %) - Case Expenses",
};
