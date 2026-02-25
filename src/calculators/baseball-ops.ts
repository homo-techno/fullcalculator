import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baseballOpsCalculator: CalculatorDefinition = {
  slug: "baseball-ops-calculator",
  title: "Baseball OPS Calculator",
  description: "Free baseball OPS calculator. Calculate On-Base Plus Slugging from batting statistics.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baseball ops calculator", "on-base plus slugging", "ops baseball", "batting statistics", "sabermetrics"],
  variants: [
    {
      id: "from-components",
      name: "From OBP and SLG",
      description: "OPS = OBP + SLG",
      fields: [
        { name: "obp", label: "On-Base Percentage (OBP)", type: "number", placeholder: "e.g. 0.350", step: 0.001 },
        { name: "slg", label: "Slugging Percentage (SLG)", type: "number", placeholder: "e.g. 0.500", step: 0.001 },
      ],
      calculate: (inputs) => {
        const obp = inputs.obp as number;
        const slg = inputs.slg as number;
        if (obp === undefined || slg === undefined) return null;
        const ops = obp + slg;
        let rating = "Poor";
        if (ops >= 1.000) rating = "Elite";
        else if (ops >= 0.900) rating = "Great";
        else if (ops >= 0.800) rating = "Above Average";
        else if (ops >= 0.710) rating = "Average";
        else if (ops >= 0.670) rating = "Below Average";
        return {
          primary: { label: "OPS", value: formatNumber(ops, 3) },
          details: [
            { label: "OBP", value: formatNumber(obp, 3) },
            { label: "SLG", value: formatNumber(slg, 3) },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
    {
      id: "from-raw",
      name: "From Raw Stats",
      description: "Calculate OPS from raw batting stats",
      fields: [
        { name: "hits", label: "Hits (H)", type: "number", placeholder: "e.g. 150" },
        { name: "doubles", label: "Doubles (2B)", type: "number", placeholder: "e.g. 30" },
        { name: "triples", label: "Triples (3B)", type: "number", placeholder: "e.g. 5" },
        { name: "homeRuns", label: "Home Runs (HR)", type: "number", placeholder: "e.g. 25" },
        { name: "walks", label: "Walks (BB)", type: "number", placeholder: "e.g. 60" },
        { name: "hbp", label: "Hit By Pitch (HBP)", type: "number", placeholder: "e.g. 3", defaultValue: 0 },
        { name: "atBats", label: "At Bats (AB)", type: "number", placeholder: "e.g. 500" },
        { name: "sacFlies", label: "Sacrifice Flies (SF)", type: "number", placeholder: "e.g. 4", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const h = inputs.hits as number;
        const d = inputs.doubles as number;
        const t = inputs.triples as number;
        const hr = inputs.homeRuns as number;
        const bb = inputs.walks as number;
        const hbp = (inputs.hbp as number) || 0;
        const ab = inputs.atBats as number;
        const sf = (inputs.sacFlies as number) || 0;
        if (h === undefined || ab === undefined || !ab) return null;
        const singles = h - (d || 0) - (t || 0) - (hr || 0);
        const totalBases = singles + ((d || 0) * 2) + ((t || 0) * 3) + ((hr || 0) * 4);
        const slg = totalBases / ab;
        const obpDenom = ab + (bb || 0) + hbp + sf;
        const obp = obpDenom > 0 ? (h + (bb || 0) + hbp) / obpDenom : 0;
        const ops = obp + slg;
        return {
          primary: { label: "OPS", value: formatNumber(ops, 3) },
          details: [
            { label: "OBP", value: formatNumber(obp, 3) },
            { label: "SLG", value: formatNumber(slg, 3) },
            { label: "Total Bases", value: formatNumber(totalBases) },
            { label: "Singles", value: formatNumber(singles) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["baseball-obp-calculator", "baseball-slugging-calculator", "baseball-era-calculator"],
  faq: [
    { question: "What is OPS in baseball?", answer: "OPS (On-Base Plus Slugging) combines a batter ability to get on base (OBP) with their power (SLG). It is the sum of OBP and slugging percentage." },
    { question: "What is a good OPS?", answer: "An OPS of .800+ is above average, .900+ is great, and 1.000+ is elite. The league average OPS typically falls around .710-.750." },
  ],
  formula: "OPS = OBP + SLG",
};