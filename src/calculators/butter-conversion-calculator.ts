import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const butterConversionCalculator: CalculatorDefinition = {
  slug: "butter-conversion-calculator",
  title: "Butter Conversion Calculator",
  description: "Free butter conversion calculator. Convert sticks to g for cooking and baking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["butter conversion calculator", "sticks to g", "cooking conversion"],
  variants: [{
    id: "standard",
    name: "sticks to g",
    description: "Convert sticks to g",
    fields: [
      { name: "value", label: "Amount (sticks)", type: "number", placeholder: "e.g. 2", suffix: "sticks", min: 0, step: 0.01 },
    ],
    calculate: (inputs)=>{const v=inputs.value as number;if(!v&&v!==0)return null;const r=v*113.4;return{primary:{label:"g",value:formatNumber(r)+" g"},details:[{label:"Input",value:formatNumber(v)+" sticks"},{label:"Factor",value:"1 sticks = 113.4 g"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How many g in a sticks?", answer: "1 sticks equals approximately 113.4 g." },
    { question: "Is this exact for baking?", answer: "These conversions are standard approximations. For precise baking, use a kitchen scale." },
  ],
  formula: "g = sticks x 113.4",
};
