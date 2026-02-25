import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const footballFantasyPointsCalculator: CalculatorDefinition = {
  slug: "football-fantasy-points-calculator",
  title: "Fantasy Football Points Calculator",
  description: "Free fantasy football points calculator. Calculate fantasy points using standard, PPR, or half-PPR scoring.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fantasy football points", "ppr scoring", "fantasy scoring", "fantasy football calculator", "ff points"],
  variants: [
    {
      id: "standard",
      name: "Standard / PPR Scoring",
      description: "Calculate fantasy points with selectable scoring format",
      fields: [
        { name: "scoringFormat", label: "Scoring Format", type: "select", options: [
          { label: "Standard", value: "standard" },
          { label: "PPR (1 pt per reception)", value: "ppr" },
          { label: "Half PPR (0.5 per reception)", value: "halfppr" },
        ], defaultValue: "ppr" },
        { name: "passingYards", label: "Passing Yards", type: "number", placeholder: "e.g. 280", defaultValue: 0 },
        { name: "passingTds", label: "Passing TDs", type: "number", placeholder: "e.g. 2", defaultValue: 0 },
        { name: "interceptions", label: "Interceptions Thrown", type: "number", placeholder: "e.g. 1", defaultValue: 0 },
        { name: "rushingYards", label: "Rushing Yards", type: "number", placeholder: "e.g. 80", defaultValue: 0 },
        { name: "rushingTds", label: "Rushing TDs", type: "number", placeholder: "e.g. 1", defaultValue: 0 },
        { name: "receptions", label: "Receptions", type: "number", placeholder: "e.g. 5", defaultValue: 0 },
        { name: "receivingYards", label: "Receiving Yards", type: "number", placeholder: "e.g. 60", defaultValue: 0 },
        { name: "receivingTds", label: "Receiving TDs", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "fumblesLost", label: "Fumbles Lost", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const format = inputs.scoringFormat as string;
        const passYds = (inputs.passingYards as number) || 0;
        const passTds = (inputs.passingTds as number) || 0;
        const ints = (inputs.interceptions as number) || 0;
        const rushYds = (inputs.rushingYards as number) || 0;
        const rushTds = (inputs.rushingTds as number) || 0;
        const rec = (inputs.receptions as number) || 0;
        const recYds = (inputs.receivingYards as number) || 0;
        const recTds = (inputs.receivingTds as number) || 0;
        const fumbles = (inputs.fumblesLost as number) || 0;
        const passPoints = passYds * 0.04 + passTds * 4 - ints * 2;
        const rushPoints = rushYds * 0.1 + rushTds * 6;
        const recBonus = format === "ppr" ? rec * 1 : format === "halfppr" ? rec * 0.5 : 0;
        const recPoints = recYds * 0.1 + recTds * 6 + recBonus;
        const penalties = fumbles * 2;
        const total = passPoints + rushPoints + recPoints - penalties;
        return {
          primary: { label: "Fantasy Points", value: formatNumber(total, 1) },
          details: [
            { label: "Passing Points", value: formatNumber(passPoints, 1) },
            { label: "Rushing Points", value: formatNumber(rushPoints, 1) },
            { label: "Receiving Points", value: formatNumber(recPoints, 1) },
            { label: "Reception Bonus", value: formatNumber(recBonus, 1) },
            { label: "Format", value: format === "ppr" ? "PPR" : format === "halfppr" ? "Half PPR" : "Standard" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["football-passer-rating-calculator", "sports-betting-ev-calculator"],
  faq: [
    { question: "What is PPR scoring?", answer: "PPR awards 1 point for each reception in addition to yardage and touchdown points. Half PPR awards 0.5 points per reception." },
    { question: "How are fantasy football points calculated?", answer: "Standard scoring: passing yards 1pt/25yds, passing TDs 4pts, rushing/receiving yards 1pt/10yds, rushing/receiving TDs 6pts, INTs -2pts, fumbles lost -2pts." },
  ],
  formula: "Points = PassYds*0.04 + PassTD*4 + RushYds*0.1 + RushTD*6 + RecYds*0.1 + RecTD*6 + RecBonus - Penalties",
};