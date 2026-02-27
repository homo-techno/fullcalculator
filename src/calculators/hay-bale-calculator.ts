import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hayBaleCalculator: CalculatorDefinition = {
  slug: "hay-bale-calculator",
  title: "Hay Bale Calculator",
  description: "Free hay bale calculator. Estimate hay needs for livestock",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hay bale calculator", "farming calculator", "agriculture tool"],
  variants: [{
    id: "standard",
    name: "Hay Bale",
    description: "Estimate hay needs for livestock",
    fields: [
      { name: "quantity", label: "Quantity", type: "number", placeholder: "e.g. 50", min: 0 },
      { name: "rate", label: "Rate per Unit", type: "number", placeholder: "e.g. 10", min: 0, step: 0.1 },
      { name: "days", label: "Days", type: "number", placeholder: "e.g. 30", suffix: "days", min: 1, max: 365 },
    ],
    calculate: (inputs)=>{const q=inputs.quantity as number;const r=inputs.rate as number;const d=inputs.days as number||30;if(!q||!r)return null;const daily=q*r;const total=daily*d;return{primary:{label:"Total",value:formatNumber(total)},details:[{label:"Daily",value:formatNumber(daily)},{label:"Weekly",value:formatNumber(daily*7)},{label:"Monthly",value:formatNumber(daily*30)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How accurate is this calculator?", answer: "Provides estimates based on averages. Actual results vary by region, weather, and management practices." },
    { question: "Where can I get more info?", answer: "Contact your local agricultural extension office for region-specific guidance and recommendations." },
  ],
  formula: "Based on agricultural standards",
};
