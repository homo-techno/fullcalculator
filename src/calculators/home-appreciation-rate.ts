import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeAppreciationRateCalculator: CalculatorDefinition = {
  slug: "home-appreciation-rate-calculator",
  title: "Home Appreciation Rate Calculator",
  description:
    "Free home appreciation rate calculator. Calculate past appreciation, estimate future home values, and understand your property's growth rate over time.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home appreciation calculator",
    "property appreciation rate",
    "home value growth",
    "house appreciation",
    "real estate appreciation",
  ],
  variants: [
    {
      id: "past-appreciation",
      name: "Past Appreciation Rate",
      description: "Calculate the annual appreciation rate of your home",
      fields: [
        {
          name: "purchasePrice",
          label: "Original Purchase Price",
          type: "number",
          placeholder: "e.g. 300000",
          prefix: "$",
          min: 0,
        },
        {
          name: "currentValue",
          label: "Current Home Value",
          type: "number",
          placeholder: "e.g. 450000",
          prefix: "$",
          min: 0,
        },
        {
          name: "yearsOwned",
          label: "Years Owned",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "years",
          min: 0.1,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const purchase = inputs.purchasePrice as number;
        const current = inputs.currentValue as number;
        const years = inputs.yearsOwned as number;
        if (!purchase || !current || !years) return null;

        const totalAppreciation = current - purchase;
        const totalPercentage = (totalAppreciation / purchase) * 100;
        const annualRate = (Math.pow(current / purchase, 1 / years) - 1) * 100;

        return {
          primary: {
            label: "Annual Appreciation Rate",
            value: `${formatNumber(annualRate)}%`,
          },
          details: [
            { label: "Total appreciation", value: `$${formatNumber(totalAppreciation)}` },
            { label: "Total percentage gain", value: `${formatNumber(totalPercentage)}%` },
            { label: "Average per year", value: `$${formatNumber(totalAppreciation / years)}` },
          ],
        };
      },
    },
    {
      id: "future-value",
      name: "Future Home Value",
      description: "Estimate future home value based on appreciation rate",
      fields: [
        {
          name: "currentValue",
          label: "Current Home Value",
          type: "number",
          placeholder: "e.g. 400000",
          prefix: "$",
          min: 0,
        },
        {
          name: "appreciationRate",
          label: "Expected Annual Appreciation Rate",
          type: "number",
          placeholder: "e.g. 3.5",
          suffix: "%",
          min: -20,
          max: 30,
          step: 0.1,
        },
        {
          name: "years",
          label: "Years Into the Future",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "years",
          min: 1,
          max: 50,
        },
      ],
      calculate: (inputs) => {
        const current = inputs.currentValue as number;
        const rate = inputs.appreciationRate as number;
        const years = inputs.years as number;
        if (!current || rate === undefined || !years) return null;

        const futureValue = current * Math.pow(1 + rate / 100, years);
        const totalGain = futureValue - current;
        const fiveYearValue = current * Math.pow(1 + rate / 100, Math.min(5, years));

        return {
          primary: {
            label: `Estimated Value in ${years} Years`,
            value: `$${formatNumber(futureValue)}`,
          },
          details: [
            { label: "Total gain", value: `$${formatNumber(totalGain)}` },
            { label: "Total percentage gain", value: `${formatNumber((totalGain / current) * 100)}%` },
            { label: `Value in ${Math.min(5, years)} years`, value: `$${formatNumber(fiveYearValue)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "investment-calculator", "property-roi-calculator"],
  faq: [
    {
      question: "What is the average home appreciation rate?",
      answer:
        "Historically, U.S. home prices have appreciated about 3-5% per year on average. However, this varies significantly by location, economic conditions, and time period. Some markets have seen much higher or lower rates.",
    },
    {
      question: "How is home appreciation calculated?",
      answer:
        "Annual appreciation rate is calculated using the compound growth formula: Rate = (Current Value / Purchase Price)^(1/Years) - 1. This gives the average annual rate that would produce the observed total growth.",
    },
    {
      question: "Does home appreciation guarantee profit?",
      answer:
        "No. Home appreciation does not account for costs of ownership such as mortgage interest, property taxes, insurance, maintenance, and transaction costs. Your net return on a home sale is appreciation minus all these costs.",
    },
  ],
  formula: "Annual Rate = (Current Value / Purchase Price)^(1/Years) - 1",
};
