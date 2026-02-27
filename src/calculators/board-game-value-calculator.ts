import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boardGameValueCalculator: CalculatorDefinition = {
  slug: "board-game-value-calculator",
  title: "Board Game Value Calculator",
  description: "Free board game value calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["board game cost per play"],
  variants: [{
    id: "standard",
    name: "Board Game Value",
    description: "",
    fields: [
      { name: "price", label: "Game Price ($)", type: "number", min: 1 },
      { name: "plays", label: "Times Played", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Cost/Play", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate board game value?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
