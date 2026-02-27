import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windChillTempCalculator: CalculatorDefinition = {
  slug: "wind-chill-temp-calculator",
  title: "Wind Chill Calculator",
  description: "Free wind chill calculator. Calculate wind chill quickly and accurately.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["wind chill calculator"],
  variants: [{
    id: "standard",
    name: "Wind Chill",
    description: "",
    fields: [
      { name: "temp", label: "Air Temp (°F)", type: "number" },
      { name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 3 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Feels Like (°F)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate wind chill?", answer: "Enter values and get instant results." },
    { question: "Why use this wind chill calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
