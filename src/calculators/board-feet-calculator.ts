import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boardFeetCalculator: CalculatorDefinition = {
  slug: "board-feet-calculator",
  title: "Board Feet Calculator",
  description: "Free board feet calculator. Woodworking planning and estimation tool.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["board feet calculator", "woodworking calculator", "carpentry tool"],
  variants: [{
    id: "standard",
    name: "Board Feet",
    description: "Woodworking calculation",
    fields: [
      { name: "length", label: "Length", type: "number", placeholder: "e.g. 96", suffix: "inches", min: 0.1 },
      { name: "width", label: "Width", type: "number", placeholder: "e.g. 6", suffix: "inches", min: 0.1 },
      { name: "thickness", label: "Thickness", type: "number", placeholder: "e.g. 1", suffix: "inches", min: 0.1, step: 0.125 },
    ],
    calculate: (inputs)=>{const l=inputs.length as number;const w=inputs.width as number;const t=inputs.thickness as number;if(!l||!w||!t)return null;const bf=(l*w*t)/144;const sqft=(l*w)/144;return{primary:{label:"Board Feet",value:formatNumber(bf)+" BF"},details:[{label:"Square feet",value:formatNumber(sqft)+" sq ft"},{label:"Cubic inches",value:formatNumber(l*w*t)},{label:"Volume (cubic ft)",value:formatNumber(l*w*t/1728)}]};},
  }],
  relatedSlugs: ["square-footage-calculator"],
  faq: [
    { question: "What is a board foot?", answer: "A board foot is a unit of lumber volume: 1 inch thick x 12 inches wide x 12 inches long (144 cubic inches)." },
    { question: "How do I calculate wood needed?", answer: "Measure length, width, and thickness. Add 10-20% waste factor for cuts, defects, and mistakes." },
  ],
  formula: "Board Feet = (L x W x T) / 144",
};
