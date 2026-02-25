import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeWarrantyCostCalculator: CalculatorDefinition = {
  slug: "home-warranty-cost-calculator",
  title: "Home Warranty Cost Calculator",
  description:
    "Free home warranty cost calculator. Compare home warranty plan costs, estimate potential savings, and determine if a home warranty is worth the investment.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "home warranty cost",
    "home warranty calculator",
    "home warranty worth it",
    "home warranty savings",
    "home warranty comparison",
  ],
  variants: [
    {
      id: "cost-analysis",
      name: "Cost vs Savings Analysis",
      description: "Determine if a home warranty saves you money",
      fields: [
        {
          name: "annualPremium",
          label: "Annual Warranty Premium",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
        },
        {
          name: "serviceCallFee",
          label: "Service Call Fee",
          type: "number",
          placeholder: "e.g. 75",
          prefix: "$",
          min: 0,
        },
        {
          name: "expectedClaims",
          label: "Expected Claims Per Year",
          type: "select",
          options: [
            { label: "1 claim", value: "1" },
            { label: "2 claims", value: "2" },
            { label: "3 claims", value: "3" },
            { label: "4 claims", value: "4" },
            { label: "5 claims", value: "5" },
          ],
          defaultValue: "2",
        },
        {
          name: "avgRepairCost",
          label: "Average Repair Cost Without Warranty",
          type: "number",
          placeholder: "e.g. 350",
          prefix: "$",
          min: 0,
        },
        {
          name: "years",
          label: "Years to Analyze",
          type: "select",
          options: [
            { label: "1 year", value: "1" },
            { label: "3 years", value: "3" },
            { label: "5 years", value: "5" },
            { label: "10 years", value: "10" },
          ],
          defaultValue: "5",
        },
      ],
      calculate: (inputs) => {
        const premium = inputs.annualPremium as number;
        const callFee = (inputs.serviceCallFee as number) || 0;
        const claims = parseInt(inputs.expectedClaims as string) || 2;
        const avgRepair = inputs.avgRepairCost as number;
        const years = parseInt(inputs.years as string) || 5;
        if (!premium || !avgRepair) return null;

        const annualWarrantyCost = premium + (callFee * claims);
        const annualRepairCostWithout = avgRepair * claims;
        const annualSavings = annualRepairCostWithout - annualWarrantyCost;
        const totalSavings = annualSavings * years;
        const totalWarrantyCost = annualWarrantyCost * years;
        const totalRepairCost = annualRepairCostWithout * years;

        return {
          primary: {
            label: `${years}-Year Net Savings`,
            value: `$${formatNumber(totalSavings)}`,
          },
          details: [
            { label: "Annual warranty cost", value: `$${formatNumber(annualWarrantyCost)}` },
            { label: "Annual repair cost without warranty", value: `$${formatNumber(annualRepairCostWithout)}` },
            { label: "Annual savings", value: `$${formatNumber(annualSavings)}` },
            { label: `Total warranty cost (${years} yr)`, value: `$${formatNumber(totalWarrantyCost)}` },
            { label: `Total repair cost without (${years} yr)`, value: `$${formatNumber(totalRepairCost)}` },
            { label: "Verdict", value: totalSavings > 0 ? "Warranty saves money" : "Warranty costs more" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["home-inspection-cost-calculator", "mortgage-calculator", "moving-cost-estimate-calculator"],
  faq: [
    {
      question: "How much does a home warranty cost?",
      answer:
        "Home warranties typically cost $300-$600 per year for basic coverage and $500-$1,000+ for comprehensive plans. Service call fees range from $50-$125 per visit. Costs vary by provider, coverage level, and home size.",
    },
    {
      question: "What does a home warranty cover?",
      answer:
        "Home warranties typically cover major systems (HVAC, plumbing, electrical) and appliances (refrigerator, washer, dryer, dishwasher). They do not cover pre-existing conditions, cosmetic issues, or items outside normal wear and tear.",
    },
    {
      question: "Is a home warranty worth it?",
      answer:
        "A home warranty is more valuable for older homes with aging systems and appliances, and for homeowners who lack repair skills or emergency funds. For newer homes with modern appliances still under manufacturer warranty, it may not be cost-effective.",
    },
  ],
  formula: "Net Savings = (Avg Repair Cost x Claims) - (Annual Premium + Service Fee x Claims)",
};
