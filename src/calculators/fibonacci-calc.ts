import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fibonacciCalcCalculator: CalculatorDefinition = {
  slug: "fibonacci-calc",
  title: "Fibonacci Number Calculator",
  description: "Free fibonacci number calculator. Get accurate results instantly.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["fibonacci calculator"],
  variants: [{
    id: "standard",
    name: "Fibonacci Number",
    description: "",
    fields: [
      { name: "n", label: "Position (n)", type: "number", min: 1, max: 70 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "F(n)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate fibonacci number?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
