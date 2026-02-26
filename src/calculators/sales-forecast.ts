import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const salesForecastCalculator: CalculatorDefinition = {
  slug: "sales-forecast",
  title: "Sales Forecast Calculator",
  description: "Free online sales forecast calculator. Project future revenue using growth rates, seasonal adjustments, and conversion metrics.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sales forecast", "revenue forecast", "sales projection", "revenue projection", "business forecast", "growth rate", "sales estimate"],
  variants: [
    {
      id: "growth-based",
      name: "Growth Rate Forecast",
      fields: [
        {
          name: "currentMonthlyRevenue",
          label: "Current Monthly Revenue ($)",
          type: "number",
          placeholder: "e.g. 50000",
          min: 0,
        },
        {
          name: "monthlyGrowthRate",
          label: "Expected Monthly Growth Rate (%)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "forecastMonths",
          label: "Forecast Period (months)",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
          max: 60,
        },
        {
          name: "seasonalAdjustment",
          label: "Seasonal Adjustment",
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Q4 Holiday Boost (+20%)", value: "holiday" },
            { label: "Summer Slowdown (-10%)", value: "summer" },
            { label: "Steady Year-Round", value: "steady" },
          ],
        },
      ],
      calculate: (inputs) => {
        const currentRevenue = parseFloat(inputs.currentMonthlyRevenue as string) || 0;
        const growthRate = parseFloat(inputs.monthlyGrowthRate as string) || 0;
        const months = parseFloat(inputs.forecastMonths as string) || 12;
        const seasonal = inputs.seasonalAdjustment as string;

        const monthlyRate = growthRate / 100;
        let totalRevenue = 0;
        let endingRevenue = currentRevenue;

        for (let i = 1; i <= months; i++) {
          endingRevenue = endingRevenue * (1 + monthlyRate);
          let adjusted = endingRevenue;
          if (seasonal === "holiday" && (i % 12 >= 10 || i % 12 === 0)) {
            adjusted *= 1.2;
          } else if (seasonal === "summer" && i % 12 >= 6 && i % 12 <= 8) {
            adjusted *= 0.9;
          }
          totalRevenue += adjusted;
        }

        const averageMonthlyRevenue = totalRevenue / months;
        const annualizedRevenue = averageMonthlyRevenue * 12;
        const totalGrowthPercent = currentRevenue > 0 ? ((endingRevenue - currentRevenue) / currentRevenue) * 100 : 0;

        return {
          primary: { label: "Forecasted Total Revenue", value: "$" + formatNumber(totalRevenue) },
          details: [
            { label: "Starting Monthly Revenue", value: "$" + formatNumber(currentRevenue) },
            { label: "Ending Monthly Revenue", value: "$" + formatNumber(endingRevenue) },
            { label: "Average Monthly Revenue", value: "$" + formatNumber(averageMonthlyRevenue) },
            { label: "Annualized Run Rate", value: "$" + formatNumber(annualizedRevenue) },
            { label: "Total Growth Over Period", value: formatNumber(totalGrowthPercent, 1) + "%" },
          ],
        };
      },
    },
    {
      id: "unit-based",
      name: "Unit-Based Forecast",
      fields: [
        {
          name: "monthlyLeads",
          label: "Monthly Leads / Visitors",
          type: "number",
          placeholder: "e.g. 10000",
          min: 0,
        },
        {
          name: "conversionRate",
          label: "Conversion Rate (%)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 100,
        },
        {
          name: "averageOrderValue",
          label: "Average Order Value ($)",
          type: "number",
          placeholder: "e.g. 75",
          min: 0,
        },
        {
          name: "repeatPurchaseRate",
          label: "Repeat Purchase Rate (%)",
          type: "number",
          placeholder: "e.g. 20",
          min: 0,
          max: 100,
        },
        {
          name: "forecastMonths",
          label: "Forecast Period (months)",
          type: "number",
          placeholder: "e.g. 12",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const leads = parseFloat(inputs.monthlyLeads as string) || 0;
        const convRate = parseFloat(inputs.conversionRate as string) || 0;
        const aov = parseFloat(inputs.averageOrderValue as string) || 0;
        const repeatRate = parseFloat(inputs.repeatPurchaseRate as string) || 0;
        const months = parseFloat(inputs.forecastMonths as string) || 12;

        const newCustomersPerMonth = leads * (convRate / 100);
        const monthlyNewRevenue = newCustomersPerMonth * aov;
        const monthlyRepeatRevenue = newCustomersPerMonth * (repeatRate / 100) * aov;
        const totalMonthlyRevenue = monthlyNewRevenue + monthlyRepeatRevenue;
        const totalRevenue = totalMonthlyRevenue * months;
        const annualRevenue = totalMonthlyRevenue * 12;

        return {
          primary: { label: "Monthly Revenue Forecast", value: "$" + formatNumber(totalMonthlyRevenue) },
          details: [
            { label: "New Customers / Month", value: formatNumber(newCustomersPerMonth, 0) },
            { label: "Revenue from New Customers", value: "$" + formatNumber(monthlyNewRevenue) },
            { label: "Revenue from Repeat Customers", value: "$" + formatNumber(monthlyRepeatRevenue) },
            { label: "Total for " + months + " Months", value: "$" + formatNumber(totalRevenue) },
            { label: "Annualized Revenue", value: "$" + formatNumber(annualRevenue) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["startup-cost-calc", "npv-calculator", "consulting-rate-calc"],
  faq: [
    {
      question: "How do I forecast sales for a new business?",
      answer: "For new businesses, use the unit-based approach: estimate your monthly leads, conversion rate, and average order value. You can also research industry benchmarks and comparable businesses for reference.",
    },
    {
      question: "What growth rate should I use?",
      answer: "Growth rates vary by industry and stage. Early-stage startups may grow 10-20% monthly, while established businesses typically grow 2-5% monthly. Use conservative estimates for planning and optimistic estimates as stretch goals.",
    },
    {
      question: "Should I account for seasonality?",
      answer: "Yes, if your business is affected by seasonal patterns. Retail businesses often see 20-40% higher sales in Q4 (holiday season), while B2B services may slow during summer months. Adjust your forecast accordingly.",
    },
  ],
  formula: "Growth Forecast: Revenue(month) = Current Revenue x (1 + Growth Rate)^month\nUnit Forecast: Monthly Revenue = Leads x Conversion Rate x Average Order Value",
};
