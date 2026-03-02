import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const parkingLotStripingCalculator: CalculatorDefinition = {
  slug: "parking-lot-striping-calculator",
  title: "Parking Lot Striping Calculator",
  description: "Calculate parking spaces and paint needed for a lot.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["parking lot striping","parking space calculator"],
  variants: [{
    id: "standard",
    name: "Parking Lot Striping",
    description: "Calculate parking spaces and paint needed for a lot.",
    fields: [
      { name: "lotLength", label: "Lot Length (ft)", type: "number", min: 20, max: 2000, defaultValue: 200 },
      { name: "lotWidth", label: "Lot Width (ft)", type: "number", min: 20, max: 2000, defaultValue: 100 },
      { name: "spaceWidth", label: "Space Width (ft)", type: "number", min: 7, max: 12, defaultValue: 9 },
      { name: "spaceLength", label: "Space Length (ft)", type: "number", min: 15, max: 25, defaultValue: 18 },
      { name: "aisleWidth", label: "Aisle Width (ft)", type: "number", min: 12, max: 30, defaultValue: 24 },
    ],
    calculate: (inputs) => {
      const ll = inputs.lotLength as number;
      const lw = inputs.lotWidth as number;
      const sw = inputs.spaceWidth as number;
      const sl = inputs.spaceLength as number;
      const aw = inputs.aisleWidth as number;
      if (!ll || !lw || !sw || !sl || !aw) return null;
      const rowDepth = sl * 2 + aw;
      const rows = Math.floor(lw / rowDepth);
      const spacesPerRow = Math.floor(ll / sw) * 2;
      const totalSpaces = rows * spacesPerRow;
      const stripeFt = totalSpaces * (sl + 0.33) * 2;
      const paintGal = Math.ceil(stripeFt / 600);
      return {
        primary: { label: "Total Parking Spaces", value: formatNumber(totalSpaces) },
        details: [
          { label: "Double Rows", value: formatNumber(rows) },
          { label: "Stripe Length", value: formatNumber(Math.round(stripeFt)) + " ft" },
          { label: "Paint Needed", value: formatNumber(paintGal) + " gallons" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is a standard parking space size?", answer: "A standard space is 9 feet wide by 18 feet long with a 24-foot aisle." },
    { question: "How many ADA spaces are required?", answer: "One ADA space per 25 standard spaces for lots with 1 to 25 total spaces." },
  ],
  formula: "Spaces = Rows x (Lot Length / Space Width) x 2",
};
