import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const internetSpeedNeedsCalculator: CalculatorDefinition = {
  slug: "internet-speed-needs",
  title: "Internet Speed Needs Calculator",
  description: "Free internet speed needs calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["internet speed calculator"],
  variants: [{
    id: "standard",
    name: "Internet Speed Needs",
    description: "",
    fields: [
      { name: "devices", label: "Connected Devices", type: "number", min: 1 },
      { name: "streaming", label: "4K Streams", type: "number", defaultValue: 1 },
      { name: "gaming", label: "Gaming Devices", type: "number", defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Recommended Mbps", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate internet speed needs?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
