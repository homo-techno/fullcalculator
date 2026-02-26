import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const streamingCostCompareCalculator: CalculatorDefinition = {
  slug: "streaming-cost-compare-calculator",
  title: "Streaming Service Cost Comparison Calculator",
  description:
    "Free streaming cost comparison calculator. Compare monthly and yearly costs of multiple streaming services and find potential savings by cutting subscriptions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "streaming cost comparison",
    "streaming service calculator",
    "streaming subscription cost",
    "streaming budget",
    "compare streaming services",
  ],
  variants: [
    {
      id: "compare",
      name: "Compare Costs",
      description: "Calculate total streaming costs and cost per hour of use",
      fields: [
        {
          name: "numServices",
          label: "Number of Streaming Services",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 15,
          step: 1,
          defaultValue: 4,
        },
        {
          name: "avgMonthlyCost",
          label: "Average Monthly Cost per Service",
          type: "number",
          placeholder: "e.g. 14",
          prefix: "$",
          min: 1,
          max: 50,
          step: 0.5,
          defaultValue: 14,
        },
        {
          name: "hoursPerWeek",
          label: "Total Streaming Hours per Week",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "hours",
          min: 1,
          max: 80,
          step: 1,
          defaultValue: 20,
        },
      ],
      calculate: (inputs) => {
        const numServices = parseFloat(inputs.numServices as string);
        const avgCost = parseFloat(inputs.avgMonthlyCost as string);
        const hoursWeek = parseFloat(inputs.hoursPerWeek as string);
        if (!numServices || !avgCost || !hoursWeek) return null;

        const totalMonthly = numServices * avgCost;
        const totalYearly = totalMonthly * 12;
        const monthlyHours = hoursWeek * 4.33;
        const costPerHour = totalMonthly / monthlyHours;
        const costPerDay = totalMonthly / 30;

        // Comparison: cable TV averages ~$100/month
        const cableSavings = (100 - totalMonthly) * 12;

        return {
          primary: { label: "Total Monthly Cost", value: `$${formatNumber(totalMonthly)}` },
          details: [
            { label: "Total Yearly Cost", value: `$${formatNumber(totalYearly)}` },
            { label: "Cost per Day", value: `$${formatNumber(costPerDay)}` },
            { label: "Cost per Hour Watched", value: `$${formatNumber(costPerHour)}` },
            { label: "Monthly Hours Watched", value: `${formatNumber(monthlyHours, 0)} hrs` },
            { label: "vs Cable TV ($100/mo)", value: cableSavings > 0 ? `Save $${formatNumber(cableSavings)}/yr` : `$${formatNumber(Math.abs(cableSavings))}/yr more` },
          ],
        };
      },
    },
    {
      id: "cut-services",
      name: "Savings from Cutting",
      description: "See how much you save by cutting services",
      fields: [
        {
          name: "currentServices",
          label: "Current Number of Services",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 15,
          step: 1,
          defaultValue: 6,
        },
        {
          name: "avgMonthlyCost",
          label: "Average Monthly Cost per Service",
          type: "number",
          placeholder: "e.g. 14",
          prefix: "$",
          min: 1,
          max: 50,
          step: 0.5,
          defaultValue: 14,
        },
        {
          name: "servicesToKeep",
          label: "Services to Keep",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 15,
          step: 1,
          defaultValue: 3,
        },
      ],
      calculate: (inputs) => {
        const current = parseFloat(inputs.currentServices as string);
        const avgCost = parseFloat(inputs.avgMonthlyCost as string);
        const keep = parseFloat(inputs.servicesToKeep as string);
        if (!current || !avgCost || isNaN(keep)) return null;

        const currentMonthly = current * avgCost;
        const newMonthly = keep * avgCost;
        const monthlySavings = currentMonthly - newMonthly;
        const yearlySavings = monthlySavings * 12;
        const servicesCut = current - keep;

        // What else could you do with savings?
        const coffees = Math.floor(monthlySavings / 5);
        const investedIn10Yrs = yearlySavings * ((Math.pow(1.07, 10) - 1) / 0.07);

        return {
          primary: { label: "Monthly Savings", value: `$${formatNumber(monthlySavings)}` },
          details: [
            { label: "Yearly Savings", value: `$${formatNumber(yearlySavings)}` },
            { label: "Services Cut", value: formatNumber(servicesCut, 0) },
            { label: "New Monthly Cost", value: `$${formatNumber(newMonthly)}` },
            { label: "Equivalent Coffees/Month", value: `${formatNumber(coffees, 0)} coffees` },
            { label: "If Invested (10 yrs @ 7%)", value: `$${formatNumber(investedIn10Yrs)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["subscription-audit-calculator", "latte-factor-calculator"],
  faq: [
    {
      question: "How much does the average person spend on streaming?",
      answer:
        "The average US household subscribes to 4-5 streaming services and spends about $50-$75 per month on streaming subscriptions. This has been steadily increasing as services raise prices and new platforms launch.",
    },
    {
      question: "Is streaming cheaper than cable TV?",
      answer:
        "Generally yes. Cable TV averages $100-$150/month while 3-4 streaming services cost $40-$60/month. However, as streaming prices rise and subscribers add more services, the cost gap is narrowing.",
    },
  ],
  formula:
    "Total Monthly = Number of Services x Average Cost | Cost per Hour = Total Monthly / (Weekly Hours x 4.33) | Yearly Savings = (Current - New) x 12",
};
