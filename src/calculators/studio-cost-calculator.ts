import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const studioCostCalculator: CalculatorDefinition = {
  slug: "studio-cost-calculator",
  title: "Studio Cost Calculator",
  description: "Free studio cost calculator. Estimate recording studio costs",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["studio cost calculator", "music calculator", "audio tool"],
  variants: [{
    id: "standard",
    name: "Studio Cost",
    description: "Estimate recording studio costs",
    fields: [
      { name: "bpm", label: "BPM (Tempo)", type: "number", placeholder: "e.g. 120", min: 20, max: 300 },
      { name: "beats", label: "Beats / Duration", type: "number", placeholder: "e.g. 4", min: 1, max: 64 },
    ],
    calculate: (inputs)=>{const bpm=inputs.bpm as number;const beats=inputs.beats as number||4;if(!bpm)return null;const beatMs=60000/bpm;const barMs=beatMs*beats;return{primary:{label:"Beat Duration",value:formatNumber(beatMs)+" ms"},details:[{label:"Bar duration",value:formatNumber(barMs)+" ms"},{label:"1/8 note",value:formatNumber(beatMs/2)+" ms"},{label:"1/16 note",value:formatNumber(beatMs/4)+" ms"},{label:"Dotted quarter",value:formatNumber(beatMs*1.5)+" ms"}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "How do I use this for music production?", answer: "Enter your tempo (BPM) and the calculator provides timing values useful for setting delays, reverbs, and other time-based effects." },
    { question: "What is BPM?", answer: "BPM (Beats Per Minute) measures the tempo of music. Common tempos: 60-80 (slow), 100-120 (moderate), 140+ (fast)." },
  ],
  formula: "Beat Duration = 60000 / BPM (ms)",
};
