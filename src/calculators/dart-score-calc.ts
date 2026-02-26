import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dartScoreCalculator: CalculatorDefinition = {
  slug: "dart-score-calculator",
  title: "Darts Scoring & Checkout Calculator",
  description: "Free darts scoring and checkout calculator. Track your 501/301 game score, find optimal checkout routes, and calculate your darts average.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["darts calculator", "darts checkout", "501 darts", "dart score calculator", "darts average"],
  variants: [
    {
      id: "checkout",
      name: "Checkout Calculator",
      description: "Find the best checkout route for your remaining score",
      fields: [
        { name: "remaining", label: "Remaining Score", type: "number", placeholder: "e.g. 72", min: 2, max: 170 },
        { name: "dartsInHand", label: "Darts in Hand", type: "select", options: [
          { label: "3 darts", value: "3" },
          { label: "2 darts", value: "2" },
          { label: "1 dart", value: "1" },
        ], defaultValue: "3" },
      ],
      calculate: (inputs) => {
        const remaining = parseFloat(inputs.remaining as string);
        const darts = parseFloat(inputs.dartsInHand as string);
        if (isNaN(remaining) || remaining < 2 || remaining > 170) return null;

        const doubles = [
          { val: 50, name: "Bull" }, { val: 40, name: "D20" }, { val: 36, name: "D18" },
          { val: 32, name: "D16" }, { val: 24, name: "D12" }, { val: 20, name: "D10" },
          { val: 16, name: "D8" }, { val: 12, name: "D6" }, { val: 8, name: "D4" },
          { val: 4, name: "D2" }, { val: 2, name: "D1" },
        ];

        let route = "No checkout available";
        let dartCount = 0;

        for (const d of doubles) {
          if (remaining === d.val && darts >= 1) {
            route = d.name; dartCount = 1; break;
          }
          if (darts >= 2) {
            const setup1 = remaining - d.val;
            if (setup1 >= 1 && setup1 <= 60) {
              if (setup1 <= 20) { route = `${setup1}, ${d.name}`; dartCount = 2; break; }
              if (setup1 <= 40 && setup1 % 2 === 0) { route = `D${setup1/2}, ${d.name}`; dartCount = 2; break; }
              if (setup1 <= 60 && setup1 % 3 === 0) { route = `T${setup1/3}, ${d.name}`; dartCount = 2; break; }
            }
          }
          if (darts >= 3) {
            const need = remaining - d.val;
            if (need >= 2 && need <= 120) {
              for (let t = 20; t >= 1; t--) {
                const afterTriple = need - t * 3;
                if (afterTriple >= 1 && afterTriple <= 20) {
                  route = `T${t}, ${afterTriple}, ${d.name}`; dartCount = 3; break;
                }
                if (afterTriple >= 2 && afterTriple <= 40 && afterTriple % 2 === 0) {
                  route = `T${t}, D${afterTriple/2}, ${d.name}`; dartCount = 3; break;
                }
              }
              if (dartCount > 0) break;
              for (let s = 20; s >= 1; s--) {
                const afterSingle = need - s;
                if (afterSingle >= 1 && afterSingle <= 20) {
                  route = `${s}, ${afterSingle}, ${d.name}`; dartCount = 3; break;
                }
              }
              if (dartCount > 0) break;
            }
          }
        }

        const isCheckable = dartCount > 0;
        return {
          primary: { label: "Checkout Route", value: route },
          details: [
            { label: "Remaining Score", value: formatNumber(remaining, 0) },
            { label: "Darts Needed", value: isCheckable ? formatNumber(dartCount, 0) : "N/A" },
            { label: "Checkable", value: isCheckable ? "Yes" : "No" },
            { label: "Max Checkout (3 darts)", value: "170 (T20, T20, Bull)" },
          ],
          note: isCheckable ? "Must finish on a double (or bullseye)." : "This score cannot be checked out with the darts available.",
        };
      },
    },
    {
      id: "average",
      name: "Darts Average",
      description: "Calculate your 3-dart average from game data",
      fields: [
        { name: "totalPoints", label: "Total Points Scored", type: "number", placeholder: "e.g. 1503" },
        { name: "dartsThrown", label: "Total Darts Thrown", type: "number", placeholder: "e.g. 45", min: 1 },
      ],
      calculate: (inputs) => {
        const points = parseFloat(inputs.totalPoints as string);
        const darts = parseFloat(inputs.dartsThrown as string);
        if (isNaN(points) || isNaN(darts) || darts <= 0) return null;

        const perDart = points / darts;
        const threeDartAvg = perDart * 3;
        let rating = "Beginner";
        if (threeDartAvg >= 90) rating = "Professional";
        else if (threeDartAvg >= 70) rating = "Expert";
        else if (threeDartAvg >= 55) rating = "Advanced";
        else if (threeDartAvg >= 40) rating = "Intermediate";

        const legsEstimate501 = Math.ceil(501 / threeDartAvg);
        return {
          primary: { label: "3-Dart Average", value: formatNumber(threeDartAvg, 1) },
          details: [
            { label: "Per Dart Average", value: formatNumber(perDart, 2) },
            { label: "Total Points", value: formatNumber(points, 0) },
            { label: "Total Darts", value: formatNumber(darts, 0) },
            { label: "Skill Rating", value: rating },
            { label: "Est. Rounds to Finish 501", value: formatNumber(legsEstimate501, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bowling-handicap-calculator", "fantasy-trade-calculator", "pickleball-rating-calculator"],
  faq: [
    { question: "What is the highest possible checkout in darts?", answer: "The highest checkout in standard darts is 170, achieved by hitting treble 20, treble 20, and bullseye (T20, T20, Bull). The game must always finish on a double or the bullseye." },
    { question: "What is a good 3-dart average?", answer: "A pub/league player typically averages 40-55. A county-level player averages 55-70. Professional players average 85-105. The world record average in a televised match is over 115." },
    { question: "Why must you finish on a double?", answer: "Standard 501/301 rules require the final dart to land on a double segment or the bullseye (which counts as double 25). This adds strategy to the checkout phase of the game." },
  ],
  formula: "3-Dart Average = (Total Points / Total Darts) x 3 | Checkout must end on a double",
};
