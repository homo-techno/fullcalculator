import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hairTransplantCostCalculator: CalculatorDefinition = {
  slug: "hair-transplant-cost-calculator",
  title: "Hair Transplant Cost Calculator",
  description: "Free hair transplant cost calculator. Get personalized beauty and cosmetics estimates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hair transplant cost calculator", "beauty calculator", "cosmetics tool"],
  variants: [{
    id: "standard",
    name: "Hair Transplant Cost",
    description: "",
    fields: [
      { name: "sessions", label: "Number of Sessions", type: "number", placeholder: "e.g. 3", min: 1, max: 20 },
      { name: "costPerSession", label: "Cost per Session", type: "number", placeholder: "e.g. 300", prefix: "$", min: 0 },
      { name: "maintenance", label: "Annual Maintenance", type: "number", placeholder: "e.g. 200", prefix: "$", min: 0 },
    ],
    calculate: (inputs)=>{const s=inputs.sessions as number;const c=inputs.costPerSession as number;const m=inputs.maintenance as number||0;if(!s||!c)return null;const total=s*c;const yearly=total+m;return{primary:{label:"Total Cost",value:"$"+formatNumber(total)},details:[{label:"Per session",value:"$"+formatNumber(c)},{label:"First year total",value:"$"+formatNumber(yearly)},{label:"5-year cost",value:"$"+formatNumber(total+m*5)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How much does hair transplant cost cost?", answer: "Costs vary widely based on location, provider, and quality. Use our calculator for a personalized estimate." },
    { question: "How often should I get this done?", answer: "Frequency depends on individual needs. Consult a professional for personalized recommendations." },
  ],
  formula: "Based on usage and frequency",
};
