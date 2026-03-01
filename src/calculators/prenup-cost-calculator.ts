import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const prenupCostCalculator: CalculatorDefinition = {
  slug: "prenup-cost-calculator",
  title: "Prenup Cost Calculator",
  description: "Estimate the total cost of a prenuptial agreement based on complexity, location, and attorney fees.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["prenup cost", "prenuptial agreement cost", "prenup attorney fees"],
  variants: [{
    id: "standard",
    name: "Prenup Cost",
    description: "Estimate the total cost of a prenuptial agreement based on complexity, location, and attorney fees",
    fields: [
      { name: "complexity", label: "Agreement Complexity", type: "select", options: [{value:"simple",label:"Simple (few assets)"},{value:"moderate",label:"Moderate"},{value:"complex",label:"Complex (many assets)"}], defaultValue: "moderate" },
      { name: "hourlyRate", label: "Attorney Hourly Rate", type: "number", prefix: "$", min: 100, max: 1000, step: 25, defaultValue: 300 },
      { name: "needsTwoAttorneys", label: "Both Parties Need Attorneys", type: "select", options: [{value:"yes",label:"Yes"},{value:"no",label:"No"}], defaultValue: "yes" },
    ],
    calculate: (inputs) => {
      const complexity = inputs.complexity as string;
      const rate = inputs.hourlyRate as number;
      const both = inputs.needsTwoAttorneys as string;
      if (!rate || rate <= 0) return null;
      const hours: Record<string, number> = { simple: 5, moderate: 10, complex: 20 };
      const baseHours = hours[complexity] || 10;
      const primaryCost = baseHours * rate;
      const secondaryCost = both === "yes" ? baseHours * rate * 0.8 : 0;
      const filingFees = 150;
      const totalCost = primaryCost + secondaryCost + filingFees;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
        details: [
          { label: "Primary Attorney Cost", value: "$" + formatNumber(Math.round(primaryCost)) },
          { label: "Second Attorney Cost", value: "$" + formatNumber(Math.round(secondaryCost)) },
          { label: "Filing and Administrative Fees", value: "$" + formatNumber(filingFees) },
        ],
      };
    },
  }],
  relatedSlugs: ["estate-tax-calculator", "trust-fund-calculator"],
  faq: [
    { question: "How much does a prenup typically cost?", answer: "A prenuptial agreement typically costs between $1,500 and $10,000 depending on the complexity of assets and the attorneys involved." },
    { question: "Do both parties need separate attorneys for a prenup?", answer: "It is strongly recommended that each party has independent legal counsel to ensure the agreement is enforceable and fair." },
  ],
  formula: "Total Cost = (Attorney Hours x Hourly Rate) + Second Attorney Cost + Filing Fees",
};
