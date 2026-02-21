import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tipPoolCalculator: CalculatorDefinition = {
  slug: "tip-pool-calculator",
  title: "Tip Pool Calculator",
  description:
    "Free tip pool calculator. Distribute pooled tips proportionally among staff based on hours worked for fair tip sharing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tip pool", "tip sharing", "gratuity", "tip distribution", "restaurant tips"],
  variants: [
    {
      id: "proportional",
      name: "Proportional by Hours",
      fields: [
        { name: "totalTips", label: "Total Tips ($)", type: "number", placeholder: "e.g. 500" },
        { name: "workerHours", label: "Hours per Worker (comma-separated)", type: "text" as "number", placeholder: "e.g. 8, 6, 7, 5, 8" },
      ],
      calculate: (inputs) => {
        const totalTips = inputs.totalTips as number;
        const hoursStr = inputs.workerHours as string || "";

        if (!totalTips) return null;

        const hours = hoursStr.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
        if (hours.length === 0) return null;

        const totalHours = hours.reduce((sum, h) => sum + h, 0);
        const tipPerHour = totalTips / totalHours;

        const distributions = hours.map((h, idx) => ({
          label: `Worker ${idx + 1} (${formatNumber(h, 1)} hrs)`,
          value: `$${formatNumber(h * tipPerHour, 2)}`,
        }));

        return {
          primary: { label: "Tip Per Hour", value: `$${formatNumber(tipPerHour, 2)}` },
          details: [
            { label: "Total Tips", value: `$${formatNumber(totalTips, 2)}` },
            { label: "Total Hours", value: formatNumber(totalHours, 1) },
            { label: "Number of Workers", value: `${hours.length}` },
            ...distributions,
          ],
        };
      },
    },
    {
      id: "equal",
      name: "Equal Split",
      fields: [
        { name: "totalTips", label: "Total Tips ($)", type: "number", placeholder: "e.g. 500" },
        { name: "numberOfWorkers", label: "Number of Workers", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const totalTips = inputs.totalTips as number;
        const numberOfWorkers = inputs.numberOfWorkers as number;

        if (!totalTips || !numberOfWorkers) return null;

        const tipPerWorker = totalTips / numberOfWorkers;
        const dailyTipEstimate = tipPerWorker;
        const weeklyEstimate = dailyTipEstimate * 5;
        const monthlyEstimate = weeklyEstimate * 4.33;

        return {
          primary: { label: "Tip Per Worker", value: `$${formatNumber(tipPerWorker, 2)}` },
          details: [
            { label: "Total Tips", value: `$${formatNumber(totalTips, 2)}` },
            { label: "Number of Workers", value: `${numberOfWorkers}` },
            { label: "Est. Weekly (5 days)", value: `$${formatNumber(weeklyEstimate, 2)}` },
            { label: "Est. Monthly", value: `$${formatNumber(monthlyEstimate, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["budget-calculator", "payroll-tax-calculator", "tax-bracket-calculator"],
  faq: [
    { question: "How does proportional tip pooling work?", answer: "Proportional tip pooling divides the total tips based on each worker's hours. The tip per hour is calculated first, then each worker receives tips proportional to their hours worked." },
    { question: "Are pooled tips taxable?", answer: "Yes, all tips including pooled tips are taxable income. Employees must report tip income, and employers are required to withhold taxes on reported tips." },
  ],
  formula: "Tip Per Hour = Total Tips / Total Hours; Worker Tip = Worker Hours × Tip Per Hour",
};
