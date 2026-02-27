import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const oilConversionCalculator: CalculatorDefinition = {
  slug: "oil-conversion-calculator",
  title: "Oil Conversion Calculator",
  description: "Free oil conversion calculator. Convert tbsp to ml for cooking and baking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["oil conversion calculator", "tbsp to ml", "cooking conversion"],
  variants: [{
    id: "standard",
    name: "tbsp to ml",
    description: "Convert tbsp to ml",
    fields: [
      { name: "value", label: "Amount (tbsp)", type: "number", placeholder: "e.g. 2", suffix: "tbsp", min: 0, step: 0.01 },
    ],
    calculate: (inputs)=>{const v=inputs.value as number;if(!v&&v!==0)return null;const r=v*15;return{primary:{label:"ml",value:formatNumber(r)+" ml"},details:[{label:"Input",value:formatNumber(v)+" tbsp"},{label:"Factor",value:"1 tbsp = 15 ml"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How many ml in a tbsp?", answer: "1 tbsp equals approximately 15 ml." },
    { question: "Is this exact for baking?", answer: "These conversions are standard approximations. For precise baking, use a kitchen scale." },
  ],
  formula: "ml = tbsp x 15",
};
