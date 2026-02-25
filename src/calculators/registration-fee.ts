import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const registrationFeeCalculator: CalculatorDefinition = {
  slug: "registration-fee-calculator",
  title: "Vehicle Registration Fee",
  description: "Free vehicle registration fee calculator. Estimate your annual vehicle registration costs including fees, taxes, and additional charges.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["vehicle registration fee", "car registration cost", "DMV registration calculator", "auto registration fee", "vehicle tag fee"],
  variants: [
    {
      id: "estimate",
      name: "Registration Fee Estimate",
      description: "Estimate vehicle registration fees",
      fields: [
        { name: "vehicleValue", label: "Vehicle Value", type: "number", placeholder: "e.g. 25000", prefix: "$" },
        { name: "vehicleAge", label: "Vehicle Age", type: "number", placeholder: "e.g. 3", suffix: "years" },
        { name: "baseFee", label: "State Base Fee", type: "number", placeholder: "e.g. 50", prefix: "$" },
        { name: "valueRate", label: "Value-Based Tax Rate", type: "number", placeholder: "e.g. 1.0", suffix: "%" },
        { name: "weightFee", label: "Weight Fee", type: "number", placeholder: "e.g. 30", prefix: "$" },
        { name: "titleFee", label: "Title Fee (if new)", type: "number", placeholder: "e.g. 15", prefix: "$" },
        { name: "additionalFees", label: "Additional Fees", type: "number", placeholder: "e.g. 20", prefix: "$" },
      ],
      calculate: (inputs) => {
        const value = (inputs.vehicleValue as number) || 0;
        const age = (inputs.vehicleAge as number) || 0;
        const baseFee = (inputs.baseFee as number) || 0;
        const valueRate = (inputs.valueRate as number) || 0;
        const weightFee = (inputs.weightFee as number) || 0;
        const titleFee = (inputs.titleFee as number) || 0;
        const additional = (inputs.additionalFees as number) || 0;

        const deprecFactor = Math.max(0.1, 1 - age * 0.1);
        const assessedValue = value * deprecFactor;
        const valueTax = assessedValue * (valueRate / 100);
        const totalFee = baseFee + valueTax + weightFee + titleFee + additional;

        return {
          primary: { label: "Total Registration Cost", value: `$${formatNumber(totalFee)}` },
          details: [
            { label: "Base registration fee", value: `$${formatNumber(baseFee)}` },
            { label: "Value-based tax", value: `$${formatNumber(valueTax)}` },
            { label: "Assessed vehicle value", value: `$${formatNumber(assessedValue)}` },
            { label: "Weight fee", value: `$${formatNumber(weightFee)}` },
            { label: "Title fee", value: `$${formatNumber(titleFee)}` },
            { label: "Additional fees", value: `$${formatNumber(additional)}` },
          ],
        };
      },
    },
    {
      id: "over-time",
      name: "Registration Cost Over Time",
      description: "Estimate how registration costs change over time",
      fields: [
        { name: "vehicleValue", label: "Current Vehicle Value", type: "number", placeholder: "e.g. 25000", prefix: "$" },
        { name: "annualBaseFee", label: "Annual Base Fees", type: "number", placeholder: "e.g. 100", prefix: "$" },
        { name: "valueRate", label: "Value-Based Tax Rate", type: "number", placeholder: "e.g. 1.0", suffix: "%" },
        { name: "depreciationRate", label: "Annual Depreciation", type: "number", placeholder: "e.g. 15", suffix: "%" },
        { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.vehicleValue as number;
        const baseFee = (inputs.annualBaseFee as number) || 0;
        const rate = (inputs.valueRate as number) || 0;
        const depreciation = (inputs.depreciationRate as number) || 15;
        const years = (inputs.years as number) || 5;
        if (!value) return null;

        let currentValue = value;
        let totalCost = 0;
        let firstYearCost = 0;
        let lastYearCost = 0;

        for (let i = 1; i <= years; i++) {
          const yearCost = baseFee + currentValue * (rate / 100);
          totalCost += yearCost;
          if (i === 1) firstYearCost = yearCost;
          if (i === years) lastYearCost = yearCost;
          currentValue *= (1 - depreciation / 100);
        }

        return {
          primary: { label: `Total Over ${years} Years`, value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Year 1 registration", value: `$${formatNumber(firstYearCost)}` },
            { label: `Year ${years} registration`, value: `$${formatNumber(lastYearCost)}` },
            { label: "Average per year", value: `$${formatNumber(totalCost / years)}` },
            { label: "Savings from depreciation", value: `$${formatNumber(firstYearCost - lastYearCost)}/yr` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-total-cost-calculator", "car-loan-calculator"],
  faq: [
    { question: "How much does vehicle registration cost?", answer: "Registration fees vary widely by state, from $20-$500+ per year. Factors include vehicle value, weight, age, and state. Some states charge flat fees while others use value-based calculations." },
    { question: "Do registration fees decrease over time?", answer: "In states with value-based fees, registration costs decrease as your vehicle depreciates. However, the base fee component remains the same. Some states have flat registration fees that don't change with vehicle age." },
  ],
  formula: "Total Fee = Base Fee + (Assessed Value × Tax Rate) + Weight Fee + Title Fee + Additional Fees",
};
