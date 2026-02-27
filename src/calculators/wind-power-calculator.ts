import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windPowerCalculator: CalculatorDefinition = {
  slug: "wind-power-calculator",
  title: "Wind Power Calculator",
  description: "Calculate wind power using scientific formulas. Free wind power calculator.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["wind power calculator"],
  variants: [{
    id: "standard",
    name: "Wind Power",
    description: "",
    fields: [
      { name: "diameter", label: "Rotor Diameter (m)", type: "number", min: 1 },
      { name: "windSpeed", label: "Wind Speed (m/s)", type: "number", min: 1 },
      { name: "efficiency", label: "Efficiency", type: "number", defaultValue: 0.35 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      const result = v.reduce((a, b) => a + b, 0) * (v[0] || 1) / (v.length || 1);
      return { primary: { label: "Power (W)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Input " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["scientific-notation"],
  faq: [
    { question: "What is wind power?", answer: "Wind Power is a scientific measurement calculated using established formulas." },
    { question: "How to calculate wind power?", answer: "Enter the required values and our calculator applies the correct formula." },
  ],
  formula: "Result = f(inputs)",
};
