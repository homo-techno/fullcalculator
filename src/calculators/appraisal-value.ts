import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const appraisalValueCalculator: CalculatorDefinition = {
  slug: "appraisal-value-calculator",
  title: "Home Appraisal Value Estimator",
  description:
    "Free home appraisal value estimator. Estimate your home's appraised value using comparable sales data and property adjustments.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home appraisal calculator",
    "appraisal value estimator",
    "property appraisal",
    "home value estimate",
    "comparable sales calculator",
  ],
  variants: [
    {
      id: "comparable-sales",
      name: "Comparable Sales Method",
      description: "Estimate value based on comparable sales in your area",
      fields: [
        {
          name: "comp1Price",
          label: "Comparable Sale #1 Price",
          type: "number",
          placeholder: "e.g. 380000",
          prefix: "$",
          min: 0,
        },
        {
          name: "comp2Price",
          label: "Comparable Sale #2 Price",
          type: "number",
          placeholder: "e.g. 395000",
          prefix: "$",
          min: 0,
        },
        {
          name: "comp3Price",
          label: "Comparable Sale #3 Price",
          type: "number",
          placeholder: "e.g. 410000",
          prefix: "$",
          min: 0,
        },
        {
          name: "bedroomAdjustment",
          label: "Bedroom Adjustment (+/- per extra/fewer bedroom)",
          type: "number",
          placeholder: "e.g. 10000",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "conditionAdjustment",
          label: "Condition Adjustment",
          type: "select",
          options: [
            { label: "Needs major repairs (-10%)", value: "-10" },
            { label: "Needs minor updates (-5%)", value: "-5" },
            { label: "Average condition (0%)", value: "0" },
            { label: "Good condition (+5%)", value: "5" },
            { label: "Fully renovated (+10%)", value: "10" },
          ],
          defaultValue: "0",
        },
        {
          name: "locationAdjustment",
          label: "Location Adjustment",
          type: "select",
          options: [
            { label: "Less desirable (-5%)", value: "-5" },
            { label: "Similar (0%)", value: "0" },
            { label: "More desirable (+5%)", value: "5" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const comp1 = inputs.comp1Price as number;
        const comp2 = inputs.comp2Price as number;
        const comp3 = inputs.comp3Price as number;
        const bedroomAdj = (inputs.bedroomAdjustment as number) || 0;
        const condAdj = parseInt(inputs.conditionAdjustment as string) || 0;
        const locAdj = parseInt(inputs.locationAdjustment as string) || 0;

        const validComps = [comp1, comp2, comp3].filter(c => c > 0);
        if (validComps.length === 0) return null;

        const avgComp = validComps.reduce((a, b) => a + b, 0) / validComps.length;
        const adjustedValue = (avgComp + bedroomAdj) * (1 + condAdj / 100) * (1 + locAdj / 100);
        const lowEstimate = adjustedValue * 0.95;
        const highEstimate = adjustedValue * 1.05;

        return {
          primary: {
            label: "Estimated Appraisal Value",
            value: `$${formatNumber(adjustedValue)}`,
          },
          details: [
            { label: "Average comparable sale", value: `$${formatNumber(avgComp)}` },
            { label: "Number of comps used", value: `${validComps.length}` },
            { label: "Bedroom adjustment", value: `$${formatNumber(bedroomAdj)}` },
            { label: "Total adjustment percentage", value: `${condAdj + locAdj >= 0 ? "+" : ""}${condAdj + locAdj}%` },
            { label: "Estimated range", value: `$${formatNumber(lowEstimate)} - $${formatNumber(highEstimate)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-appreciation-rate-calculator", "cost-per-square-foot-calculator", "square-footage-price-calculator"],
  faq: [
    {
      question: "How do appraisers determine home value?",
      answer:
        "Appraisers primarily use the comparable sales approach, analyzing recently sold similar properties (comps) in the area. They make adjustments for differences in size, condition, features, and location. They also consider market trends and, for income properties, rental income.",
    },
    {
      question: "What if the appraisal is lower than the purchase price?",
      answer:
        "If the appraisal comes in low, you can: negotiate a lower price with the seller, pay the difference in cash, challenge the appraisal with additional comps, order a second appraisal, or walk away using the appraisal contingency in your contract.",
    },
    {
      question: "How much does a home appraisal cost?",
      answer:
        "A standard home appraisal costs $300-$600, with the national average around $400. Complex properties, rural locations, or large homes may cost more. The appraisal is typically ordered by the lender and paid for by the buyer.",
    },
  ],
  formula: "Estimated Value = Average Comparable Sale + Adjustments (bedrooms, condition, location)",
};
