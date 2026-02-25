import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carDepreciationYearsCalculator: CalculatorDefinition = {
  slug: "car-depreciation-years-calculator",
  title: "Car Depreciation by Year Calculator",
  description: "Free car depreciation by year calculator. Estimate your vehicle's value over time with year-by-year depreciation breakdown.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car depreciation by year", "vehicle depreciation calculator", "car value over time", "auto depreciation schedule", "car worth by year"],
  variants: [
    {
      id: "yearly",
      name: "Year-by-Year Depreciation",
      description: "Calculate car value for each year of ownership",
      fields: [
        { name: "purchasePrice", label: "Purchase Price", type: "number", placeholder: "e.g. 35000", prefix: "$" },
        { name: "years", label: "Number of Years", type: "number", placeholder: "e.g. 10" },
        { name: "firstYearRate", label: "First Year Depreciation", type: "number", placeholder: "e.g. 20", suffix: "%" },
        { name: "subsequentRate", label: "Subsequent Year Depreciation", type: "number", placeholder: "e.g. 15", suffix: "%" },
      ],
      calculate: (inputs) => {
        const price = inputs.purchasePrice as number;
        const years = inputs.years as number;
        const firstRate = (inputs.firstYearRate as number) || 20;
        const subRate = (inputs.subsequentRate as number) || 15;
        if (!price || !years) return null;

        let currentValue = price;
        const yearlyValues: { year: number; value: number }[] = [];

        for (let i = 1; i <= years; i++) {
          const rate = i === 1 ? firstRate / 100 : subRate / 100;
          currentValue = currentValue * (1 - rate);
          yearlyValues.push({ year: i, value: currentValue });
        }

        const finalValue = yearlyValues[yearlyValues.length - 1].value;
        const totalDepreciation = price - finalValue;

        return {
          primary: { label: `Value After ${years} Years`, value: `$${formatNumber(finalValue)}` },
          details: [
            { label: "Total depreciation", value: `$${formatNumber(totalDepreciation)}` },
            { label: "Depreciation percentage", value: `${formatNumber((totalDepreciation / price) * 100, 1)}%` },
            { label: "Value after year 1", value: `$${formatNumber(yearlyValues[0].value)}` },
            { label: "Value after year 3", value: years >= 3 ? `$${formatNumber(yearlyValues[2].value)}` : "N/A" },
            { label: "Value after year 5", value: years >= 5 ? `$${formatNumber(yearlyValues[4].value)}` : "N/A" },
          ],
        };
      },
    },
    {
      id: "target",
      name: "Time to Reach Value",
      description: "Calculate how many years until your car reaches a target value",
      fields: [
        { name: "purchasePrice", label: "Purchase Price", type: "number", placeholder: "e.g. 35000", prefix: "$" },
        { name: "targetValue", label: "Target Value", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "annualRate", label: "Annual Depreciation Rate", type: "number", placeholder: "e.g. 15", suffix: "%" },
      ],
      calculate: (inputs) => {
        const price = inputs.purchasePrice as number;
        const target = inputs.targetValue as number;
        const rate = (inputs.annualRate as number) || 15;
        if (!price || !target || target >= price) return null;

        const yearsNeeded = Math.log(target / price) / Math.log(1 - rate / 100);
        const fullYears = Math.ceil(yearsNeeded);
        const finalValue = price * Math.pow(1 - rate / 100, fullYears);

        return {
          primary: { label: "Years to Target", value: `${formatNumber(yearsNeeded, 1)} years` },
          details: [
            { label: "Starting value", value: `$${formatNumber(price)}` },
            { label: "Target value", value: `$${formatNumber(target)}` },
            { label: `Value at year ${fullYears}`, value: `$${formatNumber(finalValue)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-loan-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "How much does a car depreciate per year?", answer: "On average, a new car depreciates about 20% in the first year and around 10-15% each subsequent year. After 5 years, most cars are worth about 40% of their original price." },
    { question: "What cars depreciate the least?", answer: "Trucks, SUVs, and certain luxury brands (like Toyota, Porsche, Lexus) tend to hold their value better. Electric vehicles and luxury sedans often depreciate faster." },
  ],
  formula: "Value(n) = Purchase Price × (1 - First Year Rate) × (1 - Annual Rate)^(n-1)",
};
