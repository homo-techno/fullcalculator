import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const maternityLeavePayCalculator: CalculatorDefinition = {
  slug: "maternity-leave-pay-calculator",
  title: "Maternity Leave Pay Calculator",
  description: "Calculate your expected income during maternity leave based on employer benefits, state disability insurance, and savings to plan ahead financially.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["maternity leave pay","maternity benefits","parental leave income","pregnancy leave calculator","paid family leave"],
  variants: [{
    id: "standard",
    name: "Maternity Leave Pay",
    description: "Calculate your expected income during maternity leave based on employer benefits, state disability insurance, and savings to plan ahead financially.",
    fields: [
      { name: "weeklySalary", label: "Weekly Gross Salary ($)", type: "number", min: 200, max: 10000, defaultValue: 1200 },
      { name: "paidWeeks", label: "Employer Paid Leave (Weeks)", type: "number", min: 0, max: 26, defaultValue: 6 },
      { name: "paidPercent", label: "Employer Pay Rate (%)", type: "number", min: 0, max: 100, defaultValue: 100 },
      { name: "stateWeeks", label: "State Disability Weeks", type: "number", min: 0, max: 26, defaultValue: 6 },
      { name: "statePercent", label: "State Disability Rate (%)", type: "number", min: 0, max: 80, defaultValue: 60 },
      { name: "unpaidWeeks", label: "Unpaid Leave Weeks", type: "number", min: 0, max: 26, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const weeklySalary = inputs.weeklySalary as number;
    const paidWeeks = inputs.paidWeeks as number;
    const paidPercent = inputs.paidPercent as number;
    const stateWeeks = inputs.stateWeeks as number;
    const statePercent = inputs.statePercent as number;
    const unpaidWeeks = inputs.unpaidWeeks as number;
    const employerPay = weeklySalary * (paidPercent / 100) * paidWeeks;
    const statePay = weeklySalary * (statePercent / 100) * stateWeeks;
    const totalLeaveWeeks = paidWeeks + stateWeeks + unpaidWeeks;
    const totalIncome = employerPay + statePay;
    const normalIncome = weeklySalary * totalLeaveWeeks;
    const incomeGap = normalIncome - totalIncome;
    const avgWeeklyDuringLeave = totalLeaveWeeks > 0 ? totalIncome / totalLeaveWeeks : 0;
    return {
      primary: { label: "Total Leave Income", value: "$" + formatNumber(Math.round(totalIncome)) },
      details: [
        { label: "Employer Paid Portion", value: "$" + formatNumber(Math.round(employerPay)) },
        { label: "State Disability Portion", value: "$" + formatNumber(Math.round(statePay)) },
        { label: "Total Leave Duration", value: formatNumber(totalLeaveWeeks) + " weeks" },
        { label: "Income Gap vs Normal Pay", value: "$" + formatNumber(Math.round(incomeGap)) },
        { label: "Average Weekly During Leave", value: "$" + formatNumber(Math.round(avgWeeklyDuringLeave)) }
      ]
    };
  },
  }],
  relatedSlugs: ["baby-formula-cost-calculator","nursery-setup-cost-calculator","family-emergency-fund-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Employer Pay = Weekly Salary x Paid% x Paid Weeks
State Pay = Weekly Salary x State% x State Weeks
Income Gap = (Weekly Salary x Total Weeks) - Total Income",
};
