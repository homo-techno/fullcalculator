import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bloodTransfusionVolCalculator: CalculatorDefinition = {
  slug: "blood-transfusion-vol",
  title: "Blood Transfusion Volume Calculator",
  description: "Free blood transfusion volume calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["blood transfusion calculator"],
  variants: [{
    id: "standard",
    name: "Blood Transfusion Volume",
    description: "",
    fields: [
      { name: "weight", label: "Weight (kg)", type: "number", min: 1 },
      { name: "desiredHb", label: "Desired Hb (g/dL)", type: "number", min: 1 },
      { name: "currentHb", label: "Current Hb (g/dL)", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Volume (mL)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate blood transfusion volume?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
