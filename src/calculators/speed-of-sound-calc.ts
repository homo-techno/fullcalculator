import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const speedOfSoundCalcCalculator: CalculatorDefinition = {
  slug: "speed-of-sound-calc",
  title: "Speed of Sound Calculator",
  description: "Free speed of sound calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["speed of sound calculator"],
  variants: [{
    id: "standard",
    name: "Speed of Sound",
    description: "",
    fields: [
      { name: "temp", label: "Temperature (°C)", type: "number" },
      { name: "medium", label: "Medium (1=air)", type: "number", defaultValue: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Speed (m/s)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate speed of sound?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "v = 331.3 + 0.606T",
};
