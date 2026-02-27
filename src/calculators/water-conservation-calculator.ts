import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const waterConservationCalculator: CalculatorDefinition = {
  slug: "water-conservation-calculator",
  title: "Water Conservation Calculator",
  description: "Free water conservation calculator. Calculate water conservation quickly and accurately.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["water savings calculator"],
  variants: [{
    id: "standard",
    name: "Water Conservation",
    description: "",
    fields: [
      { name: "showerMin", label: "Shower Min/Day", type: "number", defaultValue: 8 },
      { name: "flowRate", label: "Flow Rate (gal/min)", type: "number", defaultValue: 2.5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Gallons Saved/Year", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate water conservation?", answer: "Enter values and get instant results." },
    { question: "Why use this water conservation calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
