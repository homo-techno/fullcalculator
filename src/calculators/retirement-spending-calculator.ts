import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const retirementSpendingCalculator: CalculatorDefinition = {
  slug: "retirement-spending-calculator",
  title: "Retirement Spending Calculator",
  description: "Project your total retirement spending needs by category including housing, healthcare, food, transportation, and leisure, adjusted for inflation over your retirement years.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["retirement spending","retirement budget","retirement expenses calculator","spending in retirement"],
  variants: [{
    id: "standard",
    name: "Retirement Spending",
    description: "Project your total retirement spending needs by category including housing, healthcare, food, transportation, and leisure, adjusted for inflation over your retirement years.",
    fields: [
      { name: "monthlyHousing", label: "Monthly Housing ($)", type: "number", min: 0, max: 20000, defaultValue: 1500 },
      { name: "monthlyHealthcare", label: "Monthly Healthcare ($)", type: "number", min: 0, max: 10000, defaultValue: 600 },
      { name: "monthlyFood", label: "Monthly Food ($)", type: "number", min: 0, max: 5000, defaultValue: 800 },
      { name: "monthlyTransport", label: "Monthly Transportation ($)", type: "number", min: 0, max: 3000, defaultValue: 400 },
      { name: "monthlyLeisure", label: "Monthly Leisure and Travel ($)", type: "number", min: 0, max: 10000, defaultValue: 500 },
      { name: "monthlyOther", label: "Monthly Other Expenses ($)", type: "number", min: 0, max: 10000, defaultValue: 400 },
      { name: "inflationRate", label: "Inflation Rate (%)", type: "number", min: 0, max: 10, defaultValue: 3 },
      { name: "retirementYears", label: "Years in Retirement", type: "number", min: 5, max: 50, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const housing = inputs.monthlyHousing as number;
    const health = inputs.monthlyHealthcare as number;
    const food = inputs.monthlyFood as number;
    const transport = inputs.monthlyTransport as number;
    const leisure = inputs.monthlyLeisure as number;
    const other = inputs.monthlyOther as number;
    const inflation = inputs.inflationRate as number / 100;
    const years = inputs.retirementYears as number;
    const monthlyTotal = housing + health + food + transport + leisure + other;
    const annualTotal = monthlyTotal * 12;
    let totalSpending = 0;
    for (let y = 0; y < years; y++) {
      totalSpending += annualTotal * Math.pow(1 + inflation, y);
    }
    const lastYearSpending = annualTotal * Math.pow(1 + inflation, years - 1);
    const avgAnnual = totalSpending / years;
    return {
      primary: { label: "Total Lifetime Retirement Spending", value: "$" + formatNumber(Math.round(totalSpending)) },
      details: [
        { label: "Monthly Spending (Year 1)", value: "$" + formatNumber(Math.round(monthlyTotal)) },
        { label: "Annual Spending (Year 1)", value: "$" + formatNumber(Math.round(annualTotal)) },
        { label: "Annual Spending (Final Year)", value: "$" + formatNumber(Math.round(lastYearSpending)) },
        { label: "Average Annual Spending", value: "$" + formatNumber(Math.round(avgAnnual)) },
        { label: "Inflation Impact", value: "$" + formatNumber(Math.round(totalSpending - annualTotal * years)) + " over " + formatNumber(years) + " years" }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-income-gap-calculator","retirement-portfolio-withdrawal-calculator"],
  faq: [
    { question: "How much will I spend in retirement?", answer: "Most retirees spend 70 to 80 percent of their pre-retirement income, but this varies widely. Housing and healthcare typically represent the largest categories. Spending often follows a smile pattern: higher early on, declining in middle years, then rising again with increased healthcare needs." },
    { question: "Which expenses increase most in retirement?", answer: "Healthcare costs tend to increase the most, often rising 5 to 7 percent annually. Property taxes, insurance premiums, and long-term care costs also tend to grow faster than general inflation." },
    { question: "Should I plan for the same spending throughout retirement?", answer: "No. Research suggests retirees tend to spend more in the early active years on travel and hobbies, less in the middle quiet years, and more again in later years on healthcare and assistance. A dynamic spending plan is more realistic than assuming flat expenses." },
  ],
  formula: "Monthly Total = Housing + Healthcare + Food + Transport + Leisure + Other
Annual Total = Monthly Total x 12
Year N Spending = Annual Total x (1 + Inflation)^N
Lifetime Total = Sum of all years",
};
