import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const commercialInsuranceCalculator: CalculatorDefinition = {
  slug: "commercial-insurance-calculator",
  title: "Commercial Insurance Calculator",
  description: "Estimate commercial business insurance premiums based on business type, revenue, and coverage needs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["commercial insurance cost", "business insurance calculator", "commercial insurance premium"],
  variants: [{
    id: "standard",
    name: "Commercial Insurance",
    description: "Estimate commercial business insurance premiums based on business type, revenue, and coverage needs",
    fields: [
      { name: "businessType", label: "Business Type", type: "select", options: [{value:"office",label:"Office/Professional"},{value:"retail",label:"Retail Store"},{value:"restaurant",label:"Restaurant"},{value:"construction",label:"Construction"}], defaultValue: "office" },
      { name: "annualRevenue", label: "Annual Revenue", type: "number", prefix: "$", min: 0, max: 50000000, step: 10000, defaultValue: 500000 },
      { name: "employees", label: "Number of Employees", type: "number", suffix: "employees", min: 1, max: 500, defaultValue: 10 },
      { name: "coverageLevel", label: "Coverage Level", type: "select", options: [{value:"basic",label:"Basic"},{value:"standard",label:"Standard"},{value:"comprehensive",label:"Comprehensive"}], defaultValue: "standard" },
    ],
    calculate: (inputs) => {
      const bizType = inputs.businessType as string;
      const revenue = inputs.annualRevenue as number;
      const employees = inputs.employees as number;
      const coverage = inputs.coverageLevel as string;
      if (!revenue || revenue <= 0) return null;
      const baseRates: Record<string, number> = { office: 0.004, retail: 0.006, restaurant: 0.008, construction: 0.012 };
      const coverageMod: Record<string, number> = { basic: 0.7, standard: 1.0, comprehensive: 1.4 };
      const glPremium = revenue * (baseRates[bizType] || 0.006) * (coverageMod[coverage] || 1.0);
      const wcPremium = employees * 800 * (bizType === "construction" ? 2.5 : 1.0);
      const propertyPremium = revenue * 0.002;
      const totalAnnual = glPremium + wcPremium + propertyPremium;
      const monthlyPremium = totalAnnual / 12;
      return {
        primary: { label: "Estimated Annual Premium", value: "$" + formatNumber(Math.round(totalAnnual)) },
        details: [
          { label: "Monthly Premium", value: "$" + formatNumber(Math.round(monthlyPremium)) },
          { label: "General Liability", value: "$" + formatNumber(Math.round(glPremium)) },
          { label: "Workers Compensation", value: "$" + formatNumber(Math.round(wcPremium)) },
        ],
      };
    },
  }],
  relatedSlugs: ["workers-comp-calculator", "llc-cost-calculator"],
  faq: [
    { question: "What types of commercial insurance does a business need?", answer: "Most businesses need general liability insurance, commercial property insurance, and workers compensation. Depending on the industry, you may also need professional liability, commercial auto, or cyber liability coverage." },
    { question: "How much does commercial insurance cost for a small business?", answer: "Small business insurance typically costs between $500 and $5,000 per year for general liability alone. Total annual premiums including all coverage types often range from $2,000 to $15,000." },
  ],
  formula: "Total Premium = General Liability + Workers Comp + Property Insurance",
};
