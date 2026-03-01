import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petEmergencyFundCalculator: CalculatorDefinition = {
  slug: "pet-emergency-fund-calculator",
  title: "Pet Emergency Fund Calculator",
  description: "Calculate how much to save in a pet emergency fund based on pet type, age, and veterinary costs in your area.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pet emergency fund", "pet savings", "vet emergency cost"],
  variants: [{
    id: "standard",
    name: "Pet Emergency Fund",
    description: "Calculate how much to save in a pet emergency fund based on pet type, age, and veterinary costs in your area",
    fields: [
      { name: "petType", label: "Pet Type", type: "select", options: [{value:"dog",label:"Dog"},{value:"cat",label:"Cat"},{value:"other",label:"Other (Rabbit, Bird, etc.)"}], defaultValue: "dog" },
      { name: "petAge", label: "Pet Age", type: "number", suffix: "years", min: 0, max: 25, defaultValue: 5 },
      { name: "monthlySavings", label: "Monthly Savings", type: "number", prefix: "$", min: 10, max: 1000, defaultValue: 100 },
    ],
    calculate: (inputs) => {
      const petType = inputs.petType as string;
      const age = inputs.petAge as number;
      const monthly = inputs.monthlySavings as number;
      if (!monthly || monthly <= 0) return null;
      const emergencyCost: Record<string, number> = { dog: 5000, cat: 3500, other: 2000 };
      const ageFactor = age > 8 ? 1.5 : age > 5 ? 1.2 : 1.0;
      const targetFund = (emergencyCost[petType] || 3500) * ageFactor;
      const monthsToGoal = Math.ceil(targetFund / monthly);
      const annualRoutine: Record<string, number> = { dog: 700, cat: 500, other: 300 };
      return {
        primary: { label: "Target Emergency Fund", value: "$" + formatNumber(Math.round(targetFund)) },
        details: [
          { label: "Months to Reach Goal", value: String(monthsToGoal) },
          { label: "Monthly Savings", value: "$" + formatNumber(monthly) },
          { label: "Annual Routine Vet Cost", value: "$" + formatNumber(annualRoutine[petType] || 500) },
        ],
      };
    },
  }],
  relatedSlugs: ["dog-food-cost-calculator", "cat-food-cost-calculator"],
  faq: [
    { question: "How much should I save for pet emergencies?", answer: "Veterinary experts recommend saving $3,000-$5,000 for dogs and $2,000-$4,000 for cats to cover unexpected emergencies." },
    { question: "What are common pet emergencies?", answer: "Common emergencies include broken bones ($1,500-$4,000), foreign body surgery ($2,000-$5,000), and poisoning treatment ($1,000-$3,000)." },
  ],
  formula: "Target Fund = Base Emergency Cost x Age Factor; Months = Target / Monthly Savings",
};
