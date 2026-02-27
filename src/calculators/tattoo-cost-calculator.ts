import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tattooCostCalculator: CalculatorDefinition = {
  slug: "tattoo-cost-calculator",
  title: "Tattoo Cost Calculator",
  description: "Free tattoo cost calculator. Estimate tattoo cost by size and detail level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tattoo cost calculator", "tattoo calculator", "tattoo cost"],
  variants: [{
    id: "standard",
    name: "Tattoo Cost",
    description: "Estimate tattoo cost by size and detail level",
    fields: [
      { name: "size", label: "Size (inches)", type: "number", placeholder: "e.g. 6", suffix: "in", min: 1, max: 48 },
      { name: "detail", label: "Detail Level", type: "select", defaultValue: "150", options: [{label:"Simple",value:"100"},{label:"Medium",value:"150"},{label:"Detailed",value:"200"},{label:"Photorealistic",value:"300"}] },
      { name: "hourlyRate", label: "Artist Hourly Rate", type: "number", placeholder: "e.g. 150", prefix: "$", min: 50, max: 500 },
    ],
    calculate: (inputs)=>{const s=inputs.size as number;const d=parseFloat(inputs.detail as string)||150;const r=inputs.hourlyRate as number||150;if(!s)return null;const hours=Math.max(0.5,(s*s*d/10000)*2);const cost=hours*r;const tip=cost*0.2;return{primary:{label:"Estimated Cost",value:"$"+formatNumber(cost)},details:[{label:"Estimated hours",value:formatNumber(hours)+" hrs"},{label:"Suggested tip (20%)",value:"$"+formatNumber(tip)},{label:"Total with tip",value:"$"+formatNumber(cost+tip)}]};},
  }],
  relatedSlugs: ["tip-calculator"],
  faq: [
    { question: "How much does a tattoo cost?", answer: "Tattoo costs range from $50 for small simple designs to $500+ per session for large detailed work. The average hourly rate is $100-200." },
    { question: "How long does a tattoo session last?", answer: "Most sessions are 2-6 hours. Large pieces may require multiple sessions. Artists typically recommend breaks every 3-4 hours." },
  ],
  formula: "Cost = Hours x Hourly Rate",
};
