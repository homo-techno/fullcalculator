import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shannonDiversityCalculator: CalculatorDefinition = {
  slug: "shannon-diversity-calculator",
  title: "Shannon Diversity Index Calculator",
  description:
    "Free Shannon diversity index calculator. Calculate the Shannon-Wiener diversity index (H') and evenness from species abundance data.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "shannon diversity",
    "shannon-wiener",
    "diversity index",
    "species diversity",
    "evenness",
    "ecology",
    "biodiversity",
  ],
  variants: [
    {
      id: "from-counts",
      name: "From Species Counts",
      description:
        "Enter individual counts for up to 8 species to compute diversity",
      fields: [
        {
          name: "sp1",
          label: "Species 1 count",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
        },
        {
          name: "sp2",
          label: "Species 2 count",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
        },
        {
          name: "sp3",
          label: "Species 3 count",
          type: "number",
          placeholder: "e.g. 20",
          min: 0,
        },
        {
          name: "sp4",
          label: "Species 4 count (0 if none)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "sp5",
          label: "Species 5 count (0 if none)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "sp6",
          label: "Species 6 count (0 if none)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "sp7",
          label: "Species 7 count (0 if none)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          defaultValue: 0,
        },
        {
          name: "sp8",
          label: "Species 8 count (0 if none)",
          type: "number",
          placeholder: "e.g. 0",
          min: 0,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const counts = [
          inputs.sp1 as number,
          inputs.sp2 as number,
          inputs.sp3 as number,
          inputs.sp4 as number,
          inputs.sp5 as number,
          inputs.sp6 as number,
          inputs.sp7 as number,
          inputs.sp8 as number,
        ].filter((c) => c != null && c > 0);

        if (counts.length < 2) return null;

        const total = counts.reduce((a, b) => a + b, 0);
        if (total === 0) return null;

        let H = 0;
        for (const n of counts) {
          const pi = n / total;
          if (pi > 0) {
            H -= pi * Math.log(pi);
          }
        }

        const S = counts.length;
        const Hmax = Math.log(S);
        const evenness = Hmax > 0 ? H / Hmax : 0;
        const simpsonD = counts.reduce((sum, n) => sum + (n * (n - 1)), 0) / (total * (total - 1));
        const simpson1D = 1 - simpsonD;

        return {
          primary: {
            label: "Shannon Diversity Index (H')",
            value: formatNumber(H, 4),
          },
          details: [
            { label: "Species richness (S)", value: String(S) },
            { label: "Hmax (ln S)", value: formatNumber(Hmax, 4) },
            { label: "Evenness (J = H'/Hmax)", value: formatNumber(evenness, 4) },
            { label: "Simpson's Index (1−D)", value: formatNumber(simpson1D, 4) },
            { label: "Total individuals", value: formatNumber(total, 0) },
            {
              label: "Proportions",
              value: counts.map((c) => formatNumber((c / total) * 100, 1) + "%").join(", "),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "species-richness-calculator",
    "population-growth-calculator",
    "chi-square-genetics-calculator",
  ],
  faq: [
    {
      question: "What is the Shannon diversity index?",
      answer:
        "The Shannon diversity index (H') quantifies the uncertainty in predicting the species of a randomly chosen individual. Higher values indicate greater diversity. H' = −Σ(pᵢ × ln(pᵢ)), where pᵢ is the proportion of species i.",
    },
    {
      question: "What is evenness?",
      answer:
        "Evenness (J) measures how equally individuals are distributed among species: J = H'/Hmax, where Hmax = ln(S). J = 1 means all species are equally abundant; J near 0 means one species dominates.",
    },
    {
      question: "How does Shannon index differ from Simpson's index?",
      answer:
        "Shannon index is more sensitive to rare species, while Simpson's index gives more weight to abundant species. Both measure diversity but from different perspectives.",
    },
  ],
  formula:
    "H' = −Σ(pᵢ × ln(pᵢ)), where pᵢ = nᵢ/N. Hmax = ln(S). Evenness J = H'/Hmax. Simpson's D = Σ(nᵢ(nᵢ−1)) / (N(N−1)).",
};
