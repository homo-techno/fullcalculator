import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const subscriptionTrackerCalculator: CalculatorDefinition = {
  slug: "subscription-tracker-calculator",
  title: "Subscription Cost Tracker",
  description:
    "Free subscription cost tracker. Add up all your monthly subscriptions to see total monthly and yearly spending on recurring services.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "subscription tracker",
    "subscription cost",
    "monthly subscriptions",
    "recurring costs",
    "subscription manager",
    "subscription total",
  ],
  variants: [
    {
      id: "track-subscriptions",
      name: "Track Subscriptions",
      description: "Total up all your recurring subscription costs",
      fields: [
        {
          name: "sub1",
          label: "Subscription 1 ($/month)",
          type: "number",
          placeholder: "e.g. 15.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "sub2",
          label: "Subscription 2 ($/month)",
          type: "number",
          placeholder: "e.g. 9.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "sub3",
          label: "Subscription 3 ($/month)",
          type: "number",
          placeholder: "e.g. 12.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "sub4",
          label: "Subscription 4 ($/month)",
          type: "number",
          placeholder: "e.g. 4.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "sub5",
          label: "Subscription 5 ($/month)",
          type: "number",
          placeholder: "e.g. 6.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "sub6",
          label: "Subscription 6 ($/month)",
          type: "number",
          placeholder: "e.g. 14.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "sub7",
          label: "Subscription 7 ($/month)",
          type: "number",
          placeholder: "e.g. 7.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "sub8",
          label: "Subscription 8 ($/month)",
          type: "number",
          placeholder: "e.g. 19.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "monthlyIncome",
          label: "Monthly Income ($) — optional",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const subs = [
          (inputs.sub1 as number) || 0,
          (inputs.sub2 as number) || 0,
          (inputs.sub3 as number) || 0,
          (inputs.sub4 as number) || 0,
          (inputs.sub5 as number) || 0,
          (inputs.sub6 as number) || 0,
          (inputs.sub7 as number) || 0,
          (inputs.sub8 as number) || 0,
        ];
        const income = (inputs.monthlyIncome as number) || 0;

        const activeSubs = subs.filter((s) => s > 0);
        const monthlyTotal = activeSubs.reduce((sum, s) => sum + s, 0);

        if (monthlyTotal <= 0) return null;

        const yearlyTotal = monthlyTotal * 12;
        const fiveYearTotal = yearlyTotal * 5;
        const dailyCost = monthlyTotal / 30.44;
        const avgPerSub = monthlyTotal / activeSubs.length;
        const mostExpensive = Math.max(...activeSubs);
        const leastExpensive = Math.min(...activeSubs);

        const details = [
          { label: "Active subscriptions", value: formatNumber(activeSubs.length) },
          { label: "Monthly total", value: `$${formatNumber(monthlyTotal, 2)}` },
          { label: "Yearly total", value: `$${formatNumber(yearlyTotal, 2)}` },
          { label: "5-year total", value: `$${formatNumber(fiveYearTotal, 2)}` },
          { label: "Daily cost", value: `$${formatNumber(dailyCost, 2)}` },
          { label: "Average per subscription", value: `$${formatNumber(avgPerSub, 2)}` },
          { label: "Most expensive", value: `$${formatNumber(mostExpensive, 2)}/mo` },
          { label: "Least expensive", value: `$${formatNumber(leastExpensive, 2)}/mo` },
        ];

        if (income > 0) {
          const percentOfIncome = (monthlyTotal / income) * 100;
          details.push({
            label: "% of monthly income",
            value: `${formatNumber(percentOfIncome, 1)}%`,
          });
        }

        return {
          primary: {
            label: "Monthly Subscriptions",
            value: `$${formatNumber(monthlyTotal, 2)}`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: [
    "streaming-cost-calculator",
    "budget-calculator",
    "net-income-calculator",
  ],
  faq: [
    {
      question: "How much does the average person spend on subscriptions?",
      answer:
        "The average American spends about $219 per month on subscriptions, including streaming, software, gym memberships, meal kits, and other recurring services — often more than they realize.",
    },
    {
      question: "How can I reduce subscription costs?",
      answer:
        "Audit your subscriptions regularly, cancel unused ones, share family plans, downgrade to lower tiers, and consider rotating services instead of subscribing to all simultaneously.",
    },
  ],
  formula:
    "Monthly Total = Sum of all subscriptions. Yearly = Monthly x 12. % of Income = Monthly Total / Monthly Income x 100.",
};
