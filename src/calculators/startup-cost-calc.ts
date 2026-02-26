import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const startupCostCalc: CalculatorDefinition = {
  slug: "startup-cost-calc",
  title: "Startup Cost Calculator",
  description: "Free online startup cost estimator. Estimate initial costs to launch a business by type, including legal, equipment, marketing, and operating expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["startup costs", "business startup", "launch costs", "business expenses", "starting a business", "business budget", "startup budget"],
  variants: [
    {
      id: "by-type",
      name: "Estimate by Business Type",
      fields: [
        {
          name: "businessType",
          label: "Business Type",
          type: "select",
          options: [
            { label: "Online / E-commerce", value: "ecommerce" },
            { label: "Restaurant / Food Service", value: "restaurant" },
            { label: "Retail Store", value: "retail" },
            { label: "Professional Services (Law, Accounting)", value: "professional" },
            { label: "Tech Startup / SaaS", value: "tech" },
            { label: "Freelance / Consulting", value: "freelance" },
            { label: "Construction / Trades", value: "construction" },
            { label: "Healthcare Practice", value: "healthcare" },
          ],
        },
        {
          name: "location",
          label: "Location Cost Level",
          type: "select",
          options: [
            { label: "Low Cost (rural, small city)", value: "low" },
            { label: "Medium Cost (mid-size city)", value: "medium" },
            { label: "High Cost (major metro)", value: "high" },
          ],
        },
        {
          name: "employees",
          label: "Initial Number of Employees",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
        },
        {
          name: "monthsRunway",
          label: "Months of Operating Runway",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 36,
        },
      ],
      calculate: (inputs) => {
        const businessType = inputs.businessType as string;
        const location = inputs.location as string;
        const employees = parseFloat(inputs.employees as string) || 0;
        const monthsRunway = parseFloat(inputs.monthsRunway as string) || 6;

        const baseCosts: Record<string, { legal: number; equipment: number; inventory: number; marketing: number; monthlyOps: number }> = {
          ecommerce: { legal: 1500, equipment: 2000, inventory: 5000, marketing: 3000, monthlyOps: 1500 },
          restaurant: { legal: 5000, equipment: 50000, inventory: 10000, marketing: 5000, monthlyOps: 15000 },
          retail: { legal: 3000, equipment: 15000, inventory: 20000, marketing: 5000, monthlyOps: 8000 },
          professional: { legal: 5000, equipment: 5000, inventory: 0, marketing: 3000, monthlyOps: 5000 },
          tech: { legal: 5000, equipment: 10000, inventory: 0, marketing: 10000, monthlyOps: 8000 },
          freelance: { legal: 500, equipment: 2000, inventory: 0, marketing: 1000, monthlyOps: 500 },
          construction: { legal: 3000, equipment: 30000, inventory: 5000, marketing: 2000, monthlyOps: 5000 },
          healthcare: { legal: 10000, equipment: 40000, inventory: 5000, marketing: 5000, monthlyOps: 12000 },
        };

        const locationMultipliers: Record<string, number> = { low: 0.7, medium: 1.0, high: 1.5 };
        const locMult = locationMultipliers[location] || 1.0;

        const costs = baseCosts[businessType] || baseCosts.freelance;
        const legal = costs.legal * locMult;
        const equipment = costs.equipment * locMult;
        const inventory = costs.inventory * locMult;
        const marketing = costs.marketing * locMult;
        const monthlyOps = costs.monthlyOps * locMult;

        const employeeCostMonthly = employees * 4500 * locMult;
        const operatingRunway = (monthlyOps + employeeCostMonthly) * monthsRunway;

        const oneTimeCosts = legal + equipment + inventory + marketing;
        const totalStartupCost = oneTimeCosts + operatingRunway;

        return {
          primary: { label: "Total Estimated Startup Cost", value: "$" + formatNumber(totalStartupCost) },
          details: [
            { label: "Legal & Licensing", value: "$" + formatNumber(legal) },
            { label: "Equipment & Technology", value: "$" + formatNumber(equipment) },
            { label: "Initial Inventory", value: "$" + formatNumber(inventory) },
            { label: "Marketing & Branding", value: "$" + formatNumber(marketing) },
            { label: "One-Time Costs Subtotal", value: "$" + formatNumber(oneTimeCosts) },
            { label: "Monthly Operating Cost", value: "$" + formatNumber(monthlyOps + employeeCostMonthly) },
            { label: "Operating Runway (" + monthsRunway + " months)", value: "$" + formatNumber(operatingRunway) },
          ],
        };
      },
    },
    {
      id: "custom",
      name: "Custom Cost Breakdown",
      fields: [
        {
          name: "legalFees",
          label: "Legal & Registration Fees ($)",
          type: "number",
          placeholder: "e.g. 3000",
          min: 0,
        },
        {
          name: "equipment",
          label: "Equipment & Technology ($)",
          type: "number",
          placeholder: "e.g. 10000",
          min: 0,
        },
        {
          name: "inventory",
          label: "Initial Inventory ($)",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
        },
        {
          name: "marketing",
          label: "Marketing & Branding ($)",
          type: "number",
          placeholder: "e.g. 5000",
          min: 0,
        },
        {
          name: "rent",
          label: "Monthly Rent / Lease ($)",
          type: "number",
          placeholder: "e.g. 2000",
          min: 0,
        },
        {
          name: "utilities",
          label: "Monthly Utilities & Insurance ($)",
          type: "number",
          placeholder: "e.g. 500",
          min: 0,
        },
        {
          name: "monthsRunway",
          label: "Months of Runway",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const legalFees = parseFloat(inputs.legalFees as string) || 0;
        const equipment = parseFloat(inputs.equipment as string) || 0;
        const inventory = parseFloat(inputs.inventory as string) || 0;
        const marketing = parseFloat(inputs.marketing as string) || 0;
        const rent = parseFloat(inputs.rent as string) || 0;
        const utilities = parseFloat(inputs.utilities as string) || 0;
        const monthsRunway = parseFloat(inputs.monthsRunway as string) || 6;

        const oneTime = legalFees + equipment + inventory + marketing;
        const monthlyOps = rent + utilities;
        const totalOps = monthlyOps * monthsRunway;
        const total = oneTime + totalOps;

        return {
          primary: { label: "Total Startup Cost", value: "$" + formatNumber(total) },
          details: [
            { label: "One-Time Costs", value: "$" + formatNumber(oneTime) },
            { label: "Monthly Operating Costs", value: "$" + formatNumber(monthlyOps) },
            { label: "Operating Runway (" + monthsRunway + " mo)", value: "$" + formatNumber(totalOps) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sales-forecast", "consulting-rate-calc", "npv-calculator"],
  faq: [
    {
      question: "How much does it cost to start a business?",
      answer: "Startup costs vary widely by industry. A freelance business may cost under $5,000, while a restaurant can cost $100,000-$500,000+. Key expenses include legal fees, equipment, inventory, marketing, and several months of operating expenses.",
    },
    {
      question: "What is an operating runway?",
      answer: "Operating runway is the number of months you can operate before running out of money. Most experts recommend having 6-12 months of operating expenses saved before launching, as most businesses take time to become profitable.",
    },
    {
      question: "Are startup costs tax deductible?",
      answer: "Yes. You can deduct up to $5,000 in startup costs in the first year (if total costs are under $50,000). The remainder is amortized over 15 years. This includes research, marketing, training, and professional fees incurred before opening.",
    },
  ],
  formula: "Total Startup Cost = One-Time Costs + (Monthly Operating Costs x Months of Runway)",
};
