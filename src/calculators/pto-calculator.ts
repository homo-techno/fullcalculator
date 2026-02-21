import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ptoCalculator: CalculatorDefinition = {
  slug: "pto-calculator",
  title: "PTO Calculator",
  description: "Free PTO calculator. Calculate paid time off accrual, vacation balance, and PTO payout value. Track your vacation days.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["PTO calculator", "vacation accrual calculator", "paid time off calculator", "vacation days calculator", "PTO payout calculator"],
  variants: [
    {
      id: "accrual",
      name: "PTO Accrual",
      description: "Calculate PTO accrual based on your accrual rate and schedule",
      fields: [
        { name: "annualPTO", label: "Annual PTO Days", type: "number", placeholder: "e.g. 15" },
        { name: "accrualMethod", label: "Accrual Method", type: "select", options: [
          { label: "Per Pay Period (Bi-weekly, 26)", value: "26" },
          { label: "Per Pay Period (Semi-monthly, 24)", value: "24" },
          { label: "Per Pay Period (Weekly, 52)", value: "52" },
          { label: "Per Month (12)", value: "12" },
        ], defaultValue: "26" },
        { name: "monthsWorked", label: "Months Worked This Year", type: "number", placeholder: "e.g. 6", min: 0, max: 12 },
        { name: "usedDays", label: "PTO Days Used", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const annualDays = inputs.annualPTO as number;
        const periods = parseInt(inputs.accrualMethod as string) || 26;
        const monthsWorked = inputs.monthsWorked as number;
        const used = (inputs.usedDays as number) || 0;
        if (!annualDays || monthsWorked === undefined) return null;
        const accrualPerPeriod = annualDays / periods;
        const periodsWorked = (monthsWorked / 12) * periods;
        const accrued = accrualPerPeriod * periodsWorked;
        const balance = accrued - used;
        const annualHours = annualDays * 8;
        return {
          primary: { label: "Current PTO Balance", value: `${formatNumber(balance, 1)} days` },
          details: [
            { label: "PTO Accrued So Far", value: `${formatNumber(accrued, 1)} days` },
            { label: "PTO Used", value: `${formatNumber(used, 1)} days` },
            { label: "Accrual per Period", value: `${formatNumber(accrualPerPeriod, 2)} days` },
            { label: "Accrual per Period (hours)", value: `${formatNumber(accrualPerPeriod * 8, 2)} hours` },
            { label: "Annual PTO Hours", value: `${formatNumber(annualHours, 0)} hours` },
            { label: "Remaining to Accrue", value: `${formatNumber(annualDays - accrued, 1)} days` },
          ],
        };
      },
    },
    {
      id: "payout",
      name: "PTO Payout Value",
      description: "Calculate the dollar value of your unused PTO balance",
      fields: [
        { name: "unusedDays", label: "Unused PTO Days", type: "number", placeholder: "e.g. 10" },
        { name: "salary", label: "Annual Salary", type: "number", placeholder: "e.g. 75000", prefix: "$" },
        { name: "hoursPerDay", label: "Hours per Work Day", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
      ],
      calculate: (inputs) => {
        const days = inputs.unusedDays as number;
        const salary = inputs.salary as number;
        const hoursPerDay = (inputs.hoursPerDay as number) || 8;
        if (!days || !salary) return null;
        const hourlyRate = salary / 2080;
        const dailyRate = hourlyRate * hoursPerDay;
        const payoutValue = days * dailyRate;
        const totalHours = days * hoursPerDay;
        return {
          primary: { label: "PTO Payout Value", value: `$${formatNumber(payoutValue)}` },
          details: [
            { label: "Unused Days", value: formatNumber(days, 1) },
            { label: "Unused Hours", value: formatNumber(totalHours, 1) },
            { label: "Daily Rate", value: `$${formatNumber(dailyRate)}` },
            { label: "Hourly Rate", value: `$${formatNumber(hourlyRate)}` },
          ],
          note: "PTO payout requirements vary by state. Some states require payout of unused PTO upon termination.",
        };
      },
    },
    {
      id: "comparison",
      name: "PTO Value Comparison",
      description: "Compare PTO benefits between job offers",
      fields: [
        { name: "salaryA", label: "Job A: Annual Salary", type: "number", placeholder: "e.g. 70000", prefix: "$" },
        { name: "ptoA", label: "Job A: PTO Days", type: "number", placeholder: "e.g. 10" },
        { name: "salaryB", label: "Job B: Annual Salary", type: "number", placeholder: "e.g. 65000", prefix: "$" },
        { name: "ptoB", label: "Job B: PTO Days", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const salaryA = inputs.salaryA as number;
        const ptoA = inputs.ptoA as number;
        const salaryB = inputs.salaryB as number;
        const ptoB = inputs.ptoB as number;
        if (!salaryA || !ptoA || !salaryB || !ptoB) return null;
        const dailyRateA = salaryA / 260;
        const dailyRateB = salaryB / 260;
        const ptoValueA = ptoA * dailyRateA;
        const ptoValueB = ptoB * dailyRateB;
        const totalCompA = salaryA + ptoValueA;
        const totalCompB = salaryB + ptoValueB;
        const workDaysA = 260 - ptoA;
        const workDaysB = 260 - ptoB;
        const effectiveDailyA = salaryA / workDaysA;
        const effectiveDailyB = salaryB / workDaysB;
        return {
          primary: { label: "Better Total Value", value: totalCompA >= totalCompB ? "Job A" : "Job B", suffix: `by $${formatNumber(Math.abs(totalCompA - totalCompB))}` },
          details: [
            { label: "Job A: Total Compensation", value: `$${formatNumber(totalCompA)}` },
            { label: "Job B: Total Compensation", value: `$${formatNumber(totalCompB)}` },
            { label: "Job A: PTO Value", value: `$${formatNumber(ptoValueA)}` },
            { label: "Job B: PTO Value", value: `$${formatNumber(ptoValueB)}` },
            { label: "Job A: Effective Daily Rate", value: `$${formatNumber(effectiveDailyA)}` },
            { label: "Job B: Effective Daily Rate", value: `$${formatNumber(effectiveDailyB)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "paycheck-calculator", "sick-leave-calculator"],
  faq: [
    { question: "How is PTO accrual calculated?", answer: "PTO accrues at a rate of Annual PTO Days / Number of Pay Periods. For example, 15 days/year with bi-weekly pay (26 periods) = 0.577 days per paycheck, or about 4.62 hours per pay period." },
    { question: "How much PTO is average in the US?", answer: "The average is 10-15 days for new employees, increasing with tenure. After 1 year: 10-11 days. After 5 years: 15 days. After 10+ years: 20 days. Senior/executive roles often get 20-25+ days." },
    { question: "Do employers have to pay out unused PTO?", answer: "It depends on the state. California, Colorado, Illinois, and others require PTO payout upon termination. Many states follow the employer's written policy. Some states have no payout requirement. Check your state laws and company policy." },
  ],
  formula: "Accrual per Period = Annual PTO Days / Pay Periods | PTO Balance = Accrued - Used | Payout Value = Unused Days × (Annual Salary / 260)",
};
