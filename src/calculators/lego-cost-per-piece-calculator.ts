import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const legoCostPerPieceCalculator: CalculatorDefinition = {
  slug: "lego-cost-per-piece-calculator",
  title: "LEGO Cost Per Piece Calculator",
  description: "Free lego cost per piece calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lego price per piece"],
  variants: [{
    id: "standard",
    name: "LEGO Cost Per Piece",
    description: "",
    fields: [
      { name: "price", label: "Set Price ($)", type: "number", min: 1 },
      { name: "pieces", label: "Piece Count", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Price/Piece", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate lego cost per piece?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
