import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const adoptionCostEstimatorCalculator: CalculatorDefinition = {
  slug: "adoption-cost-estimator",
  title: "Adoption Cost Estimator",
  description: "Estimate the total cost of domestic, international, or foster care adoption including legal fees, agency costs, and travel expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["adoption cost","adoption fees","adoption budget","child adoption expense","adoption process cost"],
  variants: [{
    id: "standard",
    name: "Adoption Cost Estimator",
    description: "Estimate the total cost of domestic, international, or foster care adoption including legal fees, agency costs, and travel expenses.",
    fields: [
      { name: "adoptionType", label: "Adoption Type", type: "select", options: [{ value: "1", label: "Domestic Private" }, { value: "2", label: "International" }, { value: "3", label: "Foster Care" }], defaultValue: "1" },
      { name: "agencyFee", label: "Agency/Facilitator Fee ($)", type: "number", min: 0, max: 50000, defaultValue: 15000 },
      { name: "legalFee", label: "Legal Fees ($)", type: "number", min: 500, max: 20000, defaultValue: 5000 },
      { name: "homeStudy", label: "Home Study Fee ($)", type: "number", min: 500, max: 5000, defaultValue: 2000 },
      { name: "travel", label: "Travel Expenses ($)", type: "number", min: 0, max: 30000, defaultValue: 3000 },
    ],
    calculate: (inputs) => {
    const adoptionType = inputs.adoptionType as number;
    const agencyFee = inputs.agencyFee as number;
    const legalFee = inputs.legalFee as number;
    const homeStudy = inputs.homeStudy as number;
    const travel = inputs.travel as number;
    const typeLabels = ["", "Domestic Private", "International", "Foster Care"];
    const totalCost = agencyFee + legalFee + homeStudy + travel;
    const taxCredit = Math.min(totalCost, 16810);
    const netCost = totalCost - taxCredit;
    return {
      primary: { label: "Total Adoption Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Adoption Type", value: typeLabels[adoptionType] },
        { label: "Agency/Facilitator Fee", value: "$" + formatNumber(Math.round(agencyFee)) },
        { label: "Legal and Home Study", value: "$" + formatNumber(Math.round(legalFee + homeStudy)) },
        { label: "Federal Tax Credit (Estimated)", value: "$" + formatNumber(Math.round(taxCredit)) },
        { label: "Net Cost After Tax Credit", value: "$" + formatNumber(Math.round(netCost)) }
      ]
    };
  },
  }],
  relatedSlugs: ["surrogacy-cost-calculator","fertility-treatment-cost-calculator","maternity-leave-pay-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total Cost = Agency Fee + Legal Fees + Home Study + Travel; Net Cost = Total Cost - Federal Tax Credit (up to $16,810)",
};
