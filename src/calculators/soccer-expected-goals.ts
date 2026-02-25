import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soccerExpectedGoalsCalculator: CalculatorDefinition = {
  slug: "soccer-expected-goals-calculator",
  title: "Soccer xG Calculator",
  description: "Free soccer expected goals calculator. Estimate xG from shot characteristics and match data.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["soccer xg calculator", "expected goals", "xg football", "shot quality", "soccer analytics"],
  variants: [
    {
      id: "shot-based",
      name: "Shot-Based xG",
      description: "Estimate xG based on shot location and type",
      fields: [
        { name: "shotLocation", label: "Shot Location", type: "select", options: [
          { label: "Inside 6-yard box", value: "6yard" },
          { label: "Inside penalty area (central)", value: "box_central" },
          { label: "Inside penalty area (wide)", value: "box_wide" },
          { label: "Outside penalty area", value: "outside" },
          { label: "Long range (30+ yards)", value: "long" },
        ] },
        { name: "shotType", label: "Shot Type", type: "select", options: [
          { label: "Right foot", value: "right" },
          { label: "Left foot", value: "left" },
          { label: "Header", value: "header" },
          { label: "Volley", value: "volley" },
          { label: "Penalty", value: "penalty" },
        ] },
        { name: "numShots", label: "Number of Similar Shots", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const location = inputs.shotLocation as string;
        const shotType = inputs.shotType as string;
        const numShots = (inputs.numShots as number) || 1;
        if (!location || !shotType) return null;
        let baseXg = 0;
        if (location === "6yard") baseXg = 0.38;
        else if (location === "box_central") baseXg = 0.15;
        else if (location === "box_wide") baseXg = 0.06;
        else if (location === "outside") baseXg = 0.03;
        else if (location === "long") baseXg = 0.02;
        let multiplier = 1.0;
        if (shotType === "header") multiplier = 0.75;
        else if (shotType === "volley") multiplier = 0.8;
        else if (shotType === "penalty") { baseXg = 0.76; multiplier = 1.0; }
        const singleXg = shotType === "penalty" ? 0.76 : baseXg * multiplier;
        const totalXg = singleXg * numShots;
        return {
          primary: { label: "Total xG", value: formatNumber(totalXg, 2) },
          details: [
            { label: "xG per Shot", value: formatNumber(singleXg, 3) },
            { label: "Conversion Probability", value: formatNumber(singleXg * 100, 1) + "%" },
            { label: "Number of Shots", value: formatNumber(numShots) },
          ],
        };
      },
    },
    {
      id: "match-totals",
      name: "Match xG Summary",
      description: "Summarize match xG from total shots",
      fields: [
        { name: "shotsInBox", label: "Shots Inside Box", type: "number", placeholder: "e.g. 8" },
        { name: "shotsOutBox", label: "Shots Outside Box", type: "number", placeholder: "e.g. 5" },
        { name: "headers", label: "Headers", type: "number", placeholder: "e.g. 3" },
        { name: "penalties", label: "Penalties", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const inBox = (inputs.shotsInBox as number) || 0;
        const outBox = (inputs.shotsOutBox as number) || 0;
        const headers = (inputs.headers as number) || 0;
        const pens = (inputs.penalties as number) || 0;
        const footInBox = Math.max(inBox - headers, 0);
        const xg = footInBox * 0.12 + outBox * 0.03 + headers * 0.07 + pens * 0.76;
        const totalShots = inBox + outBox;
        return {
          primary: { label: "Estimated Match xG", value: formatNumber(xg, 2) },
          details: [
            { label: "Total Shots", value: formatNumber(totalShots) },
            { label: "Shots in Box", value: formatNumber(inBox) },
            { label: "Shots Outside Box", value: formatNumber(outBox) },
            { label: "xG per Shot", value: totalShots > 0 ? formatNumber(xg / totalShots, 3) : "0" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["soccer-pass-completion-calculator", "sports-betting-ev-calculator"],
  faq: [
    { question: "What is xG in soccer?", answer: "xG (Expected Goals) is a statistical measure of the quality of goal-scoring chances. Each shot is assigned a probability of being scored based on factors like distance, angle, and shot type." },
    { question: "What is a good xG per shot?", answer: "The average xG per shot is around 0.10. Shots from inside the 6-yard box average around 0.38 xG, while long-range shots average about 0.02-0.03 xG." },
  ],
  formula: "xG = Sum of P(goal | shot characteristics) for each shot",
};