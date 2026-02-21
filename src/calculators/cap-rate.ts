import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capRateCalculator: CalculatorDefinition = {
  slug: "cap-rate-calculator",
  title: "Cap Rate Calculator",
  description:
    "Free cap rate calculator. Calculate the capitalization rate for real estate investments to compare property returns and estimate property value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "cap rate calculator",
    "capitalization rate",
    "cap rate real estate",
    "property cap rate",
    "real estate cap rate calculator",
  ],
  variants: [
    {
      id: "cap-rate",
      name: "Calculate Cap Rate",
      description: "Find the cap rate from NOI and property value",
      fields: [
        { name: "noi", label: "Annual Net Operating Income (NOI)", type: "number", placeholder: "e.g. 36000", prefix: "$", min: 0 },
        { name: "propertyValue", label: "Property Value / Purchase Price", type: "number", placeholder: "e.g. 450000", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const noi = inputs.noi as number;
        const value = inputs.propertyValue as number;
        if (!noi || !value) return null;

        const capRate = (noi / value) * 100;
        const monthlyNOI = noi / 12;

        return {
          primary: { label: "Cap Rate", value: `${formatNumber(capRate, 2)}%` },
          details: [
            { label: "Annual NOI", value: `$${formatNumber(noi)}` },
            { label: "Monthly NOI", value: `$${formatNumber(monthlyNOI)}` },
            { label: "Property value", value: `$${formatNumber(value)}` },
          ],
          note: capRate < 4 ? "A cap rate below 4% is considered low-yield but may indicate a stable, low-risk market." : capRate > 10 ? "A cap rate above 10% may indicate higher risk or an undervalued property." : undefined,
        };
      },
    },
    {
      id: "property-value",
      name: "Estimate Property Value",
      description: "Estimate property value from NOI and desired cap rate",
      fields: [
        { name: "noi", label: "Annual NOI", type: "number", placeholder: "e.g. 36000", prefix: "$", min: 0 },
        { name: "targetCapRate", label: "Target Cap Rate", type: "number", placeholder: "e.g. 7", suffix: "%", min: 0.1, max: 30, step: 0.1 },
      ],
      calculate: (inputs) => {
        const noi = inputs.noi as number;
        const targetRate = inputs.targetCapRate as number;
        if (!noi || !targetRate) return null;

        const estimatedValue = noi / (targetRate / 100);

        return {
          primary: { label: "Estimated Property Value", value: `$${formatNumber(estimatedValue)}` },
          details: [
            { label: "Annual NOI", value: `$${formatNumber(noi)}` },
            { label: "Target cap rate", value: `${formatNumber(targetRate, 2)}%` },
            { label: "Price per dollar of NOI", value: `$${formatNumber(estimatedValue / noi, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["noi-calculator", "rental-income-calculator", "cash-on-cash-calculator"],
  faq: [
    {
      question: "What is a cap rate?",
      answer:
        "Capitalization rate (cap rate) is the ratio of a property's Net Operating Income (NOI) to its market value. Cap Rate = NOI / Property Value. It measures the expected rate of return on a real estate investment, independent of financing.",
    },
    {
      question: "What is a good cap rate?",
      answer:
        "A 'good' cap rate depends on market and risk tolerance. Generally, 4-6% is typical in stable urban markets, 6-8% in suburban areas, and 8-12% in higher-risk or rural markets. Higher cap rates mean higher potential returns but usually more risk.",
    },
    {
      question: "How is cap rate different from ROI?",
      answer:
        "Cap rate uses NOI (before mortgage payments) divided by property value, so it measures property performance regardless of financing. ROI (or cash-on-cash return) factors in your actual cash invested and debt payments, measuring your personal return after leverage.",
    },
  ],
  formula: "Cap Rate = (Annual NOI / Property Value) × 100 | Property Value = NOI / Cap Rate",
};
