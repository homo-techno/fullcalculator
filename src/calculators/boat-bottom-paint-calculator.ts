import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const boatBottomPaintCalculator: CalculatorDefinition = {
  slug: "boat-bottom-paint-calculator",
  title: "Boat Bottom Paint Calculator",
  description: "Calculate how much antifouling bottom paint you need based on boat dimensions and number of coats, plus estimated material cost.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["boat bottom paint","antifouling paint calculator","hull paint coverage","bottom paint cost"],
  variants: [{
    id: "standard",
    name: "Boat Bottom Paint",
    description: "Calculate how much antifouling bottom paint you need based on boat dimensions and number of coats, plus estimated material cost.",
    fields: [
      { name: "boatLength", label: "Waterline Length (feet)", type: "number", min: 10, max: 150, defaultValue: 28 },
      { name: "boatBeam", label: "Beam at Waterline (feet)", type: "number", min: 4, max: 40, defaultValue: 9 },
      { name: "draft", label: "Draft (feet)", type: "number", min: 1, max: 20, defaultValue: 3.5 },
      { name: "coats", label: "Number of Coats", type: "number", min: 1, max: 4, defaultValue: 2 },
      { name: "paintCost", label: "Paint Cost Per Gallon ($)", type: "number", min: 50, max: 500, defaultValue: 180 },
    ],
    calculate: (inputs) => {
    const length = inputs.boatLength as number;
    const beam = inputs.boatBeam as number;
    const draft = inputs.draft as number;
    const coats = inputs.coats as number;
    const costPerGallon = inputs.paintCost as number;
    const hullArea = length * (beam + draft) * 0.85;
    const totalArea = hullArea * coats;
    const gallonsNeeded = totalArea / 350;
    const totalCost = Math.ceil(gallonsNeeded) * costPerGallon;
    return {
      primary: { label: "Paint Needed", value: formatNumber(Math.round(gallonsNeeded * 10) / 10) + " gallons" },
      details: [
        { label: "Hull Surface Area", value: formatNumber(Math.round(hullArea)) + " sq ft" },
        { label: "Total Coverage Area", value: formatNumber(Math.round(totalArea)) + " sq ft (" + coats + " coats)" },
        { label: "Gallons to Purchase", value: Math.ceil(gallonsNeeded) + " gallons" },
        { label: "Estimated Paint Cost", value: "$" + formatNumber(Math.round(totalCost)) }
      ]
    };
  },
  }],
  relatedSlugs: ["marina-slip-cost-calculator","boat-depreciation-calculator"],
  faq: [
    { question: "How often should I repaint the bottom of my boat?", answer: "Most antifouling paints last one to two seasons depending on water temperature, salinity, and how often the boat is used. Boats kept in warm saltwater may need annual repainting." },
    { question: "How many coats of bottom paint do I need?", answer: "Two coats are standard for most applications. Apply three coats on the waterline area and any leading edges that experience more wear. New boats or bare hulls may need a primer coat first." },
    { question: "What type of bottom paint should I use?", answer: "Ablative paint wears away slowly and is ideal for boats used regularly. Hard modified epoxy paint is better for high-speed boats. Consult your marina for local environmental regulations on copper content." },
  ],
  formula: "Hull Surface Area = Waterline Length x (Beam + Draft) x 0.85; Total Coverage Area = Hull Area x Number of Coats; Gallons Needed = Total Coverage Area / 350 sq ft per gallon",
};
