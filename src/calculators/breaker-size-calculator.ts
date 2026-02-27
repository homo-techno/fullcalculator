import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breakerSizeCalculator: CalculatorDefinition = {
  slug: "breaker-size-calculator",
  title: "Breaker Size Calculator",
  description: "Free breaker size calculator. Electrical sizing and planning tool.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["breaker size calculator", "electrical calculator", "sizing tool"],
  variants: [{
    id: "standard",
    name: "Breaker Size",
    description: "",
    fields: [
      { name: "watts", label: "Total Watts", type: "number", placeholder: "e.g. 2400", suffix: "W", min: 0 },
      { name: "voltage", label: "Voltage", type: "select", defaultValue: "120", options: [{label:"120V",value:"120"},{label:"240V",value:"240"},{label:"208V",value:"208"}] },
      { name: "distance", label: "Wire Run", type: "number", placeholder: "e.g. 50", suffix: "feet", min: 1 },
    ],
    calculate: (inputs)=>{const w=inputs.watts as number;const v=parseFloat(inputs.voltage as string)||120;const d=inputs.distance as number||50;if(!w)return null;const amps=w/v;const breaker=Math.ceil(amps/0.8);const awg=amps<=15?14:amps<=20?12:amps<=30?10:amps<=40?8:6;return{primary:{label:"Circuit Amps",value:formatNumber(amps)+" A"},details:[{label:"Recommended breaker",value:breaker+"A"},{label:"Wire gauge (AWG)",value:"#"+awg},{label:"Voltage drop at "+d+"ft",value:formatNumber(amps*d*0.002/awg)+"%"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How do I size electrical wiring?", answer: "Wire size depends on amperage and distance. Use NEC tables for exact requirements." },
    { question: "Do I need a permit?", answer: "Most electrical work requires a permit and licensed professional. Check local building codes." },
  ],
  formula: "Amps = Watts / Voltage",
};
