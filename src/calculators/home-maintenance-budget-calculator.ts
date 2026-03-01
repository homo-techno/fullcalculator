import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeMaintenanceBudgetCalculator: CalculatorDefinition = {
  slug: "home-maintenance-budget-calculator",
  title: "Home Maintenance Budget Calculator",
  description: "Calculate the recommended annual home maintenance budget based on home value, age, and condition.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["home maintenance budget", "home repair budget", "annual home maintenance cost"],
  variants: [{
    id: "standard",
    name: "Home Maintenance Budget",
    description: "Calculate the recommended annual home maintenance budget based on home value, age, and condition",
    fields: [
      { name: "homeValue", label: "Current Home Value", type: "number", prefix: "$", min: 50000, max: 5000000, step: 10000, defaultValue: 350000 },
      { name: "homeAge", label: "Home Age", type: "number", suffix: "years", min: 0, max: 100, defaultValue: 20 },
      { name: "condition", label: "Overall Condition", type: "select", options: [{value:"excellent",label:"Excellent"},{value:"good",label:"Good"},{value:"fair",label:"Fair"},{value:"poor",label:"Poor"}], defaultValue: "good" },
      { name: "squareFeet", label: "Square Footage", type: "number", suffix: "sq ft", min: 500, max: 10000, step: 100, defaultValue: 2000 },
    ],
    calculate: (inputs) => {
      const value = inputs.homeValue as number;
      const age = inputs.homeAge as number;
      const condition = inputs.condition as string;
      const sqft = inputs.squareFeet as number;
      if (!value || value <= 0) return null;
      let baseRate = 0.01;
      if (age > 30) baseRate = 0.02;
      else if (age > 15) baseRate = 0.015;
      else if (age > 5) baseRate = 0.01;
      else baseRate = 0.005;
      const conditionMod: Record<string, number> = { excellent: 0.7, good: 1.0, fair: 1.3, poor: 1.6 };
      const modifier = conditionMod[condition] || 1.0;
      const annualBudget = value * baseRate * modifier;
      const sqftCost = sqft > 0 ? annualBudget / sqft : 0;
      const monthlyReserve = annualBudget / 12;
      return {
        primary: { label: "Recommended Annual Budget", value: "$" + formatNumber(Math.round(annualBudget)) },
        details: [
          { label: "Monthly Reserve", value: "$" + formatNumber(Math.round(monthlyReserve)) },
          { label: "Cost Per Square Foot", value: "$" + formatNumber(Math.round(sqftCost * 100) / 100) },
          { label: "Percentage of Home Value", value: formatNumber(Math.round(baseRate * modifier * 10000) / 100) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["repair-vs-replace-calculator", "appliance-lifespan-calculator"],
  faq: [
    { question: "How much should I budget for home maintenance?", answer: "The general rule is 1 to 2 percent of the home value per year. Older homes and those in poor condition may require 2 to 4 percent. A $350,000 home should budget $3,500 to $7,000 annually." },
    { question: "What are the most expensive home maintenance items?", answer: "The most costly items include roof replacement ($5,000 to $15,000), HVAC replacement ($4,000 to $12,000), foundation repairs ($2,000 to $10,000), and siding replacement ($5,000 to $15,000)." },
  ],
  formula: "Annual Budget = Home Value x Base Rate (by age) x Condition Modifier",
};
