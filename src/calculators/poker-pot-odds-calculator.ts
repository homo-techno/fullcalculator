import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pokerPotOddsCalculator: CalculatorDefinition = {
  slug: "poker-pot-odds-calculator",
  title: "Poker Pot Odds Calculator",
  description: "Calculate pot odds, equity needed, and expected value to make mathematically optimal decisions in Texas Hold em poker.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["poker pot odds","poker equity calculator","poker math","Texas Hold em odds"],
  variants: [{
    id: "standard",
    name: "Poker Pot Odds",
    description: "Calculate pot odds, equity needed, and expected value to make mathematically optimal decisions in Texas Hold em poker.",
    fields: [
      { name: "potSize", label: "Current Pot Size ($)", type: "number", min: 1, max: 100000, defaultValue: 100 },
      { name: "betToCall", label: "Bet to Call ($)", type: "number", min: 1, max: 50000, defaultValue: 25 },
      { name: "outs", label: "Number of Outs", type: "number", min: 0, max: 20, defaultValue: 9 },
      { name: "street", label: "Current Street", type: "select", options: [{ value: "1", label: "Flop (2 cards to come)" }, { value: "2", label: "Turn (1 card to come)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const pot = inputs.potSize as number;
    const bet = inputs.betToCall as number;
    const outs = inputs.outs as number;
    const street = parseInt(inputs.street as string);
    const totalPot = pot + bet;
    const potOdds = (bet / totalPot) * 100;
    const equity = street === 1 ? (1 - Math.pow((47 - outs) / 47 * (46 - outs) / 46, 1)) * 100 : (outs / 46) * 100;
    const approxEquity = street === 1 ? outs * 4 : outs * 2;
    const ev = (equity / 100) * pot - ((100 - equity) / 100) * bet;
    const decision = equity > potOdds ? "Call (Profitable)" : "Fold (Unprofitable)";
    return {
      primary: { label: "Decision", value: decision },
      details: [
        { label: "Pot Odds", value: formatNumber(Math.round(potOdds * 10) / 10) + "%" },
        { label: "Hand Equity", value: formatNumber(Math.round(equity * 10) / 10) + "%" },
        { label: "Quick Estimate (Rule of 2/4)", value: formatNumber(approxEquity) + "%" },
        { label: "Expected Value", value: (ev >= 0 ? "+$" : "-$") + formatNumber(Math.round(Math.abs(ev) * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["chess-elo-rating-calculator","fantasy-sports-lineup-value-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Pot Odds = Bet to Call / (Pot + Bet to Call) x 100
Equity (Turn) = Outs / 46 x 100
Equity (Flop) = 1 - ((47-Outs)/47 x (46-Outs)/46) x 100
EV = Equity x Pot - (1-Equity) x Bet",
};
