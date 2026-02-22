import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const billableHoursCalculator: CalculatorDefinition = {
  slug: "billable-hours-calculator",
  title: "Billable Hours Calculator",
  description: "Free billable hours calculator. Track billable vs non-billable time, calculate revenue, and determine effective hourly rates for freelancers and consultants.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["billable hours calculator", "freelance hours calculator", "consultant billing", "billable time tracker", "hourly billing calculator"],
  variants: [
    {
      id: "weekly",
      name: "Weekly Billable Hours",
      description: "Calculate weekly billable hours and revenue",
      fields: [
        { name: "totalHours", label: "Total Hours Worked", type: "number", placeholder: "e.g. 40", suffix: "hours" },
        { name: "billableHours", label: "Billable Hours", type: "number", placeholder: "e.g. 30", suffix: "hours" },
        { name: "hourlyRate", label: "Hourly Rate", type: "number", placeholder: "e.g. 150", prefix: "$" },
      ],
      calculate: (inputs) => {
        const total = inputs.totalHours as number;
        const billable = inputs.billableHours as number;
        const rate = inputs.hourlyRate as number;
        if (!total || !billable || !rate) return null;

        const nonBillable = total - billable;
        const utilization = (billable / total) * 100;
        const weeklyRevenue = billable * rate;
        const effectiveRate = weeklyRevenue / total;
        const monthlyRevenue = weeklyRevenue * 4.33;
        const annualRevenue = weeklyRevenue * 52;

        return {
          primary: { label: "Weekly Revenue", value: `$${formatNumber(weeklyRevenue)}` },
          details: [
            { label: "Utilization rate", value: `${formatNumber(utilization, 1)}%` },
            { label: "Effective hourly rate", value: `$${formatNumber(effectiveRate)}` },
            { label: "Non-billable hours", value: `${formatNumber(nonBillable, 1)} hours` },
            { label: "Monthly revenue (est.)", value: `$${formatNumber(monthlyRevenue)}` },
            { label: "Annual revenue (est.)", value: `$${formatNumber(annualRevenue)}` },
          ],
        };
      },
    },
    {
      id: "target",
      name: "Target Revenue",
      description: "Calculate hours needed to reach revenue target",
      fields: [
        { name: "targetRevenue", label: "Target Monthly Revenue", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "hourlyRate", label: "Hourly Rate", type: "number", placeholder: "e.g. 150", prefix: "$" },
        { name: "utilizationPct", label: "Expected Utilization %", type: "number", placeholder: "e.g. 75", suffix: "%", defaultValue: 75 },
      ],
      calculate: (inputs) => {
        const target = inputs.targetRevenue as number;
        const rate = inputs.hourlyRate as number;
        const util = (inputs.utilizationPct as number) || 75;
        if (!target || !rate) return null;

        const billableHoursNeeded = target / rate;
        const totalHoursNeeded = billableHoursNeeded / (util / 100);
        const weeklyTotal = totalHoursNeeded / 4.33;
        const dailyTotal = weeklyTotal / 5;

        return {
          primary: { label: "Billable Hours Needed", value: `${formatNumber(billableHoursNeeded, 1)}/month` },
          details: [
            { label: "Total hours (incl. non-billable)", value: `${formatNumber(totalHoursNeeded, 1)}/month` },
            { label: "Weekly hours needed", value: `${formatNumber(weeklyTotal, 1)} hours` },
            { label: "Daily hours needed", value: `${formatNumber(dailyTotal, 1)} hours` },
            { label: "Annual revenue at target", value: `$${formatNumber(target * 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "time-card-calculator", "roi-calculator"],
  faq: [
    { question: "What is a good billable utilization rate?", answer: "For freelancers and consultants, a utilization rate of 60-80% is typical. The remaining time covers admin, marketing, learning, and business development. Top performers may reach 80-85%, but 100% is unsustainable." },
    { question: "How do I track billable hours?", answer: "Use time-tracking tools like Toggl, Harvest, or Clockify. Start a timer when you begin billable work and stop when switching to non-billable tasks. Review weekly to ensure accuracy before invoicing." },
  ],
  formula: "Revenue = Billable Hours x Rate | Utilization = (Billable Hours / Total Hours) x 100 | Effective Rate = Revenue / Total Hours",
};
