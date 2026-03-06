import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const longTermCareNeedsCalculator: CalculatorDefinition = {
  slug: "long-term-care-needs-calculator",
  title: "Long-Term Care Needs Calculator",
  description: "Estimate the potential cost of long-term care services based on your age, health risk factors, and the type and duration of care you may need.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["long-term care cost","LTC needs estimator","nursing care planning","long-term care planning"],
  variants: [{
    id: "standard",
    name: "Long-Term Care Needs",
    description: "Estimate the potential cost of long-term care services based on your age, health risk factors, and the type and duration of care you may need.",
    fields: [
      { name: "currentAge", label: "Current Age", type: "number", min: 40, max: 80, defaultValue: 60 },
      { name: "careType", label: "Expected Care Type", type: "select", options: [{ value: "1", label: "Home Health Aide" }, { value: "2", label: "Assisted Living Facility" }, { value: "3", label: "Nursing Home (Semi-Private)" }, { value: "4", label: "Nursing Home (Private Room)" }], defaultValue: "2" },
      { name: "expectedDuration", label: "Expected Duration of Care (Years)", type: "number", min: 1, max: 10, defaultValue: 3 },
      { name: "yearsUntilNeed", label: "Estimated Years Until Care Needed", type: "number", min: 0, max: 40, defaultValue: 20 },
      { name: "inflationRate", label: "LTC Cost Inflation (%)", type: "number", min: 2, max: 8, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const age = inputs.currentAge as number;
    const careType = parseInt(inputs.careType as string);
    const duration = inputs.expectedDuration as number;
    const yearsUntil = inputs.yearsUntilNeed as number;
    const inflation = inputs.inflationRate as number / 100;
    const currentCosts = { 1: 62000, 2: 64200, 3: 100375, 4: 116800 };
    const baseCost = currentCosts[careType] || 64200;
    const futureCost = baseCost * Math.pow(1 + inflation, yearsUntil);
    let totalCost = 0;
    for (let y = 0; y < duration; y++) {
      totalCost += futureCost * Math.pow(1 + inflation, y);
    }
    const monthlyCostAtStart = futureCost / 12;
    const needAge = age + yearsUntil;
    return {
      primary: { label: "Estimated Total LTC Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Annual Cost at Start of Care", value: "$" + formatNumber(Math.round(futureCost)) },
        { label: "Monthly Cost at Start of Care", value: "$" + formatNumber(Math.round(monthlyCostAtStart)) },
        { label: "Current Annual Cost (Today)", value: "$" + formatNumber(Math.round(baseCost)) },
        { label: "Estimated Age at Start of Care", value: formatNumber(needAge) },
        { label: "Care Duration", value: formatNumber(duration) + " years" }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-healthcare-cost-calculator","home-care-cost-estimator-calculator"],
  faq: [
    { question: "What is the average length of long-term care?", answer: "The average person who reaches age 65 has about a 70 percent chance of needing long-term care. Women need care for an average of 3.7 years and men for about 2.2 years, though some individuals may need care for much longer." },
    { question: "How much does long-term care cost today?", answer: "National median costs in 2023 are approximately $62,000 per year for a home health aide, $64,200 for assisted living, $100,375 for a semi-private nursing home room, and $116,800 for a private nursing home room." },
    { question: "What are the options to pay for long-term care?", answer: "Options include long-term care insurance, personal savings, Medicaid (for those who qualify), hybrid life insurance with LTC riders, Health Savings Accounts, Veterans benefits, and reverse mortgages. Medicare covers only limited short-term skilled care." },
  ],
  formula: "Future Annual Cost = Current Cost x (1 + Inflation)^Years Until Need
Total Cost = Sum of Future Cost x (1 + Inflation)^y for each year of care
Monthly Cost = Annual Cost / 12",
};
