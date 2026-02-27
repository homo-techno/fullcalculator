import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flightFuelCalculator: CalculatorDefinition = {
  slug: "flight-fuel-calculator",
  title: "Flight Fuel Calculator",
  description: "Free flight fuel calculator. Aviation planning and flight calculation tool.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["flight fuel calculator", "aviation calculator", "pilot tool", "flight calculator"],
  variants: [{
    id: "standard",
    name: "Flight Fuel",
    description: "Aviation calculation tool",
    fields: [
      { name: "v1", label: "Primary Value", type: "number", placeholder: "Enter value", min: 0, step: 0.1 },
      { name: "v2", label: "Secondary Value", type: "number", placeholder: "Enter value", min: 0, step: 0.1 },
      { name: "altitude", label: "Altitude (ft)", type: "number", placeholder: "e.g. 5000", suffix: "ft", min: 0, max: 50000 },
    ],
    calculate: (inputs)=>{const a=inputs.v1 as number;const b=inputs.v2 as number;const alt=inputs.altitude as number||0;if(!a)return null;const factor=1-alt*0.0000068756;const result=a*(b||1)*factor;return{primary:{label:"Result",value:formatNumber(result)},details:[{label:"Input",value:formatNumber(a)},{label:"Altitude factor",value:formatNumber(factor)},{label:"At sea level",value:formatNumber(a*(b||1))}]};},
  }],
  relatedSlugs: ["speed-calculator", "unit-converter"],
  faq: [
    { question: "How accurate is this for flight planning?", answer: "Use official aviation tools for actual flight planning. This calculator provides educational estimates only." },
    { question: "What units are used?", answer: "Standard aviation units: feet for altitude, knots for speed, nautical miles for distance." },
  ],
  formula: "Based on ICAO standard atmosphere",
};
