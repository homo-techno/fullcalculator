import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pumpPowerCalculator: CalculatorDefinition = {
  slug: "pump-power",
  title: "Pump Power Calculator",
  description: "Free pump power calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["pump power calculator"],
  variants: [{
    id: "standard",
    name: "Pump Power",
    description: "",
    fields: [
      { name: "flow", label: "Flow Rate (m³/s)", type: "number", min: 0.001 },
      { name: "head", label: "Head (m)", type: "number", min: 0.1 },
      { name: "density", label: "Density (kg/m³)", type: "number", defaultValue: 1000 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Power (W)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate pump power?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
