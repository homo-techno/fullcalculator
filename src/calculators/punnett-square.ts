import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const punnettSquareCalculator: CalculatorDefinition = {
  slug: "punnett-square-calculator",
  title: "Punnett Square Calculator",
  description:
    "Free Punnett square calculator. Predict offspring genotype and phenotype ratios for monohybrid crosses using a single-gene Punnett square.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "punnett square",
    "genetics calculator",
    "genotype ratio",
    "phenotype ratio",
    "monohybrid cross",
    "dominant",
    "recessive",
  ],
  variants: [
    {
      id: "monohybrid",
      name: "Monohybrid Cross",
      description: "Cross two parents for a single gene with two alleles",
      fields: [
        {
          name: "parent1",
          label: "Parent 1 Genotype",
          type: "select",
          options: [
            { label: "Homozygous Dominant (AA)", value: "AA" },
            { label: "Heterozygous (Aa)", value: "Aa" },
            { label: "Homozygous Recessive (aa)", value: "aa" },
          ],
          defaultValue: "Aa",
        },
        {
          name: "parent2",
          label: "Parent 2 Genotype",
          type: "select",
          options: [
            { label: "Homozygous Dominant (AA)", value: "AA" },
            { label: "Heterozygous (Aa)", value: "Aa" },
            { label: "Homozygous Recessive (aa)", value: "aa" },
          ],
          defaultValue: "Aa",
        },
      ],
      calculate: (inputs) => {
        const p1 = inputs.parent1 as string;
        const p2 = inputs.parent2 as string;
        if (!p1 || !p2) return null;

        const alleles1 = [p1[0], p1[1]];
        const alleles2 = [p2[0], p2[1]];

        const counts: Record<string, number> = {};
        for (const a1 of alleles1) {
          for (const a2 of alleles2) {
            const genotype =
              a1.toUpperCase() === a1 || a2.toUpperCase() !== a2
                ? a1 + a2
                : a2 + a1;
            const sorted =
              genotype[0] === genotype[0].toUpperCase()
                ? genotype
                : genotype[1] + genotype[0];
            counts[sorted] = (counts[sorted] || 0) + 1;
          }
        }

        const total = 4;
        const genotypeDetails = Object.entries(counts).map(
          ([g, c]) => `${g}: ${c}/${total} (${formatNumber((c / total) * 100, 1)}%)`
        );

        let dominant = 0;
        let recessive = 0;
        for (const [g, c] of Object.entries(counts)) {
          if (g[0] === g[0].toUpperCase()) {
            dominant += c;
          } else {
            recessive += c;
          }
        }

        return {
          primary: {
            label: "Genotype Ratio",
            value: Object.entries(counts)
              .map(([g, c]) => `${c} ${g}`)
              .join(" : "),
          },
          details: [
            { label: "Genotype Probabilities", value: genotypeDetails.join(", ") },
            {
              label: "Phenotype Ratio (Dominant : Recessive)",
              value: `${dominant} : ${recessive}`,
            },
            {
              label: "Dominant Phenotype",
              value: formatNumber((dominant / total) * 100, 1) + "%",
            },
            {
              label: "Recessive Phenotype",
              value: formatNumber((recessive / total) * 100, 1) + "%",
            },
            { label: "Parent 1", value: p1 },
            { label: "Parent 2", value: p2 },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "dihybrid-cross-calculator",
    "allele-frequency-calculator",
    "hardy-weinberg-calculator",
  ],
  faq: [
    {
      question: "What is a Punnett square?",
      answer:
        "A Punnett square is a diagram used in genetics to predict the genotypes of offspring from a particular cross. It shows all possible combinations of alleles from two parents and the probability of each outcome.",
    },
    {
      question: "What is the difference between genotype and phenotype?",
      answer:
        "Genotype is the genetic makeup (e.g., AA, Aa, aa), while phenotype is the observable trait. In simple dominance, both AA and Aa show the dominant phenotype, whereas only aa shows the recessive phenotype.",
    },
    {
      question: "What ratio does a heterozygous monohybrid cross produce?",
      answer:
        "A cross between two heterozygous parents (Aa × Aa) produces a 1:2:1 genotype ratio (1 AA : 2 Aa : 1 aa) and a 3:1 phenotype ratio (3 dominant : 1 recessive).",
    },
  ],
  formula:
    "Punnett Square: List alleles from each parent along rows and columns, then combine to find all possible offspring genotypes. Genotype ratio from Aa × Aa = 1 AA : 2 Aa : 1 aa. Phenotype ratio = 3 dominant : 1 recessive.",
};
