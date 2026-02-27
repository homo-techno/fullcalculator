import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const arduinoPowerCalculator: CalculatorDefinition = {
  slug: "arduino-power-calculator",
  title: "Arduino Power Calculator",
  description: "Calculate arduino power with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["arduino power calculator"],
  variants: [{
    id: "standard",
    name: "Arduino Power",
    description: "",
    fields: [
      { name: "voltage", label: "Voltage (V)", type: "number", defaultValue: 5 },
      { name: "current", label: "Current (mA)", type: "number", defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Power (mW)", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate arduino power?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good arduino power?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
