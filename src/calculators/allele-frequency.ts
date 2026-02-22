import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const alleleFrequencyCalculator: CalculatorDefinition = {
  slug: "allele-frequency-calculator",
  title: "Allele Frequency Calculator",
  description:
    "Free allele frequency calculator. Compute allele and genotype frequencies from population data using the Hardy-Weinberg principle.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "allele frequency",
    "hardy-weinberg",
    "population genetics",
    "genotype frequency",
    "p and q",
  ],
  variants: [
    {
      id: "from-genotypes",
      name: "From Genotype Counts",
      description:
        "Calculate allele frequencies from observed numbers of each genotype",
      fields: [
        {
          name: "countAA",
          label: "Number of AA individuals",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
        {
          name: "countAa",
          label: "Number of Aa individuals",
          type: "number",
          placeholder: "e.g. 100",
          min: 0,
        },
        {
          name: "countaa",
          label: "Number of aa individuals",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const nAA = inputs.countAA as number;
        const nAa = inputs.countAa as number;
        const naa = inputs.countaa as number;
        if (nAA == null || nAa == null || naa == null) return null;
        const total = nAA + nAa + naa;
        if (total === 0) return null;

        const p = (2 * nAA + nAa) / (2 * total);
        const q = 1 - p;

        return {
          primary: {
            label: "Frequency of A (p)",
            value: formatNumber(p, 4),
          },
          details: [
            { label: "Frequency of a (q)", value: formatNumber(q, 4) },
            { label: "p + q", value: formatNumber(p + q, 4) },
            { label: "Total individuals", value: String(total) },
            { label: "Total alleles", value: String(2 * total) },
            {
              label: "Expected AA (p²)",
              value: formatNumber(p * p * total, 1),
            },
            {
              label: "Expected Aa (2pq)",
              value: formatNumber(2 * p * q * total, 1),
            },
            {
              label: "Expected aa (q²)",
              value: formatNumber(q * q * total, 1),
            },
          ],
        };
      },
    },
    {
      id: "from-recessive",
      name: "From Recessive Phenotype Frequency",
      description:
        "Calculate allele frequencies when you know the proportion of recessive phenotypes",
      fields: [
        {
          name: "recessiveFreq",
          label: "Recessive phenotype frequency (q²)",
          type: "number",
          placeholder: "e.g. 0.25",
          min: 0,
          max: 1,
          step: 0.01,
        },
      ],
      calculate: (inputs) => {
        const q2 = inputs.recessiveFreq as number;
        if (q2 == null || q2 < 0 || q2 > 1) return null;

        const q = Math.sqrt(q2);
        const p = 1 - q;

        return {
          primary: {
            label: "Frequency of a (q)",
            value: formatNumber(q, 4),
          },
          details: [
            { label: "Frequency of A (p)", value: formatNumber(p, 4) },
            { label: "p²  (AA frequency)", value: formatNumber(p * p, 4) },
            { label: "2pq (Aa frequency)", value: formatNumber(2 * p * q, 4) },
            { label: "q²  (aa frequency)", value: formatNumber(q2, 4) },
            {
              label: "Carrier frequency (2pq)",
              value: formatNumber(2 * p * q * 100, 2) + "%",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "hardy-weinberg-calculator",
    "punnett-square-calculator",
    "chi-square-genetics-calculator",
  ],
  faq: [
    {
      question: "What are allele frequencies?",
      answer:
        "Allele frequencies describe how common each version of a gene (allele) is in a population. The frequency of the dominant allele is denoted p and the recessive allele q, where p + q = 1.",
    },
    {
      question: "How do you calculate allele frequency from genotype counts?",
      answer:
        "Count all copies of each allele: p = (2×AA + Aa) / (2×total individuals). Since there are only two alleles, q = 1 - p.",
    },
  ],
  formula:
    "p = (2×nAA + nAa) / (2×N), q = 1 - p. Genotype frequencies under Hardy-Weinberg: p² (AA) + 2pq (Aa) + q² (aa) = 1.",
};
