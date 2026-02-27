import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eyelashExtensionCalculator: CalculatorDefinition = {
  slug: "eyelash-extension-calculator",
  title: "Eyelash Extension Calculator",
  description: "Free eyelash extension calculator. Get personalized beauty and cosmetics estimates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["eyelash extension calculator", "beauty calculator", "cosmetics tool"],
  variants: [{
    id: "standard",
    name: "Eyelash Extension",
    description: "",
    fields: [
      { name: "area", label: "Application Area", type: "select", defaultValue: "1", options: [{label:"Face",value:"1"},{label:"Full Body",value:"5"},{label:"Hair",value:"2"},{label:"Nails",value:"0.5"}] },
      { name: "frequency", label: "Applications per Week", type: "number", placeholder: "e.g. 7", min: 1, max: 14 },
      { name: "productSize", label: "Product Size (oz)", type: "number", placeholder: "e.g. 1", suffix: "oz", min: 0.1, step: 0.1 },
    ],
    calculate: (inputs)=>{const a=parseFloat(inputs.area as string)||1;const f=inputs.frequency as number||7;const ps=inputs.productSize as number||1;if(!f)return null;const dailyUse=a*0.1;const weeklyUse=dailyUse*f;const weeksPerBottle=ps*29.5735/(weeklyUse*1000)*100;return{primary:{label:"Product Lasts",value:formatNumber(weeksPerBottle)+" weeks"},details:[{label:"Daily usage",value:formatNumber(dailyUse*1000)+" mg"},{label:"Weekly usage",value:formatNumber(weeklyUse)+" oz"},{label:"Bottles per year",value:formatNumber(52/weeksPerBottle)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How much does eyelash extension cost?", answer: "Costs vary widely based on location, provider, and quality. Use our calculator for a personalized estimate." },
    { question: "How often should I get this done?", answer: "Frequency depends on individual needs. Consult a professional for personalized recommendations." },
  ],
  formula: "Based on usage and frequency",
};
