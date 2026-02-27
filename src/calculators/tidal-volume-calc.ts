import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tidalVolumeCalcCalculator: CalculatorDefinition = {
  slug: "tidal-volume-calc",
  title: "Tidal Volume Calculator",
  description: "Free tidal volume calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["tidal volume calculator"],
  variants: [{
    id: "standard",
    name: "Tidal Volume",
    description: "",
    fields: [
      { name: "weight", label: "Ideal Body Weight (kg)", type: "number", min: 30 },
      { name: "mlPerKg", label: "mL/kg", type: "number", defaultValue: 6 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Tidal Volume (mL)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate tidal volume?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Vt = IBW × mL/kg",
};
