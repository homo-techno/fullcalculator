import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const maternityLeaveCalculator: CalculatorDefinition = {
  slug: "maternity-leave-calculator",
  title: "Maternity Leave Calculator",
  description:
    "Free maternity leave calculator. Estimate your maternity leave duration, pay, and key dates based on your due date and employer benefits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "maternity leave calculator",
    "maternity leave pay",
    "FMLA leave calculator",
    "maternity leave duration",
    "paid maternity leave",
  ],
  variants: [
    {
      id: "maternity-leave",
      name: "Maternity Leave Planner",
      description: "Plan your maternity leave dates and income",
      fields: [
        {
          name: "leaveWeeks",
          label: "Total Leave (weeks)",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
          max: 52,
          defaultValue: 12,
        },
        {
          name: "paidWeeks",
          label: "Paid Leave Weeks",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
          max: 52,
          defaultValue: 6,
        },
        {
          name: "payPercentage",
          label: "Paid Leave Pay Rate",
          type: "select",
          options: [
            { label: "100% of salary", value: "100" },
            { label: "80% of salary", value: "80" },
            { label: "67% of salary (typical STD)", value: "67" },
            { label: "60% of salary", value: "60" },
            { label: "50% of salary", value: "50" },
          ],
          defaultValue: "67",
        },
        {
          name: "weeklySalary",
          label: "Weekly Gross Salary ($)",
          type: "number",
          placeholder: "e.g. 1200",
          min: 100,
          max: 10000,
        },
        {
          name: "vacationDays",
          label: "Available Vacation/PTO Days",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          max: 40,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const leaveWeeks = (inputs.leaveWeeks as number) || 12;
        const paidWeeks = (inputs.paidWeeks as number) || 0;
        const payPercentage = parseInt(inputs.payPercentage as string) || 67;
        const weeklySalary = inputs.weeklySalary as number;
        const vacationDays = (inputs.vacationDays as number) || 0;
        if (!weeklySalary) return null;

        const ptoWeeks = vacationDays / 5;
        const fullPayWeeks = ptoWeeks; // PTO used first at full pay
        const partialPayWeeks = Math.max(0, paidWeeks - fullPayWeeks);
        const unpaidWeeks = Math.max(0, leaveWeeks - paidWeeks - fullPayWeeks);

        const fullPayIncome = fullPayWeeks * weeklySalary;
        const partialPayIncome = partialPayWeeks * weeklySalary * (payPercentage / 100);
        const totalIncome = fullPayIncome + partialPayIncome;
        const normalIncome = leaveWeeks * weeklySalary;
        const incomeLoss = normalIncome - totalIncome;

        const dailySalary = weeklySalary / 5;
        const totalLeaveDays = leaveWeeks * 7;

        return {
          primary: {
            label: "Total Leave Duration",
            value: `${leaveWeeks} weeks (${totalLeaveDays} days)`,
          },
          details: [
            { label: "Full Pay Period (PTO)", value: `${formatNumber(fullPayWeeks, 1)} weeks ($${formatNumber(fullPayIncome, 0)})` },
            { label: `Partial Pay Period (${payPercentage}%)`, value: `${formatNumber(partialPayWeeks, 1)} weeks ($${formatNumber(partialPayIncome, 0)})` },
            { label: "Unpaid Leave Period", value: `${formatNumber(unpaidWeeks, 1)} weeks ($0)` },
            { label: "Total Income During Leave", value: `$${formatNumber(totalIncome, 0)}` },
            { label: "Normal Income (same period)", value: `$${formatNumber(normalIncome, 0)}` },
            { label: "Income Reduction", value: `$${formatNumber(incomeLoss, 0)} (${formatNumber((incomeLoss / normalIncome) * 100, 1)}% less)` },
            { label: "Monthly Income During Leave", value: `~$${formatNumber(totalIncome / (leaveWeeks / 4.33), 0)}/month` },
          ],
          note: "FMLA provides up to 12 weeks of unpaid, job-protected leave for eligible employees. Paid leave varies by employer and state. Some states (CA, NJ, NY, WA, MA, CT, OR, CO, MD) offer paid family leave programs. Check your specific employer policy and state laws.",
        };
      },
    },
  ],
  relatedSlugs: ["paternity-leave-calculator", "childcare-cost-calculator", "savings-goal-calculator"],
  faq: [
    {
      question: "How long is maternity leave in the US?",
      answer:
        "There is no federal paid maternity leave in the US. FMLA provides 12 weeks of unpaid, job-protected leave for eligible employees. Actual paid leave depends on your employer: average is 8-12 weeks, with some companies offering up to 16-20 weeks. Some states have paid family leave programs providing 6-12 weeks at partial pay.",
    },
    {
      question: "What is short-term disability for maternity?",
      answer:
        "Short-term disability (STD) insurance typically covers 6 weeks for vaginal delivery and 8 weeks for C-section at 50-67% of salary. There is usually a 1-2 week waiting period. STD covers the medical recovery period only, not additional bonding time. Check if your employer offers STD or if you can purchase it.",
    },
    {
      question: "Can I use vacation time for maternity leave?",
      answer:
        "Yes, many employees use accumulated PTO/vacation days to supplement maternity leave, especially to cover the gap between paid and total leave. Using PTO first provides full pay. Some employers require using PTO before FMLA, while others allow you to save it for after returning. Check your employer's policy.",
    },
  ],
  formula:
    "Total Income = (PTO Weeks × Weekly Salary) + (Paid Leave Weeks × Weekly Salary × Pay %) | Income Loss = Normal Income - Total Income | FMLA: 12 weeks unpaid job-protected leave (federal). State programs vary.",
};
