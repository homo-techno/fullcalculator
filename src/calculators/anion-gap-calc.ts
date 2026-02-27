import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const anionGapCalcCalculator: CalculatorDefinition = {
  slug: "anion-gap-calc",
  title: "Anion Gap Calculator",
  description: "Free anion gap calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["anion gap calculator"],
  variants: [{
    id: "standard",
    name: "Anion Gap",
    description: "",
    fields: [
      { name: "sodium", label: "Sodium (mEq/L)", type: "number", defaultValue: 140 },
      { name: "chloride", label: "Chloride (mEq/L)", type: "number", defaultValue: 100 },
      { name: "bicarb", label: "Bicarbonate (mEq/L)", type: "number", defaultValue: 24 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Anion Gap", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate anion gap?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "AG = Na - (Cl + HCO3)",
};
