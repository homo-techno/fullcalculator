import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carbonFootprintCarCalculator: CalculatorDefinition = {
  slug: "carbon-footprint-car",
  title: "Car Carbon Footprint Calculator",
  description: "Free car carbon footprint calculator. Get accurate results instantly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["car carbon footprint"],
  variants: [{
    id: "standard",
    name: "Car Carbon Footprint",
    description: "",
    fields: [
      { name: "miles", label: "Miles/Year", type: "number", min: 1 },
      { name: "mpg", label: "MPG", type: "number", defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const r = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "CO2 (tons/year)", value: formatNumber(r) }, details: v.map((x,i) => ({ label: "Value "+(i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate car carbon footprint?", answer: "Enter your values and get instant results." },
    { question: "Why use this calculator?", answer: "Free, accurate, and easy to use online tool." },
  ],
  formula: "Result = f(inputs)",
};
