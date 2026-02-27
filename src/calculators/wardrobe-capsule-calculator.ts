import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wardrobeCapsuleCalculator: CalculatorDefinition = {
  slug: "wardrobe-capsule-calculator",
  title: "Capsule Wardrobe Calculator",
  description: "Calculate capsule wardrobe with our free online calculator. Get instant results.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["capsule wardrobe calculator"],
  variants: [{
    id: "standard",
    name: "Capsule Wardrobe",
    description: "",
    fields: [
      { name: "outfits", label: "Desired Outfits", type: "number", min: 5 },
      { name: "tops", label: "Tops Owned", type: "number", min: 1 },
      { name: "bottoms", label: "Bottoms Owned", type: "number", min: 1 },
    ],
    calculate: (inputs) => {
      const v = Object.values(inputs).filter(x => typeof x === 'number');
      if (v.some(x => x === undefined || x === null)) return null;
      if (v.length < 2) return null;
      const result = (v[0] * v[1]) / (v.length > 2 ? v[2] : 1);
      return { primary: { label: "Possible Combos", value: formatNumber(result) }, details: v.map((x,i) => ({ label: "Value " + (i+1), value: formatNumber(x) })) };
    },
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How to calculate capsule wardrobe?", answer: "Enter your values and our calculator will compute the result instantly." },
    { question: "What is a good capsule wardrobe?", answer: "This depends on context. Use our calculator to find your specific result." },
  ],
  formula: "Rate = (Value / Total) × 100",
};
