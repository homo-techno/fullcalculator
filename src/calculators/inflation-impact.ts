import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inflationImpactCalculator: CalculatorDefinition = {
  slug: "inflation-impact-calculator",
  title: "Inflation Impact Calculator",
  description:
    "Free inflation impact calculator. See how inflation erodes buying power over time. Compare past and future dollar values and understand what your money will really be worth.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "inflation impact",
    "inflation calculator",
    "buying power",
    "purchasing power",
    "dollar value over time",
    "inflation erosion",
  ],
  variants: [
    {
      id: "future-value",
      name: "Future Purchasing Power",
      description: "See what your money will be worth in the future after inflation",
      fields: [
        {
          name: "currentAmount",
          label: "Current Amount ($)",
          type: "number",
          placeholder: "e.g. 1000",
          min: 0.01,
          prefix: "$",
        },
        {
          name: "inflationRate",
          label: "Annual Inflation Rate (%)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0,
          max: 50,
          step: 0.1,
          defaultValue: 3,
        },
        {
          name: "years",
          label: "Number of Years",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.currentAmount as number;
        const rate = (inputs.inflationRate as number) || 3;
        const years = inputs.years as number;

        if (!amount || !years) return null;

        const futureValue = amount / Math.pow(1 + rate / 100, years);
        const purchasingPowerLoss = amount - futureValue;
        const percentLoss = (purchasingPowerLoss / amount) * 100;

        // What you'd need in the future to have same buying power
        const equivalentFuture = amount * Math.pow(1 + rate / 100, years);

        // How many years to lose half
        const halfLifeYears = rate > 0 ? Math.log(2) / Math.log(1 + rate / 100) : Infinity;

        // Yearly breakdown for first 5 years
        const yearlyDetails: { label: string; value: string }[] = [];
        for (let y = 1; y <= Math.min(5, years); y++) {
          const val = amount / Math.pow(1 + rate / 100, y);
          yearlyDetails.push({
            label: `After ${y} year${y > 1 ? "s" : ""}`,
            value: `$${formatNumber(val, 2)}`,
          });
        }

        return {
          primary: {
            label: `Buying Power After ${years} Years`,
            value: `$${formatNumber(futureValue, 2)}`,
          },
          details: [
            { label: "Original amount", value: `$${formatNumber(amount, 2)}` },
            { label: "Inflation rate", value: `${formatNumber(rate, 1)}% per year` },
            { label: "Purchasing power loss", value: `$${formatNumber(purchasingPowerLoss, 2)} (${formatNumber(percentLoss, 1)}%)` },
            { label: "Future equivalent needed", value: `$${formatNumber(equivalentFuture, 2)}` },
            { label: "Years to lose half", value: `${formatNumber(halfLifeYears, 1)} years` },
            ...yearlyDetails,
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "inflation-calculator",
    "compound-interest-calculator",
    "future-value-calculator",
  ],
  faq: [
    {
      question: "What is a normal inflation rate?",
      answer:
        "Central banks in most developed countries target about 2% annual inflation. The US has averaged about 3.2% over the last century. Recent years have seen higher rates of 5-9%.",
    },
    {
      question: "How does inflation affect savings?",
      answer:
        "If your savings earn less interest than the inflation rate, your purchasing power decreases. At 3% inflation, $1,000 today will buy only $744 worth of goods in 10 years.",
    },
  ],
  formula:
    "Future Buying Power = Amount / (1 + Rate)^Years. Future Equivalent = Amount x (1 + Rate)^Years. Half-Life = ln(2) / ln(1 + Rate).",
};
