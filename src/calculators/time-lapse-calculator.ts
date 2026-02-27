import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeLapseCalculator: CalculatorDefinition = {
  slug: "time-lapse-calculator",
  title: "Time Lapse Calculator",
  description: "Free time lapse calculator. Photography exposure and settings calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["time lapse calculator", "photography calculator", "camera settings"],
  variants: [{
    id: "standard",
    name: "Time Lapse",
    description: "Photography calculation",
    fields: [
      { name: "aperture", label: "Aperture (f-stop)", type: "number", placeholder: "e.g. 2.8", suffix: "f/", min: 1, max: 64, step: 0.1 },
      { name: "shutter", label: "Shutter Speed", type: "number", placeholder: "e.g. 125", suffix: "1/x sec", min: 1, max: 8000 },
      { name: "iso", label: "ISO", type: "number", placeholder: "e.g. 400", min: 50, max: 102400 },
    ],
    calculate: (inputs)=>{const f=inputs.aperture as number;const ss=inputs.shutter as number;const iso=inputs.iso as number;if(!f||!ss||!iso)return null;const ev=Math.log2(f*f*ss/iso);const lv=ev+Math.log2(iso/100);return{primary:{label:"Exposure Value",value:formatNumber(ev)+" EV"},details:[{label:"Light Value",value:formatNumber(lv)},{label:"Aperture",value:"f/"+f},{label:"Shutter",value:"1/"+ss+" sec"},{label:"ISO",value:String(iso)}]};},
  }],
  relatedSlugs: ["percentage-calculator"],
  faq: [
    { question: "What is the exposure triangle?", answer: "The exposure triangle consists of aperture, shutter speed, and ISO. Changing one requires adjusting another to maintain proper exposure." },
    { question: "What is EV?", answer: "Exposure Value (EV) is a number representing the combination of shutter speed and f-number that gives the same exposure." },
  ],
  formula: "EV = log2(f² x SS / ISO)",
};
