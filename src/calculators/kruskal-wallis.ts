import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kruskalWallisCalculator: CalculatorDefinition = {
  slug: "kruskal-wallis-calculator",
  title: "Kruskal-Wallis Test Calculator",
  description: "Free Kruskal-Wallis test calculator. Non-parametric alternative to one-way ANOVA for comparing three or more independent groups using ranks.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["kruskal-wallis test", "non-parametric anova", "rank test", "compare multiple groups"],
  variants: [
    {
      id: "three-groups",
      name: "Three Groups (3 values each)",
      fields: [
        { name: "a1", label: "Group A Val 1", type: "number", placeholder: "e.g. 3" },
        { name: "a2", label: "Group A Val 2", type: "number", placeholder: "e.g. 5" },
        { name: "a3", label: "Group A Val 3", type: "number", placeholder: "e.g. 4" },
        { name: "b1", label: "Group B Val 1", type: "number", placeholder: "e.g. 7" },
        { name: "b2", label: "Group B Val 2", type: "number", placeholder: "e.g. 9" },
        { name: "b3", label: "Group B Val 3", type: "number", placeholder: "e.g. 8" },
        { name: "c1", label: "Group C Val 1", type: "number", placeholder: "e.g. 12" },
        { name: "c2", label: "Group C Val 2", type: "number", placeholder: "e.g. 14" },
        { name: "c3", label: "Group C Val 3", type: "number", placeholder: "e.g. 13" },
      ],
      calculate: (inputs) => {
        const ga = [inputs.a1 as number, inputs.a2 as number, inputs.a3 as number];
        const gb = [inputs.b1 as number, inputs.b2 as number, inputs.b3 as number];
        const gc = [inputs.c1 as number, inputs.c2 as number, inputs.c3 as number];
        const all = [...ga, ...gb, ...gc];
        if (all.some((v) => v === undefined || isNaN(v))) return null;
        const N = all.length;
        const combined: { v: number; group: number; rank: number }[] = all.map((v, i) => ({ v, group: i < 3 ? 0 : i < 6 ? 1 : 2, rank: 0 })).sort((a, b) => a.v - b.v);
        let idx = 0;
        while (idx < combined.length) {
          let j = idx;
          while (j < combined.length && combined[j].v === combined[idx].v) j++;
          const avg = (idx + 1 + j) / 2;
          for (let k = idx; k < j; k++) combined[k].rank = avg;
          idx = j;
        }
        const groups = [ga, gb, gc];
        const rankSums = [0, 1, 2].map((gi) => combined.filter((c) => c.group === gi).reduce((s, c) => s + c.rank, 0));
        const H = (12 / (N * (N + 1))) * rankSums.reduce((s, r, i) => s + (r * r) / groups[i].length, 0) - 3 * (N + 1);
        const pApprox = H > 9.21 ? "< 0.01" : H > 5.99 ? "< 0.05" : H > 4.61 ? "borderline" : "> 0.10";
        return {
          primary: { label: "H-Statistic", value: formatNumber(H, 4) },
          details: [
            { label: "Rank Sum A", value: formatNumber(rankSums[0], 2) },
            { label: "Rank Sum B", value: formatNumber(rankSums[1], 2) },
            { label: "Rank Sum C", value: formatNumber(rankSums[2], 2) },
            { label: "df", value: formatNumber(2) },
            { label: "p-value (approx)", value: pApprox },
            { label: "Total N", value: formatNumber(N) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["one-way-anova-calculator", "mann-whitney-calculator"],
  faq: [
    { question: "What is the Kruskal-Wallis test?", answer: "A non-parametric alternative to one-way ANOVA that compares three or more independent groups using ranks." },
  ],
  formula: "H = [12/(N(N+1))] * sum(Ri^2/ni) - 3(N+1)",
};
