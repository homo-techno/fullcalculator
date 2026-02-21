import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carDepreciationCalculator: CalculatorDefinition = {
  slug: "car-depreciation-calculator",
  title: "Car Depreciation Calculator",
  description:
    "Free car depreciation calculator. Estimate your vehicle's value over time with standard depreciation rates: 20% year 1, 15% years 2-5, 10% after.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "car depreciation",
    "vehicle value",
    "car value",
    "depreciation calculator",
    "auto depreciation",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Car Depreciation",
      fields: [
        {
          name: "purchasePrice",
          label: "Purchase Price ($)",
          type: "number",
          placeholder: "e.g. 35000",
        },
        {
          name: "yearsToProject",
          label: "Years to Project",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const price = inputs.purchasePrice as number;
        const years = inputs.yearsToProject as number;

        if (!price || !years) return null;
        if (price <= 0 || years <= 0) return null;

        const maxYears = Math.min(years, 20);
        let currentValue = price;
        const yearlyValues: { label: string; value: string }[] = [];

        for (let year = 1; year <= maxYears; year++) {
          let depRate: number;
          if (year === 1) {
            depRate = 0.2; // 20% first year
          } else if (year <= 5) {
            depRate = 0.15; // 15% years 2-5
          } else {
            depRate = 0.1; // 10% after year 5
          }

          const depreciation = currentValue * depRate;
          currentValue = currentValue - depreciation;

          yearlyValues.push({
            label: `Year ${year} Value`,
            value: `$${formatNumber(currentValue, 0)} (-${formatNumber(depRate * 100, 0)}%)`,
          });
        }

        const totalDepreciation = price - currentValue;
        const totalDepPct = (totalDepreciation / price) * 100;

        const details: { label: string; value: string }[] = [
          {
            label: "Purchase Price",
            value: `$${formatNumber(price, 0)}`,
          },
          {
            label: `Value After ${maxYears} Years`,
            value: `$${formatNumber(currentValue, 0)}`,
          },
          {
            label: "Total Depreciation",
            value: `$${formatNumber(totalDepreciation, 0)} (${formatNumber(totalDepPct, 1)}%)`,
          },
          ...yearlyValues,
        ];

        return {
          primary: {
            label: `Value After ${maxYears} Years`,
            value: `$${formatNumber(currentValue, 0)}`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["travel-budget-calculator"],
  faq: [
    {
      question: "How fast do cars depreciate?",
      answer:
        "On average, a new car loses about 20% of its value in the first year, 15% per year for years 2-5, and about 10% per year after that. After 5 years, a car is typically worth about 37% of its original price.",
    },
    {
      question: "What factors affect car depreciation?",
      answer:
        "Brand reputation, mileage, condition, market demand, fuel type, and model popularity all affect depreciation. Luxury and exotic cars often depreciate faster, while trucks and certain brands hold value better.",
    },
  ],
  formula:
    "Year 1: Value = Price x 0.80. Years 2-5: Value = Previous x 0.85. Years 6+: Value = Previous x 0.90.",
};
