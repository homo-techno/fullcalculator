import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeWarrantyCalculator: CalculatorDefinition = {
  slug: "home-warranty-calculator",
  title: "Home Warranty Calculator",
  description: "Determine the potential value of a home warranty by comparing coverage costs to expected repair expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["home warranty cost", "home warranty value", "home warranty calculator"],
  variants: [{
    id: "standard",
    name: "Home Warranty",
    description: "Determine the potential value of a home warranty by comparing coverage costs to expected repair expenses",
    fields: [
      { name: "homeAge", label: "Home Age", type: "number", suffix: "years", min: 0, max: 100, defaultValue: 15 },
      { name: "planType", label: "Warranty Plan Type", type: "select", options: [{value:"basic",label:"Basic (major systems only)"},{value:"standard",label:"Standard (systems + appliances)"},{value:"premium",label:"Premium (comprehensive)"}], defaultValue: "standard" },
      { name: "annualPremium", label: "Annual Warranty Premium", type: "number", prefix: "$", min: 200, max: 1500, step: 25, defaultValue: 550 },
      { name: "serviceFee", label: "Service Call Fee", type: "number", prefix: "$", min: 50, max: 200, step: 25, defaultValue: 75 },
    ],
    calculate: (inputs) => {
      const age = inputs.homeAge as number;
      const plan = inputs.planType as string;
      const premium = inputs.annualPremium as number;
      const serviceFee = inputs.serviceFee as number;
      if (!premium || premium <= 0) return null;
      const avgRepairsByAge = age < 5 ? 300 : age < 15 ? 800 : age < 30 ? 1500 : 2500;
      const coverageMod: Record<string, number> = { basic: 0.5, standard: 0.7, premium: 0.9 };
      const coveredRepairs = avgRepairsByAge * (coverageMod[plan] || 0.7);
      const estimatedCalls = age < 5 ? 1 : age < 15 ? 2 : 3;
      const totalWarrantyCost = premium + serviceFee * estimatedCalls;
      const netValue = coveredRepairs - totalWarrantyCost;
      return {
        primary: { label: "Estimated Annual Net Value", value: (netValue >= 0 ? "$" : "-$") + formatNumber(Math.abs(Math.round(netValue))) },
        details: [
          { label: "Expected Covered Repairs", value: "$" + formatNumber(Math.round(coveredRepairs)) },
          { label: "Total Warranty Cost", value: "$" + formatNumber(Math.round(totalWarrantyCost)) },
          { label: "Estimated Service Calls", value: formatNumber(estimatedCalls) + " per year" },
        ],
      };
    },
  }],
  relatedSlugs: ["hoa-fee-impact-calculator", "earnest-money-calculator"],
  faq: [
    { question: "Is a home warranty worth it?", answer: "A home warranty is generally more valuable for older homes with aging systems and appliances. For newer homes, the manufacturer warranties may provide sufficient coverage." },
    { question: "What does a home warranty cover?", answer: "A typical home warranty covers major home systems such as HVAC, plumbing, and electrical, as well as appliances like refrigerators, dishwashers, and washers. Coverage varies by plan level." },
  ],
  formula: "Net Value = Expected Covered Repairs - (Annual Premium + Service Fees x Estimated Calls)",
};
