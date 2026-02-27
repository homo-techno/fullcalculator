import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const podcastMonetizationCalculator: CalculatorDefinition = {
  slug: "podcast-monetization-calculator",
  title: "Podcast Monetization Calculator",
  description: "Free podcast monetization calculator. Calculate podcast monetization quickly and accurately.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["podcast earnings"],
  variants: [{
    id: "standard",
    name: "Podcast Monetization",
    description: "",
    fields: [
      { name: "downloads", label: "Downloads/Episode", type: "number", min: 100 },
      { name: "cpm", label: "CPM ($)", type: "number", defaultValue: 25 },
      { name: "episodes", label: "Episodes/Month", type: "number", defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Monthly Revenue", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: String(formatNumber(x)) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate podcast monetization?", answer: "Enter values and get instant results." },
    { question: "Why use this podcast monetization calculator?", answer: "Quick, accurate, and free online calculation tool." },
  ],
  formula: "Result = f(inputs)",
};
