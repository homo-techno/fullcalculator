import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const recessedLightingCalculator: CalculatorDefinition = {
  slug: "recessed-lighting-calculator",
  title: "Recessed Lighting Calculator",
  description: "Calculate recessed light spacing and quantity needed.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["recessed","lighting","spacing","ceiling"],
  variants: [{
    id: "standard",
    name: "Recessed Lighting",
    description: "Calculate recessed light spacing and quantity needed.",
    fields: [
      { name: "roomLength", label: "Room Length (ft)", type: "number", min: 4, max: 60, defaultValue: 14 },
      { name: "roomWidth", label: "Room Width (ft)", type: "number", min: 4, max: 60, defaultValue: 12 },
      { name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 20, defaultValue: 8 },
    ],
    calculate: (inputs) => {
    const roomLength = inputs.roomLength as number;
    const roomWidth = inputs.roomWidth as number;
    const ceilingHeight = inputs.ceilingHeight as number;
    const spacing = ceilingHeight / 2;
    const rows = Math.ceil(roomLength / spacing);
    const cols = Math.ceil(roomWidth / spacing);
    const totalLights = rows * cols;
    return {
      primary: { label: "Lights Needed", value: formatNumber(totalLights) },
      details: [
        { label: "Recommended Spacing", value: formatNumber(spacing) + " ft" },
        { label: "Rows", value: formatNumber(rows) },
        { label: "Columns", value: formatNumber(cols) }
      ]
    };
  },
  }],
  relatedSlugs: ["lighting-lumen-calculator","landscape-lighting-calculator"],
  faq: [
    { question: "How far apart should recessed lights be?", answer: "Space recessed lights at half the ceiling height apart." },
    { question: "How far from the wall should recessed lights be?", answer: "Place recessed lights about 2 to 3 feet from the wall." },
  ],
  formula: "Spacing = Ceiling Height / 2; Lights = Rows x Columns",
};
