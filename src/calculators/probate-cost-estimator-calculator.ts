import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const probateCostEstimatorCalculator: CalculatorDefinition = {
  slug: "probate-cost-estimator-calculator",
  title: "Probate Cost Estimator Calculator",
  description: "Estimate total probate costs including court fees, attorney fees, and executor compensation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["probate cost","estate probate","probate fees","estate administration cost"],
  variants: [{
    id: "standard",
    name: "Probate Cost Estimator",
    description: "Estimate total probate costs including court fees, attorney fees, and executor compensation.",
    fields: [
      { name: "estateValue", label: "Gross Estate Value ($)", type: "number", min: 0, max: 100000000, defaultValue: 500000 },
      { name: "state", label: "Fee Structure", type: "select", options: [{ value: "1", label: "Statutory (% of Estate)" }, { value: "2", label: "Reasonable Fee" }, { value: "3", label: "Flat Fee" }], defaultValue: "1" },
      { name: "isContested", label: "Contested Estate?", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" },
      { name: "realProperty", label: "Number of Real Properties", type: "number", min: 0, max: 20, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const estateValue = inputs.estateValue as number;
    const state = inputs.state as string;
    const isContested = parseInt(inputs.isContested as string);
    const realProperty = inputs.realProperty as number;
    let attorneyFee = 0;
    if (state === "1") {
      if (estateValue <= 100000) attorneyFee = estateValue * 0.04;
      else if (estateValue <= 1000000) attorneyFee = 4000 + (estateValue - 100000) * 0.03;
      else attorneyFee = 31000 + (estateValue - 1000000) * 0.02;
    } else if (state === "2") {
      attorneyFee = estateValue * 0.025;
    } else {
      attorneyFee = Math.max(estateValue * 0.015, 3000);
    }
    const executorFee = attorneyFee * 0.8;
    const courtFees = 500 + (realProperty * 200);
    const contestedExtra = isContested === 1 ? attorneyFee * 0.5 : 0;
    const totalCost = attorneyFee + executorFee + courtFees + contestedExtra;
    return {
      primary: { label: "Estimated Total Probate Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Attorney Fees", value: "$" + formatNumber(attorneyFee) },
        { label: "Executor Compensation", value: "$" + formatNumber(executorFee) },
        { label: "Court Filing Fees", value: "$" + formatNumber(courtFees) },
        { label: "Contested Litigation Extra", value: "$" + formatNumber(contestedExtra) },
        { label: "Probate Cost as % of Estate", value: formatNumber(estateValue > 0 ? (totalCost / estateValue) * 100 : 0) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["legal-fee-estimator-calculator","settlement-value-estimator-calculator","legal-retainer-calculator"],
  faq: [
    { question: "How much does probate cost?", answer: "Probate typically costs 3 to 7 percent of the estate value, including attorney fees, executor compensation, court fees, and other administrative costs." },
    { question: "How long does probate take?", answer: "Simple probate cases take 6 to 12 months. Complex or contested estates can take 2 to 5 years or more." },
    { question: "Can you avoid probate?", answer: "Yes, through living trusts, joint ownership, beneficiary designations, and transfer-on-death accounts. Estate planning can significantly reduce or eliminate probate." },
  ],
  formula: "Total Probate Cost = Attorney Fee + Executor Fee + Court Fees + Contested Extra",
};
