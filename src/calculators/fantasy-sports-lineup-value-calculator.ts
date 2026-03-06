import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fantasySportsLineupValueCalculator: CalculatorDefinition = {
  slug: "fantasy-sports-lineup-value-calculator",
  title: "Fantasy Sports Lineup Value Calculator",
  description: "Optimize your daily fantasy sports lineup by calculating value scores, projected points per salary dollar, and remaining budget allocation.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["fantasy sports lineup","DFS lineup optimizer","fantasy football value","daily fantasy calculator"],
  variants: [{
    id: "standard",
    name: "Fantasy Sports Lineup Value",
    description: "Optimize your daily fantasy sports lineup by calculating value scores, projected points per salary dollar, and remaining budget allocation.",
    fields: [
      { name: "salaryCap", label: "Salary Cap ($)", type: "number", min: 10000, max: 100000, defaultValue: 50000 },
      { name: "playersNeeded", label: "Roster Spots", type: "number", min: 1, max: 15, defaultValue: 9 },
      { name: "salaryUsed", label: "Salary Used So Far ($)", type: "number", min: 0, max: 100000, defaultValue: 35000 },
      { name: "playersSelected", label: "Players Selected", type: "number", min: 0, max: 14, defaultValue: 6 },
    ],
    calculate: (inputs) => {
    const cap = inputs.salaryCap as number;
    const spots = inputs.playersNeeded as number;
    const used = inputs.salaryUsed as number;
    const selected = inputs.playersSelected as number;
    const remaining = cap - used;
    const spotsLeft = spots - selected;
    const avgPerSpot = spotsLeft > 0 ? Math.round(remaining / spotsLeft) : 0;
    const idealAvg = Math.round(cap / spots);
    const overUnder = avgPerSpot - idealAvg;
    const flexibility = remaining > 0 ? Math.round((remaining / cap) * 100) : 0;
    const status = overUnder > 1000 ? "Above average budget remaining" : overUnder < -1000 ? "Below average - seek value plays" : "On track";
    return {
      primary: { label: "Avg Salary Per Remaining Spot", value: "$" + formatNumber(avgPerSpot) },
      details: [
        { label: "Remaining Budget", value: "$" + formatNumber(remaining) },
        { label: "Roster Spots Left", value: formatNumber(spotsLeft) },
        { label: "Ideal Average Per Spot", value: "$" + formatNumber(idealAvg) },
        { label: "Budget Status", value: status }
      ]
    };
  },
  }],
  relatedSlugs: ["poker-pot-odds-calculator","esports-prize-pool-split-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Remaining Budget = Salary Cap - Salary Used
Spots Left = Roster Spots - Players Selected
Avg Per Spot = Remaining Budget / Spots Left
Ideal Avg = Salary Cap / Total Roster Spots",
};
