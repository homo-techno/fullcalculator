import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tattooTipCalculator: CalculatorDefinition = {
  slug: "tattoo-tip-calculator",
  title: "Tattoo Tip Calculator",
  description: "Free tattoo tip calculator. Calculate appropriate tattoo artist tip.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tattoo tip calculator", "tattoo calculator", "tattoo cost"],
  variants: [{
    id: "standard",
    name: "Tattoo Tip",
    description: "Calculate appropriate tattoo artist tip",
    fields: [
      { name: "size", label: "Tattoo Size (inches)", type: "number", placeholder: "e.g. 5", suffix: "in", min: 1, max: 36 },
      { name: "rate", label: "Hourly Rate", type: "number", placeholder: "e.g. 150", prefix: "$", min: 50, max: 500 },
      { name: "complexity", label: "Complexity", type: "select", defaultValue: "1.5", options: [{label:"Simple",value:"1"},{label:"Medium",value:"1.5"},{label:"Complex",value:"2"},{label:"Very Complex",value:"3"}] },
    ],
    calculate: (inputs)=>{const s=inputs.size as number;const r=inputs.rate as number||150;const c=parseFloat(inputs.complexity as string)||1.5;if(!s)return null;const hrs=s*c*0.3;const cost=hrs*r;return{primary:{label:"Estimate",value:"$"+formatNumber(cost)},details:[{label:"Hours",value:formatNumber(hrs)},{label:"Rate",value:"$"+r+"/hr"}]};},
  }],
  relatedSlugs: ["tip-calculator"],
  faq: [
    { question: "How much does a tattoo cost?", answer: "Tattoo costs range from $50 for small simple designs to $500+ per session for large detailed work. The average hourly rate is $100-200." },
    { question: "How long does a tattoo session last?", answer: "Most sessions are 2-6 hours. Large pieces may require multiple sessions. Artists typically recommend breaks every 3-4 hours." },
  ],
  formula: "Cost = Hours x Hourly Rate",
};
