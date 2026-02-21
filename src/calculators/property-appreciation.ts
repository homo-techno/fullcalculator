import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const propertyAppreciationCalculator: CalculatorDefinition = {
  slug: "property-appreciation-calculator",
  title: "Property Appreciation Calculator",
  description:
    "Free property appreciation calculator. Estimate your home's future value, total equity gained, and annual appreciation over any time period.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "property appreciation calculator",
    "home appreciation calculator",
    "house appreciation",
    "real estate appreciation",
    "property value growth",
  ],
  variants: [
    {
      id: "future-value",
      name: "Future Property Value",
      description: "Estimate your property's value after appreciation",
      fields: [
        { name: "currentValue", label: "Current Property Value", type: "number", placeholder: "e.g. 400000", prefix: "$", min: 0 },
        { name: "appreciationRate", label: "Annual Appreciation Rate", type: "number", placeholder: "e.g. 3.5", suffix: "%", min: -20, max: 30, step: 0.1 },
        {
          name: "years",
          label: "Time Period",
          type: "select",
          options: [
            { label: "1 year", value: "1" },
            { label: "3 years", value: "3" },
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
            { label: "15 years", value: "15" },
            { label: "20 years", value: "20" },
            { label: "30 years", value: "30" },
          ],
          defaultValue: "10",
        },
      ],
      calculate: (inputs) => {
        const current = inputs.currentValue as number;
        const rate = inputs.appreciationRate as number;
        const years = parseInt(inputs.years as string) || 10;
        if (!current || rate === undefined) return null;

        const futureValue = current * Math.pow(1 + rate / 100, years);
        const totalGain = futureValue - current;
        const totalReturnPercent = (totalGain / current) * 100;
        const avgAnnualGain = totalGain / years;

        return {
          primary: { label: `Value in ${years} Years`, value: `$${formatNumber(futureValue)}` },
          details: [
            { label: "Current value", value: `$${formatNumber(current)}` },
            { label: "Total appreciation", value: `$${formatNumber(totalGain)}` },
            { label: "Total return", value: `${formatNumber(totalReturnPercent)}%` },
            { label: "Average annual gain", value: `$${formatNumber(avgAnnualGain)}` },
            { label: "Annual rate", value: `${formatNumber(rate)}%` },
          ],
        };
      },
    },
    {
      id: "historical",
      name: "Historical Appreciation Rate",
      description: "Calculate the annual appreciation rate between two values",
      fields: [
        { name: "purchasePrice", label: "Purchase Price", type: "number", placeholder: "e.g. 250000", prefix: "$", min: 0 },
        { name: "currentValue", label: "Current Value", type: "number", placeholder: "e.g. 400000", prefix: "$", min: 0 },
        { name: "yearsOwned", label: "Years Owned", type: "number", placeholder: "e.g. 8", suffix: "years", min: 0.5, max: 100, step: 0.5 },
      ],
      calculate: (inputs) => {
        const purchase = inputs.purchasePrice as number;
        const current = inputs.currentValue as number;
        const years = inputs.yearsOwned as number;
        if (!purchase || !current || !years) return null;

        const annualRate = (Math.pow(current / purchase, 1 / years) - 1) * 100;
        const totalGain = current - purchase;
        const totalReturn = (totalGain / purchase) * 100;

        return {
          primary: { label: "Annual Appreciation Rate", value: `${formatNumber(annualRate, 2)}%` },
          details: [
            { label: "Purchase price", value: `$${formatNumber(purchase)}` },
            { label: "Current value", value: `$${formatNumber(current)}` },
            { label: "Total gain", value: `$${formatNumber(totalGain)}` },
            { label: "Total return", value: `${formatNumber(totalReturn)}%` },
            { label: "Years owned", value: formatNumber(years, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-value-calculator", "home-equity-calculator", "mortgage-calculator"],
  faq: [
    {
      question: "What is the average home appreciation rate?",
      answer:
        "U.S. homes have historically appreciated 3-5% annually on average. From 2012-2022, appreciation was significantly higher (7-10% in many markets). However, appreciation varies greatly by location, economic conditions, and property type.",
    },
    {
      question: "How is property appreciation calculated?",
      answer:
        "Future Value = Current Value × (1 + Annual Rate)^Years. To find the annual rate from two values: Annual Rate = (Current Value / Purchase Price)^(1/Years) − 1. This is compound annual growth rate (CAGR).",
    },
    {
      question: "Does property always appreciate?",
      answer:
        "No. While long-term trends have been positive, property can depreciate during recessions, in areas with declining populations, or due to local economic changes. The 2008 housing crisis saw national prices drop 27%. Location, condition, and market fundamentals matter most.",
    },
  ],
  formula:
    "Future Value = Current Value × (1 + Rate)^Years | Annual Rate = (Current / Purchase)^(1/Years) − 1",
};
