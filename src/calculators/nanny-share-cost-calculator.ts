import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nannyShareCostCalculator: CalculatorDefinition = {
  slug: "nanny-share-cost-calculator",
  title: "Nanny Share Cost Calculator",
  description: "Calculate the cost savings of a nanny share arrangement where two or more families split a nanny salary and related expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["nanny share","shared nanny cost","nanny split cost","childcare sharing","nanny share savings"],
  variants: [{
    id: "standard",
    name: "Nanny Share Cost",
    description: "Calculate the cost savings of a nanny share arrangement where two or more families split a nanny salary and related expenses.",
    fields: [
      { name: "nannyHourlyRate", label: "Nanny Hourly Rate ($)", type: "number", min: 15, max: 40, defaultValue: 22 },
      { name: "hoursPerWeek", label: "Hours Per Week", type: "number", min: 20, max: 50, defaultValue: 40 },
      { name: "families", label: "Number of Families Sharing", type: "number", min: 2, max: 4, defaultValue: 2 },
      { name: "shareBonus", label: "Nanny Share Rate Increase (%)", type: "number", min: 0, max: 50, defaultValue: 20 },
      { name: "payrollTax", label: "Payroll Tax and Benefits (%)", type: "number", min: 5, max: 20, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const nannyHourlyRate = inputs.nannyHourlyRate as number;
    const hoursPerWeek = inputs.hoursPerWeek as number;
    const families = inputs.families as number;
    const shareBonus = inputs.shareBonus as number;
    const payrollTax = inputs.payrollTax as number;
    const adjustedRate = nannyHourlyRate * (1 + shareBonus / 100);
    const weeklyTotal = adjustedRate * hoursPerWeek;
    const weeklyWithTax = weeklyTotal * (1 + payrollTax / 100);
    const yourWeekly = weeklyWithTax / families;
    const yourMonthly = yourWeekly * 4.33;
    const soloMonthly = nannyHourlyRate * hoursPerWeek * (1 + payrollTax / 100) * 4.33;
    const monthlySavings = soloMonthly - yourMonthly;
    const annualSavings = monthlySavings * 12;
    return {
      primary: { label: "Your Monthly Cost", value: "$" + formatNumber(Math.round(yourMonthly)) },
      details: [
        { label: "Solo Nanny Monthly Cost", value: "$" + formatNumber(Math.round(soloMonthly)) },
        { label: "Monthly Savings vs Solo", value: "$" + formatNumber(Math.round(monthlySavings)) },
        { label: "Annual Savings", value: "$" + formatNumber(Math.round(annualSavings)) },
        { label: "Your Weekly Cost", value: "$" + formatNumber(Math.round(yourWeekly)) },
        { label: "Nanny Total Weekly Pay", value: "$" + formatNumber(Math.round(weeklyWithTax)) }
      ]
    };
  },
  }],
  relatedSlugs: ["babysitting-rate-calculator","au-pair-cost-calculator","daycare-waitlist-estimator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Adjusted Rate = Hourly Rate x (1 + Share Bonus%); Your Cost = (Adjusted Rate x Hours x (1 + Tax%)) / Families; Savings = Solo Monthly - Share Monthly",
};
