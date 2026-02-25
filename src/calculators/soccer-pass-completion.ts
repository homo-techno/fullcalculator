import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soccerPassCompletionCalculator: CalculatorDefinition = {
  slug: "soccer-pass-completion-calculator",
  title: "Pass Completion Rate Calculator",
  description: "Free pass completion rate calculator. Calculate soccer pass completion percentage from match data.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pass completion rate", "soccer passing stats", "pass accuracy", "football passing calculator", "pass percentage"],
  variants: [
    {
      id: "standard",
      name: "Standard Pass Completion",
      description: "Completion % = Completed / Total * 100",
      fields: [
        { name: "completedPasses", label: "Completed Passes", type: "number", placeholder: "e.g. 420" },
        { name: "totalPasses", label: "Total Passes Attempted", type: "number", placeholder: "e.g. 500" },
      ],
      calculate: (inputs) => {
        const completed = inputs.completedPasses as number;
        const total = inputs.totalPasses as number;
        if (completed === undefined || !total || total <= 0) return null;
        const rate = (completed / total) * 100;
        const incomplete = total - completed;
        let rating = "Poor";
        if (rate >= 92) rating = "Elite";
        else if (rate >= 87) rating = "Excellent";
        else if (rate >= 82) rating = "Above Average";
        else if (rate >= 75) rating = "Average";
        else if (rate >= 65) rating = "Below Average";
        return {
          primary: { label: "Completion Rate", value: formatNumber(rate, 1) + "%" },
          details: [
            { label: "Completed Passes", value: formatNumber(completed) },
            { label: "Incomplete Passes", value: formatNumber(incomplete) },
            { label: "Total Attempted", value: formatNumber(total) },
            { label: "Rating", value: rating },
          ],
        };
      },
    },
    {
      id: "by-type",
      name: "By Pass Type",
      description: "Breakdown by short, medium, and long passes",
      fields: [
        { name: "shortCompleted", label: "Short Passes Completed", type: "number", placeholder: "e.g. 200" },
        { name: "shortTotal", label: "Short Passes Attempted", type: "number", placeholder: "e.g. 220" },
        { name: "medCompleted", label: "Medium Passes Completed", type: "number", placeholder: "e.g. 150" },
        { name: "medTotal", label: "Medium Passes Attempted", type: "number", placeholder: "e.g. 180" },
        { name: "longCompleted", label: "Long Passes Completed", type: "number", placeholder: "e.g. 30" },
        { name: "longTotal", label: "Long Passes Attempted", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const sc = (inputs.shortCompleted as number) || 0;
        const st = (inputs.shortTotal as number) || 0;
        const mc = (inputs.medCompleted as number) || 0;
        const mt = (inputs.medTotal as number) || 0;
        const lc = (inputs.longCompleted as number) || 0;
        const lt = (inputs.longTotal as number) || 0;
        const totalCompleted = sc + mc + lc;
        const totalAttempted = st + mt + lt;
        if (totalAttempted <= 0) return null;
        const overallRate = (totalCompleted / totalAttempted) * 100;
        return {
          primary: { label: "Overall Completion Rate", value: formatNumber(overallRate, 1) + "%" },
          details: [
            { label: "Short Pass Rate", value: st > 0 ? formatNumber((sc / st) * 100, 1) + "%" : "N/A" },
            { label: "Medium Pass Rate", value: mt > 0 ? formatNumber((mc / mt) * 100, 1) + "%" : "N/A" },
            { label: "Long Pass Rate", value: lt > 0 ? formatNumber((lc / lt) * 100, 1) + "%" : "N/A" },
            { label: "Total Completed / Attempted", value: formatNumber(totalCompleted) + " / " + formatNumber(totalAttempted) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["soccer-expected-goals-calculator", "sports-betting-ev-calculator"],
  faq: [
    { question: "What is a good pass completion rate?", answer: "In top-level soccer, elite teams maintain 85-92% completion rates. Central midfielders and center-backs typically have higher rates (88-93%)." },
    { question: "Why does pass completion rate matter?", answer: "Pass completion rate indicates a team ability to maintain possession and control the game. Higher rates correlate with better possession stats." },
  ],
  formula: "Pass Completion Rate = (Completed Passes / Total Passes) * 100",
};