import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dataTransferTimeCalculator: CalculatorDefinition = {
  slug: "data-transfer-time",
  title: "Data Transfer Time Calculator",
  description: "Free data transfer time calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["data transfer time calculator"],
  variants: [{
    id: "standard",
    name: "Data Transfer Time",
    description: "",
    fields: [
      { name: "size", label: "Size (GB)", type: "number", min: 0.01 },
      { name: "speed", label: "Speed (Mbps)", type: "number", min: 0.1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Transfer Time", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate data transfer time?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
