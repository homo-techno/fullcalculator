import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dihybridCrossCalculator: CalculatorDefinition = {
  slug: "dihybrid-cross-calculator",
  title: "Dihybrid Cross Calculator",
  description:
    "Free dihybrid cross Punnett square calculator. Predict offspring genotype and phenotype ratios for two-gene crosses.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "dihybrid cross",
    "punnett square",
    "two gene cross",
    "genetics",
    "genotype ratio",
    "phenotype ratio",
    "independent assortment",
  ],
  variants: [
    {
      id: "dihybrid",
      name: "Dihybrid Cross",
      description: "Cross two parents for two genes simultaneously",
      fields: [
        {
          name: "parent1Gene1",
          label: "Parent 1 - Gene 1",
          type: "select",
          options: [
            { label: "Homozygous Dominant (AA)", value: "AA" },
            { label: "Heterozygous (Aa)", value: "Aa" },
            { label: "Homozygous Recessive (aa)", value: "aa" },
          ],
          defaultValue: "Aa",
        },
        {
          name: "parent1Gene2",
          label: "Parent 1 - Gene 2",
          type: "select",
          options: [
            { label: "Homozygous Dominant (BB)", value: "BB" },
            { label: "Heterozygous (Bb)", value: "Bb" },
            { label: "Homozygous Recessive (bb)", value: "bb" },
          ],
          defaultValue: "Bb",
        },
        {
          name: "parent2Gene1",
          label: "Parent 2 - Gene 1",
          type: "select",
          options: [
            { label: "Homozygous Dominant (AA)", value: "AA" },
            { label: "Heterozygous (Aa)", value: "Aa" },
            { label: "Homozygous Recessive (aa)", value: "aa" },
          ],
          defaultValue: "Aa",
        },
        {
          name: "parent2Gene2",
          label: "Parent 2 - Gene 2",
          type: "select",
          options: [
            { label: "Homozygous Dominant (BB)", value: "BB" },
            { label: "Heterozygous (Bb)", value: "Bb" },
            { label: "Homozygous Recessive (bb)", value: "bb" },
          ],
          defaultValue: "Bb",
        },
      ],
      calculate: (inputs) => {
        const p1g1 = inputs.parent1Gene1 as string;
        const p1g2 = inputs.parent1Gene2 as string;
        const p2g1 = inputs.parent2Gene1 as string;
        const p2g2 = inputs.parent2Gene2 as string;
        if (!p1g1 || !p1g2 || !p2g1 || !p2g2) return null;

        const gametes1: string[] = [];
        for (const a of [p1g1[0], p1g1[1]]) {
          for (const b of [p1g2[0], p1g2[1]]) {
            gametes1.push(a + b);
          }
        }

        const gametes2: string[] = [];
        for (const a of [p2g1[0], p2g1[1]]) {
          for (const b of [p2g2[0], p2g2[1]]) {
            gametes2.push(a + b);
          }
        }

        const normalize = (a1: string, a2: string): string => {
          const g1 =
            a1[0].toUpperCase() === a1[0] ? a1[0] + a2[0] : a2[0] + a1[0];
          const g2 =
            a1[1].toUpperCase() === a1[1] ? a1[1] + a2[1] : a2[1] + a1[1];
          return g1 + g2;
        };

        const counts: Record<string, number> = {};
        const total = 16;
        for (const g1 of gametes1) {
          for (const g2 of gametes2) {
            const genotype = normalize(g1, g2);
            counts[genotype] = (counts[genotype] || 0) + 1;
          }
        }

        const phenoCounts: Record<string, number> = {};
        for (const [g, c] of Object.entries(counts)) {
          const trait1 = g[0] === g[0].toUpperCase() ? "Dominant A" : "Recessive a";
          const trait2 = g[2] === g[2].toUpperCase() ? "Dominant B" : "Recessive b";
          const key = `${trait1}, ${trait2}`;
          phenoCounts[key] = (phenoCounts[key] || 0) + c;
        }

        const genotypeList = Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .map(([g, c]) => `${g}: ${c}/${total}`)
          .join(", ");

        const phenoList = Object.entries(phenoCounts)
          .sort(([, a], [, b]) => b - a)
          .map(
            ([p, c]) =>
              `${p}: ${c}/${total} (${formatNumber((c / total) * 100, 1)}%)`
          )
          .join(", ");

        return {
          primary: {
            label: "Phenotype Ratio",
            value: Object.entries(phenoCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([, c]) => c)
              .join(" : "),
          },
          details: [
            { label: "Total Offspring Combinations", value: String(total) },
            { label: "Genotypes", value: genotypeList },
            { label: "Phenotypes", value: phenoList },
            { label: "Parent 1", value: `${p1g1}${p1g2}` },
            { label: "Parent 2", value: `${p2g1}${p2g2}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "punnett-square-calculator",
    "allele-frequency-calculator",
    "chi-square-genetics-calculator",
  ],
  faq: [
    {
      question: "What is a dihybrid cross?",
      answer:
        "A dihybrid cross examines the inheritance of two different genes simultaneously. It uses a 4×4 Punnett square (16 combinations) to predict genotype and phenotype ratios of offspring.",
    },
    {
      question: "What is the expected ratio of a dihybrid cross between two heterozygotes?",
      answer:
        "When both parents are heterozygous for both genes (AaBb × AaBb), the expected phenotype ratio is 9:3:3:1 — 9 dominant-dominant, 3 dominant-recessive, 3 recessive-dominant, 1 recessive-recessive.",
    },
  ],
  formula:
    "Dihybrid Cross: Each parent produces 4 gamete types. The 4×4 Punnett square yields 16 offspring combinations. For AaBb × AaBb: phenotype ratio = 9:3:3:1.",
};
