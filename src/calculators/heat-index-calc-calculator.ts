import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatIndexCalcCalculator: CalculatorDefinition = {
  slug: "heat-index-calc-calculator",
  title: "Heat Index Calculator",
  description: "Free heat index calculator. Calculate heat index quickly and accurately.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["heat index calculator"],
  variants: [{
    id: "standard",
    name: "Heat Index",
    description: "",
    fields: [
      { name: "temp", label: "Air Temp (°F)", type: "number", min: 80 },
      { name: "humidity", label: "Humidity %", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Heat Index (°F)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate heat index?", answer: "Enter values and get instant results." },
    { question: "Why use this heat index calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
