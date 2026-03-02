import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lightingLumenCalculator: CalculatorDefinition = {
  slug: "lighting-lumen-calculator",
  title: "Lighting Lumen Calculator",
  description: "Calculate the lumens needed for a room by purpose.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["lighting","lumens","room","brightness"],
  variants: [{
    id: "standard",
    name: "Lighting Lumen",
    description: "Calculate the lumens needed for a room by purpose.",
    fields: [
      { name: "length", label: "Room Length (ft)", type: "number", min: 4, max: 60, defaultValue: 14 },
      { name: "width", label: "Room Width (ft)", type: "number", min: 4, max: 60, defaultValue: 12 },
      { name: "roomType", label: "Room Type", type: "select", options: [{ value: "1", label: "Living Room" }, { value: "2", label: "Kitchen" }, { value: "3", label: "Bedroom" }, { value: "4", label: "Office" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const roomType = inputs.roomType as number;
    const area = length * width;
    let lumensPerSqFt = 20;
    if (roomType === 2) lumensPerSqFt = 40;
    if (roomType === 3) lumensPerSqFt = 15;
    if (roomType === 4) lumensPerSqFt = 50;
    const totalLumens = area * lumensPerSqFt;
    const bulbs60W = Math.ceil(totalLumens / 800);
    return {
      primary: { label: "Total Lumens Needed", value: formatNumber(totalLumens) + " lumens" },
      details: [
        { label: "Room Area", value: formatNumber(area) + " sq ft" },
        { label: "Lumens per Sq Ft", value: formatNumber(lumensPerSqFt) },
        { label: "Equivalent 60W Bulbs", value: formatNumber(bulbs60W) }
      ]
    };
  },
  }],
  relatedSlugs: ["recessed-lighting-calculator","landscape-lighting-calculator"],
  faq: [
    { question: "How many lumens per square foot?", answer: "Kitchens need 40, living rooms 20, and bedrooms 15 lumens." },
    { question: "How many lumens is a 60W bulb?", answer: "A standard 60 watt incandescent bulb produces about 800 lumens." },
  ],
  formula: "Total Lumens = Room Area x Lumens per Sq Ft (varies by room type)",
};
