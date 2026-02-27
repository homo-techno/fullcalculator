import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const anchorSizeCalculator: CalculatorDefinition = {
  slug: "anchor-size-calculator",
  title: "Anchor Size Calculator",
  description: "Free anchor size calculator. Boating and marine planning calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["anchor size calculator", "boating calculator", "marine tool"],
  variants: [{
    id: "standard",
    name: "Anchor Size",
    description: "",
    fields: [
      { name: "length", label: "Boat Length (ft)", type: "number", placeholder: "e.g. 30", suffix: "ft", min: 5, max: 200 },
      { name: "weight", label: "Displacement (lbs)", type: "number", placeholder: "e.g. 10000", suffix: "lbs", min: 100 },
      { name: "speed", label: "Speed (knots)", type: "number", placeholder: "e.g. 7", suffix: "knots", min: 0, max: 60 },
    ],
    calculate: (inputs)=>{const len=inputs.length as number;const wt=inputs.weight as number;const spd=inputs.speed as number||7;if(!len)return null;const hullSpeed=1.34*Math.sqrt(len);const fuelPerHour=wt*0.001*spd;return{primary:{label:"Hull Speed",value:formatNumber(hullSpeed)+" knots"},details:[{label:"Est. fuel/hr",value:formatNumber(fuelPerHour)+" gal"},{label:"Waterline length",value:formatNumber(len*0.85)+" ft"},{label:"At speed "+spd+"kts",value:formatNumber(fuelPerHour*spd)+" gal/hr"}]};},
  }],
  relatedSlugs: ["speed-calculator"],
  faq: [
    { question: "What is hull speed?", answer: "Hull speed is the maximum efficient speed for a displacement hull: 1.34 x sqrt(waterline length in feet)." },
    { question: "How much fuel does a boat use?", answer: "Fuel consumption varies widely by engine size, hull type, and speed. Generally 0.5-2 gallons per hour per 10HP." },
  ],
  formula: "Hull Speed = 1.34 x sqrt(LWL)",
};
