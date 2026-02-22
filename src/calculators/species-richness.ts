import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const speciesRichnessCalculator: CalculatorDefinition = {
  slug: "species-richness-calculator",
  title: "Species Richness Calculator",
  description:
    "Free species richness calculator. Estimate species richness with Margalef and Menhinick indices from sample data.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "species richness",
    "Margalef index",
    "Menhinick index",
    "biodiversity",
    "ecology",
    "species count",
  ],
  variants: [
    {
      id: "richness-indices",
      name: "Richness Indices",
      description: "Calculate Margalef and Menhinick indices from species and individual counts",
      fields: [
        {
          name: "speciesCount",
          label: "Number of Species (S)",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
        },
        {
          name: "totalIndividuals",
          label: "Total Individuals (N)",
          type: "number",
          placeholder: "e.g. 500",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const S = inputs.speciesCount as number;
        const N = inputs.totalIndividuals as number;
        if (!S || !N || S <= 0 || N <= 0) return null;

        const margalef = (S - 1) / Math.log(N);
        const menhinick = S / Math.sqrt(N);
        const avgPerSpecies = N / S;

        return {
          primary: {
            label: "Margalef Richness Index (DMg)",
            value: formatNumber(margalef, 4),
          },
          details: [
            { label: "Menhinick Index (DMn)", value: formatNumber(menhinick, 4) },
            { label: "Species count (S)", value: String(S) },
            { label: "Total individuals (N)", value: formatNumber(N, 0) },
            { label: "Average individuals per species", value: formatNumber(avgPerSpecies, 1) },
            { label: "ln(N)", value: formatNumber(Math.log(N), 4) },
            { label: "√N", value: formatNumber(Math.sqrt(N), 4) },
          ],
        };
      },
    },
    {
      id: "rarefaction",
      name: "Rarefaction Estimate",
      description:
        "Estimate expected species at a smaller sample size using rarefaction",
      fields: [
        {
          name: "speciesCount",
          label: "Observed Species (S)",
          type: "number",
          placeholder: "e.g. 20",
          min: 1,
        },
        {
          name: "totalIndividuals",
          label: "Total Individuals (N)",
          type: "number",
          placeholder: "e.g. 500",
          min: 1,
        },
        {
          name: "subsampleSize",
          label: "Subsample Size (n)",
          type: "number",
          placeholder: "e.g. 100",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const S = inputs.speciesCount as number;
        const N = inputs.totalIndividuals as number;
        const n = inputs.subsampleSize as number;
        if (!S || !N || !n || S <= 0 || N <= 0 || n <= 0 || n > N) return null;

        // Simplified rarefaction: E(S) ≈ S × (1 - ((N-n)/N)^(N/S))
        // More accurate approximation for equal abundances:
        const avgAbundance = N / S;
        let expectedS = 0;
        for (let i = 0; i < S; i++) {
          // Probability that species i is not sampled in n draws
          // Approx: ((N - avgAbundance) / N) ^ n for species with avgAbundance individuals
          const pMiss = Math.pow((N - avgAbundance) / N, n);
          expectedS += 1 - pMiss;
        }

        return {
          primary: {
            label: "Expected Species at Subsample",
            value: formatNumber(expectedS, 1),
          },
          details: [
            { label: "Observed species (S)", value: String(S) },
            { label: "Total sample (N)", value: formatNumber(N, 0) },
            { label: "Subsample size (n)", value: formatNumber(n, 0) },
            { label: "Sampling fraction", value: formatNumber((n / N) * 100, 1) + "%" },
            { label: "Average abundance per species", value: formatNumber(avgAbundance, 1) },
          ],
          note: "Assumes equal species abundances. For unequal abundances, use individual species counts.",
        };
      },
    },
  ],
  relatedSlugs: [
    "shannon-diversity-calculator",
    "population-growth-calculator",
    "carrying-capacity-calculator",
  ],
  faq: [
    {
      question: "What is species richness?",
      answer:
        "Species richness is simply the number of different species present in a sample or community. Unlike diversity indices, it does not account for the relative abundance of each species.",
    },
    {
      question: "What is the Margalef index?",
      answer:
        "The Margalef richness index adjusts species count for sample size: DMg = (S−1)/ln(N). It accounts for the fact that more species are found in larger samples.",
    },
    {
      question: "What is rarefaction?",
      answer:
        "Rarefaction is a method to compare species richness between samples of different sizes. It estimates the expected number of species in a smaller random subsample drawn from the full dataset.",
    },
  ],
  formula:
    "Margalef: DMg = (S − 1) / ln(N). Menhinick: DMn = S / √N. Where S = number of species, N = total individuals.",
};
