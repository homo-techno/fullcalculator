import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const streamingCostCalculator: CalculatorDefinition = {
  slug: "streaming-cost-calculator",
  title: "Streaming Service Cost Calculator",
  description:
    "Free streaming cost calculator. Add up what you spend on all streaming services monthly and yearly and see cost per hour of content watched.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "streaming cost",
    "netflix cost",
    "subscription cost",
    "streaming services",
    "streaming budget",
    "entertainment cost",
  ],
  variants: [
    {
      id: "streaming-total",
      name: "Streaming Cost Total",
      description: "Calculate total streaming subscription costs and value",
      fields: [
        {
          name: "service1",
          label: "Service 1 ($/month)",
          type: "number",
          placeholder: "e.g. 15.49",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "service2",
          label: "Service 2 ($/month)",
          type: "number",
          placeholder: "e.g. 7.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "service3",
          label: "Service 3 ($/month)",
          type: "number",
          placeholder: "e.g. 9.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "service4",
          label: "Service 4 ($/month)",
          type: "number",
          placeholder: "e.g. 5.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "service5",
          label: "Service 5 ($/month)",
          type: "number",
          placeholder: "e.g. 14.99",
          min: 0,
          step: 0.01,
          prefix: "$",
        },
        {
          name: "hoursWatched",
          label: "Hours Watched per Month",
          type: "number",
          placeholder: "e.g. 40",
          min: 0,
          max: 744,
        },
      ],
      calculate: (inputs) => {
        const s1 = (inputs.service1 as number) || 0;
        const s2 = (inputs.service2 as number) || 0;
        const s3 = (inputs.service3 as number) || 0;
        const s4 = (inputs.service4 as number) || 0;
        const s5 = (inputs.service5 as number) || 0;
        const hoursWatched = (inputs.hoursWatched as number) || 0;

        const monthly = s1 + s2 + s3 + s4 + s5;
        if (monthly <= 0) return null;

        const yearly = monthly * 12;
        const fiveYear = yearly * 5;
        const serviceCount = [s1, s2, s3, s4, s5].filter((v) => v > 0).length;
        const costPerHour = hoursWatched > 0 ? monthly / hoursWatched : 0;
        const costPerDay = monthly / 30.44;

        return {
          primary: {
            label: "Monthly Total",
            value: `$${formatNumber(monthly, 2)}`,
          },
          details: [
            { label: "Active services", value: formatNumber(serviceCount) },
            { label: "Yearly total", value: `$${formatNumber(yearly, 2)}` },
            { label: "5-year total", value: `$${formatNumber(fiveYear, 2)}` },
            { label: "Cost per day", value: `$${formatNumber(costPerDay, 2)}` },
            ...(hoursWatched > 0
              ? [
                  {
                    label: "Cost per hour watched",
                    value: `$${formatNumber(costPerHour, 2)}`,
                  },
                ]
              : []),
            {
              label: "Equivalent cable cost",
              value: monthly < 70 ? "Less than avg cable ($70/mo)" : "More than avg cable ($70/mo)",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "subscription-tracker-calculator",
    "budget-calculator",
    "binge-watch-time-calculator",
  ],
  faq: [
    {
      question: "How much does the average person spend on streaming?",
      answer:
        "The average American household spends about $46 per month on streaming services, subscribing to 3-4 services at a time.",
    },
    {
      question: "Is streaming cheaper than cable?",
      answer:
        "Individual services are cheaper, but subscribing to many services can exceed the average cable bill of $70-100/month. The calculator helps you see your true total.",
    },
  ],
  formula:
    "Monthly Total = Sum of all service costs. Yearly = Monthly x 12. Cost per Hour = Monthly / Hours Watched.",
};
