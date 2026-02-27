import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dripRateCalcCalculator: CalculatorDefinition = {
  slug: "drip-rate-calc",
  title: "Drip Rate Calculator",
  description: "Free drip rate calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["drip rate calculator", "iv drip"],
  variants: [{
    id: "standard",
    name: "Drip Rate",
    description: "",
    fields: [
      { name: "volume", label: "Volume (mL)", type: "number", min: 1 },
      { name: "time", label: "Time (hours)", type: "number", min: 0.1 },
      { name: "dropFactor", label: "Drop Factor (gtt/mL)", type: "number", defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Drops/min", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate drip rate?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
