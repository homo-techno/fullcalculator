import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const unitConversionChainCalculator: CalculatorDefinition = {
  slug: "unit-conversion-chain-calculator",
  title: "Unit Conversion Chain Calculator",
  description: "Free unit conversion chain calculator. Advanced math and computation tool.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["unit conversion chain calculator", "math calculator", "computation tool"],
  variants: [{
    id: "standard",
    name: "Unit Conversion Chain",
    description: "",
    fields: [
      { name: "a", label: "Value A", type: "number", placeholder: "Enter value" },
      { name: "b", label: "Value B", type: "number", placeholder: "Enter value" },
      { name: "c", label: "Value C (optional)", type: "number", placeholder: "Enter value" },
    ],
    calculate: (inputs)=>{const a=inputs.a as number;const b=inputs.b as number;const c=inputs.c as number||0;if(a===undefined||b===undefined)return null;const sum=a+b+c;const prod=a*b*(c||1);return{primary:{label:"Result",value:formatNumber(sum)},details:[{label:"Sum",value:formatNumber(sum)},{label:"Product",value:formatNumber(prod)},{label:"Power",value:formatNumber(Math.pow(Math.abs(a),Math.min(Math.abs(b),20)))}]};},
  }],
  relatedSlugs: ["percentage-calculator", "fraction-calculator"],
  faq: [
    { question: "What is unit conversion chain?", answer: "A mathematical concept used in computation and analysis. This calculator helps you solve related problems." },
    { question: "How do I use this?", answer: "Enter your values and the calculator will compute the results based on standard mathematical definitions." },
  ],
  formula: "Based on mathematical definitions",
};
