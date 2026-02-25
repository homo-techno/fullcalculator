import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const squareFootagePriceCalculator: CalculatorDefinition = {
  slug: "square-footage-price-calculator",
  title: "Price Per Sq Ft Analysis",
  description:
    "Free price per square foot analysis tool. Analyze property values, compare neighborhoods, and evaluate fair market price using square footage pricing data.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "price per square foot",
    "sq ft price analysis",
    "property price comparison",
    "home value per sqft",
    "real estate price analysis",
  ],
  variants: [
    {
      id: "fair-price",
      name: "Fair Price Estimate",
      description: "Estimate a fair price based on neighborhood price per sq ft",
      fields: [
        {
          name: "neighborhoodPricePerSqFt",
          label: "Neighborhood Avg Price Per Sq Ft",
          type: "number",
          placeholder: "e.g. 200",
          prefix: "$",
          min: 0,
        },
        {
          name: "propertySqFt",
          label: "Property Square Footage",
          type: "number",
          placeholder: "e.g. 2200",
          suffix: "sq ft",
          min: 0,
        },
        {
          name: "askingPrice",
          label: "Asking Price",
          type: "number",
          placeholder: "e.g. 480000",
          prefix: "$",
          min: 0,
        },
        {
          name: "conditionAdjustment",
          label: "Condition Adjustment",
          type: "select",
          options: [
            { label: "Below average (-10%)", value: "-10" },
            { label: "Average (0%)", value: "0" },
            { label: "Above average (+5%)", value: "5" },
            { label: "Renovated (+10%)", value: "10" },
            { label: "Luxury finish (+20%)", value: "20" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const avgPricePerSqFt = inputs.neighborhoodPricePerSqFt as number;
        const sqft = inputs.propertySqFt as number;
        const askingPrice = inputs.askingPrice as number;
        const adjustment = parseInt(inputs.conditionAdjustment as string) || 0;
        if (!avgPricePerSqFt || !sqft || !askingPrice) return null;

        const baseEstimate = avgPricePerSqFt * sqft;
        const adjustedEstimate = baseEstimate * (1 + adjustment / 100);
        const askingPricePerSqFt = askingPrice / sqft;
        const difference = askingPrice - adjustedEstimate;
        const differencePercent = (difference / adjustedEstimate) * 100;

        return {
          primary: {
            label: "Estimated Fair Value",
            value: `$${formatNumber(adjustedEstimate)}`,
          },
          details: [
            { label: "Base estimate (no adjustment)", value: `$${formatNumber(baseEstimate)}` },
            { label: "Condition adjustment", value: `${adjustment >= 0 ? "+" : ""}${adjustment}%` },
            { label: "Asking price per sq ft", value: `$${formatNumber(askingPricePerSqFt)}` },
            { label: "Asking vs estimate", value: `$${formatNumber(difference)} (${differencePercent > 0 ? "+" : ""}${formatNumber(differencePercent)}%)` },
            { label: "Verdict", value: differencePercent > 5 ? "Overpriced" : differencePercent < -5 ? "Underpriced" : "Fair price" },
          ],
        };
      },
    },
    {
      id: "rental-rate",
      name: "Rent Per Sq Ft Analysis",
      description: "Analyze rental rates by price per square foot",
      fields: [
        {
          name: "monthlyRent",
          label: "Monthly Rent",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          min: 0,
        },
        {
          name: "sqft",
          label: "Unit Square Footage",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "sq ft",
          min: 0,
        },
        {
          name: "marketRatePerSqFt",
          label: "Market Rate Per Sq Ft (monthly)",
          type: "number",
          placeholder: "e.g. 2.00",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const rent = inputs.monthlyRent as number;
        const sqft = inputs.sqft as number;
        const marketRate = inputs.marketRatePerSqFt as number;
        if (!rent || !sqft || !marketRate) return null;

        const rentPerSqFt = rent / sqft;
        const marketRentEstimate = marketRate * sqft;
        const difference = rent - marketRentEstimate;

        return {
          primary: {
            label: "Rent Per Sq Ft",
            value: `$${formatNumber(rentPerSqFt)}/sq ft`,
          },
          details: [
            { label: "Your monthly rent", value: `$${formatNumber(rent)}` },
            { label: "Market rate estimate", value: `$${formatNumber(marketRentEstimate)}/mo` },
            { label: "Difference from market", value: `$${formatNumber(difference)}/mo` },
            { label: "Annual rent per sq ft", value: `$${formatNumber(rentPerSqFt * 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cost-per-square-foot-calculator", "appraisal-value-calculator", "investment-property-calculator"],
  faq: [
    {
      question: "How do I use price per square foot to evaluate a home?",
      answer:
        "Compare the property's price per square foot to the neighborhood average. If a 2,200 sq ft home is listed at $480,000 ($218/sq ft) but the neighborhood average is $200/sq ft, the home may be overpriced unless it has premium features or recent renovations.",
    },
    {
      question: "What affects price per square foot?",
      answer:
        "Location, condition, age, lot size, renovations, neighborhood desirability, school districts, views, and market conditions all affect price per square foot. Smaller homes often have higher per-sqft costs due to fixed costs like kitchens and bathrooms.",
    },
    {
      question: "Is price per square foot the best way to compare properties?",
      answer:
        "Price per square foot is a useful quick comparison but has limitations. It does not account for lot size, layout efficiency, number of bathrooms, garage space, or outdoor features. Use it as a starting point alongside other valuation methods.",
    },
  ],
  formula: "Fair Value = Neighborhood Avg Price Per Sq Ft x Property Sq Ft x (1 + Condition Adjustment)",
};
