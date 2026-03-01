import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seriesSumCalculator: CalculatorDefinition = {
  slug: "series-sum-calculator",
  title: "Series Sum Calculator",
  description: "Calculate the sum of arithmetic and geometric series given the first term, common difference or ratio, and number of terms.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["series sum", "arithmetic series", "geometric series calculator"],
  variants: [{
    id: "standard",
    name: "Series Sum",
    description: "Calculate the sum of arithmetic and geometric series given the first term, common difference or ratio, and number of terms",
    fields: [
      { name: "firstTerm", label: "First Term (a)", type: "number", suffix: "", min: -10000, max: 10000, defaultValue: 1 },
      { name: "commonValue", label: "Common Difference (d) or Ratio (r)", type: "number", suffix: "", min: -1000, max: 1000, defaultValue: 2 },
      { name: "terms", label: "Number of Terms (n)", type: "number", suffix: "", min: 1, max: 1000, defaultValue: 10 },
      { name: "type", label: "Series Type", type: "select", options: [{value:"arithmetic",label:"Arithmetic"},{value:"geometric",label:"Geometric"}], defaultValue: "arithmetic" },
    ],
    calculate: (inputs) => {
      const a = inputs.firstTerm as number;
      const cv = inputs.commonValue as number;
      const n = inputs.terms as number;
      const type = inputs.type as string;
      if (a === undefined || cv === undefined || !n || n <= 0) return null;
      let sum = 0;
      let lastTerm = 0;
      if (type === "arithmetic") {
        lastTerm = a + (n - 1) * cv;
        sum = n * (a + lastTerm) / 2;
      } else {
        if (cv === 1) { sum = a * n; lastTerm = a; }
        else { sum = a * (1 - Math.pow(cv, n)) / (1 - cv); lastTerm = a * Math.pow(cv, n - 1); }
      }
      return {
        primary: { label: "Sum of Series", value: formatNumber(Math.round(sum * 10000) / 10000) },
        details: [
          { label: "Series Type", value: type === "arithmetic" ? "Arithmetic" : "Geometric" },
          { label: "Last Term", value: formatNumber(Math.round(lastTerm * 10000) / 10000) },
          { label: "Number of Terms", value: formatNumber(n) },
          { label: "Average Term", value: formatNumber(Math.round(sum / n * 10000) / 10000) },
        ],
      };
    },
  }],
  relatedSlugs: ["fibonacci-calculator", "logarithm-calculator"],
  faq: [
    { question: "What is an arithmetic series?", answer: "An arithmetic series is the sum of terms with a constant difference between consecutive terms. For example, 2 + 4 + 6 + 8 has a common difference of 2." },
    { question: "What is a geometric series?", answer: "A geometric series is the sum of terms where each term is multiplied by a constant ratio. For example, 3 + 6 + 12 + 24 has a common ratio of 2." },
  ],
  formula: "Arithmetic: S = n(a + last)/2; Geometric: S = a(1 - r^n)/(1 - r)",
};
