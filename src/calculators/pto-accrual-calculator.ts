import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ptoAccrualCalculator: CalculatorDefinition = {
  slug: "pto-accrual-calculator",
  title: "PTO Accrual Calculator",
  description: "Calculate paid time off hours accrued over a period.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["PTO","accrual","vacation","time off"],
  variants: [{
    id: "standard",
    name: "PTO Accrual",
    description: "Calculate paid time off hours accrued over a period.",
    fields: [
      { name: "annualPTODays", label: "Annual PTO Days", type: "number", min: 1, max: 60, defaultValue: 15 },
      { name: "monthsWorked", label: "Months Worked", type: "number", min: 1, max: 12, defaultValue: 6 },
      { name: "hoursPerDay", label: "Hours Per Work Day", type: "number", min: 4, max: 12, defaultValue: 8 },
      { name: "hourlyRate", label: "Hourly Rate ($)", type: "number", min: 7, max: 200, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const annualPTODays = inputs.annualPTODays as number;
    const monthsWorked = inputs.monthsWorked as number;
    const hoursPerDay = inputs.hoursPerDay as number;
    const hourlyRate = inputs.hourlyRate as number;
    const monthlyAccrual = annualPTODays / 12;
    const daysAccrued = monthlyAccrual * monthsWorked;
    const hoursAccrued = daysAccrued * hoursPerDay;
    const ptoValue = hoursAccrued * hourlyRate;
    return { primary: { label: "PTO Hours Accrued", value: formatNumber(hoursAccrued) + " hours" }, details: [{ label: "Days Accrued", value: formatNumber(daysAccrued) + " days" }, { label: "Monthly Accrual Rate", value: formatNumber(monthlyAccrual) + " days/month" }, { label: "PTO Dollar Value", value: "$" + formatNumber(ptoValue) }] };
  },
  }],
  relatedSlugs: ["severance-pay-calculator","absenteeism-cost-calculator","shift-differential-calculator"],
  faq: [
    { question: "How is PTO accrual typically calculated?", answer: "Most companies divide annual PTO by 12 months or 26 pay periods." },
    { question: "Do unused PTO hours roll over?", answer: "It depends on company policy; some cap rollovers while others pay out." },
    { question: "What is the average PTO in the United States?", answer: "The average is about 10 to 15 days per year for full-time workers." },
  ],
  formula: "HoursAccrued = (AnnualPTODays / 12) * MonthsWorked * HoursPerDay",
};
