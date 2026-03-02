import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pressureWashingCalculator: CalculatorDefinition = {
  slug: "pressure-washing-calculator",
  title: "Pressure Washing Calculator",
  description: "Calculate the area and time for pressure washing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["pressure","washing","area","outdoor"],
  variants: [{
    id: "standard",
    name: "Pressure Washing",
    description: "Calculate the area and time for pressure washing.",
    fields: [
      { name: "sqft", label: "Area to Wash (sq ft)", type: "number", min: 50, max: 5000, defaultValue: 500 },
      { name: "surface", label: "Surface Type", type: "select", options: [{ value: "3", label: "Concrete" }, { value: "5", label: "Wood Deck" }, { value: "2", label: "Vinyl Siding" }] },
      { name: "dirtLevel", label: "Dirt Level", type: "select", options: [{ value: "1", label: "Light" }, { value: "1.5", label: "Moderate" }, { value: "2", label: "Heavy" }] },
    ],
    calculate: (inputs) => {
    const sqft = inputs.sqft as number;
    const surface = inputs.surface as number;
    const dirtLevel = inputs.dirtLevel as number;
    const minutesPerSqFt = (surface / 60) * dirtLevel;
    const totalMinutes = Math.ceil(sqft * minutesPerSqFt);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const waterGallons = sqft * 0.5;
    return { primary: { label: "Estimated Time", value: hours + "h " + minutes + "m" }, details: [{ label: "Total Minutes", value: formatNumber(totalMinutes) }, { label: "Area", value: formatNumber(sqft) + " sq ft" }, { label: "Water Usage", value: formatNumber(waterGallons) + " gallons" }] };
  },
  }],
  relatedSlugs: ["house-cleaning-time-calculator","gutter-cleaning-cost-calculator","window-cleaning-calculator"],
  faq: [
    { question: "How long does pressure washing take?", answer: "About 2 to 5 minutes per 100 sq ft depending on surface." },
    { question: "What PSI should I use?", answer: "Use 1500 to 2000 PSI for decks and 2500 to 3000 for concrete." },
    { question: "Can pressure washing damage surfaces?", answer: "Yes, use lower PSI on wood and painted surfaces." },
  ],
  formula: "Time = SqFt * (SurfaceFactor / 60) * DirtLevel",
};
