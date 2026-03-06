import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gameDevelopmentBudgetCalculator: CalculatorDefinition = {
  slug: "game-development-budget-calculator",
  title: "Game Development Budget Calculator",
  description: "Plan your indie game development budget by estimating costs across programming, art, audio, marketing, and distribution for solo and small team projects.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["game dev budget","indie game cost","game development cost","video game budget planner"],
  variants: [{
    id: "standard",
    name: "Game Development Budget",
    description: "Plan your indie game development budget by estimating costs across programming, art, audio, marketing, and distribution for solo and small team projects.",
    fields: [
      { name: "teamSize", label: "Team Size", type: "number", min: 1, max: 50, defaultValue: 3 },
      { name: "devMonths", label: "Development Duration (months)", type: "number", min: 1, max: 60, defaultValue: 12 },
      { name: "avgMonthlySalary", label: "Avg Monthly Salary/Cost ($)", type: "number", min: 0, max: 20000, defaultValue: 5000 },
      { name: "scope", label: "Game Scope", type: "select", options: [{ value: "1", label: "Small (mobile/casual)" }, { value: "2", label: "Medium (indie)" }, { value: "3", label: "Large (AA indie)" }, { value: "4", label: "Ambitious (large indie)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const team = inputs.teamSize as number;
    const months = inputs.devMonths as number;
    const salary = inputs.avgMonthlySalary as number;
    const scope = parseInt(inputs.scope as string);
    const laborCost = team * months * salary;
    const assetMultiplier = { 1: 0.10, 2: 0.20, 3: 0.30, 4: 0.40 };
    const assetCost = laborCost * (assetMultiplier[scope] || 0.20);
    const toolsAndLicenses = months * 50 * team;
    const marketingPercent = { 1: 0.15, 2: 0.20, 3: 0.25, 4: 0.30 };
    const marketing = (laborCost + assetCost) * (marketingPercent[scope] || 0.20);
    const totalBudget = laborCost + assetCost + toolsAndLicenses + marketing;
    return {
      primary: { label: "Total Estimated Budget", value: "$" + formatNumber(Math.round(totalBudget)) },
      details: [
        { label: "Labor Cost", value: "$" + formatNumber(Math.round(laborCost)) },
        { label: "Assets (Art, Audio, etc.)", value: "$" + formatNumber(Math.round(assetCost)) },
        { label: "Tools and Licenses", value: "$" + formatNumber(Math.round(toolsAndLicenses)) },
        { label: "Marketing Budget", value: "$" + formatNumber(Math.round(marketing)) }
      ]
    };
  },
  }],
  relatedSlugs: ["esports-prize-pool-split-calculator","game-server-hosting-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Labor Cost = Team Size x Development Months x Monthly Salary; Asset Cost = Labor Cost x Scope Multiplier; Marketing = (Labor + Assets) x Marketing Percentage; Total = Labor + Assets + Tools + Marketing",
};
