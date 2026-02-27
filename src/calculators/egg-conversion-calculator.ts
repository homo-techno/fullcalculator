import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eggConversionCalculator: CalculatorDefinition = {
  slug: "egg-conversion-calculator",
  title: "Egg Conversion Calculator",
  description: "Free egg conversion calculator. Convert eggs to ml for cooking and baking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["egg conversion calculator", "eggs to ml", "cooking conversion"],
  variants: [{
    id: "standard",
    name: "eggs to ml",
    description: "Convert eggs to ml",
    fields: [
      { name: "value", label: "Amount (eggs)", type: "number", placeholder: "e.g. 2", suffix: "eggs", min: 0, step: 0.01 },
    ],
    calculate: (inputs)=>{const v=inputs.value as number;if(!v&&v!==0)return null;const r=v*50;return{primary:{label:"ml",value:formatNumber(r)+" ml"},details:[{label:"Input",value:formatNumber(v)+" eggs"},{label:"Factor",value:"1 eggs = 50 ml"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How many ml in a eggs?", answer: "1 eggs equals approximately 50 ml." },
    { question: "Is this exact for baking?", answer: "These conversions are standard approximations. For precise baking, use a kitchen scale." },
  ],
  formula: "ml = eggs x 50",
};
