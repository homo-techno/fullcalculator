import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inflationCalculator: CalculatorDefinition = {
  slug: "inflation-calculator",
  title: "Inflation Calculator",
  description: "Free inflation calculator. See how purchasing power changes over time. Calculate the future value of money adjusted for inflation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["inflation calculator", "purchasing power calculator", "inflation rate calculator", "dollar value calculator"],
  variants: [
    {
      id: "future",
      name: "Future Value of Money",
      description: "See what your money will be worth in the future with inflation",
      fields: [
        { name: "amount", label: "Current Amount", type: "number", placeholder: "e.g. 1000", prefix: "$" },
        { name: "rate", label: "Annual Inflation Rate", type: "number", placeholder: "e.g. 3", suffix: "%", step: 0.1 },
        { name: "years", label: "Years", type: "number", placeholder: "e.g. 10", min: 1, max: 100 },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const rate = inputs.rate as number;
        const years = inputs.years as number;
        if (!amount || !rate || !years) return null;
        const futureEquivalent = amount * Math.pow(1 + rate / 100, years);
        const purchasingPower = amount / Math.pow(1 + rate / 100, years);
        const totalInflation = ((futureEquivalent - amount) / amount) * 100;
        return {
          primary: { label: `$${formatNumber(amount)} today will feel like`, value: `$${formatNumber(purchasingPower)}` },
          details: [
            { label: `To maintain purchasing power, you'll need`, value: `$${formatNumber(futureEquivalent)}` },
            { label: "Total inflation over period", value: `${formatNumber(totalInflation)}%` },
            { label: "Purchasing power lost", value: `${formatNumber(((amount - purchasingPower) / amount) * 100)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "roi-calculator", "salary-calculator"],
  faq: [
    { question: "What is inflation?", answer: "Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power. A 3% annual inflation rate means that what costs $100 today will cost $103 next year." },
    { question: "What is a normal inflation rate?", answer: "Most central banks target 2% annual inflation. The US has averaged about 3.2% since 1913. Anything above 5-6% is considered high inflation." },
  ],
  formula: "Future Value = Present Value x (1 + Inflation Rate)^Years",
};
