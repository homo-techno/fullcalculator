import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const raspberryPiPowerCalculator: CalculatorDefinition = {
  slug: "raspberry-pi-power-calculator",
  title: "Raspberry Pi Power Calculator",
  description: "Calculate raspberry pi power with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["raspberry pi power"],
  variants: [{
    id: "standard",
    name: "Raspberry Pi Power",
    description: "",
    fields: [
      { name: "voltage", label: "Voltage (V)", type: "number", defaultValue: 5 },
      { name: "current", label: "Current (A)", type: "number", defaultValue: 2.5 },
      { name: "hours", label: "Hours/Day", type: "number", defaultValue: 24 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Wh/Day", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate raspberry pi power?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good raspberry pi power?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
