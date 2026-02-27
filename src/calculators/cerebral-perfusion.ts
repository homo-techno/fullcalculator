import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cerebralPerfusionCalculator: CalculatorDefinition = {
  slug: "cerebral-perfusion",
  title: "Cerebral Perfusion Pressure Calculator",
  description: "Free cerebral perfusion pressure calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["cpp calculator"],
  variants: [{
    id: "standard",
    name: "Cerebral Perfusion Pressure",
    description: "",
    fields: [
      { name: "map", label: "MAP (mmHg)", type: "number", min: 40 },
      { name: "icp", label: "ICP (mmHg)", type: "number", min: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "CPP (mmHg)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate cerebral perfusion pressure?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "CPP = MAP - ICP",
};
