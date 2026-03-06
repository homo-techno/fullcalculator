import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pensionColaImpactCalculator: CalculatorDefinition = {
  slug: "pension-cola-impact-calculator",
  title: "Pension COLA Impact Calculator",
  description: "Calculate how a cost-of-living adjustment (COLA) affects the real purchasing power of your pension benefit over time compared to a pension without adjustments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pension COLA","cost of living adjustment pension","pension inflation protection","COLA impact retirement"],
  variants: [{
    id: "standard",
    name: "Pension COLA Impact",
    description: "Calculate how a cost-of-living adjustment (COLA) affects the real purchasing power of your pension benefit over time compared to a pension without adjustments.",
    fields: [
      { name: "monthlyPension", label: "Monthly Pension Benefit ($)", type: "number", min: 500, max: 20000, defaultValue: 2500 },
      { name: "colaRate", label: "Annual COLA Rate (%)", type: "number", min: 0, max: 10, defaultValue: 2 },
      { name: "inflationRate", label: "Expected Inflation Rate (%)", type: "number", min: 0, max: 10, defaultValue: 3 },
      { name: "yearsInRetirement", label: "Years in Retirement", type: "number", min: 5, max: 40, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const pension = inputs.monthlyPension as number;
    const cola = inputs.colaRate as number / 100;
    const inflation = inputs.inflationRate as number / 100;
    const years = inputs.yearsInRetirement as number;
    const pensionWithCola = pension * Math.pow(1 + cola, years);
    const purchasingPowerWithCola = pensionWithCola / Math.pow(1 + inflation, years);
    const purchasingPowerNoCola = pension / Math.pow(1 + inflation, years);
    let totalWithCola = 0;
    let totalNoCola = 0;
    for (let y = 0; y < years; y++) {
      totalWithCola += pension * Math.pow(1 + cola, y) * 12;
      totalNoCola += pension * 12;
    }
    const extraFromCola = totalWithCola - totalNoCola;
    const realValueLossNoCola = pension - purchasingPowerNoCola;
    return {
      primary: { label: "Extra Lifetime Income from COLA", value: "$" + formatNumber(Math.round(extraFromCola)) },
      details: [
        { label: "Monthly Pension After " + formatNumber(years) + " Years", value: "$" + formatNumber(Math.round(pensionWithCola)) },
        { label: "Real Purchasing Power (with COLA)", value: "$" + formatNumber(Math.round(purchasingPowerWithCola)) + "/mo" },
        { label: "Real Purchasing Power (no COLA)", value: "$" + formatNumber(Math.round(purchasingPowerNoCola)) + "/mo" },
        { label: "Total Lifetime Pension (with COLA)", value: "$" + formatNumber(Math.round(totalWithCola)) },
        { label: "Total Lifetime Pension (no COLA)", value: "$" + formatNumber(Math.round(totalNoCola)) }
      ]
    };
  },
  }],
  relatedSlugs: ["pension-benefit-estimator-calculator","retirement-income-gap-calculator"],
  faq: [
    { question: "What is a pension COLA?", answer: "A pension Cost-of-Living Adjustment (COLA) is an annual increase to your pension payment, typically based on inflation measures like the CPI. It helps maintain your purchasing power as prices rise over time." },
    { question: "Do all pensions have COLA adjustments?", answer: "No. Many private pensions do not include COLA provisions. Government pensions, Social Security, and military pensions typically include some form of COLA. If your pension lacks COLA, you need to plan for inflation eroding your benefit over time." },
    { question: "How much does inflation erode a fixed pension?", answer: "At 3 percent annual inflation, a fixed pension loses about 26 percent of its purchasing power in 10 years and nearly 53 percent in 25 years. A $2,500 monthly pension would feel like only about $1,180 in todays dollars after 25 years." },
  ],
  formula: "Pension After N Years = Monthly Pension x (1 + COLA)^N; Real Value = Nominal Value / (1 + Inflation)^N; Total COLA Benefit = Sum of COLA-adjusted payments - Sum of fixed payments",
};
