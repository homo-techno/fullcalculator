import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chocolateConversionCalculator: CalculatorDefinition = {
  slug: "chocolate-conversion-calculator",
  title: "Chocolate Conversion Calculator",
  description: "Free chocolate conversion calculator. Convert oz to g for cooking and baking.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["chocolate conversion calculator", "oz to g", "cooking conversion"],
  variants: [{
    id: "standard",
    name: "oz to g",
    description: "Convert oz to g",
    fields: [
      { name: "value", label: "Amount (oz)", type: "number", placeholder: "e.g. 2", suffix: "oz", min: 0, step: 0.01 },
    ],
    calculate: (inputs)=>{const v=inputs.value as number;if(!v&&v!==0)return null;const r=v*28.35;return{primary:{label:"g",value:formatNumber(r)+" g"},details:[{label:"Input",value:formatNumber(v)+" oz"},{label:"Factor",value:"1 oz = 28.35 g"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How many g in a oz?", answer: "1 oz equals approximately 28.35 g." },
    { question: "Is this exact for baking?", answer: "These conversions are standard approximations. For precise baking, use a kitchen scale." },
  ],
  formula: "g = oz x 28.35",
};
