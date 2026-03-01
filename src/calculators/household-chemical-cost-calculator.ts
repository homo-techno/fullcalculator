import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const householdChemicalCostCalculator: CalculatorDefinition = {
  slug: "household-chemical-cost-calculator",
  title: "Household Chemical Cost Calculator",
  description: "Estimate your annual spending on cleaning supplies and household chemicals.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cleaning supply cost", "household chemical budget", "cleaning product cost"],
  variants: [{
    id: "standard",
    name: "Household Chemical Cost",
    description: "Estimate your annual spending on cleaning supplies and household chemicals",
    fields: [
      { name: "homeSize", label: "Home Size", type: "number", suffix: "sq ft", min: 200, max: 20000, defaultValue: 2000 },
      { name: "people", label: "Household Members", type: "number", min: 1, max: 12, defaultValue: 4 },
      { name: "cleaningFreq", label: "Cleaning Frequency", type: "select", options: [{value:"weekly",label:"Weekly"},{value:"biweekly",label:"Every 2 Weeks"},{value:"monthly",label:"Monthly"}], defaultValue: "weekly" },
      { name: "productType", label: "Product Preference", type: "select", options: [{value:"budget",label:"Budget/Store Brand"},{value:"name",label:"Name Brand"},{value:"eco",label:"Eco-Friendly/Green"},{value:"diy",label:"DIY/Homemade"}], defaultValue: "name" },
    ],
    calculate: (inputs) => {
      const size = inputs.homeSize as number;
      const people = inputs.people as number;
      const freq = inputs.cleaningFreq as string;
      const product = inputs.productType as string;
      if (!size || !people) return null;
      const baseCostPerMonth = 25 + people * 8 + (size / 1000) * 5;
      const freqMult: Record<string, number> = { weekly: 1.0, biweekly: 0.7, monthly: 0.4 };
      const productMult: Record<string, number> = { budget: 0.6, name: 1.0, eco: 1.5, diy: 0.3 };
      const monthly = Math.round(baseCostPerMonth * (freqMult[freq] || 1.0) * (productMult[product] || 1.0));
      const annual = monthly * 12;
      const topProducts = product === "diy" ? "Vinegar, baking soda, castile soap" : "All-purpose cleaner, dish soap, laundry detergent";
      return {
        primary: { label: "Monthly Budget", value: "$" + formatNumber(monthly) },
        details: [
          { label: "Annual Budget", value: "$" + formatNumber(annual) },
          { label: "Top Products", value: topProducts },
          { label: "Cost per Person", value: "$" + formatNumber(Math.round(annual / people)) + "/year" },
        ],
      };
    },
  }],
  relatedSlugs: ["vacuum-cleaner-cost-calculator", "lightbulb-comparison-calculator"],
  faq: [
    { question: "How much should I spend on cleaning supplies?", answer: "The average household spends $40-$80 per month on cleaning supplies. Eco-friendly products cost more while DIY solutions can cut costs by 60-70%." },
    { question: "What are the essential cleaning supplies?", answer: "Essential supplies include all-purpose cleaner, dish soap, laundry detergent, glass cleaner, disinfectant, sponges, and trash bags." },
  ],
  formula: "Monthly Cost = (Base + Per Person + Per 1000 sqft) x Frequency x Product Multiplier",
};
