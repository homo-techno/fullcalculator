import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const barometricAltitudeCalculator: CalculatorDefinition = {
  slug: "barometric-altitude-calculator",
  title: "Barometric Altitude Calculator",
  description: "Free barometric altitude calculator. Calculate barometric altitude quickly and accurately.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["barometric altitude"],
  variants: [{
    id: "standard",
    name: "Barometric Altitude",
    description: "",
    fields: [
      { name: "pressure", label: "Pressure (hPa)", type: "number", min: 200 },
      { name: "seaLevel", label: "Sea Level (hPa)", type: "number", defaultValue: 1013.25 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Altitude (m)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate barometric altitude?", answer: "Enter values and get instant results." },
    { question: "Why use this barometric altitude calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
