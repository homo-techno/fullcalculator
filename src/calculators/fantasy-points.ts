import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fantasyPointsCalculator: CalculatorDefinition = {
  slug: "fantasy-points-calculator",
  title: "Fantasy Points Calculator",
  description:
    "Free fantasy sports points calculator. Calculate fantasy football points for PPR, half-PPR, and standard scoring formats.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "fantasy points calculator",
    "fantasy football calculator",
    "PPR calculator",
    "fantasy scoring",
    "fantasy sports",
    "fantasy football points",
  ],
  variants: [
    {
      id: "fantasy-qb",
      name: "QB Fantasy Points",
      description: "Calculate fantasy points for a quarterback",
      fields: [
        {
          name: "passYards",
          label: "Passing Yards",
          type: "number",
          placeholder: "e.g. 300",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "passTDs",
          label: "Passing Touchdowns",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "interceptions",
          label: "Interceptions Thrown",
          type: "number",
          placeholder: "e.g. 1",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "rushYards",
          label: "Rushing Yards",
          type: "number",
          placeholder: "e.g. 25",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "rushTDs",
          label: "Rushing Touchdowns",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "fumbles",
          label: "Fumbles Lost",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "scoring",
          label: "Scoring Format",
          type: "select",
          options: [
            { label: "Standard (4pt pass TD)", value: "standard" },
            { label: "6pt Pass TD", value: "6pt" },
          ],
          defaultValue: "standard",
        },
      ],
      calculate: (inputs) => {
        const passYards = (inputs.passYards as number) || 0;
        const passTDs = (inputs.passTDs as number) || 0;
        const ints = (inputs.interceptions as number) || 0;
        const rushYards = (inputs.rushYards as number) || 0;
        const rushTDs = (inputs.rushTDs as number) || 0;
        const fumbles = (inputs.fumbles as number) || 0;
        const scoring = inputs.scoring as string;

        const passTDpts = scoring === "6pt" ? 6 : 4;

        const passYardPts = passYards / 25; // 1 pt per 25 yards
        const passTDPts = passTDs * passTDpts;
        const intPts = ints * -2;
        const rushYardPts = rushYards / 10; // 1 pt per 10 yards
        const rushTDPts = rushTDs * 6;
        const fumblePts = fumbles * -2;

        // Bonuses
        const pass300Bonus = passYards >= 300 ? 1 : 0;
        const pass400Bonus = passYards >= 400 ? 2 : 0;
        const passBonus = Math.max(pass300Bonus, pass400Bonus);

        const total = passYardPts + passTDPts + intPts + rushYardPts + rushTDPts + fumblePts;

        return {
          primary: { label: "Fantasy Points", value: formatNumber(total, 1) },
          details: [
            { label: "Passing Yards", value: `${passYards} yds = ${formatNumber(passYardPts, 1)} pts (1 per 25 yds)` },
            { label: "Passing TDs", value: `${passTDs} TD = ${formatNumber(passTDPts, 0)} pts (${passTDpts} per TD)` },
            { label: "Interceptions", value: `${ints} INT = ${formatNumber(intPts, 0)} pts (-2 each)` },
            { label: "Rushing Yards", value: `${rushYards} yds = ${formatNumber(rushYardPts, 1)} pts (1 per 10 yds)` },
            { label: "Rushing TDs", value: `${rushTDs} TD = ${formatNumber(rushTDPts, 0)} pts (6 per TD)` },
            { label: "Fumbles Lost", value: `${fumbles} = ${formatNumber(fumblePts, 0)} pts (-2 each)` },
            { label: "Scoring Format", value: scoring === "6pt" ? "6pt Pass TD" : "Standard (4pt Pass TD)" },
          ],
        };
      },
    },
    {
      id: "fantasy-skill",
      name: "RB/WR/TE Fantasy Points",
      description: "Calculate fantasy points for skill position players",
      fields: [
        {
          name: "rushYards",
          label: "Rushing Yards",
          type: "number",
          placeholder: "e.g. 85",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "rushTDs",
          label: "Rushing Touchdowns",
          type: "number",
          placeholder: "e.g. 1",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "receptions",
          label: "Receptions",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "recYards",
          label: "Receiving Yards",
          type: "number",
          placeholder: "e.g. 45",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "recTDs",
          label: "Receiving Touchdowns",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "fumbles",
          label: "Fumbles Lost",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "scoring",
          label: "Scoring Format",
          type: "select",
          options: [
            { label: "PPR (1pt per reception)", value: "ppr" },
            { label: "Half PPR (0.5pt per reception)", value: "half" },
            { label: "Standard (no reception bonus)", value: "standard" },
          ],
          defaultValue: "ppr",
        },
      ],
      calculate: (inputs) => {
        const rushYards = (inputs.rushYards as number) || 0;
        const rushTDs = (inputs.rushTDs as number) || 0;
        const receptions = (inputs.receptions as number) || 0;
        const recYards = (inputs.recYards as number) || 0;
        const recTDs = (inputs.recTDs as number) || 0;
        const fumbles = (inputs.fumbles as number) || 0;
        const scoring = inputs.scoring as string;

        const pprMultiplier = scoring === "ppr" ? 1 : scoring === "half" ? 0.5 : 0;

        const rushYardPts = rushYards / 10;
        const rushTDPts = rushTDs * 6;
        const recPts = receptions * pprMultiplier;
        const recYardPts = recYards / 10;
        const recTDPts = recTDs * 6;
        const fumblePts = fumbles * -2;

        const total = rushYardPts + rushTDPts + recPts + recYardPts + recTDPts + fumblePts;

        const formatStr = scoring === "ppr" ? "PPR" : scoring === "half" ? "Half PPR" : "Standard";

        return {
          primary: { label: "Fantasy Points (" + formatStr + ")", value: formatNumber(total, 1) },
          details: [
            { label: "Rushing Yards", value: `${rushYards} yds = ${formatNumber(rushYardPts, 1)} pts` },
            { label: "Rushing TDs", value: `${rushTDs} TD = ${formatNumber(rushTDPts, 0)} pts` },
            { label: "Receptions", value: `${receptions} rec = ${formatNumber(recPts, 1)} pts (${pprMultiplier} per rec)` },
            { label: "Receiving Yards", value: `${recYards} yds = ${formatNumber(recYardPts, 1)} pts` },
            { label: "Receiving TDs", value: `${recTDs} TD = ${formatNumber(recTDPts, 0)} pts` },
            { label: "Fumbles Lost", value: `${fumbles} = ${formatNumber(fumblePts, 0)} pts` },
            { label: "Format", value: formatStr },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sports-betting-odds-calculator", "quarterback-rating-calculator", "batting-average-calculator"],
  faq: [
    {
      question: "What is PPR scoring in fantasy football?",
      answer:
        "PPR stands for Points Per Reception. In PPR scoring, players earn 1 additional point for each catch. This increases the value of pass-catching running backs and slot receivers. Half PPR awards 0.5 points per reception as a middle ground.",
    },
    {
      question: "How are QB fantasy points calculated?",
      answer:
        "Standard QB scoring: 1 point per 25 passing yards, 4 points per passing TD (6 in some leagues), -2 per interception, 1 point per 10 rushing yards, 6 points per rushing TD, -2 per fumble lost.",
    },
    {
      question: "What is a good fantasy football score?",
      answer:
        "In PPR leagues, a QB scoring 20+ points is solid, 25+ is great. For RBs and WRs, 15+ is good, 20+ is excellent. For TEs, 10+ is good, 15+ is great. Top performances can reach 30-40+ points.",
    },
  ],
  formula:
    "QB: PassYds/25 + PassTD*4 + INT*(-2) + RushYds/10 + RushTD*6 + FumLost*(-2) | Skill: RushYds/10 + RushTD*6 + Rec*PPR + RecYds/10 + RecTD*6 + FumLost*(-2)",
};
