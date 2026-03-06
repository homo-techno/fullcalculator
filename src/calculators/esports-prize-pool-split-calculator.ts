import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const esportsPrizePoolSplitCalculator: CalculatorDefinition = {
  slug: "esports-prize-pool-split-calculator",
  title: "Esports Prize Pool Split Calculator",
  description: "Calculate prize money distribution among team members for esports tournaments including organization cuts, coach shares, and tax withholding estimates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["esports prize pool","tournament winnings split","team prize distribution","esports earnings calculator"],
  variants: [{
    id: "standard",
    name: "Esports Prize Pool Split",
    description: "Calculate prize money distribution among team members for esports tournaments including organization cuts, coach shares, and tax withholding estimates.",
    fields: [
      { name: "totalPrize", label: "Total Prize Pool ($)", type: "number", min: 100, max: 50000000, defaultValue: 50000 },
      { name: "teamPlacement", label: "Placement", type: "select", options: [{ value: "1", label: "1st (50%)" }, { value: "2", label: "2nd (25%)" }, { value: "3", label: "3rd (12%)" }, { value: "4", label: "4th (6%)" }], defaultValue: "1" },
      { name: "teamSize", label: "Team Size (Players)", type: "number", min: 1, max: 10, defaultValue: 5 },
      { name: "orgCut", label: "Organization Cut (%)", type: "number", min: 0, max: 50, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const totalPrize = inputs.totalPrize as number;
    const placement = parseInt(inputs.teamPlacement as string);
    const teamSize = inputs.teamSize as number;
    const orgCut = inputs.orgCut as number / 100;
    const placeShare = { 1: 0.50, 2: 0.25, 3: 0.12, 4: 0.06 };
    const teamWinnings = totalPrize * (placeShare[placement] || 0.06);
    const orgTake = teamWinnings * orgCut;
    const afterOrg = teamWinnings - orgTake;
    const perPlayer = afterOrg / teamSize;
    const taxEstimate = perPlayer * 0.25;
    const takeHome = perPlayer - taxEstimate;
    return {
      primary: { label: "Per Player Earnings", value: "$" + formatNumber(Math.round(perPlayer)) },
      details: [
        { label: "Team Total Winnings", value: "$" + formatNumber(Math.round(teamWinnings)) },
        { label: "Organization Cut", value: "$" + formatNumber(Math.round(orgTake)) },
        { label: "Estimated Tax (25%)", value: "$" + formatNumber(Math.round(taxEstimate)) },
        { label: "Estimated Take-Home", value: "$" + formatNumber(Math.round(takeHome)) }
      ]
    };
  },
  }],
  relatedSlugs: ["twitch-streamer-revenue-calculator","youtube-gaming-cpm-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Team Winnings = Total Prize x Placement Percentage
After Org = Team Winnings x (1 - Org Cut)
Per Player = After Org / Team Size
Take-Home = Per Player x (1 - Tax Rate)",
};
