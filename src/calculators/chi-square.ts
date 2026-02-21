import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chiSquareCalculator: CalculatorDefinition = {
  slug: "chi-square-calculator",
  title: "Chi-Square Calculator",
  description:
    "Free chi-square calculator. Calculate the chi-square statistic from observed and expected frequencies for goodness-of-fit tests.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "chi-square",
    "chi-squared",
    "goodness of fit",
    "hypothesis testing",
    "statistics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Chi-Square",
      fields: [
        {
          name: "observed",
          label: "Observed values (comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 50, 30, 20",
        },
        {
          name: "expected",
          label: "Expected values (comma-separated)",
          type: "text" as "number",
          placeholder: "e.g. 40, 35, 25",
        },
      ],
      calculate: (inputs) => {
        const obs = (inputs.observed as string || "")
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
        const exp = (inputs.expected as string || "")
          .split(",")
          .map((s) => parseFloat(s.trim()))
          .filter((n) => !isNaN(n));
        if (obs.length === 0 || exp.length === 0 || obs.length !== exp.length)
          return null;
        if (exp.some((e) => e === 0)) return null;

        let chiSquare = 0;
        const components: string[] = [];
        for (let i = 0; i < obs.length; i++) {
          const component = Math.pow(obs[i] - exp[i], 2) / exp[i];
          chiSquare += component;
          components.push(formatNumber(component, 4));
        }

        const df = obs.length - 1;

        return {
          primary: { label: "Chi-Square (χ²)", value: formatNumber(chiSquare, 4) },
          details: [
            { label: "Degrees of freedom", value: String(df) },
            { label: "Number of categories", value: String(obs.length) },
            { label: "Components", value: components.join(", ") },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "z-score-calculator",
    "normal-distribution-calculator",
    "variance-calculator",
  ],
  faq: [
    {
      question: "What is the chi-square test?",
      answer:
        "The chi-square test is a statistical test used to determine if there is a significant difference between observed frequencies and expected frequencies in categorical data. A larger χ² value indicates a greater discrepancy.",
    },
  ],
  formula: "χ² = Σ((Oᵢ - Eᵢ)² / Eᵢ)",
};
