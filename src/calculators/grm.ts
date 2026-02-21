import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grmCalculator: CalculatorDefinition = {
  slug: "grm-calculator",
  title: "Gross Rent Multiplier Calculator",
  description:
    "Free gross rent multiplier (GRM) calculator. Quickly evaluate and compare real estate investment properties using the GRM ratio.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "gross rent multiplier calculator",
    "GRM calculator",
    "GRM real estate",
    "gross rent multiplier",
    "property GRM",
  ],
  variants: [
    {
      id: "calculate-grm",
      name: "Calculate GRM",
      description: "Find the gross rent multiplier for a property",
      fields: [
        { name: "propertyPrice", label: "Property Price", type: "number", placeholder: "e.g. 400000", prefix: "$", min: 0 },
        { name: "annualRent", label: "Annual Gross Rent", type: "number", placeholder: "e.g. 36000", prefix: "$", min: 0 },
      ],
      calculate: (inputs) => {
        const price = inputs.propertyPrice as number;
        const annualRent = inputs.annualRent as number;
        if (!price || !annualRent) return null;

        const grm = price / annualRent;
        const monthlyRent = annualRent / 12;
        const grossYield = (annualRent / price) * 100;

        return {
          primary: { label: "Gross Rent Multiplier", value: formatNumber(grm, 2) },
          details: [
            { label: "Property price", value: `$${formatNumber(price)}` },
            { label: "Annual gross rent", value: `$${formatNumber(annualRent)}` },
            { label: "Monthly gross rent", value: `$${formatNumber(monthlyRent)}` },
            { label: "Gross rental yield", value: `${formatNumber(grossYield, 2)}%` },
          ],
          note: grm > 20 ? "A GRM above 20 suggests the property may be overpriced relative to rental income." : grm < 8 ? "A GRM below 8 is attractive and may indicate strong cash flow potential." : undefined,
        };
      },
    },
    {
      id: "estimate-value",
      name: "Estimate Value from GRM",
      description: "Estimate property value using a target GRM",
      fields: [
        { name: "annualRent", label: "Annual Gross Rent", type: "number", placeholder: "e.g. 36000", prefix: "$", min: 0 },
        { name: "targetGRM", label: "Target GRM", type: "number", placeholder: "e.g. 12", min: 0, step: 0.1 },
      ],
      calculate: (inputs) => {
        const annualRent = inputs.annualRent as number;
        const grm = inputs.targetGRM as number;
        if (!annualRent || !grm) return null;

        const estimatedValue = annualRent * grm;

        return {
          primary: { label: "Estimated Property Value", value: `$${formatNumber(estimatedValue)}` },
          details: [
            { label: "Annual gross rent", value: `$${formatNumber(annualRent)}` },
            { label: "Target GRM", value: formatNumber(grm, 2) },
            { label: "Monthly rent", value: `$${formatNumber(annualRent / 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cap-rate-calculator", "rental-income-calculator", "rental-yield-calculator"],
  faq: [
    {
      question: "What is Gross Rent Multiplier (GRM)?",
      answer:
        "GRM is a quick screening metric for investment properties. GRM = Property Price / Annual Gross Rent. A lower GRM means the property generates more rent relative to its price. It's simpler than cap rate because it doesn't account for expenses.",
    },
    {
      question: "What is a good GRM?",
      answer:
        "GRM varies by market. Generally, 4-8 is excellent, 8-12 is good, 12-20 is average, and above 20 may be overpriced for investment. Compare GRM to similar properties in the same market rather than using a universal benchmark.",
    },
    {
      question: "GRM vs. Cap Rate: which should I use?",
      answer:
        "GRM is a quick screening tool that uses gross rent (ignoring expenses). Cap rate uses Net Operating Income (after expenses). Cap rate is more accurate for comparing investments. Use GRM to quickly filter properties, then calculate cap rate for serious analysis.",
    },
  ],
  formula: "GRM = Property Price / Annual Gross Rent | Estimated Value = Annual Rent × GRM",
};
