import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pvrCalculator: CalculatorDefinition = {
  slug: "pvr-calculator",
  title: "Pulmonary Vascular Resistance Calculator",
  description: "Free pulmonary vascular resistance calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pvr calculator"],
  variants: [{
    id: "standard",
    name: "Pulmonary Vascular Resistance",
    description: "",
    fields: [
      { name: "mpap", label: "Mean PA Pressure (mmHg)", type: "number", min: 1 },
      { name: "pcwp", label: "PCWP (mmHg)", type: "number", min: 1 },
      { name: "co", label: "Cardiac Output (L/min)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "PVR (dynes)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate pulmonary vascular resistance?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
