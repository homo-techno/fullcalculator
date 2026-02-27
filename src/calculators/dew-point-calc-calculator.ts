import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dewPointCalcCalculator: CalculatorDefinition = {
  slug: "dew-point-calc-calculator",
  title: "Dew Point Calculator",
  description: "Free dew point calculator. Calculate dew point quickly and accurately.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["dew point calculator"],
  variants: [{
    id: "standard",
    name: "Dew Point",
    description: "",
    fields: [
      { name: "temp", label: "Air Temp (°F)", type: "number" },
      { name: "humidity", label: "Humidity %", type: "number", min: 0, max: 100 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Dew Point (°F)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate dew point?", answer: "Enter values and get instant results." },
    { question: "Why use this dew point calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
