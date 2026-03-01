import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catLitterCostCalculator: CalculatorDefinition = {
  slug: "cat-litter-cost-calculator",
  title: "Cat Litter Cost Calculator",
  description: "Estimate monthly and yearly cat litter expenses based on number of cats, litter type, and usage habits.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cat litter cost", "cat litter budget", "litter expense calculator"],
  variants: [{
    id: "standard",
    name: "Cat Litter Cost",
    description: "Estimate monthly and yearly cat litter expenses based on number of cats, litter type, and usage habits",
    fields: [
      { name: "cats", label: "Number of Cats", type: "number", min: 1, max: 10, defaultValue: 1 },
      { name: "litterType", label: "Litter Type", type: "select", options: [{value:"clay",label:"Clay (Clumping)"},{value:"crystal",label:"Crystal/Silica"},{value:"pine",label:"Pine/Natural"},{value:"premium",label:"Premium Clumping"}], defaultValue: "clay" },
      { name: "changeFrequency", label: "Full Change Frequency", type: "select", options: [{value:"weekly",label:"Weekly"},{value:"biweekly",label:"Every 2 Weeks"},{value:"monthly",label:"Monthly"}], defaultValue: "biweekly" },
    ],
    calculate: (inputs) => {
      const cats = inputs.cats as number;
      const type = inputs.litterType as string;
      const freq = inputs.changeFrequency as string;
      if (!cats || cats <= 0) return null;
      const costPerLb: Record<string, number> = { clay: 0.40, crystal: 1.20, pine: 0.30, premium: 0.80 };
      const lbsPerBox = 20;
      const changesPerMonth: Record<string, number> = { weekly: 4.3, biweekly: 2.15, monthly: 1 };
      const changes = changesPerMonth[freq] || 2.15;
      const lbsPerMonth = lbsPerBox * changes * (1 + (cats - 1) * 0.6);
      const monthlyTotal = lbsPerMonth * (costPerLb[type] || 0.40);
      const yearly = monthlyTotal * 12;
      return {
        primary: { label: "Monthly Litter Cost", value: "$" + formatNumber(Math.round(monthlyTotal)) },
        details: [
          { label: "Yearly Cost", value: "$" + formatNumber(Math.round(yearly)) },
          { label: "Litter per Month", value: Math.round(lbsPerMonth) + " lbs" },
          { label: "Boxes per Month", value: (lbsPerMonth / lbsPerBox).toFixed(1) },
        ],
      };
    },
  }],
  relatedSlugs: ["cat-food-cost-calculator", "cat-age-calculator"],
  faq: [
    { question: "How much does cat litter cost per month?", answer: "Cat litter costs $15-$40 per month for one cat using standard clumping clay. Premium and crystal litters cost more." },
    { question: "How many litter boxes do I need?", answer: "The general rule is one litter box per cat plus one extra. So two cats should have three litter boxes." },
  ],
  formula: "Monthly Cost = Lbs per Month x Cost per Lb; Lbs = Box Size x Changes x Cat Factor",
};
