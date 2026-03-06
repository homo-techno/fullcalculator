import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bacterialGrowthRateCalculator: CalculatorDefinition = {
  slug: "bacterial-growth-rate-calculator",
  title: "Bacterial Growth Rate Calculator",
  description: "Calculate bacterial growth rate, generation time, and projected population from initial and final cell counts during exponential growth phase.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["bacterial growth rate","generation time","doubling rate bacteria","exponential growth microbiology","cell division rate"],
  variants: [{
    id: "standard",
    name: "Bacterial Growth Rate",
    description: "Calculate bacterial growth rate, generation time, and projected population from initial and final cell counts during exponential growth phase.",
    fields: [
      { name: "n0", label: "Initial Cell Count", type: "number", min: 1, max: 1e12, defaultValue: 1000 },
      { name: "nt", label: "Final Cell Count", type: "number", min: 1, max: 1e15, defaultValue: 1000000 },
      { name: "time", label: "Time Elapsed (hours)", type: "number", min: 0.1, max: 200, defaultValue: 6 },
    ],
    calculate: (inputs) => {
    const n0 = inputs.n0 as number;
    const nt = inputs.nt as number;
    const time = inputs.time as number;
    const generations = Math.log2(nt / n0);
    const generationTime = time / generations;
    const growthRate = Math.log(nt / n0) / time;
    const doublingTime = Math.log(2) / growthRate;
    const predict24 = n0 * Math.pow(2, 24 / generationTime);
    return {
      primary: { label: "Growth Rate (k)", value: formatNumber(Math.round(growthRate * 10000) / 10000) + " /hr" },
      details: [
        { label: "Generation Time", value: formatNumber(Math.round(generationTime * 100) / 100) + " hrs" },
        { label: "Number of Generations", value: formatNumber(Math.round(generations * 100) / 100) },
        { label: "Doubling Time", value: formatNumber(Math.round(doublingTime * 100) / 100) + " hrs" },
        { label: "Projected 24hr Population", value: formatNumber(Math.round(predict24)) }
      ]
    };
  },
  }],
  relatedSlugs: ["generation-time-calculator","doubling-time-calculator","serial-dilution-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "k = ln(Nt / N0) / t; g = ln(2) / k; Generations = log2(Nt / N0); where Nt = final count, N0 = initial count, t = time",
};
