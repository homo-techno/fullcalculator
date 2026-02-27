import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const declutterCalculator: CalculatorDefinition = {
  slug: "declutter-calculator",
  title: "Declutter Calculator",
  description: "Free declutter calculator. Estimate cleaning time and supply needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["declutter calculator", "cleaning calculator", "organization tool"],
  variants: [{
    id: "standard",
    name: "Declutter",
    description: "",
    fields: [
      { name: "sqft", label: "Area (sq ft)", type: "number", placeholder: "e.g. 1500", suffix: "sq ft", min: 50, max: 10000 },
      { name: "rooms", label: "Number of Rooms", type: "number", placeholder: "e.g. 6", min: 1, max: 30 },
      { name: "condition", label: "Condition", type: "select", defaultValue: "1", options: [{label:"Light Clean",value:"0.5"},{label:"Regular Clean",value:"1"},{label:"Deep Clean",value:"2"},{label:"Move-out Clean",value:"3"}] },
    ],
    calculate: (inputs)=>{const sqft=inputs.sqft as number;const rooms=inputs.rooms as number;const cond=parseFloat(inputs.condition as string)||1;if(!sqft||!rooms)return null;const baseHours=sqft/500*cond;const totalHours=baseHours+(rooms*0.25*cond);const supplyCost=sqft*0.02*cond;return{primary:{label:"Estimated Time",value:formatNumber(totalHours)+" hours"},details:[{label:"Supply cost",value:"$"+formatNumber(supplyCost)},{label:"Per room avg",value:formatNumber(totalHours/rooms*60)+" min"},{label:"Pro service est.",value:"$"+formatNumber(totalHours*40)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How long does cleaning take?", answer: "Cleaning time depends on space size, number of rooms, and how thorough you want to be. Our calculator provides realistic estimates." },
    { question: "Should I hire a professional?", answer: "For regular maintenance, DIY is cost-effective. For deep cleans, moves, or large spaces, professionals save time and effort." },
  ],
  formula: "Time = (Area / 500) x Condition Factor + (Rooms x 0.25)",
};
