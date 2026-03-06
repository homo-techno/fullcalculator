import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const restaurantBreakEvenCalculator: CalculatorDefinition = {
  slug: "restaurant-break-even-calculator",
  title: "Restaurant Break-Even Calculator",
  description: "Determine how many covers or how much revenue your restaurant needs each month to break even after fixed costs, variable costs, and average check size.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["restaurant break even","break even analysis restaurant","restaurant cover target","food business break even"],
  variants: [{
    id: "standard",
    name: "Restaurant Break-Even",
    description: "Determine how many covers or how much revenue your restaurant needs each month to break even after fixed costs, variable costs, and average check size.",
    fields: [
      { name: "monthlyFixedCosts", label: "Monthly Fixed Costs ($)", type: "number", min: 1000, max: 500000, defaultValue: 18000 },
      { name: "avgCheck", label: "Average Check Per Cover ($)", type: "number", min: 5, max: 300, defaultValue: 35 },
      { name: "variableCostPct", label: "Variable Cost Per Cover (%)", type: "number", min: 20, max: 80, defaultValue: 55 },
      { name: "daysOpen", label: "Operating Days Per Month", type: "number", min: 15, max: 31, defaultValue: 26 },
    ],
    calculate: (inputs) => {
    const fixed = inputs.monthlyFixedCosts as number;
    const avgCheck = inputs.avgCheck as number;
    const varPct = inputs.variableCostPct as number / 100;
    const days = inputs.daysOpen as number;
    const contributionPerCover = avgCheck * (1 - varPct);
    const breakEvenCovers = contributionPerCover > 0 ? Math.ceil(fixed / contributionPerCover) : 0;
    const breakEvenRevenue = breakEvenCovers * avgCheck;
    const coversPerDay = days > 0 ? Math.ceil(breakEvenCovers / days) : 0;
    const revenuePerDay = days > 0 ? Math.round(breakEvenRevenue / days) : 0;
    return {
      primary: { label: "Break-Even Covers Per Month", value: formatNumber(breakEvenCovers) },
      details: [
        { label: "Break-Even Revenue", value: "$" + formatNumber(breakEvenRevenue) },
        { label: "Contribution Per Cover", value: "$" + formatNumber(Math.round(contributionPerCover * 100) / 100) },
        { label: "Covers Needed Per Day", value: formatNumber(coversPerDay) },
        { label: "Revenue Needed Per Day", value: "$" + formatNumber(revenuePerDay) }
      ]
    };
  },
  }],
  relatedSlugs: ["restaurant-profit-margin-calculator","restaurant-labor-cost-percentage-calculator"],
  faq: [
    { question: "What is break-even analysis for a restaurant?", answer: "Break-even analysis determines the point where total revenue equals total costs, meaning zero profit or loss. It tells you the minimum number of customers or revenue needed each month to cover all fixed and variable expenses." },
    { question: "What are typical fixed costs for a restaurant?", answer: "Fixed costs include rent or mortgage, insurance, loan payments, management salaries, accounting and legal fees, equipment leases, and software subscriptions. These costs remain constant regardless of sales volume." },
    { question: "How long does it take a new restaurant to break even?", answer: "Most new restaurants take 6 to 18 months to reach their break-even point. Some may take up to 2 years. Factors include location, concept, initial investment size, and how quickly the restaurant builds a steady customer base." },
  ],
  formula: "Contribution Per Cover = Average Check x (1 - Variable Cost %); Break-Even Covers = Monthly Fixed Costs / Contribution Per Cover; Break-Even Revenue = Break-Even Covers x Average Check",
};
