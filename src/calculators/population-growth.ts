import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const populationGrowthCalculator: CalculatorDefinition = {
  slug: "population-growth-calculator",
  title: "Population Growth Calculator",
  description:
    "Free population growth calculator. Model exponential and logistic population growth with growth rate, doubling time, and carrying capacity.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "population growth",
    "exponential growth",
    "logistic growth",
    "growth rate",
    "ecology",
    "doubling time",
  ],
  variants: [
    {
      id: "exponential",
      name: "Exponential Growth",
      description: "Unlimited growth model: Nt = N0 × e^(rt)",
      fields: [
        {
          name: "initialPop",
          label: "Initial Population (N₀)",
          type: "number",
          placeholder: "e.g. 100",
          min: 1,
        },
        {
          name: "growthRate",
          label: "Intrinsic Growth Rate (r) per time unit",
          type: "number",
          placeholder: "e.g. 0.05",
          step: 0.001,
        },
        {
          name: "time",
          label: "Time (t)",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const N0 = inputs.initialPop as number;
        const r = inputs.growthRate as number;
        const t = inputs.time as number;
        if (!N0 || r == null || !t || N0 <= 0 || t < 0) return null;

        const Nt = N0 * Math.exp(r * t);
        const doublingTime = r > 0 ? Math.log(2) / r : null;

        const details = [
          { label: "Final population (Nt)", value: Nt > 1e12 ? Nt.toExponential(3) : formatNumber(Nt, 0) },
          { label: "Growth rate (r)", value: formatNumber(r, 4) },
          { label: "Time elapsed", value: formatNumber(t, 2) },
          { label: "Fold change", value: formatNumber(Nt / N0, 2) + "×" },
        ];

        if (doublingTime !== null && doublingTime > 0) {
          details.push({ label: "Doubling time", value: formatNumber(doublingTime, 2) });
        }

        return {
          primary: {
            label: "Population at Time t",
            value: Nt > 1e12 ? Nt.toExponential(3) : formatNumber(Nt, 0),
          },
          details,
        };
      },
    },
    {
      id: "logistic",
      name: "Logistic Growth",
      description: "Growth with carrying capacity: Nt = K / (1 + ((K-N0)/N0) × e^(-rt))",
      fields: [
        {
          name: "initialPop",
          label: "Initial Population (N₀)",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
        },
        {
          name: "carryingCapacity",
          label: "Carrying Capacity (K)",
          type: "number",
          placeholder: "e.g. 1000",
          min: 1,
        },
        {
          name: "growthRate",
          label: "Intrinsic Growth Rate (r)",
          type: "number",
          placeholder: "e.g. 0.1",
          step: 0.001,
        },
        {
          name: "time",
          label: "Time (t)",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const N0 = inputs.initialPop as number;
        const K = inputs.carryingCapacity as number;
        const r = inputs.growthRate as number;
        const t = inputs.time as number;
        if (!N0 || !K || r == null || !t || N0 <= 0 || K <= 0 || t < 0)
          return null;

        const Nt = K / (1 + ((K - N0) / N0) * Math.exp(-r * t));
        const percentK = (Nt / K) * 100;
        const dNdt = r * Nt * (1 - Nt / K);

        return {
          primary: {
            label: "Population at Time t",
            value: formatNumber(Nt, 0),
          },
          details: [
            { label: "% of carrying capacity", value: formatNumber(percentK, 1) + "%" },
            { label: "Growth rate at time t (dN/dt)", value: formatNumber(dNdt, 2) },
            { label: "Carrying capacity (K)", value: formatNumber(K, 0) },
            { label: "Intrinsic growth rate (r)", value: formatNumber(r, 4) },
            { label: "Initial population", value: formatNumber(N0, 0) },
            { label: "Max growth rate at N=K/2", value: formatNumber((r * K) / 4, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "carrying-capacity-calculator",
    "generation-time-calculator",
    "shannon-diversity-calculator",
  ],
  faq: [
    {
      question: "What is the difference between exponential and logistic growth?",
      answer:
        "Exponential growth assumes unlimited resources: Nt = N₀e^(rt), producing J-shaped curves. Logistic growth includes a carrying capacity K that limits population size, producing S-shaped (sigmoid) curves.",
    },
    {
      question: "What is intrinsic growth rate (r)?",
      answer:
        "The intrinsic rate of natural increase (r) is the per-capita growth rate under ideal conditions: r = birth rate − death rate. A positive r means the population is growing.",
    },
    {
      question: "When does logistic growth rate peak?",
      answer:
        "The population growth rate (dN/dt) in logistic growth is maximum when the population is at K/2 (half the carrying capacity). At this point, dN/dt = rK/4.",
    },
  ],
  formula:
    "Exponential: Nt = N₀ × e^(rt). Logistic: Nt = K / (1 + ((K−N₀)/N₀) × e^(−rt)). Doubling time = ln(2)/r. Max dN/dt at N = K/2.",
};
