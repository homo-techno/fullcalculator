import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeGymSpaceCalculator: CalculatorDefinition = {
  slug: "home-gym-space-calculator",
  title: "Home Gym Space Calculator",
  description: "Calculate the floor space needed for a home gym.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["home","gym","space","fitness"],
  variants: [{
    id: "standard",
    name: "Home Gym Space",
    description: "Calculate the floor space needed for a home gym.",
    fields: [
      { name: "equipment", label: "Equipment Pieces", type: "number", min: 1, max: 20, defaultValue: 5 },
      { name: "avgFootprint", label: "Avg Equipment Size (sq ft)", type: "number", min: 5, max: 80, defaultValue: 25 },
      { name: "freeWeight", label: "Free Weight Area (sq ft)", type: "number", min: 0, max: 200, defaultValue: 50 },
      { name: "stretchArea", label: "Stretch Area (sq ft)", type: "number", min: 0, max: 150, defaultValue: 40 },
    ],
    calculate: (inputs) => {
    const equipment = inputs.equipment as number;
    const avgFootprint = inputs.avgFootprint as number;
    const freeWeight = inputs.freeWeight as number;
    const stretchArea = inputs.stretchArea as number;
    const equipmentArea = equipment * avgFootprint;
    const walkways = equipmentArea * 0.3;
    const totalArea = equipmentArea + walkways + freeWeight + stretchArea;
    return {
      primary: { label: "Total Space Needed", value: formatNumber(totalArea) + " sq ft" },
      details: [
        { label: "Equipment Area", value: formatNumber(equipmentArea) + " sq ft" },
        { label: "Walkway Space", value: formatNumber(walkways) + " sq ft" },
        { label: "Free Weight Area", value: formatNumber(freeWeight) + " sq ft" },
        { label: "Stretch Area", value: formatNumber(stretchArea) + " sq ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["billiard-room-size-calculator","epoxy-floor-calculator"],
  faq: [
    { question: "How much space for a home gym?", answer: "A basic home gym needs at least 100 to 200 square feet." },
    { question: "What ceiling height is best for a gym?", answer: "A ceiling height of at least 8 feet is recommended." },
  ],
  formula: "Total Area = Equipment x Avg Size x 1.3 + Free Weight Area + Stretch Area",
};
