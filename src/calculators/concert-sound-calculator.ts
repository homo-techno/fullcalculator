import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concertSoundCalculator: CalculatorDefinition = {
  slug: "concert-sound-calculator",
  title: "Concert Sound Calculator",
  description: "Calculate concert sound with our free online calculator. Get instant results.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["concert sound calculator"],
  variants: [{
    id: "standard",
    name: "Concert Sound",
    description: "",
    fields: [
      { name: "venue", label: "Venue Capacity", type: "number", min: 50 },
      { name: "wattsPerPerson", label: "Watts/Person", type: "number", defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "PA Watts Needed", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate concert sound?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good concert sound?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
