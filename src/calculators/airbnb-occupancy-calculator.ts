import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airbnbOccupancyCalculator: CalculatorDefinition = {
  slug: "airbnb-occupancy-calculator",
  title: "Airbnb Occupancy Calculator",
  description: "Calculate airbnb occupancy with our free online calculator. Get instant results.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["airbnb occupancy rate"],
  variants: [{
    id: "standard",
    name: "Airbnb Occupancy",
    description: "",
    fields: [
      { name: "bookedNights", label: "Booked Nights", type: "number", min: 1 },
      { name: "totalNights", label: "Total Nights", type: "number", defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Occupancy %", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate airbnb occupancy?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good airbnb occupancy?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
