import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const streamingServiceCostComparisonCalculator: CalculatorDefinition = {
  slug: "streaming-service-cost-comparison-calculator",
  title: "Streaming Service Cost Comparison Calculator",
  description: "Compare monthly and annual costs of multiple streaming subscriptions to see your total entertainment spending and find potential savings.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["streaming cost comparison","subscription cost total","streaming budget","netflix hulu disney cost","streaming services"],
  variants: [{
    id: "standard",
    name: "Streaming Service Cost Comparison",
    description: "Compare monthly and annual costs of multiple streaming subscriptions to see your total entertainment spending and find potential savings.",
    fields: [
      { name: "service1", label: "Service 1 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 15.49 },
      { name: "service2", label: "Service 2 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 7.99 },
      { name: "service3", label: "Service 3 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 13.99 },
      { name: "service4", label: "Service 4 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 9.99 },
      { name: "service5", label: "Service 5 Monthly Cost ($)", type: "number", min: 0, max: 50, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const s1 = inputs.service1 as number;
    const s2 = inputs.service2 as number;
    const s3 = inputs.service3 as number;
    const s4 = inputs.service4 as number;
    const s5 = inputs.service5 as number;
    const monthlyTotal = s1 + s2 + s3 + s4 + s5;
    const annualTotal = monthlyTotal * 12;
    const activeServices = [s1, s2, s3, s4, s5].filter(s => s > 0).length;
    const avgPerService = activeServices > 0 ? monthlyTotal / activeServices : 0;
    const dailyCost = monthlyTotal / 30.44;
    return {
      primary: { label: "Total Monthly Cost", value: "$" + formatNumber(Math.round(monthlyTotal * 100) / 100) },
      details: [
        { label: "Annual Cost", value: "$" + formatNumber(Math.round(annualTotal * 100) / 100) },
        { label: "Active Subscriptions", value: formatNumber(activeServices) },
        { label: "Average Per Service", value: "$" + formatNumber(Math.round(avgPerService * 100) / 100) },
        { label: "Daily Cost", value: "$" + formatNumber(Math.round(dailyCost * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["electric-bill-device-cost-calculator","gaming-pc-build-budget-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Monthly Total = Sum of all service costs; Annual Total = Monthly Total x 12; Average Per Service = Monthly Total / Number of Active Services",
};
