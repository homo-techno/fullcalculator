import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const surrogacyCostCalculator: CalculatorDefinition = {
  slug: "surrogacy-cost-calculator",
  title: "Surrogacy Cost Calculator",
  description: "Estimate the total cost of gestational surrogacy including surrogate compensation, agency fees, legal costs, and medical expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["surrogacy cost","gestational surrogacy","surrogate mother cost","surrogacy budget","surrogacy expenses"],
  variants: [{
    id: "standard",
    name: "Surrogacy Cost",
    description: "Estimate the total cost of gestational surrogacy including surrogate compensation, agency fees, legal costs, and medical expenses.",
    fields: [
      { name: "surrogateComp", label: "Surrogate Compensation ($)", type: "number", min: 20000, max: 100000, defaultValue: 40000 },
      { name: "agencyFee", label: "Agency Fee ($)", type: "number", min: 5000, max: 40000, defaultValue: 20000 },
      { name: "legalFees", label: "Legal Fees ($)", type: "number", min: 5000, max: 20000, defaultValue: 10000 },
      { name: "medicalIVF", label: "IVF and Medical Costs ($)", type: "number", min: 10000, max: 50000, defaultValue: 25000 },
      { name: "insurance", label: "Surrogate Insurance ($)", type: "number", min: 5000, max: 40000, defaultValue: 15000 },
    ],
    calculate: (inputs) => {
    const surrogateComp = inputs.surrogateComp as number;
    const agencyFee = inputs.agencyFee as number;
    const legalFees = inputs.legalFees as number;
    const medicalIVF = inputs.medicalIVF as number;
    const insurance = inputs.insurance as number;
    const miscExpenses = surrogateComp * 0.15;
    const totalCost = surrogateComp + agencyFee + legalFees + medicalIVF + insurance + miscExpenses;
    const monthlyIfFinanced = totalCost / 60;
    return {
      primary: { label: "Total Surrogacy Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Surrogate Compensation", value: "$" + formatNumber(Math.round(surrogateComp)) },
        { label: "Agency and Legal", value: "$" + formatNumber(Math.round(agencyFee + legalFees)) },
        { label: "Medical and IVF", value: "$" + formatNumber(Math.round(medicalIVF)) },
        { label: "Insurance", value: "$" + formatNumber(Math.round(insurance)) },
        { label: "Misc Expenses (Est.)", value: "$" + formatNumber(Math.round(miscExpenses)) },
        { label: "If Financed Over 5 Years", value: "$" + formatNumber(Math.round(monthlyIfFinanced)) + "/mo" }
      ]
    };
  },
  }],
  relatedSlugs: ["adoption-cost-estimator","fertility-treatment-cost-calculator","maternity-leave-pay-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total Cost = Surrogate Compensation + Agency + Legal + Medical/IVF + Insurance + Misc; Misc = Surrogate Compensation x 15%",
};
