import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vanillaConversionCalculator: CalculatorDefinition = {
  slug: "vanilla-conversion-calculator",
  title: "Vanilla Conversion Calculator",
  description: "Free vanilla conversion calculator. Convert tsp to ml for cooking and baking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["vanilla conversion calculator", "tsp to ml", "cooking conversion"],
  variants: [{
    id: "standard",
    name: "tsp to ml",
    description: "Convert tsp to ml",
    fields: [
      { name: "value", label: "Amount (tsp)", type: "number", placeholder: "e.g. 2", suffix: "tsp", min: 0, step: 0.01 },
    ],
    calculate: (inputs)=>{const v=inputs.value as number;if(!v&&v!==0)return null;const r=v*5;return{primary:{label:"ml",value:formatNumber(r)+" ml"},details:[{label:"Input",value:formatNumber(v)+" tsp"},{label:"Factor",value:"1 tsp = 5 ml"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How many ml in a tsp?", answer: "1 tsp equals approximately 5 ml." },
    { question: "Is this exact for baking?", answer: "These conversions are standard approximations. For precise baking, use a kitchen scale." },
  ],
  formula: "ml = tsp x 5",
};
