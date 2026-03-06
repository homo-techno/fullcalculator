import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementHealthcareCostCalculator: CalculatorDefinition = {
  slug: "retirement-healthcare-cost-calculator",
  title: "Retirement Healthcare Cost Calculator",
  description: "Estimate total out-of-pocket healthcare costs throughout retirement including Medicare premiums, supplemental insurance, prescriptions, and dental and vision expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement healthcare cost","healthcare cost in retirement","medical costs retirement","retirement medical expenses"],
  variants: [{
    id: "standard",
    name: "Retirement Healthcare Cost",
    description: "Estimate total out-of-pocket healthcare costs throughout retirement including Medicare premiums, supplemental insurance, prescriptions, and dental and vision expenses.",
    fields: [
      { name: "currentAge", label: "Current Age", type: "number", min: 50, max: 80, defaultValue: 65 },
      { name: "retirementAge", label: "Retirement Age", type: "number", min: 55, max: 80, defaultValue: 65 },
      { name: "lifeExpectancy", label: "Life Expectancy", type: "number", min: 70, max: 100, defaultValue: 85 },
      { name: "monthlyMedicare", label: "Monthly Medicare Premium ($)", type: "number", min: 100, max: 1000, defaultValue: 175 },
      { name: "monthlySupplemental", label: "Monthly Supplemental Insurance ($)", type: "number", min: 0, max: 500, defaultValue: 150 },
      { name: "annualOutOfPocket", label: "Annual Out-of-Pocket Costs ($)", type: "number", min: 0, max: 50000, defaultValue: 3000 },
      { name: "inflationRate", label: "Healthcare Inflation Rate (%)", type: "number", min: 0, max: 15, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const currentAge = inputs.currentAge as number;
    const retireAge = inputs.retirementAge as number;
    const lifeExp = inputs.lifeExpectancy as number;
    const medicare = inputs.monthlyMedicare as number;
    const supplemental = inputs.monthlySupplemental as number;
    const oop = inputs.annualOutOfPocket as number;
    const inflation = inputs.inflationRate as number / 100;
    const yearsInRetirement = Math.max(0, lifeExp - retireAge);
    const yearsUntilRetire = Math.max(0, retireAge - currentAge);
    let totalCost = 0;
    for (let y = 0; y < yearsInRetirement; y++) {
      const yearCost = ((medicare + supplemental) * 12 + oop) * Math.pow(1 + inflation, yearsUntilRetire + y);
      totalCost += yearCost;
    }
    const firstYearCost = ((medicare + supplemental) * 12 + oop) * Math.pow(1 + inflation, yearsUntilRetire);
    const avgAnnualCost = yearsInRetirement > 0 ? totalCost / yearsInRetirement : 0;
    return {
      primary: { label: "Total Healthcare Cost in Retirement", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "First Year Cost", value: "$" + formatNumber(Math.round(firstYearCost)) },
        { label: "Average Annual Cost", value: "$" + formatNumber(Math.round(avgAnnualCost)) },
        { label: "Years in Retirement", value: formatNumber(yearsInRetirement) },
        { label: "Monthly Cost at Start", value: "$" + formatNumber(Math.round(firstYearCost / 12)) }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-income-gap-calculator","retirement-tax-calculator"],
  faq: [
    { question: "How much should I budget for healthcare in retirement?", answer: "Fidelity estimates the average 65-year-old couple retiring in 2023 will need approximately $315,000 for healthcare costs throughout retirement. Individual needs vary based on health status, location, and coverage choices." },
    { question: "Does Medicare cover all healthcare costs?", answer: "No. Medicare typically covers about 60 percent of healthcare expenses. You are still responsible for premiums, deductibles, copays, coinsurance, and services not covered like most dental, vision, hearing, and long-term care." },
    { question: "Why use a 5 percent healthcare inflation rate?", answer: "Healthcare costs have historically risen faster than general inflation, averaging 5 to 7 percent annually over the past two decades. Using a higher rate provides a more realistic long-term projection." },
  ],
  formula: "Year Cost = (Monthly Premiums x 12 + Annual Out-of-Pocket) x (1 + Inflation)^Year
Total = Sum of all Year Costs over retirement period",
};
