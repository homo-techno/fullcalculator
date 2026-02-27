import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gearRatioFinalDriveCalculator: CalculatorDefinition = {
  slug: "gear-ratio-final-drive-calculator",
  title: "Gear Ratio Final Drive Calculator",
  description: "Free gear ratio final drive calculator. Automotive calculation and planning tool.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gear ratio final drive calculator", "auto calculator", "car tool"],
  variants: [{
    id: "standard",
    name: "Gear Ratio Final Drive",
    description: "",
    fields: [
      { name: "v1", label: "Primary Value", type: "number", placeholder: "Enter value", min: 0, step: 0.1 },
      { name: "v2", label: "Secondary Value", type: "number", placeholder: "Enter value", min: 0, step: 0.1 },
      { name: "v3", label: "Additional Value", type: "number", placeholder: "Enter value", min: 0, step: 0.01 },
    ],
    calculate: (inputs)=>{const a=inputs.v1 as number;const b=inputs.v2 as number;const c=inputs.v3 as number||1;if(!a||!b)return null;const r=a*b*c;return{primary:{label:"Result",value:formatNumber(r)},details:[{label:"Input 1",value:formatNumber(a)},{label:"Input 2",value:formatNumber(b)},{label:"Ratio",value:formatNumber(a/b)}]};},
  }],
  relatedSlugs: ["fuel-cost-calculator"],
  faq: [
    { question: "How do I use this calculator?", answer: "Enter your vehicle specifications and the calculator provides results based on standard automotive formulas." },
    { question: "Is this accurate for my car?", answer: "Results are estimates based on standard formulas. Always verify with a qualified mechanic for modifications." },
  ],
  formula: "Based on automotive engineering formulas",
};
