import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cabinetHardwareCalculator: CalculatorDefinition = {
  slug: "cabinet-hardware-calculator",
  title: "Cabinet Hardware Calculator",
  description: "Calculate the number of knobs and pulls needed for cabinets.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cabinet","hardware","knobs","pulls"],
  variants: [{
    id: "standard",
    name: "Cabinet Hardware",
    description: "Calculate the number of knobs and pulls needed for cabinets.",
    fields: [
      { name: "doors", label: "Number of Doors", type: "number", min: 0, max: 60, defaultValue: 20 },
      { name: "drawers", label: "Number of Drawers", type: "number", min: 0, max: 40, defaultValue: 10 },
      { name: "knobPrice", label: "Knob Price ($)", type: "number", min: 1, max: 50, defaultValue: 5 },
      { name: "pullPrice", label: "Pull Price ($)", type: "number", min: 1, max: 80, defaultValue: 8 },
    ],
    calculate: (inputs) => {
    const doors = inputs.doors as number;
    const drawers = inputs.drawers as number;
    const knobPrice = inputs.knobPrice as number;
    const pullPrice = inputs.pullPrice as number;
    const knobs = doors;
    const pulls = drawers;
    const totalPieces = knobs + pulls;
    const totalCost = knobs * knobPrice + pulls * pullPrice;
    return {
      primary: { label: "Total Hardware Pieces", value: formatNumber(totalPieces) },
      details: [
        { label: "Knobs for Doors", value: formatNumber(knobs) },
        { label: "Pulls for Drawers", value: formatNumber(pulls) },
        { label: "Total Cost", value: "$" + formatNumber(totalCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["countertop-square-footage-calculator","kitchen-island-size-calculator"],
  faq: [
    { question: "Should I use knobs or pulls on cabinets?", answer: "Knobs are common on doors and pulls are common on drawers." },
    { question: "What size pulls for kitchen cabinets?", answer: "The most popular pull sizes are 3 inch and 4 inch centers." },
  ],
  formula: "Knobs = Number of Doors; Pulls = Number of Drawers; Cost = Knobs x Price + Pulls x Price",
};
