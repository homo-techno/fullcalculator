import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const actToSatConverterCalculator: CalculatorDefinition = {
  slug: "act-to-sat-converter-calculator",
  title: "ACT to SAT Converter Calculator",
  description: "Convert ACT composite scores to equivalent SAT scores.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["act","sat","conversion","score","college"],
  variants: [{
    id: "standard",
    name: "ACT to SAT Converter",
    description: "Convert ACT composite scores to equivalent SAT scores.",
    fields: [
      { name: "actScore", label: "ACT Composite Score", type: "number", min: 1, max: 36, step: 1, defaultValue: 25 },
      { name: "direction", label: "Conversion Direction", type: "select", options: [{ value: "1", label: "ACT to SAT" }, { value: "2", label: "SAT to ACT (enter SAT in ACT field / 44.4)" }] },
    ],
    calculate: (inputs) => {
    const actScore = inputs.actScore as number;
    const direction = inputs.direction as number;
    if (direction === 1) {
      const concordance = { 36: 1590, 35: 1540, 34: 1500, 33: 1460, 32: 1430, 31: 1400, 30: 1370, 29: 1340, 28: 1310, 27: 1280, 26: 1240, 25: 1210, 24: 1180, 23: 1140, 22: 1110, 21: 1080, 20: 1040, 19: 1010, 18: 970, 17: 930, 16: 890, 15: 850, 14: 800, 13: 760, 12: 710, 11: 670, 10: 630, 9: 590 };
      const rounded = Math.min(36, Math.max(9, Math.round(actScore)));
      const satScore = concordance[rounded] || 400;
      return {
        primary: { label: "Equivalent SAT Score", value: formatNumber(satScore) },
        details: [
          { label: "ACT Score", value: formatNumber(rounded) },
          { label: "SAT Range", value: formatNumber(satScore - 30) + " - " + formatNumber(satScore + 30) },
          { label: "Percentile (approx)", value: formatNumber(Math.round((rounded / 36) * 100)) + "th" },
          { label: "Competitiveness", value: satScore >= 1400 ? "Highly Competitive" : satScore >= 1200 ? "Competitive" : satScore >= 1000 ? "Average" : "Below Average" }
        ]
      };
    } else {
      const satFromAct = Math.round(actScore * 44.4);
      const estimatedAct = Math.round(satFromAct / 44.4);
      return {
        primary: { label: "Estimated Conversion", value: formatNumber(satFromAct) },
        details: [
          { label: "Input Value", value: formatNumber(actScore) },
          { label: "Estimated ACT", value: formatNumber(estimatedAct) },
          { label: "Note", value: "Use ACT to SAT mode for best results" }
        ]
      };
    }
  },
  }],
  relatedSlugs: ["sat-score-calculator","gpa-calculator","class-rank-percentile-calculator"],
  faq: [
    { question: "How do ACT and SAT scores compare?", answer: "An ACT score of 30 is roughly equivalent to an SAT score of 1370." },
    { question: "Do colleges prefer SAT or ACT?", answer: "Most colleges accept both tests equally and do not prefer one over the other." },
  ],
  formula: "SAT Score = Concordance table mapping from ACT composite",
};
