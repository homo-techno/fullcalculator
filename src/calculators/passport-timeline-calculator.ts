import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const passportTimelineCalculator: CalculatorDefinition = {
  slug: "passport-timeline-calculator",
  title: "Passport Timeline Calculator",
  description: "Calculate passport timeline with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["passport processing time"],
  variants: [{
    id: "standard",
    name: "Passport Timeline",
    description: "",
    fields: [
      { name: "type", label: "Type (1=routine,2=expedited)", type: "number", defaultValue: 1 },
      { name: "weeks", label: "Weeks Until Travel", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Processing Days", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate passport timeline?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good passport timeline?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
