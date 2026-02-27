import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatExchangerCalculator: CalculatorDefinition = {
  slug: "heat-exchanger",
  title: "Heat Exchanger Calculator",
  description: "Free heat exchanger calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["heat exchanger calculator"],
  variants: [{
    id: "standard",
    name: "Heat Exchanger",
    description: "",
    fields: [
      { name: "flow", label: "Flow Rate (kg/s)", type: "number", min: 0.01 },
      { name: "cp", label: "Specific Heat (J/kg·K)", type: "number", defaultValue: 4186 },
      { name: "deltaT", label: "ΔT (°C)", type: "number", min: 0.1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Heat Transfer (W)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate heat exchanger?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
