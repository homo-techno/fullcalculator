import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const franchiseCostCalculator: CalculatorDefinition = {
  slug: "franchise-cost-calculator",
  title: "Franchise Cost Calculator",
  description: "Estimate the total investment needed to open a franchise including fees, buildout, and working capital.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["franchise cost", "franchise investment", "franchise startup cost"],
  variants: [{
    id: "standard",
    name: "Franchise Cost",
    description: "Estimate the total investment needed to open a franchise including fees, buildout, and working capital",
    fields: [
      { name: "franchiseFee", label: "Initial Franchise Fee", type: "number", prefix: "$", min: 0, max: 500000, step: 1000, defaultValue: 35000 },
      { name: "buildoutCost", label: "Buildout and Equipment Cost", type: "number", prefix: "$", min: 0, max: 2000000, step: 5000, defaultValue: 250000 },
      { name: "workingCapital", label: "Working Capital (6 months)", type: "number", prefix: "$", min: 0, max: 500000, step: 1000, defaultValue: 75000 },
      { name: "royaltyRate", label: "Ongoing Royalty Rate", type: "number", suffix: "%", min: 0, max: 15, step: 0.5, defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const fee = inputs.franchiseFee as number;
      const buildout = inputs.buildoutCost as number;
      const working = inputs.workingCapital as number;
      const royalty = inputs.royaltyRate as number;
      const totalInitial = fee + buildout + working;
      const estimatedAnnualRevenue = totalInitial * 1.5;
      const annualRoyalty = estimatedAnnualRevenue * (royalty / 100);
      const fiveYearRoyalty = annualRoyalty * 5;
      return {
        primary: { label: "Total Initial Investment", value: "$" + formatNumber(Math.round(totalInitial)) },
        details: [
          { label: "Franchise Fee", value: "$" + formatNumber(Math.round(fee)) },
          { label: "Estimated Annual Royalty", value: "$" + formatNumber(Math.round(annualRoyalty)) },
          { label: "5-Year Royalty Obligation", value: "$" + formatNumber(Math.round(fiveYearRoyalty)) },
        ],
      };
    },
  }],
  relatedSlugs: ["business-valuation-calculator", "llc-cost-calculator"],
  faq: [
    { question: "What are the typical costs to open a franchise?", answer: "Total franchise investment typically ranges from $100,000 for a small service franchise to over $1 million for a restaurant or hotel franchise, including the franchise fee, buildout, equipment, and working capital." },
    { question: "What is a franchise royalty fee?", answer: "A franchise royalty fee is an ongoing percentage of gross revenue (typically 4 to 8 percent) paid to the franchisor for the right to use the brand, systems, and ongoing support." },
  ],
  formula: "Total Investment = Franchise Fee + Buildout Cost + Working Capital",
};
