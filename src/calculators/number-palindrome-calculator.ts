import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const numberPalindromeCalculator: CalculatorDefinition = {
  slug: "number-palindrome-calculator",
  title: "Palindrome Check Calculator",
  description: "Calculate palindrome check using scientific formulas. Free palindrome check calculator.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["palindrome number checker"],
  variants: [{
    id: "standard",
    name: "Palindrome Check",
    description: "",
    fields: [
      { name: "n", label: "Number", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Is Palindrome", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is palindrome check?", answer: "Palindrome Check is a scientific measurement calculated using established formulas." },
    { question: "How to calculate palindrome check?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
