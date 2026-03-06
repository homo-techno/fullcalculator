import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chessEloRatingCalculator: CalculatorDefinition = {
  slug: "chess-elo-rating-calculator",
  title: "Chess ELO Rating Calculator",
  description: "Calculate your expected new ELO rating after a chess match based on both players ratings and the match outcome using the standard ELO formula.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["chess ELO calculator","chess rating calculator","ELO rating change","chess ranking estimator"],
  variants: [{
    id: "standard",
    name: "Chess ELO Rating",
    description: "Calculate your expected new ELO rating after a chess match based on both players ratings and the match outcome using the standard ELO formula.",
    fields: [
      { name: "yourRating", label: "Your Current Rating", type: "number", min: 100, max: 3000, defaultValue: 1200 },
      { name: "opponentRating", label: "Opponent Rating", type: "number", min: 100, max: 3000, defaultValue: 1400 },
      { name: "result", label: "Match Result", type: "select", options: [{ value: "1", label: "Win" }, { value: "0.5", label: "Draw" }, { value: "0", label: "Loss" }], defaultValue: "1" },
      { name: "kFactor", label: "K-Factor", type: "select", options: [{ value: "40", label: "40 (New player)" }, { value: "20", label: "20 (Standard)" }, { value: "10", label: "10 (Master level)" }], defaultValue: "20" },
    ],
    calculate: (inputs) => {
    const myRating = inputs.yourRating as number;
    const oppRating = inputs.opponentRating as number;
    const result = parseFloat(inputs.result as string);
    const k = parseInt(inputs.kFactor as string);
    const expectedScore = 1 / (1 + Math.pow(10, (oppRating - myRating) / 400));
    const ratingChange = Math.round(k * (result - expectedScore));
    const newRating = myRating + ratingChange;
    const winExpectancy = Math.round(expectedScore * 100);
    return {
      primary: { label: "New Rating", value: formatNumber(newRating) },
      details: [
        { label: "Rating Change", value: (ratingChange >= 0 ? "+" : "") + formatNumber(ratingChange) },
        { label: "Expected Score", value: formatNumber(Math.round(expectedScore * 1000) / 1000) },
        { label: "Win Probability", value: formatNumber(winExpectancy) + "%" },
        { label: "K-Factor Used", value: formatNumber(k) }
      ]
    };
  },
  }],
  relatedSlugs: ["tabletop-rpg-encounter-builder-calculator","poker-pot-odds-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Expected Score = 1 / (1 + 10^((Opponent Rating - Your Rating) / 400)); Rating Change = K x (Actual Result - Expected Score); New Rating = Current Rating + Rating Change",
};
