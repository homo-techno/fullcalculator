import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boxingReachAdvantageCalculator: CalculatorDefinition = {
  slug: "boxing-reach-advantage-calculator",
  title: "Boxing Reach Advantage Calculator",
  description: "Calculate reach advantage and optimal fighting distance based on arm span and height.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["boxing reach","reach advantage","arm span boxing","fighting distance"],
  variants: [{
    id: "standard",
    name: "Boxing Reach Advantage",
    description: "Calculate reach advantage and optimal fighting distance based on arm span and height.",
    fields: [
      { name: "yourReach", label: "Your Reach (inches)", type: "number", min: 55, max: 90, defaultValue: 72 },
      { name: "opponentReach", label: "Opponent Reach (inches)", type: "number", min: 55, max: 90, defaultValue: 70 },
      { name: "yourHeight", label: "Your Height (inches)", type: "number", min: 58, max: 84, defaultValue: 70 },
      { name: "stance", label: "Your Stance", type: "select", options: [{ value: "1", label: "Orthodox" }, { value: "2", label: "Southpaw" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const yourReach = inputs.yourReach as number;
    const opponentReach = inputs.opponentReach as number;
    const yourHeight = inputs.yourHeight as number;
    const stance = parseInt(inputs.stance as string);
    const reachDiff = yourReach - opponentReach;
    const apeIndex = yourReach - yourHeight;
    const optimalDistance = Math.round(yourReach * 0.6);
    const jabRange = Math.round(yourReach * 0.42);
    const advantage = reachDiff > 0 ? "You have the reach advantage" : reachDiff < 0 ? "Opponent has the reach advantage" : "Reach is equal";
    return {
      primary: { label: "Reach Difference", value: (reachDiff >= 0 ? "+" : "") + formatNumber(reachDiff) + " inches" },
      details: [
        { label: "Assessment", value: advantage },
        { label: "Ape Index", value: (apeIndex >= 0 ? "+" : "") + formatNumber(apeIndex) + " inches" },
        { label: "Optimal Fighting Distance", value: formatNumber(optimalDistance) + " inches" }
      ]
    };
  },
  }],
  relatedSlugs: ["martial-arts-belt-progression-calculator","lacrosse-stick-length-calculator"],
  faq: [
    { question: "What is reach in boxing?", answer: "Reach is the distance from fingertip to fingertip with arms outstretched. It determines how far you can hit without being hit." },
    { question: "What is ape index?", answer: "Ape index is the difference between your arm span and height. A positive ape index is advantageous in combat sports." },
    { question: "Does reach advantage matter in boxing?", answer: "Yes, a longer reach allows fighters to land jabs from further away and control distance. It is one of the most important physical attributes." },
  ],
  formula: "Reach Difference = Your Reach - Opponent Reach; Ape Index = Reach - Height",
};
