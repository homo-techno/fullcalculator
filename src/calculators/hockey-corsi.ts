import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hockeyCorsiCalculator: CalculatorDefinition = {
  slug: "hockey-corsi-calculator",
  title: "Hockey Corsi Calculator",
  description: "Free hockey Corsi calculator. Calculate Corsi For, Corsi Against, and Corsi percentage for shot attempt analytics.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hockey corsi calculator", "corsi percentage", "shot attempts analytics", "nhl corsi", "hockey advanced stats"],
  variants: [
    {
      id: "standard",
      name: "Standard Corsi",
      description: "CF% = CF / (CF + CA) * 100",
      fields: [
        { name: "shotsFor", label: "Shots on Goal For", type: "number", placeholder: "e.g. 30" },
        { name: "blockedFor", label: "Blocked Shots For", type: "number", placeholder: "e.g. 8" },
        { name: "missedFor", label: "Missed Shots For", type: "number", placeholder: "e.g. 10" },
        { name: "shotsAgainst", label: "Shots on Goal Against", type: "number", placeholder: "e.g. 25" },
        { name: "blockedAgainst", label: "Blocked Shots Against", type: "number", placeholder: "e.g. 6" },
        { name: "missedAgainst", label: "Missed Shots Against", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const sf = (inputs.shotsFor as number) || 0;
        const bf = (inputs.blockedFor as number) || 0;
        const mf = (inputs.missedFor as number) || 0;
        const sa = (inputs.shotsAgainst as number) || 0;
        const ba = (inputs.blockedAgainst as number) || 0;
        const ma = (inputs.missedAgainst as number) || 0;
        const cf = sf + bf + mf;
        const ca = sa + ba + ma;
        const total = cf + ca;
        if (total <= 0) return null;
        const cfPercent = (cf / total) * 100;
        const corsiRel = cf - ca;
        let rating = "Heavily Outshot";
        if (cfPercent >= 55) rating = "Dominant";
        else if (cfPercent >= 52) rating = "Above Average";
        else if (cfPercent >= 48) rating = "Average";
        else if (cfPercent >= 45) rating = "Below Average";
        return {
          primary: { label: "Corsi For %", value: formatNumber(cfPercent, 1) + "%" },
          details: [
            { label: "Corsi For (CF)", value: formatNumber(cf) },
            { label: "Corsi Against (CA)", value: formatNumber(ca) },
            { label: "Corsi Differential", value: corsiRel >= 0 ? "+" + formatNumber(corsiRel) : formatNumber(corsiRel) },
            { label: "Total Shot Attempts", value: formatNumber(total) },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hockey-save-pct-calculator", "sports-betting-ev-calculator"],
  faq: [
    { question: "What is Corsi in hockey?", answer: "Corsi measures shot attempt differential including shots on goal, blocked shots, and missed shots. A positive Corsi means generating more shot attempts than allowed." },
    { question: "What is a good Corsi percentage?", answer: "A CF% above 50% means out-shooting the opposition. Above 55% is dominant, while below 45% indicates being consistently outshot." },
  ],
  formula: "CF = SOG + Blocked + Missed | CF% = CF / (CF + CA) * 100",
};