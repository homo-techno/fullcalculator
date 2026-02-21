import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boardGameScoreCalculator: CalculatorDefinition = {
  slug: "board-game-score-calculator",
  title: "Board Game Score Calculator",
  description:
    "Free board game score calculator. Track scores for multiple players across rounds. Perfect for Scrabble, Catan, Yahtzee, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "board game score",
    "score tracker",
    "game score calculator",
    "Scrabble score",
    "game points",
    "score keeper",
    "player scores",
  ],
  variants: [
    {
      id: "multi-round",
      name: "Multi-Round Scoring",
      description: "Calculate total and average scores across multiple rounds for up to 4 players",
      fields: [
        { name: "p1r1", label: "Player 1 - Round 1", type: "number", placeholder: "Score", defaultValue: 0 },
        { name: "p1r2", label: "Player 1 - Round 2", type: "number", placeholder: "Score", defaultValue: 0 },
        { name: "p1r3", label: "Player 1 - Round 3", type: "number", placeholder: "Score", defaultValue: 0 },
        { name: "p1r4", label: "Player 1 - Round 4", type: "number", placeholder: "Score", defaultValue: 0 },
        { name: "p1r5", label: "Player 1 - Round 5", type: "number", placeholder: "Score", defaultValue: 0 },
        { name: "p2r1", label: "Player 2 - Round 1", type: "number", placeholder: "Score", defaultValue: 0 },
        { name: "p2r2", label: "Player 2 - Round 2", type: "number", placeholder: "Score", defaultValue: 0 },
        { name: "p2r3", label: "Player 2 - Round 3", type: "number", placeholder: "Score", defaultValue: 0 },
        { name: "p2r4", label: "Player 2 - Round 4", type: "number", placeholder: "Score", defaultValue: 0 },
        { name: "p2r5", label: "Player 2 - Round 5", type: "number", placeholder: "Score", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const p1Scores: number[] = [];
        const p2Scores: number[] = [];

        for (let r = 1; r <= 5; r++) {
          const s1 = inputs[`p1r${r}`] as number;
          const s2 = inputs[`p2r${r}`] as number;
          if (s1 !== undefined && s1 !== 0) p1Scores.push(s1);
          if (s2 !== undefined && s2 !== 0) p2Scores.push(s2);
        }

        if (p1Scores.length === 0 && p2Scores.length === 0) return null;

        const p1Total = p1Scores.reduce((a, b) => a + b, 0);
        const p2Total = p2Scores.reduce((a, b) => a + b, 0);
        const p1Avg = p1Scores.length > 0 ? p1Total / p1Scores.length : 0;
        const p2Avg = p2Scores.length > 0 ? p2Total / p2Scores.length : 0;
        const p1Best = p1Scores.length > 0 ? Math.max(...p1Scores) : 0;
        const p2Best = p2Scores.length > 0 ? Math.max(...p2Scores) : 0;

        let winner = "Tie";
        if (p1Total > p2Total) winner = "Player 1";
        else if (p2Total > p1Total) winner = "Player 2";

        const details: { label: string; value: string }[] = [
          { label: "Player 1 Total", value: formatNumber(p1Total, 0) },
          { label: "Player 2 Total", value: formatNumber(p2Total, 0) },
          { label: "Player 1 Average", value: formatNumber(p1Avg, 1) },
          { label: "Player 2 Average", value: formatNumber(p2Avg, 1) },
          { label: "Player 1 Best Round", value: formatNumber(p1Best, 0) },
          { label: "Player 2 Best Round", value: formatNumber(p2Best, 0) },
          { label: "Player 1 Rounds", value: `${p1Scores.length}` },
          { label: "Player 2 Rounds", value: `${p2Scores.length}` },
          { label: "Margin", value: formatNumber(Math.abs(p1Total - p2Total), 0) + " points" },
        ];

        return {
          primary: { label: "Winner", value: winner },
          details,
        };
      },
    },
    {
      id: "scrabble-word",
      name: "Scrabble Word Score",
      description: "Calculate the base point value of a Scrabble word",
      fields: [
        {
          name: "word",
          label: "Word (use the select for each letter position)",
          type: "select",
          options: [
            { label: "Calculate from letter values below", value: "manual" },
          ],
          defaultValue: "manual",
        },
        { name: "l1", label: "Letter 1 Value", type: "number", placeholder: "e.g. 1 for A", min: 0, max: 10, defaultValue: 0 },
        { name: "l2", label: "Letter 2 Value", type: "number", placeholder: "e.g. 3 for B", min: 0, max: 10, defaultValue: 0 },
        { name: "l3", label: "Letter 3 Value", type: "number", placeholder: "e.g. 1 for E", min: 0, max: 10, defaultValue: 0 },
        { name: "l4", label: "Letter 4 Value", type: "number", placeholder: "e.g. 0 for blank", min: 0, max: 10, defaultValue: 0 },
        { name: "l5", label: "Letter 5 Value", type: "number", placeholder: "e.g. 0 if unused", min: 0, max: 10, defaultValue: 0 },
        { name: "l6", label: "Letter 6 Value", type: "number", placeholder: "e.g. 0 if unused", min: 0, max: 10, defaultValue: 0 },
        { name: "l7", label: "Letter 7 Value", type: "number", placeholder: "e.g. 0 if unused", min: 0, max: 10, defaultValue: 0 },
        {
          name: "wordMultiplier",
          label: "Word Multiplier",
          type: "select",
          options: [
            { label: "None (1x)", value: "1" },
            { label: "Double Word (2x)", value: "2" },
            { label: "Triple Word (3x)", value: "3" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const multiplier = parseInt(inputs.wordMultiplier as string) || 1;
        let baseScore = 0;
        let letterCount = 0;

        for (let i = 1; i <= 7; i++) {
          const val = (inputs[`l${i}`] as number) || 0;
          if (val > 0) {
            baseScore += val;
            letterCount++;
          }
        }

        if (baseScore === 0) return null;

        const finalScore = baseScore * multiplier;
        const bingo = letterCount === 7 ? 50 : 0;
        const totalWithBingo = finalScore + bingo;

        return {
          primary: { label: "Word Score", value: formatNumber(totalWithBingo, 0) },
          details: [
            { label: "Base Letter Score", value: formatNumber(baseScore, 0) },
            { label: "Word Multiplier", value: `${multiplier}x` },
            { label: "After Multiplier", value: formatNumber(finalScore, 0) },
            { label: "Letters Used", value: `${letterCount}` },
            { label: "Bingo Bonus (7 letters)", value: bingo > 0 ? "+50" : "N/A (need 7 letters)" },
            { label: "Total Score", value: formatNumber(totalWithBingo, 0) },
          ],
          note: "Scrabble letter values: A=1, B=3, C=3, D=2, E=1, F=4, G=2, H=4, I=1, J=8, K=5, L=1, M=3, N=1, O=1, P=3, Q=10, R=1, S=1, T=1, U=1, V=4, W=4, X=8, Y=4, Z=10, Blank=0",
        };
      },
    },
  ],
  relatedSlugs: ["bowling-score-calculator", "d-and-d-dice-calculator", "card-probability-calculator"],
  faq: [
    {
      question: "How does Scrabble scoring work?",
      answer:
        "Each letter has a point value (A=1, Q=10, Z=10, etc.). Add up letter values, then apply any premium squares (Double/Triple Letter, Double/Triple Word). If you use all 7 tiles in one turn, you get a 50-point bingo bonus.",
    },
    {
      question: "How do I keep score in Catan?",
      answer:
        "In Catan, each settlement = 1 point, each city = 2 points, longest road = 2 points, largest army = 2 points, and each victory point card = 1 point. First to 10 points wins.",
    },
    {
      question: "What is the highest possible Scrabble score for a single word?",
      answer:
        "Theoretically, the highest single-word score is debated, but scores over 1,000 points are possible with perfect tile and board placement. The highest recorded competitive single word score is around 365 points.",
    },
  ],
  formula:
    "Total Score = Sum of round scores | Average = Total / Rounds | Scrabble Word = (Sum of letter values) x Word Multiplier + Bingo Bonus",
};
