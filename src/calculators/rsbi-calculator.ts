import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rsbiCalculator: CalculatorDefinition = {
  slug: "rsbi-calculator",
  title: "RSBI Calculator",
  description: "Free rsbi calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["rsbi calculator", "rapid shallow breathing"],
  variants: [{
    id: "standard",
    name: "RSBI",
    description: "",
    fields: [
      { name: "respRate", label: "Resp Rate (breaths/min)", type: "number", min: 1 },
      { name: "tidalVol", label: "Tidal Volume (L)", type: "number", min: 0.1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "RSBI", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate rsbi?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "RSBI = RR / Vt",
};
