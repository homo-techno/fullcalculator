import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const extracurricularCostCalculator: CalculatorDefinition = {
  slug: "extracurricular-cost-calculator",
  title: "Extracurricular Activity Cost Calculator",
  description: "Estimate the annual cost of extracurricular activities including fees, equipment, and travel.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["extracurricular cost", "activity expenses", "kids sports cost"],
  variants: [{
    id: "standard",
    name: "Extracurricular Activity Cost",
    description: "Estimate the annual cost of extracurricular activities including fees, equipment, and travel",
    fields: [
      { name: "monthlyFee", label: "Monthly Activity Fee", type: "number", prefix: "$", min: 0, max: 2000, defaultValue: 150 },
      { name: "monthsActive", label: "Active Months per Year", type: "number", suffix: "months", min: 1, max: 12, defaultValue: 10 },
      { name: "equipmentCost", label: "Annual Equipment Cost", type: "number", prefix: "$", min: 0, max: 5000, defaultValue: 300 },
      { name: "travelCost", label: "Annual Travel/Competition Cost", type: "number", prefix: "$", min: 0, max: 10000, defaultValue: 500 },
    ],
    calculate: (inputs) => {
      const monthly = inputs.monthlyFee as number;
      const months = inputs.monthsActive as number;
      const equipment = inputs.equipmentCost as number;
      const travel = inputs.travelCost as number;
      const fees = monthly * months;
      const total = fees + equipment + travel;
      const perMonth = total / 12;
      return {
        primary: { label: "Annual Activity Cost", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Tuition/Fees", value: "$" + formatNumber(Math.round(fees)) },
          { label: "Equipment", value: "$" + formatNumber(Math.round(equipment)) },
          { label: "Travel/Competitions", value: "$" + formatNumber(Math.round(travel)) },
          { label: "Monthly Average", value: "$" + formatNumber(Math.round(perMonth)) },
        ],
      };
    },
  }],
  relatedSlugs: ["private-school-cost-calculator", "allowance-calculator"],
  faq: [
    { question: "How much do kids activities cost per year?", answer: "Youth sports average $500-$1,500 per season. Competitive travel sports can cost $3,000-$10,000 or more annually." },
    { question: "What extracurricular activities are most affordable?", answer: "Community sports leagues, school clubs, library programs, and parks and recreation programs tend to be the most affordable options." },
  ],
  formula: "Annual Cost = (Monthly Fee x Active Months) + Equipment + Travel",
};
