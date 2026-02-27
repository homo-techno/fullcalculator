import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cropYieldCalculator: CalculatorDefinition = {
  slug: "crop-yield-calculator",
  title: "Crop Yield Calculator",
  description: "Free crop yield calculator. Estimate harvest yield per acre",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["crop yield calculator", "farming calculator", "agriculture tool"],
  variants: [{
    id: "standard",
    name: "Crop Yield",
    description: "Estimate harvest yield per acre",
    fields: [
      { name: "acres", label: "Field Size", type: "number", placeholder: "e.g. 100", suffix: "acres", min: 0.1 },
      { name: "yieldPerAcre", label: "Expected Yield per Acre", type: "number", placeholder: "e.g. 180", suffix: "bushels", min: 0 },
      { name: "pricePerBushel", label: "Price per Bushel", type: "number", placeholder: "e.g. 6.50", prefix: "$", min: 0, step: 0.01 },
    ],
    calculate: (inputs)=>{const a=inputs.acres as number;const y=inputs.yieldPerAcre as number;const p=inputs.pricePerBushel as number;if(!a||!y)return null;const totalYield=a*y;const revenue=totalYield*(p||0);return{primary:{label:"Total Yield",value:formatNumber(totalYield)+" bushels"},details:[{label:"Revenue",value:"$"+formatNumber(revenue)},{label:"Per acre",value:formatNumber(y)+" bu/acre"},{label:"Total acres",value:formatNumber(a)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How accurate is this calculator?", answer: "Provides estimates based on averages. Actual results vary by region, weather, and management practices." },
    { question: "Where can I get more info?", answer: "Contact your local agricultural extension office for region-specific guidance and recommendations." },
  ],
  formula: "Based on agricultural standards",
};
