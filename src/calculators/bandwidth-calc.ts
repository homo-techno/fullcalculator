import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bandwidthCalcCalculator: CalculatorDefinition = {
  slug: "bandwidth-calc",
  title: "Bandwidth Calculator",
  description: "Free bandwidth calculator. Get accurate results instantly.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bandwidth calculator"],
  variants: [{
    id: "standard",
    name: "Bandwidth",
    description: "",
    fields: [
      { name: "fileSize", label: "File Size (MB)", type: "number", min: 0.1 },
      { name: "speed", label: "Speed (Mbps)", type: "number", min: 0.1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Download Time (s)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate bandwidth?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
