import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const divorceCostCalculator: CalculatorDefinition = {
  slug: "divorce-cost-calculator",
  title: "Divorce Cost Estimator",
  description:
    "Estimate divorce costs by type. Compare uncontested, mediated, collaborative, and litigated divorce expenses including attorney fees, filing costs, and more.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "divorce cost",
    "divorce fees",
    "divorce attorney",
    "divorce budget",
    "separation cost",
  ],
  variants: [
    {
      id: "byType",
      name: "By Divorce Type",
      description: "Estimate costs based on the type of divorce proceeding",
      fields: [
        { name: "divorceType", label: "Divorce Type", type: "select", options: [
          { label: "Uncontested (agreement)", value: "uncontested" },
          { label: "Mediated", value: "mediated" },
          { label: "Collaborative", value: "collaborative" },
          { label: "Litigated (contested)", value: "litigated" },
        ], defaultValue: "mediated" },
        { name: "filingFee", label: "Court Filing Fee ($)", type: "number", placeholder: "e.g. 300", defaultValue: 300 },
        { name: "attorneyRate", label: "Attorney Hourly Rate ($)", type: "number", placeholder: "e.g. 300", defaultValue: 300 },
        { name: "estimatedHours", label: "Estimated Attorney Hours", type: "number", placeholder: "e.g. 20" },
        { name: "hasChildren", label: "Children Involved?", type: "select", options: [
          { label: "No children", value: "no" },
          { label: "Yes, custody agreed", value: "agreed" },
          { label: "Yes, custody disputed", value: "disputed" },
        ], defaultValue: "no" },
        { name: "hasProperty", label: "Property Complexity", type: "select", options: [
          { label: "Minimal assets", value: "minimal" },
          { label: "Moderate (home, retirement)", value: "moderate" },
          { label: "Complex (business, investments)", value: "complex" },
        ], defaultValue: "moderate" },
      ],
      calculate: (inputs) => {
        const divorceType = inputs.divorceType as string;
        const filingFee = parseFloat(inputs.filingFee as string) || 300;
        const attorneyRate = parseFloat(inputs.attorneyRate as string) || 300;
        const hasChildren = inputs.hasChildren as string;
        const hasProperty = inputs.hasProperty as string;

        const baseHours: Record<string, number> = {
          uncontested: 5,
          mediated: 15,
          collaborative: 25,
          litigated: 50,
        };

        const childMultiplier: Record<string, number> = { no: 1, agreed: 1.3, disputed: 2 };
        const propertyMultiplier: Record<string, number> = { minimal: 0.8, moderate: 1, complex: 1.5 };

        const inputHours = parseFloat(inputs.estimatedHours as string);
        const hours = isNaN(inputHours) ? baseHours[divorceType] || 15 : inputHours;
        const adjustedHours = hours * (childMultiplier[hasChildren] || 1) * (propertyMultiplier[hasProperty] || 1);
        const attorneyFees = adjustedHours * attorneyRate;

        const mediatorCost = divorceType === "mediated" ? 3000 : divorceType === "collaborative" ? 5000 : 0;
        const expertCosts = hasProperty === "complex" ? 3000 : hasProperty === "moderate" ? 500 : 0;
        const totalCost = attorneyFees + filingFee + mediatorCost + expertCosts;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Attorney Fees", value: `$${formatNumber(attorneyFees, 2)}` },
            { label: "Estimated Hours", value: formatNumber(adjustedHours, 1) },
            { label: "Filing Fee", value: `$${formatNumber(filingFee, 2)}` },
            { label: "Mediator/Collaborative Fees", value: `$${formatNumber(mediatorCost, 2)}` },
            { label: "Expert/Appraisal Costs", value: `$${formatNumber(expertCosts, 2)}` },
            { label: "Monthly (spread over 6 months)", value: `$${formatNumber(totalCost / 6, 2)}` },
          ],
        };
      },
    },
    {
      id: "comparison",
      name: "Type Comparison",
      description: "Compare costs across different divorce types",
      fields: [
        { name: "attorneyRate", label: "Attorney Hourly Rate ($)", type: "number", placeholder: "e.g. 300", defaultValue: 300 },
        { name: "filingFee", label: "Court Filing Fee ($)", type: "number", placeholder: "e.g. 300", defaultValue: 300 },
        { name: "complexity", label: "Case Complexity", type: "select", options: [
          { label: "Simple (no kids, few assets)", value: "simple" },
          { label: "Moderate (kids or assets)", value: "moderate" },
          { label: "Complex (kids + assets + disputes)", value: "complex" },
        ], defaultValue: "moderate" },
      ],
      calculate: (inputs) => {
        const attorneyRate = parseFloat(inputs.attorneyRate as string) || 300;
        const filingFee = parseFloat(inputs.filingFee as string) || 300;
        const complexity = inputs.complexity as string;

        const multiplier: Record<string, number> = { simple: 0.7, moderate: 1, complex: 1.8 };
        const m = multiplier[complexity] || 1;

        const uncontested = (5 * m * attorneyRate) + filingFee;
        const mediated = (15 * m * attorneyRate) + filingFee + 3000;
        const collaborative = (25 * m * attorneyRate) + filingFee + 5000;
        const litigated = (50 * m * attorneyRate) + filingFee + 3000;

        return {
          primary: { label: "Most Affordable Option", value: `$${formatNumber(uncontested, 2)}` },
          details: [
            { label: "Uncontested", value: `$${formatNumber(uncontested, 2)}` },
            { label: "Mediated", value: `$${formatNumber(mediated, 2)}` },
            { label: "Collaborative", value: `$${formatNumber(collaborative, 2)}` },
            { label: "Litigated", value: `$${formatNumber(litigated, 2)}` },
            { label: "Savings: Uncontested vs Litigated", value: `$${formatNumber(litigated - uncontested, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["budget-calculator", "loan-calculator", "funeral-cost-calculator"],
  faq: [
    {
      question: "How much does a divorce cost on average?",
      answer:
        "The average divorce costs $7,000-$15,000 per person. Uncontested divorces can cost as little as $500-$3,000, while contested/litigated divorces can exceed $50,000-$100,000 per side.",
    },
    {
      question: "What is the cheapest way to get divorced?",
      answer:
        "An uncontested divorce where both parties agree on all terms is the cheapest option, typically $500-$3,000. Some states allow DIY filing for just the court fee ($150-$500). Mediation is the next most affordable at $3,000-$8,000 total.",
    },
    {
      question: "How long does a divorce take?",
      answer:
        "Uncontested divorces take 2-6 months. Mediated divorces take 3-9 months. Litigated divorces take 12-24+ months. Many states have mandatory waiting periods of 30-90 days.",
    },
  ],
  formula:
    "Total Cost = (Attorney Hours × Hourly Rate × Child Multiplier × Property Multiplier) + Filing Fee + Mediator Fee + Expert Costs",
};
