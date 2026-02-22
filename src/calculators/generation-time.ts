import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const generationTimeCalculator: CalculatorDefinition = {
  slug: "generation-time-calculator",
  title: "Generation Time Calculator",
  description:
    "Free bacterial generation time calculator. Calculate doubling time, growth rate, and final population from initial conditions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "generation time",
    "doubling time",
    "bacterial growth",
    "growth rate",
    "microbiology",
    "exponential growth",
  ],
  variants: [
    {
      id: "generation-time",
      name: "Calculate Generation Time",
      description: "Find doubling time from initial and final population counts",
      fields: [
        {
          name: "initialPop",
          label: "Initial Population (N₀)",
          type: "number",
          placeholder: "e.g. 1000",
          min: 1,
        },
        {
          name: "finalPop",
          label: "Final Population (Nₜ)",
          type: "number",
          placeholder: "e.g. 1000000",
          min: 1,
        },
        {
          name: "time",
          label: "Time Elapsed",
          type: "number",
          placeholder: "e.g. 120",
          min: 0,
        },
        {
          name: "timeUnit",
          label: "Time Unit",
          type: "select",
          options: [
            { label: "Minutes", value: "min" },
            { label: "Hours", value: "hr" },
          ],
          defaultValue: "min",
        },
      ],
      calculate: (inputs) => {
        const N0 = inputs.initialPop as number;
        const Nt = inputs.finalPop as number;
        const t = inputs.time as number;
        const unit = inputs.timeUnit as string;
        if (!N0 || !Nt || !t || N0 <= 0 || Nt <= 0 || t <= 0) return null;
        if (Nt <= N0) return null;

        const n = Math.log2(Nt / N0); // number of generations
        const generationTime = t / n;
        const growthRate = n / t;
        const specificGrowthRate = Math.log(Nt / N0) / t;

        const unitLabel = unit === "hr" ? "hours" : "minutes";

        return {
          primary: {
            label: "Generation (Doubling) Time",
            value: formatNumber(generationTime, 2) + " " + unitLabel,
          },
          details: [
            { label: "Number of generations (n)", value: formatNumber(n, 2) },
            {
              label: "Growth rate constant (k)",
              value: formatNumber(growthRate, 4) + " per " + (unit === "hr" ? "hour" : "minute"),
            },
            {
              label: "Specific growth rate (μ)",
              value: formatNumber(specificGrowthRate, 4) + " per " + (unit === "hr" ? "hour" : "minute"),
            },
            { label: "Initial population", value: formatNumber(N0, 0) },
            { label: "Final population", value: formatNumber(Nt, 0) },
            { label: "Time elapsed", value: formatNumber(t, 2) + " " + unitLabel },
          ],
        };
      },
    },
    {
      id: "predict-population",
      name: "Predict Final Population",
      description: "Calculate expected population after a given number of generations",
      fields: [
        {
          name: "initialPop",
          label: "Initial Population (N₀)",
          type: "number",
          placeholder: "e.g. 1000",
          min: 1,
        },
        {
          name: "generationTime",
          label: "Generation Time (minutes)",
          type: "number",
          placeholder: "e.g. 20",
          min: 0.1,
        },
        {
          name: "totalTime",
          label: "Total Time (minutes)",
          type: "number",
          placeholder: "e.g. 180",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const N0 = inputs.initialPop as number;
        const g = inputs.generationTime as number;
        const t = inputs.totalTime as number;
        if (!N0 || !g || !t || N0 <= 0 || g <= 0 || t <= 0) return null;

        const n = t / g;
        const Nt = N0 * Math.pow(2, n);

        return {
          primary: {
            label: "Final Population",
            value: Nt > 1e12 ? Nt.toExponential(2) : formatNumber(Nt, 0),
          },
          details: [
            { label: "Number of generations", value: formatNumber(n, 2) },
            { label: "Fold increase", value: formatNumber(Nt / N0, 1) + "×" },
            { label: "Initial population", value: formatNumber(N0, 0) },
            { label: "Generation time", value: formatNumber(g, 2) + " min" },
            { label: "Total time", value: formatNumber(t, 2) + " min" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "population-growth-calculator",
    "cell-dilution-calculator",
    "hemocytometer-calculator",
  ],
  faq: [
    {
      question: "What is generation time?",
      answer:
        "Generation time (doubling time) is the time required for a bacterial population to double in number during exponential growth. E. coli, for example, has a generation time of about 20 minutes under optimal conditions.",
    },
    {
      question: "How do you calculate generation time?",
      answer:
        "Generation time g = t / n, where t is the elapsed time and n is the number of generations. n = log₂(Nₜ/N₀), which is the log base 2 of the ratio of final to initial population.",
    },
  ],
  formula:
    "n = log₂(Nₜ / N₀). Generation time g = t / n. Growth rate k = n / t. Specific growth rate μ = ln(Nₜ / N₀) / t.",
};
