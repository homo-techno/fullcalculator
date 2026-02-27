import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const toiletFlushCalculator: CalculatorDefinition = {
  slug: "toilet-flush-calculator",
  title: "Toilet Flush Calculator",
  description: "Free toilet flush calculator. Plumbing sizing and planning tool.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["toilet flush calculator", "plumbing calculator", "sizing tool"],
  variants: [{
    id: "standard",
    name: "Toilet Flush",
    description: "",
    fields: [
      { name: "flow", label: "Flow Rate", type: "number", placeholder: "e.g. 10", suffix: "GPM", min: 0, step: 0.1 },
      { name: "pressure", label: "Water Pressure", type: "number", placeholder: "e.g. 60", suffix: "PSI", min: 0 },
      { name: "length", label: "Pipe Length", type: "number", placeholder: "e.g. 100", suffix: "feet", min: 1 },
    ],
    calculate: (inputs)=>{const flow=inputs.flow as number;const psi=inputs.pressure as number||60;const len=inputs.length as number||100;if(!flow)return null;const pipeSize=flow<=5?0.5:flow<=10?0.75:flow<=20?1:flow<=40?1.25:1.5;const velocity=flow*0.408/(pipeSize*pipeSize);return{primary:{label:"Pipe Size",value:pipeSize+' inches'},details:[{label:"Flow velocity",value:formatNumber(velocity)+" ft/s"},{label:"Pressure loss",value:formatNumber(len*0.05*flow/pipeSize)+" PSI"},{label:"Available pressure",value:formatNumber(psi)+" PSI"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How do I size plumbing pipes?", answer: "Pipe size depends on flow rate, pressure, and distance. Check local plumbing codes." },
    { question: "Do I need a permit?", answer: "Most plumbing work requires a permit and licensed professional. Check local building codes." },
  ],
  formula: "Size based on flow rate and pressure",
};
