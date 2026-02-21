import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeValueCalculator: CalculatorDefinition = {
  slug: "home-value-calculator",
  title: "Home Value Calculator",
  description:
    "Free home value estimator. Estimate your home's current market value based on purchase price, appreciation rate, and years of ownership.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home value calculator",
    "home value estimator",
    "house value calculator",
    "property value estimator",
    "what is my home worth",
  ],
  variants: [
    {
      id: "appreciation",
      name: "Value by Appreciation",
      description: "Estimate current home value based on annual appreciation",
      fields: [
        { name: "purchasePrice", label: "Purchase Price", type: "number", placeholder: "e.g. 300000", prefix: "$", min: 0 },
        { name: "appreciationRate", label: "Annual Appreciation Rate", type: "number", placeholder: "e.g. 3.5", suffix: "%", min: -20, max: 30, step: 0.1 },
        { name: "yearsOwned", label: "Years Owned", type: "number", placeholder: "e.g. 5", suffix: "years", min: 0, max: 100, step: 1 },
      ],
      calculate: (inputs) => {
        const price = inputs.purchasePrice as number;
        const rate = inputs.appreciationRate as number;
        const years = inputs.yearsOwned as number;
        if (!price || rate === undefined || !years) return null;

        const currentValue = price * Math.pow(1 + rate / 100, years);
        const totalGain = currentValue - price;
        const totalReturnPercent = ((currentValue - price) / price) * 100;

        return {
          primary: { label: "Estimated Home Value", value: `$${formatNumber(currentValue)}` },
          details: [
            { label: "Original purchase price", value: `$${formatNumber(price)}` },
            { label: "Total appreciation", value: `$${formatNumber(totalGain)}` },
            { label: "Total return", value: `${formatNumber(totalReturnPercent)}%` },
            { label: "Avg. annual gain", value: `$${formatNumber(totalGain / years)}` },
          ],
        };
      },
    },
    {
      id: "comp-based",
      name: "Price Per Sq Ft Method",
      description: "Estimate value using comparable price per square foot",
      fields: [
        { name: "sqft", label: "Your Home (sq ft)", type: "number", placeholder: "e.g. 2000", suffix: "sq ft", min: 0 },
        { name: "pricePerSqft", label: "Comparable $/sq ft", type: "number", placeholder: "e.g. 200", prefix: "$", min: 0 },
        {
          name: "condition",
          label: "Condition Adjustment",
          type: "select",
          options: [
            { label: "Below average (-10%)", value: "-10" },
            { label: "Average (0%)", value: "0" },
            { label: "Above average (+10%)", value: "10" },
            { label: "Excellent (+20%)", value: "20" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const sqft = inputs.sqft as number;
        const ppsf = inputs.pricePerSqft as number;
        const condAdj = parseInt(inputs.condition as string) || 0;
        if (!sqft || !ppsf) return null;

        const baseValue = sqft * ppsf;
        const adjustedValue = baseValue * (1 + condAdj / 100);

        return {
          primary: { label: "Estimated Home Value", value: `$${formatNumber(adjustedValue)}` },
          details: [
            { label: "Base value (before adjustment)", value: `$${formatNumber(baseValue)}` },
            { label: "Condition adjustment", value: `${condAdj >= 0 ? "+" : ""}${condAdj}%` },
            { label: "Price per sq ft used", value: `$${formatNumber(ppsf)}` },
            { label: "Home size", value: `${formatNumber(sqft)} sq ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["property-appreciation-calculator", "mortgage-calculator", "home-equity-calculator"],
  faq: [
    {
      question: "How do I estimate my home's value?",
      answer:
        "You can estimate your home's value using the appreciation method (purchase price compounded annually), the price-per-square-foot method (using comparable sales in your area), or a professional appraisal. Online estimates are a starting point; a formal appraisal is most accurate.",
    },
    {
      question: "What is the average home appreciation rate?",
      answer:
        "Nationally, U.S. home prices have appreciated about 3-5% per year on average over the long term. However, appreciation varies widely by market, neighborhood, and economic conditions. Some hot markets see 10%+ gains while others may be flat or decline.",
    },
    {
      question: "What is price per square foot?",
      answer:
        "Price per square foot is the sale price divided by the home's living area. It's a common metric to compare homes of different sizes in the same neighborhood. Check recent comparable sales (comps) in your area to find a local average.",
    },
  ],
  formula:
    "Value (Appreciation) = Purchase Price × (1 + Annual Rate)^Years | Value (Comp) = Square Footage × Price Per Sq Ft × Condition Adjustment",
};
