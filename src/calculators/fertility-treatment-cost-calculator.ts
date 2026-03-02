import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fertilityTreatmentCostCalculator: CalculatorDefinition = {
  slug: "fertility-treatment-cost-calculator",
  title: "Fertility Treatment Cost Calculator",
  description: "Estimate the cost of fertility treatments including IVF cycles, IUI, medication, and monitoring to plan your family building budget.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["fertility treatment cost","IVF cost","IUI cost","fertility medication","reproductive treatment"],
  variants: [{
    id: "standard",
    name: "Fertility Treatment Cost",
    description: "Estimate the cost of fertility treatments including IVF cycles, IUI, medication, and monitoring to plan your family building budget.",
    fields: [
      { name: "treatmentType", label: "Treatment Type", type: "select", options: [{ value: "1", label: "IUI (Intrauterine Insemination)" }, { value: "2", label: "IVF (In Vitro Fertilization)" }, { value: "3", label: "IVF with Donor Eggs" }, { value: "4", label: "Frozen Embryo Transfer" }], defaultValue: "2" },
      { name: "cycles", label: "Estimated Number of Cycles", type: "number", min: 1, max: 6, defaultValue: 2 },
      { name: "medicationCost", label: "Medication Cost Per Cycle ($)", type: "number", min: 500, max: 10000, defaultValue: 4000 },
      { name: "insuranceCoverage", label: "Insurance Coverage (%)", type: "number", min: 0, max: 100, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const treatmentType = inputs.treatmentType as number;
    const cycles = inputs.cycles as number;
    const medicationCost = inputs.medicationCost as number;
    const insuranceCoverage = inputs.insuranceCoverage as number;
    const baseCosts = [0, 1500, 15000, 25000, 5000];
    const baseCostPerCycle = baseCosts[treatmentType];
    const totalPerCycle = baseCostPerCycle + medicationCost;
    const grossTotal = totalPerCycle * cycles;
    const insuranceSavings = grossTotal * (insuranceCoverage / 100);
    const netCost = grossTotal - insuranceSavings;
    const treatmentLabels = ["", "IUI", "IVF", "IVF with Donor Eggs", "Frozen Embryo Transfer"];
    return {
      primary: { label: "Total Estimated Cost", value: "$" + formatNumber(Math.round(netCost)) },
      details: [
        { label: "Treatment Type", value: treatmentLabels[treatmentType] },
        { label: "Cost Per Cycle (Before Insurance)", value: "$" + formatNumber(Math.round(totalPerCycle)) },
        { label: "Gross Total for All Cycles", value: "$" + formatNumber(Math.round(grossTotal)) },
        { label: "Insurance Savings", value: "$" + formatNumber(Math.round(insuranceSavings)) },
        { label: "Number of Cycles", value: formatNumber(cycles) }
      ]
    };
  },
  }],
  relatedSlugs: ["surrogacy-cost-calculator","adoption-cost-estimator","maternity-leave-pay-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Cost Per Cycle = Base Procedure Cost + Medication Cost
Net Cost = (Cost Per Cycle x Cycles) x (1 - Insurance Coverage%)",
};
