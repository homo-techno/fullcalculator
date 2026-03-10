import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gigWorkerHourlyRateCalculator: CalculatorDefinition = {
  slug: "gig-worker-hourly-rate-calculator",
  title: "Gig Worker True Hourly Rate Calculator",
  description:
    "Calculate your real hourly rate as a gig worker after all expenses. Account for unpaid time, vehicle costs, and self-employment taxes.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "gig worker hourly rate",
    "true hourly rate calculator",
    "gig economy real earnings",
    "freelance hourly rate after taxes",
    "self-employed true hourly wage",
  ],
  variants: [
    {
      id: "true",
      name: "True Hourly Rate",
      description: "Calculate real hourly rate including all unpaid time and costs",
      fields: [
        {
          name: "weeklyEarnings",
          label: "Weekly Gross Earnings",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
        },
        {
          name: "activeHours",
          label: "Active Working Hours per Week",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "hours",
        },
        {
          name: "unpaidHours",
          label: "Unpaid Hours (waiting, driving to zone, app time)",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "hours",
          defaultValue: 5,
        },
        {
          name: "weeklyExpenses",
          label: "Weekly Expenses (gas, supplies, fees)",
          type: "number",
          placeholder: "e.g. 80",
          prefix: "$",
          defaultValue: 80,
        },
        {
          name: "taxRate",
          label: "Estimated Tax Rate",
          type: "select",
          options: [
            { label: "~25% (SE tax + low income bracket)", value: "25" },
            { label: "~30% (SE tax + moderate bracket)", value: "30" },
            { label: "~35% (SE tax + higher bracket)", value: "35" },
          ],
          defaultValue: "30",
        },
      ],
      calculate: (inputs) => {
        const weeklyGross = parseFloat(inputs.weeklyEarnings as string) || 0;
        const activeHours = parseFloat(inputs.activeHours as string) || 1;
        const unpaidHours = parseFloat(inputs.unpaidHours as string) || 0;
        const expenses = parseFloat(inputs.weeklyExpenses as string) || 0;
        const taxRate = parseFloat(inputs.taxRate as string) || 30;

        const totalHours = activeHours + unpaidHours;
        const netBeforeTax = weeklyGross - expenses;
        const taxAmount = netBeforeTax * (taxRate / 100);
        const netAfterTax = netBeforeTax - taxAmount;

        const apparentHourly = activeHours > 0 ? weeklyGross / activeHours : 0;
        const trueHourly = totalHours > 0 ? netAfterTax / totalHours : 0;
        const annualNet = netAfterTax * 52;

        return {
          primary: { label: "True Hourly Rate", value: `$${formatNumber(trueHourly, 2)}/hr` },
          details: [
            { label: "Apparent hourly (active only)", value: `$${formatNumber(apparentHourly, 2)}/hr` },
            { label: "Total hours (incl. unpaid)", value: `${totalHours} hrs/wk` },
            { label: "Weekly gross earnings", value: `$${formatNumber(weeklyGross, 2)}` },
            { label: "Weekly expenses", value: `-$${formatNumber(expenses, 2)}` },
            { label: "Net before tax", value: `$${formatNumber(netBeforeTax, 2)}` },
            { label: `Tax (~${taxRate}%)`, value: `-$${formatNumber(taxAmount, 2)}` },
            { label: "Net after tax", value: `$${formatNumber(netAfterTax, 2)}/wk` },
            { label: "Annual net income", value: `$${formatNumber(annualNet, 0)}` },
          ],
          note: `Your true hourly is $${formatNumber(trueHourly, 2)} vs apparent $${formatNumber(apparentHourly, 2)}/hr. Unpaid time and expenses reduce effective pay significantly.`,
        };
      },
    },
  ],
  relatedSlugs: ["gig-vs-w2-calculator", "gig-worker-quarterly-tax-calculator", "side-hustle-comparison-calculator"],
  faq: [
    {
      question: "Why is my true hourly rate lower than advertised?",
      answer:
        "Gig platforms advertise active earnings per active hour. Your true rate drops when you include: waiting between gigs, driving to starting zones, app check-in time, and all expenses. A $20/hr DoorDash rate often works out to $10–$12/hr true rate.",
    },
    {
      question: "What expenses should gig workers track?",
      answer:
        "Key deductible expenses: mileage (67.5¢/mile in 2024), phone bill (business %), hot bags/supplies, app subscriptions, parking, and tolls. Tracking these can reduce your taxable income by $3,000–$8,000/year.",
    },
    {
      question: "How much does self-employment tax cost gig workers?",
      answer:
        "Self-employment tax is 15.3% on net earnings (12.4% Social Security + 2.9% Medicare). Unlike W-2 employees who pay 7.65%, gig workers pay both halves. On $40,000 net, SE tax alone is $6,120 before income tax.",
    },
  ],
  formula: "True Hourly = (Gross − Expenses) × (1 − Tax%) ÷ (Active + Unpaid Hours)",
};
