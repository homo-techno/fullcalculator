import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sportsLeagueCostCalculator: CalculatorDefinition = {
  slug: "sports-league-cost-calculator",
  title: "Sports League Cost Calculator",
  description: "Calculate the total cost of a youth sports season including fees and gear.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["sports","league","youth","cost","season"],
  variants: [{
    id: "standard",
    name: "Sports League Cost",
    description: "Calculate the total cost of a youth sports season including fees and gear.",
    fields: [
      { name: "registrationFee", label: "Registration Fee ($)", type: "number", min: 25, max: 1000, step: 25, defaultValue: 150 },
      { name: "equipmentCost", label: "Equipment and Gear ($)", type: "number", min: 0, max: 2000, step: 25, defaultValue: 200 },
      { name: "uniformCost", label: "Uniform Cost ($)", type: "number", min: 0, max: 300, step: 10, defaultValue: 75 },
      { name: "travelCost", label: "Travel Per Game ($)", type: "number", min: 0, max: 100, step: 5, defaultValue: 15 },
      { name: "numGames", label: "Number of Games", type: "number", min: 4, max: 40, step: 1, defaultValue: 12 },
    ],
    calculate: (inputs) => {
    const registrationFee = inputs.registrationFee as number;
    const equipmentCost = inputs.equipmentCost as number;
    const uniformCost = inputs.uniformCost as number;
    const travelCost = inputs.travelCost as number;
    const numGames = inputs.numGames as number;
    const totalTravel = travelCost * numGames;
    const seasonTotal = registrationFee + equipmentCost + uniformCost + totalTravel;
    const costPerGame = seasonTotal / numGames;
    return {
      primary: { label: "Season Total", value: "$" + formatNumber(seasonTotal) },
      details: [
        { label: "Registration", value: "$" + formatNumber(registrationFee) },
        { label: "Equipment and Gear", value: "$" + formatNumber(equipmentCost) },
        { label: "Uniform", value: "$" + formatNumber(uniformCost) },
        { label: "Total Travel", value: "$" + formatNumber(totalTravel) },
        { label: "Cost Per Game", value: "$" + formatNumber(costPerGame) }
      ]
    };
  },
  }],
  relatedSlugs: ["summer-camp-cost-calculator","music-lesson-cost-calculator","school-supply-list-calculator"],
  faq: [
    { question: "How much does youth sports cost per season?", answer: "A typical youth sports season costs between $200 and $800 depending on the sport." },
    { question: "What sport is cheapest for kids?", answer: "Running, soccer, and basketball tend to have the lowest startup costs for youth athletes." },
  ],
  formula: "Season Total = Registration + Equipment + Uniform + (Travel Per Game x Games)",
};
