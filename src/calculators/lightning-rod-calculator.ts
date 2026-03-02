import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lightningRodCalculator: CalculatorDefinition = {
  slug: "lightning-rod-calculator",
  title: "Lightning Rod Calculator",
  description: "Calculate lightning protection requirements for a building.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["lightning rod","lightning protection calculator"],
  variants: [{
    id: "standard",
    name: "Lightning Rod",
    description: "Calculate lightning protection requirements for a building.",
    fields: [
      { name: "roofLength", label: "Roof Length (ft)", type: "number", min: 10, max: 500, defaultValue: 60 },
      { name: "roofWidth", label: "Roof Width (ft)", type: "number", min: 10, max: 500, defaultValue: 40 },
      { name: "buildingHeight", label: "Building Height (ft)", type: "number", min: 10, max: 300, defaultValue: 30 },
      { name: "rodSpacing", label: "Rod Spacing (ft)", type: "number", min: 10, max: 25, defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const rl = inputs.roofLength as number;
      const rw = inputs.roofWidth as number;
      const bh = inputs.buildingHeight as number;
      const sp = inputs.rodSpacing as number;
      if (!rl || !rw || !bh || !sp) return null;
      const rodsLength = Math.ceil(rl / sp) + 1;
      const rodsWidth = Math.ceil(rw / sp) + 1;
      const totalRods = 2 * (rodsLength + rodsWidth) - 4;
      const conductorFt = Math.round((rl + rw) * 2 + bh * 4 + 20);
      const groundRods = Math.max(2, Math.ceil(totalRods / 4));
      return {
        primary: { label: "Air Terminals Needed", value: formatNumber(totalRods) },
        details: [
          { label: "Conductor Cable", value: formatNumber(conductorFt) + " ft" },
          { label: "Ground Rods", value: formatNumber(groundRods) },
          { label: "Protection Zone Radius", value: formatNumber(bh) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How does a lightning rod work?", answer: "It provides a low-resistance path to safely direct lightning current into the ground." },
    { question: "How far apart should lightning rods be?", answer: "NFPA 780 requires air terminals spaced no more than 20 to 25 feet apart." },
  ],
  formula: "Rods = 2 x (ceil(L/Spacing) + ceil(W/Spacing) + 2) - 4",
};
