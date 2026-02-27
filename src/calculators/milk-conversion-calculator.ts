import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const milkConversionCalculator: CalculatorDefinition = {
  slug: "milk-conversion-calculator",
  title: "Milk Conversion Calculator",
  description: "Free milk conversion calculator. Convert cups to ml for cooking and baking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["milk conversion calculator", "cups to ml", "cooking conversion"],
  variants: [{
    id: "standard",
    name: "cups to ml",
    description: "Convert cups to ml",
    fields: [
      { name: "value", label: "Amount (cups)", type: "number", placeholder: "e.g. 2", suffix: "cups", min: 0, step: 0.01 },
    ],
    calculate: (inputs)=>{const v=inputs.value as number;if(!v&&v!==0)return null;const r=v*240;return{primary:{label:"ml",value:formatNumber(r)+" ml"},details:[{label:"Input",value:formatNumber(v)+" cups"},{label:"Factor",value:"1 cups = 240 ml"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How many ml in a cups?", answer: "1 cups equals approximately 240 ml." },
    { question: "Is this exact for baking?", answer: "These conversions are standard approximations. For precise baking, use a kitchen scale." },
  ],
  formula: "ml = cups x 240",
};
