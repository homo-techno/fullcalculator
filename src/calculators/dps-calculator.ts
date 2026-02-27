import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dpsCalculator: CalculatorDefinition = {
  slug: "dps-calculator",
  title: "DPS Calculator",
  description: "Free dps calculator. Calculate damage per second in games",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dps calculator", "gaming calculator", "game tool"],
  variants: [{
    id: "standard",
    name: "DPS",
    description: "Calculate damage per second in games",
    fields: [
      { name: "baseDamage", label: "Base Damage", type: "number", placeholder: "e.g. 100", min: 0 },
      { name: "attackSpeed", label: "Attack Speed", type: "number", placeholder: "e.g. 1.5", suffix: "per sec", min: 0.1, max: 10, step: 0.1 },
      { name: "critChance", label: "Crit Chance", type: "number", placeholder: "e.g. 25", suffix: "%", min: 0, max: 100 },
      { name: "critMultiplier", label: "Crit Multiplier", type: "number", placeholder: "e.g. 200", suffix: "%", min: 100, max: 1000, defaultValue: 200 },
    ],
    calculate: (inputs)=>{const d=inputs.baseDamage as number;const s=inputs.attackSpeed as number;const cc=(inputs.critChance as number)/100;const cm=(inputs.critMultiplier as number)/100;if(!d||!s)return null;const avgDmg=d*(1+cc*(cm-1));const dps=avgDmg*s;return{primary:{label:"DPS",value:formatNumber(dps)},details:[{label:"Avg damage per hit",value:formatNumber(avgDmg)},{label:"Hits per second",value:formatNumber(s)},{label:"DPS with crits",value:formatNumber(dps)},{label:"DPS without crits",value:formatNumber(d*s)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How is this calculated?", answer: "Uses standard gaming formulas. Actual results may vary by game." },
    { question: "Is this accurate for my game?", answer: "This provides general estimates. Specific games may use different formulas." },
  ],
  formula: "Based on game mechanics",
};
