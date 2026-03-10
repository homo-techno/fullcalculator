import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const taskrabbitPricingCalculator: CalculatorDefinition = {
  slug: "taskrabbit-pricing-calculator",
  title: "TaskRabbit Pricing Calculator",
  description:
    "Calculate your TaskRabbit hourly rate and net earnings after the 15% service fee. Set competitive rates to win jobs and maximize income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "TaskRabbit pricing calculator",
    "TaskRabbit service fee calculator",
    "TaskRabbit hourly rate",
    "how much does TaskRabbit take",
    "TaskRabbit tasker net earnings",
  ],
  variants: [
    {
      id: "earnings",
      name: "Tasker Net Earnings",
      description: "Calculate take-home after TaskRabbit fees and taxes",
      fields: [
        {
          name: "hourlyRate",
          label: "Your Hourly Rate",
          type: "number",
          placeholder: "e.g. 50",
          prefix: "$",
          suffix: "/hr",
        },
        {
          name: "hoursPerWeek",
          label: "Hours Worked per Week",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "hours",
        },
        {
          name: "taskType",
          label: "Task Category",
          type: "select",
          options: [
            { label: "Furniture assembly ($35–$60/hr avg)", value: "furniture" },
            { label: "Handyman / home repair ($45–$80/hr)", value: "handyman" },
            { label: "Moving help ($30–$50/hr)", value: "moving" },
            { label: "Cleaning ($25–$45/hr)", value: "cleaning" },
            { label: "General errands ($20–$35/hr)", value: "errands" },
            { label: "Tech / IT help ($40–$70/hr)", value: "tech" },
          ],
          defaultValue: "furniture",
        },
        {
          name: "supplysCostPct",
          label: "Supplies/Tools Cost (% of earnings)",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const rate = parseFloat(inputs.hourlyRate as string) || 0;
        const hours = parseFloat(inputs.hoursPerWeek as string) || 0;
        const suppliesPct = parseFloat(inputs.supplysCostPct as string) / 100 || 0.05;

        const trFeeRate = 0.15; // TaskRabbit 15% service fee
        const weeklyGross = rate * hours;
        const trFee = weeklyGross * trFeeRate;
        const suppliesCost = weeklyGross * suppliesPct;
        const netBeforeTax = weeklyGross - trFee - suppliesCost;
        const seTaxRate = 0.153;
        const seTax = netBeforeTax * 0.9235 * seTaxRate;
        const incomeTax = netBeforeTax * 0.12; // approximate
        const netAfterTax = netBeforeTax - seTax - incomeTax;
        const effectiveHourly = hours > 0 ? netAfterTax / hours : 0;

        // What rate to charge to achieve target
        const targetNet = rate * 0.7; // if they want $rate/hr net
        const requiredRate = rate / (1 - trFeeRate - suppliesPct) / 0.72;

        const monthlyNet = netAfterTax * 4.33;

        return {
          primary: { label: "Net Hourly After All Costs", value: `$${formatNumber(effectiveHourly, 2)}/hr` },
          details: [
            { label: "Weekly gross earnings", value: `$${formatNumber(weeklyGross, 2)}` },
            { label: "TaskRabbit fee (15%)", value: `-$${formatNumber(trFee, 2)}` },
            { label: "Supplies/tools", value: `-$${formatNumber(suppliesCost, 2)}` },
            { label: "Net before tax", value: `$${formatNumber(netBeforeTax, 2)}` },
            { label: "SE + income tax (~27%)", value: `-$${formatNumber(seTax + incomeTax, 2)}` },
            { label: "Weekly net take-home", value: `$${formatNumber(netAfterTax, 2)}` },
            { label: "Monthly net income", value: `$${formatNumber(monthlyNet, 2)}` },
            { label: "Rate to net $${formatNumber(rate * 0.7, 0)}/hr", value: `$${formatNumber(requiredRate, 2)}/hr` },
          ],
          note: "TaskRabbit charges a 15% service fee on all completed tasks. You keep 85% before taxes. Elite Taskers (top 10%) get priority in search and can command 20–30% higher rates.",
        };
      },
    },
  ],
  relatedSlugs: ["gig-worker-hourly-rate-calculator", "gig-vs-w2-calculator", "rover-pet-sitter-calculator"],
  faq: [
    {
      question: "How much does TaskRabbit take from taskers?",
      answer:
        "TaskRabbit charges a 15% service fee on all completed task payments. If you charge $100 for a task, TaskRabbit keeps $15 and you receive $85. There are no monthly fees — you only pay when you earn.",
    },
    {
      question: "How much can you make on TaskRabbit?",
      answer:
        "TaskRabbit taskers earn $30–$80/hr depending on skill and market. Furniture assembly ($40–$60/hr) and handyman work ($50–$80/hr) pay the most. Full-time taskers in major cities can earn $40,000–$80,000/year gross before fees and taxes.",
    },
    {
      question: "What TaskRabbit categories pay the most?",
      answer:
        "Highest-paying categories: Handyman/plumbing/electrical ($50–$100/hr), furniture assembly ($40–$70/hr), tech setup ($40–$80/hr), and mounting/installation ($40–$70/hr). Cleaning and errands pay less ($25–$40/hr) but have higher demand and faster bookings.",
    },
  ],
  formula: "Net Hourly = Rate × (1 − 15% TR Fee − Supplies%) × (1 − ~27% Tax) ÷ Hours",
};
