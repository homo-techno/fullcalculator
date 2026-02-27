import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const honeyConversionCalculator: CalculatorDefinition = {
  slug: "honey-conversion-calculator",
  title: "Honey Conversion Calculator",
  description: "Free honey conversion calculator. Convert tbsp to g for cooking and baking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["honey conversion calculator", "tbsp to g", "cooking conversion"],
  variants: [{
    id: "standard",
    name: "tbsp to g",
    description: "Convert tbsp to g",
    fields: [
      { name: "value", label: "Amount (tbsp)", type: "number", placeholder: "e.g. 2", suffix: "tbsp", min: 0, step: 0.01 },
    ],
    calculate: (inputs)=>{const v=inputs.value as number;if(!v&&v!==0)return null;const r=v*21;return{primary:{label:"g",value:formatNumber(r)+" g"},details:[{label:"Input",value:formatNumber(v)+" tbsp"},{label:"Factor",value:"1 tbsp = 21 g"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How many g in a tbsp?", answer: "1 tbsp equals approximately 21 g." },
    { question: "Is this exact for baking?", answer: "These conversions are standard approximations. For precise baking, use a kitchen scale." },
  ],
  formula: "g = tbsp x 21",
};
