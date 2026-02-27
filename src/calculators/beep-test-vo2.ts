import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beepTestVo2Calculator: CalculatorDefinition = {
  slug: "beep-test-vo2",
  title: "Beep Test VO2 Calculator",
  description: "Free beep test vo2 calculator. Get accurate results instantly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["beep test calculator"],
  variants: [{
    id: "standard",
    name: "Beep Test VO2",
    description: "",
    fields: [
      { name: "level", label: "Level Reached", type: "number", min: 1 },
      { name: "shuttle", label: "Shuttle Number", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "VO2max", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate beep test vo2?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
