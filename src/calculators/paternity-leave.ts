import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paternityLeaveCalculator: CalculatorDefinition = {
  slug: "paternity-leave-calculator",
  title: "Paternity Leave Calculator",
  description:
    "Free paternity leave calculator. Estimate your paternity leave duration, pay, and financial impact based on your benefits and salary.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "paternity leave calculator",
    "paternity leave pay",
    "dad leave calculator",
    "father parental leave",
    "FMLA paternity",
  ],
  variants: [
    {
      id: "paternity-leave",
      name: "Paternity Leave Planner",
      description: "Plan your paternity leave dates and finances",
      fields: [
        {
          name: "leaveWeeks",
          label: "Total Leave (weeks)",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 26,
          defaultValue: 4,
        },
        {
          name: "paidWeeks",
          label: "Employer Paid Leave Weeks",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 26,
          defaultValue: 2,
        },
        {
          name: "payPercentage",
          label: "Paid Leave Pay Rate",
          type: "select",
          options: [
            { label: "100% of salary", value: "100" },
            { label: "80% of salary", value: "80" },
            { label: "67% of salary", value: "67" },
            { label: "60% of salary", value: "60" },
            { label: "50% of salary", value: "50" },
          ],
          defaultValue: "100",
        },
        {
          name: "weeklySalary",
          label: "Weekly Gross Salary ($)",
          type: "number",
          placeholder: "e.g. 1500",
          min: 100,
          max: 10000,
        },
        {
          name: "vacationDays",
          label: "Available PTO Days to Use",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 30,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const leaveWeeks = (inputs.leaveWeeks as number) || 4;
        const paidWeeks = (inputs.paidWeeks as number) || 0;
        const payPercentage = parseInt(inputs.payPercentage as string) || 100;
        const weeklySalary = inputs.weeklySalary as number;
        const vacationDays = (inputs.vacationDays as number) || 0;
        if (!weeklySalary) return null;

        const ptoWeeks = vacationDays / 5;
        const totalPaidWeeks = Math.min(ptoWeeks + paidWeeks, leaveWeeks);
        const fullPayWeeks = Math.min(ptoWeeks, leaveWeeks);
        const partialPayWeeks = Math.min(paidWeeks, leaveWeeks - fullPayWeeks);
        const unpaidWeeks = Math.max(0, leaveWeeks - fullPayWeeks - partialPayWeeks);

        const fullPayIncome = fullPayWeeks * weeklySalary;
        const partialPayIncome = partialPayWeeks * weeklySalary * (payPercentage / 100);
        const totalIncome = fullPayIncome + partialPayIncome;
        const normalIncome = leaveWeeks * weeklySalary;
        const incomeLoss = normalIncome - totalIncome;
        const totalLeaveDays = leaveWeeks * 7;

        // Savings recommendation
        const savingsNeeded = unpaidWeeks * weeklySalary;

        return {
          primary: {
            label: "Total Leave Duration",
            value: `${leaveWeeks} weeks (${totalLeaveDays} days)`,
          },
          details: [
            { label: "Full Pay Period (PTO)", value: `${formatNumber(fullPayWeeks, 1)} weeks ($${formatNumber(fullPayIncome, 0)})` },
            { label: `Partial Pay Period (${payPercentage}%)`, value: `${formatNumber(partialPayWeeks, 1)} weeks ($${formatNumber(partialPayIncome, 0)})` },
            { label: "Unpaid Leave Period", value: `${formatNumber(unpaidWeeks, 1)} weeks` },
            { label: "Total Income During Leave", value: `$${formatNumber(totalIncome, 0)}` },
            { label: "Income Reduction", value: `$${formatNumber(incomeLoss, 0)}` },
            { label: "Savings Needed (unpaid weeks)", value: `$${formatNumber(savingsNeeded, 0)}` },
          ],
          note: "Under FMLA, eligible fathers can take up to 12 weeks of unpaid, job-protected leave. Paid paternity leave varies by employer: average is 1-4 weeks, with tech companies offering 6-16 weeks. States with paid family leave (CA, NJ, NY, WA, MA, CT, OR, CO, MD) cover fathers too.",
        };
      },
    },
  ],
  relatedSlugs: ["maternity-leave-calculator", "childcare-cost-calculator", "savings-goal-calculator"],
  faq: [
    {
      question: "How long is paternity leave?",
      answer:
        "Paternity leave varies widely. FMLA provides 12 weeks unpaid (if eligible). Average employer-paid paternity leave is 1-4 weeks. Tech companies may offer 6-16 weeks. States with paid family leave programs typically provide 6-12 weeks at partial pay for all parents, including fathers.",
    },
    {
      question: "Are fathers eligible for FMLA leave?",
      answer:
        "Yes, FMLA is gender-neutral. Fathers who work for a covered employer (50+ employees), have worked there 12+ months, and have logged 1,250+ hours in the past year are eligible for up to 12 weeks of unpaid, job-protected leave within the first year of their child's birth or adoption.",
    },
    {
      question: "When should fathers take paternity leave?",
      answer:
        "Most fathers take leave starting at the birth/adoption date, but FMLA allows leave any time within the first 12 months. Some fathers split their leave: taking a few weeks at birth and saving the rest for later. Research shows fathers who take leave bond better with their babies and support their partner's recovery.",
    },
  ],
  formula:
    "Total Income = (PTO Weeks × Salary) + (Paid Weeks × Salary × Pay %) | Income Loss = Normal Pay - Total Income | Savings Needed = Unpaid Weeks × Weekly Salary. FMLA: up to 12 weeks unpaid (federal).",
};
