import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sugarConversionCalculator: CalculatorDefinition = {
  slug: "sugar-conversion-calculator",
  title: "Sugar Conversion Calculator",
  description: "Free sugar conversion calculator. Convert cups to g for cooking and baking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["sugar conversion calculator", "cups to g", "cooking conversion"],
  variants: [{
    id: "standard",
    name: "cups to g",
    description: "Convert cups to g",
    fields: [
      { name: "value", label: "Amount (cups)", type: "number", placeholder: "e.g. 2", suffix: "cups", min: 0, step: 0.01 },
    ],
    calculate: (inputs)=>{const v=inputs.value as number;if(!v&&v!==0)return null;const r=v*200;return{primary:{label:"g",value:formatNumber(r)+" g"},details:[{label:"Input",value:formatNumber(v)+" cups"},{label:"Factor",value:"1 cups = 200 g"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How many g in a cups?", answer: "1 cups equals approximately 200 g." },
    { question: "Is this exact for baking?", answer: "These conversions are standard approximations. For precise baking, use a kitchen scale." },
  ],
  formula: "g = cups x 200",
};
