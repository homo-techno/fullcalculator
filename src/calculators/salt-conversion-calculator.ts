import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const saltConversionCalculator: CalculatorDefinition = {
  slug: "salt-conversion-calculator",
  title: "Salt Conversion Calculator",
  description: "Free salt conversion calculator. Convert tsp to g for cooking and baking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["salt conversion calculator", "tsp to g", "cooking conversion"],
  variants: [{
    id: "standard",
    name: "tsp to g",
    description: "Convert tsp to g",
    fields: [
      { name: "value", label: "Amount (tsp)", type: "number", placeholder: "e.g. 2", suffix: "tsp", min: 0, step: 0.01 },
    ],
    calculate: (inputs)=>{const v=inputs.value as number;if(!v&&v!==0)return null;const r=v*6;return{primary:{label:"g",value:formatNumber(r)+" g"},details:[{label:"Input",value:formatNumber(v)+" tsp"},{label:"Factor",value:"1 tsp = 6 g"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How many g in a tsp?", answer: "1 tsp equals approximately 6 g." },
    { question: "Is this exact for baking?", answer: "These conversions are standard approximations. For precise baking, use a kitchen scale." },
  ],
  formula: "g = tsp x 6",
};
