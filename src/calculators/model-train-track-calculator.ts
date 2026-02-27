import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const modelTrainTrackCalculator: CalculatorDefinition = {
  slug: "model-train-track-calculator",
  title: "Model Train Track Calculator",
  description: "Free model train track calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["model train layout"],
  variants: [{
    id: "standard",
    name: "Model Train Track",
    description: "",
    fields: [
      { name: "length", label: "Layout Length (ft)", type: "number", min: 2 },
      { name: "width", label: "Layout Width (ft)", type: "number", min: 2 },
      { name: "trackCost", label: "Track/Ft ($)", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Track Cost", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate model train track?", answer: "Enter your values and get instant results with our free calculator." },
    { question: "Why use this calculator?", answer: "Quick, accurate, and completely free online tool." },
  ],
  formula: "Result = f(inputs)",
};
