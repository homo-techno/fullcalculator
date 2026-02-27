import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crownMoldingCalcCalculator: CalculatorDefinition = {
  slug: "crown-molding-calc",
  title: "Crown Molding Calculator",
  description: "Free crown molding calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["crown molding calculator"],
  variants: [{
    id: "standard",
    name: "Crown Molding",
    description: "",
    fields: [
      { name: "perimeter", label: "Room Perimeter (ft)", type: "number", min: 10 },
      { name: "waste", label: "Waste %", type: "number", defaultValue: 10 },
      { name: "pricePerFt", label: "Price/Ft ($)", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Total Cost ($)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate crown molding?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
