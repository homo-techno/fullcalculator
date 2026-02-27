import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const livestockFeedCalculator: CalculatorDefinition = {
  slug: "livestock-feed-calculator",
  title: "Livestock Feed Calculator",
  description: "Free livestock feed calculator. Calculate daily feed requirements",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["livestock feed calculator", "farming calculator", "agriculture tool"],
  variants: [{
    id: "standard",
    name: "Livestock Feed",
    description: "Calculate daily feed requirements",
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
