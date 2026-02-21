import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const minimumWageCalculator: CalculatorDefinition = {
  slug: "minimum-wage-calculator",
  title: "Minimum Wage Calculator",
  description: "Free minimum wage calculator. Calculate annual, monthly, and weekly earnings at minimum wage rates by state. Compare federal vs. state minimum wages.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["minimum wage calculator", "minimum wage by state", "minimum wage salary", "living wage calculator", "hourly wage calculator"],
  variants: [
    {
      id: "minimum-wage",
      name: "Minimum Wage Earnings",
      description: "Calculate earnings at minimum wage for different states and hours worked",
      fields: [
        { name: "state", label: "State / Rate", type: "select", options: [
          { label: "Federal ($7.25)", value: "7.25" },
          { label: "California ($16.00)", value: "16.00" },
          { label: "New York ($15.00)", value: "15.00" },
          { label: "Washington ($16.28)", value: "16.28" },
          { label: "Massachusetts ($15.00)", value: "15.00" },
          { label: "Arizona ($14.35)", value: "14.35" },
          { label: "Colorado ($14.42)", value: "14.42" },
          { label: "Connecticut ($15.69)", value: "15.69" },
          { label: "Florida ($13.00)", value: "13.00" },
          { label: "Illinois ($14.00)", value: "14.00" },
          { label: "New Jersey ($15.13)", value: "15.13" },
          { label: "Oregon ($14.70)", value: "14.70" },
          { label: "Texas ($7.25)", value: "7.25" },
          { label: "Custom Rate", value: "custom" },
        ], defaultValue: "7.25" },
        { name: "customRate", label: "Custom Hourly Rate (if selected)", type: "number", placeholder: "e.g. 12.50", prefix: "$", defaultValue: 0 },
        { name: "hoursPerWeek", label: "Hours Per Week", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "weeksPerYear", label: "Weeks Per Year", type: "number", placeholder: "e.g. 52", defaultValue: 52 },
      ],
      calculate: (inputs) => {
        const stateRate = inputs.state as string;
        const customRate = inputs.customRate as number;
        const hoursPerWeek = (inputs.hoursPerWeek as number) || 40;
        const weeksPerYear = (inputs.weeksPerYear as number) || 52;

        const hourlyRate = stateRate === "custom" ? customRate : parseFloat(stateRate);
        if (!hourlyRate || hourlyRate <= 0) return null;

        const weeklyPay = hourlyRate * hoursPerWeek;
        const biweeklyPay = weeklyPay * 2;
        const monthlyPay = (weeklyPay * weeksPerYear) / 12;
        const annualPay = weeklyPay * weeksPerYear;

        const federalMin = 7.25;
        const federalAnnual = federalMin * hoursPerWeek * weeksPerYear;
        const difference = annualPay - federalAnnual;

        return {
          primary: { label: "Annual Earnings", value: `$${formatNumber(annualPay)}` },
          details: [
            { label: "Hourly rate", value: `$${formatNumber(hourlyRate, 2)}` },
            { label: "Weekly pay", value: `$${formatNumber(weeklyPay)}` },
            { label: "Bi-weekly pay", value: `$${formatNumber(biweeklyPay)}` },
            { label: "Monthly pay", value: `$${formatNumber(monthlyPay)}` },
            { label: "Hours per year", value: formatNumber(hoursPerWeek * weeksPerYear, 0) },
            { label: "Difference vs. federal minimum", value: `$${formatNumber(difference)}/year` },
          ],
          note: "Minimum wage rates shown are approximate and subject to change. Some cities have higher minimum wages than the state. Tipped employees may have lower minimum wages. Always verify current rates with your state's labor department.",
        };
      },
    },
  ],
  relatedSlugs: ["overtime-law-calculator", "paycheck-calculator", "salary-calculator"],
  faq: [
    { question: "What is the federal minimum wage?", answer: "The federal minimum wage has been $7.25 per hour since July 2009. However, 30+ states and many cities have set higher minimum wages. Employers must pay whichever is higher - the federal, state, or local minimum wage." },
    { question: "Which state has the highest minimum wage?", answer: "Washington state has one of the highest state minimum wages at $16.28/hour. California follows at $16.00/hour. Some cities like Seattle, San Francisco, and New York City have even higher local minimum wages." },
    { question: "Do all workers earn minimum wage?", answer: "Most workers are covered, but there are exceptions. Tipped employees can be paid as low as $2.13/hour federally (tips must bring them to minimum wage). Some exemptions exist for young workers, student workers, and workers with disabilities under certain programs." },
  ],
  formula: "Weekly Pay = Hourly Rate × Hours/Week. Monthly Pay = Weekly Pay × 52 / 12. Annual Pay = Weekly Pay × Weeks/Year.",
};
