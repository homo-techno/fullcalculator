import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lootDropCalculator: CalculatorDefinition = {
  slug: "loot-drop-calculator",
  title: "Loot Drop Calculator",
  description: "Free loot drop calculator. Calculate loot drop probability",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["loot drop calculator", "gaming calculator", "game tool"],
  variants: [{
    id: "standard",
    name: "Loot Drop",
    description: "Calculate loot drop probability",
    fields: [
      { name: "level", label: "Current Level", type: "number", placeholder: "e.g. 30", min: 1, max: 999 },
      { name: "target", label: "Target Level", type: "number", placeholder: "e.g. 50", min: 1, max: 999 },
      { name: "xpPerAction", label: "XP per Action", type: "number", placeholder: "e.g. 500", min: 1 },
    ],
    calculate: (inputs)=>{const cur=inputs.level as number;const tgt=inputs.target as number;const xpPer=inputs.xpPerAction as number||500;if(!cur||!tgt)return null;const xpNeeded=Math.pow(tgt,2)*100-Math.pow(cur,2)*100;const actions=Math.ceil(xpNeeded/xpPer);const hours=actions*5/3600;return{primary:{label:"XP Needed",value:formatNumber(xpNeeded)},details:[{label:"Actions required",value:formatNumber(actions)},{label:"Estimated time",value:formatNumber(hours)+" hours"},{label:"Levels to gain",value:String(tgt-cur)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How is this calculated?", answer: "Uses standard gaming formulas. Actual results may vary by game." },
    { question: "Is this accurate for my game?", answer: "This provides general estimates. Specific games may use different formulas." },
  ],
  formula: "Based on game mechanics",
};
