import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquariumGlassThicknessCalculator: CalculatorDefinition = {
  slug: "aquarium-glass-thickness-calculator",
  title: "Aquarium Glass Thickness Calculator",
  description: "Free aquarium glass thickness calculator. Aquarium planning and maintenance calculator.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["aquarium glass thickness calculator", "aquarium calculator", "fishkeeping tool"],
  variants: [{
    id: "standard",
    name: "Aquarium Glass Thickness",
    description: "Aquarium calculation",
    fields: [
      { name: "length", label: "Tank Length", type: "number", placeholder: "e.g. 48", suffix: "inches", min: 6, max: 120 },
      { name: "width", label: "Tank Width", type: "number", placeholder: "e.g. 12", suffix: "inches", min: 6, max: 48 },
      { name: "height", label: "Tank Height", type: "number", placeholder: "e.g. 20", suffix: "inches", min: 6, max: 48 },
    ],
    calculate: (inputs)=>{const l=inputs.length as number;const w=inputs.width as number;const h=inputs.height as number;if(!l||!w||!h)return null;const volIn=l*w*h;const gallons=volIn/231;const liters=gallons*3.785;const weight=gallons*8.34;return{primary:{label:"Volume",value:formatNumber(gallons)+" gallons"},details:[{label:"Liters",value:formatNumber(liters)+" L"},{label:"Water weight",value:formatNumber(weight)+" lbs"},{label:"Fish capacity (1in/gal)",value:formatNumber(Math.floor(gallons))+" inches of fish"}]};},
  }],
  relatedSlugs: ["volume-calculator"],
  faq: [
    { question: "How many fish can I keep?", answer: "The general rule is 1 inch of fish per gallon for small community fish. Research specific species for accurate stocking levels." },
    { question: "How often should I change water?", answer: "Weekly 20-25% water changes are recommended for most aquariums. Heavily stocked tanks may need more frequent changes." },
  ],
  formula: "Gallons = (L x W x H) / 231",
};
