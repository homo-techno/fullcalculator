import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const uvExposureTimeCalculator: CalculatorDefinition = {
  slug: "uv-exposure-time-calculator",
  title: "UV Exposure Time Calculator",
  description: "Free uv exposure time calculator. Calculate uv exposure time quickly and accurately.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["uv exposure calculator"],
  variants: [{
    id: "standard",
    name: "UV Exposure Time",
    description: "",
    fields: [
      { name: "uvIndex", label: "UV Index", type: "number", min: 1, max: 12 },
      { name: "skinType", label: "Skin Type (1-6)", type: "number", defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Safe Minutes", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate uv exposure time?", answer: "Enter values and get instant results." },
    { question: "Why use this uv exposure time calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
