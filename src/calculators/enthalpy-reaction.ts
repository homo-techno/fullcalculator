import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const enthalpyReactionCalculator: CalculatorDefinition = {
  slug: "enthalpy-reaction",
  title: "Enthalpy of Reaction Calculator",
  description: "Free enthalpy of reaction calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["enthalpy calculator"],
  variants: [{
    id: "standard",
    name: "Enthalpy of Reaction",
    description: "",
    fields: [
      { name: "products", label: "ΣH Products (kJ)", type: "number" },
      { name: "reactants", label: "ΣH Reactants (kJ)", type: "number" },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "ΔH (kJ)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate enthalpy of reaction?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "ΔH = ΣH(products) - ΣH(reactants)",
};
