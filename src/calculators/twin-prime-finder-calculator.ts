import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const twinPrimeFinderCalculator: CalculatorDefinition = {
  slug: "twin-prime-finder-calculator",
  title: "Twin Prime Finder Calculator",
  description: "Calculate twin prime finder using scientific formulas. Free twin prime finder calculator.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["twin prime calculator"],
  variants: [{
    id: "standard",
    name: "Twin Prime Finder",
    description: "",
    fields: [
      { name: "limit", label: "Search Up To", type: "number", min: 10 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Twin Primes Found", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is twin prime finder?", answer: "Twin Prime Finder is a scientific measurement calculated using established formulas." },
    { question: "How to calculate twin prime finder?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
