import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const layerHeightCalculator: CalculatorDefinition = {
  slug: "layer-height-calculator",
  title: "Layer Height Calculator",
  description: "Free layer height calculator. 3D printing planning and estimation tool.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["layer height calculator", "3d printing calculator", "filament calculator"],
  variants: [{
    id: "standard",
    name: "Layer Height",
    description: "3D printing calculation",
    fields: [
      { name: "volume", label: "Print Volume (cm³)", type: "number", placeholder: "e.g. 50", suffix: "cm³", min: 0.1 },
      { name: "density", label: "Material Density", type: "number", placeholder: "e.g. 1.24", suffix: "g/cm³", min: 0.5, max: 3, step: 0.01, defaultValue: 1.24 },
      { name: "infill", label: "Infill %", type: "number", placeholder: "e.g. 20", suffix: "%", min: 5, max: 100, defaultValue: 20 },
    ],
    calculate: (inputs)=>{const vol=inputs.volume as number;const dens=inputs.density as number||1.24;const inf=(inputs.infill as number)/100;if(!vol)return null;const actualVol=vol*inf+vol*0.1;const weight=actualVol*dens;const filamentM=weight/(dens*Math.PI*0.0175*0.0175*100);const cost=weight*0.025;return{primary:{label:"Filament Needed",value:formatNumber(weight)+" g"},details:[{label:"Filament length",value:formatNumber(filamentM)+" m"},{label:"Estimated cost",value:"$"+formatNumber(cost)},{label:"Print volume",value:formatNumber(actualVol)+" cm³"}]};},
  }],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How much filament do I need?", answer: "Filament usage depends on print volume, infill percentage, and material density. PLA is about 1.24 g/cm³." },
    { question: "What infill should I use?", answer: "15-20% for decorative items, 40-60% for functional parts, 80-100% for maximum strength." },
  ],
  formula: "Weight = Volume x Infill x Density",
};
