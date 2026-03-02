import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baseboardLengthCalculator: CalculatorDefinition = {
  slug: "baseboard-length-calculator",
  title: "Baseboard Length Calculator",
  description: "Calculate linear feet of baseboard trim for a room.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baseboard trim","baseboard length","baseboard linear feet"],
  variants: [{
    id: "standard",
    name: "Baseboard Length",
    description: "Calculate linear feet of baseboard trim for a room.",
    fields: [
      { name: "roomLength", label: "Room Length (ft)", type: "number", min: 1, max: 100, defaultValue: 15 },
      { name: "roomWidth", label: "Room Width (ft)", type: "number", min: 1, max: 100, defaultValue: 12 },
      { name: "doors", label: "Number of Doors", type: "number", min: 0, max: 10, defaultValue: 2 },
      { name: "doorWidth", label: "Door Width (ft)", type: "number", min: 2, max: 8, defaultValue: 3 },
    ],
    calculate: (inputs) => {
      const rl = inputs.roomLength as number;
      const rw = inputs.roomWidth as number;
      const doors = inputs.doors as number;
      const dw = inputs.doorWidth as number;
      if (!rl || !rw) return null;
      const perimeter = 2 * (rl + rw);
      const doorDeduct = doors * dw;
      const needed = perimeter - doorDeduct;
      const withWaste = Math.ceil(needed * 1.1);
      return {
        primary: { label: "Baseboard Needed", value: formatNumber(withWaste) + " linear ft" },
        details: [
          { label: "Room Perimeter", value: formatNumber(Math.round(perimeter)) + " ft" },
          { label: "Door Deduction", value: formatNumber(Math.round(doorDeduct)) + " ft" },
          { label: "Net Length", value: formatNumber(Math.round(needed)) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: ["crown-molding-calculator","chair-rail-calculator"],
  faq: [
    { question: "How do I measure baseboard needed?", answer: "Measure the room perimeter and subtract the width of all door openings." },
    { question: "How much extra baseboard should I buy?", answer: "Buy 10 percent extra to account for cuts, corners, and waste." },
  ],
  formula: "Linear Feet = (2 x (Length + Width)) - (Doors x Door Width) x 1.1",
};
