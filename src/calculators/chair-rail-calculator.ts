import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chairRailCalculator: CalculatorDefinition = {
  slug: "chair-rail-calculator",
  title: "Chair Rail Calculator",
  description: "Calculate linear feet of chair rail molding for a room.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["chair rail","chair rail length","chair rail molding"],
  variants: [{
    id: "standard",
    name: "Chair Rail",
    description: "Calculate linear feet of chair rail molding for a room.",
    fields: [
      { name: "roomLength", label: "Room Length (ft)", type: "number", min: 1, max: 100, defaultValue: 15 },
      { name: "roomWidth", label: "Room Width (ft)", type: "number", min: 1, max: 100, defaultValue: 12 },
      { name: "doors", label: "Number of Doors", type: "number", min: 0, max: 10, defaultValue: 2 },
      { name: "windows", label: "Number of Windows", type: "number", min: 0, max: 10, defaultValue: 2 },
    ],
    calculate: (inputs) => {
      const rl = inputs.roomLength as number;
      const rw = inputs.roomWidth as number;
      const doors = inputs.doors as number;
      const windows = inputs.windows as number;
      if (!rl || !rw) return null;
      const perimeter = 2 * (rl + rw);
      const doorDeduct = doors * 3;
      const windowDeduct = windows * 3;
      const net = perimeter - doorDeduct - windowDeduct;
      const withWaste = Math.ceil(net * 1.1);
      return {
        primary: { label: "Chair Rail Needed", value: formatNumber(withWaste) + " linear ft" },
        details: [
          { label: "Room Perimeter", value: formatNumber(Math.round(perimeter)) + " ft" },
          { label: "Door Deductions", value: formatNumber(Math.round(doorDeduct)) + " ft" },
          { label: "Window Deductions", value: formatNumber(Math.round(windowDeduct)) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: ["baseboard-length-calculator","wainscoting-calculator"],
  faq: [
    { question: "What height should chair rail be installed?", answer: "Chair rail is typically installed 30 to 36 inches from the floor." },
    { question: "Does chair rail go around the whole room?", answer: "Chair rail usually runs the full perimeter, stopping at door casings." },
  ],
  formula: "Linear Feet = (Perimeter - Door/Window Openings) x 1.10",
};
