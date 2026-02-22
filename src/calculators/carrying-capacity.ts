import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carryingCapacityCalculator: CalculatorDefinition = {
  slug: "carrying-capacity-calculator",
  title: "Carrying Capacity Calculator",
  description:
    "Free carrying capacity calculator. Estimate the carrying capacity (K) of an environment from population data and logistic growth parameters.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "carrying capacity",
    "K value",
    "logistic growth",
    "population ecology",
    "maximum population",
    "sustainability",
  ],
  variants: [
    {
      id: "from-growth-data",
      name: "Estimate K from Two Population Points",
      description: "Estimate carrying capacity from population at two time points",
      fields: [
        {
          name: "n0",
          label: "Population at Time 0 (N₀)",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
        },
        {
          name: "n1",
          label: "Population at Time t (Nt)",
          type: "number",
          placeholder: "e.g. 200",
          min: 1,
        },
        {
          name: "time",
          label: "Time Elapsed (t)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
        },
        {
          name: "growthRate",
          label: "Intrinsic Growth Rate (r)",
          type: "number",
          placeholder: "e.g. 0.2",
          step: 0.001,
        },
      ],
      calculate: (inputs) => {
        const N0 = inputs.n0 as number;
        const Nt = inputs.n1 as number;
        const t = inputs.time as number;
        const r = inputs.growthRate as number;
        if (!N0 || !Nt || !t || r == null || N0 <= 0 || Nt <= 0 || t <= 0)
          return null;

        // From logistic equation: Nt = K / (1 + ((K-N0)/N0)*e^(-rt))
        // Rearranging: K = Nt * (1 + ((K-N0)/N0)*e^(-rt))
        // K * (Nt - Nt*e^(-rt)) / (Nt - N0*e^(-rt)) ... solving for K:
        // K = Nt * (1 + A) where A = ((K-N0)/N0)*e^(-rt)
        // Direct solve: K(Nt) = Nt × N0 × e^(rt) / (N0 × e^(rt) - N0 + Nt × (1 - e^(rt)/(...)))
        // Use numeric: K = (Nt × (e^(rt) - 1) × N0) / (N0 × e^(rt) - Nt)
        const ert = Math.exp(r * t);
        const denominator = N0 * ert - Nt;
        if (denominator <= 0) {
          return {
            primary: {
              label: "Carrying Capacity (K)",
              value: "Cannot estimate",
            },
            details: [
              {
                label: "Note",
                value:
                  "Population growth appears exponential (no K constraint detected). Try a longer time period or check r value.",
              },
            ],
          };
        }

        const K = (Nt * N0 * (ert - 1)) / denominator;

        if (K < Nt) {
          return {
            primary: {
              label: "Carrying Capacity (K)",
              value: "Cannot estimate — values inconsistent",
            },
            details: [
              {
                label: "Note",
                value: "The given data does not fit a logistic growth model. Please check your inputs.",
              },
            ],
          };
        }

        const percentUsed = (Nt / K) * 100;

        return {
          primary: {
            label: "Estimated Carrying Capacity (K)",
            value: formatNumber(K, 0),
          },
          details: [
            { label: "Current % of K", value: formatNumber(percentUsed, 1) + "%" },
            { label: "Room for growth", value: formatNumber(K - Nt, 0) },
            { label: "Initial population (N₀)", value: formatNumber(N0, 0) },
            { label: "Current population (Nt)", value: formatNumber(Nt, 0) },
            { label: "Growth rate (r)", value: formatNumber(r, 4) },
            { label: "Time elapsed", value: formatNumber(t, 2) },
          ],
        };
      },
    },
    {
      id: "resource-based",
      name: "Resource-Based Carrying Capacity",
      description: "Estimate K from available resources and per-individual requirements",
      fields: [
        {
          name: "totalResource",
          label: "Total Available Resource",
          type: "number",
          placeholder: "e.g. 10000",
          min: 0,
        },
        {
          name: "perIndividual",
          label: "Resource Needed per Individual",
          type: "number",
          placeholder: "e.g. 15",
          min: 0,
        },
        {
          name: "resourceUnit",
          label: "Resource Type",
          type: "select",
          options: [
            { label: "Food (kg/year)", value: "food" },
            { label: "Water (L/day)", value: "water" },
            { label: "Space (m²)", value: "space" },
            { label: "Energy (kcal/day)", value: "energy" },
            { label: "Other", value: "other" },
          ],
          defaultValue: "food",
        },
      ],
      calculate: (inputs) => {
        const total = inputs.totalResource as number;
        const perInd = inputs.perIndividual as number;
        const unit = inputs.resourceUnit as string;
        if (!total || !perInd || total <= 0 || perInd <= 0) return null;

        const K = Math.floor(total / perInd);
        const leftover = total - K * perInd;

        return {
          primary: {
            label: "Carrying Capacity (K)",
            value: formatNumber(K, 0) + " individuals",
          },
          details: [
            { label: "Total resource available", value: formatNumber(total, 2) },
            { label: "Resource per individual", value: formatNumber(perInd, 2) },
            { label: "Resource type", value: unit },
            { label: "Surplus resource", value: formatNumber(leftover, 2) },
            { label: "Resource utilization", value: formatNumber(((K * perInd) / total) * 100, 1) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "population-growth-calculator",
    "shannon-diversity-calculator",
    "species-richness-calculator",
  ],
  faq: [
    {
      question: "What is carrying capacity?",
      answer:
        "Carrying capacity (K) is the maximum population size an environment can sustain indefinitely given available resources like food, water, habitat, and other necessities.",
    },
    {
      question: "What factors affect carrying capacity?",
      answer:
        "Carrying capacity depends on abiotic factors (temperature, water, space) and biotic factors (food availability, predation, disease, competition). It can change over time as conditions change.",
    },
    {
      question: "What happens when a population exceeds K?",
      answer:
        "When a population exceeds carrying capacity, density-dependent factors like starvation, disease, and competition increase, causing the population to decline back toward K (sometimes oscillating).",
    },
  ],
  formula:
    "Resource-based K = Total resources / Resources per individual. From logistic model: K can be estimated by fitting Nt = K/(1 + ((K−N₀)/N₀)×e^(−rt)) to observed data.",
};
