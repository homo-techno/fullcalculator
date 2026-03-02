import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kitchenIslandSizeCalculator: CalculatorDefinition = {
  slug: "kitchen-island-size-calculator",
  title: "Kitchen Island Size Calculator",
  description: "Determine the right kitchen island dimensions for your space.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["kitchen","island","size","dimensions"],
  variants: [{
    id: "standard",
    name: "Kitchen Island Size",
    description: "Determine the right kitchen island dimensions for your space.",
    fields: [
      { name: "kitchenLength", label: "Kitchen Length (ft)", type: "number", min: 8, max: 40, defaultValue: 16 },
      { name: "kitchenWidth", label: "Kitchen Width (ft)", type: "number", min: 8, max: 40, defaultValue: 12 },
      { name: "clearance", label: "Walkway Clearance (ft)", type: "number", min: 3, max: 5, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const kitchenLength = inputs.kitchenLength as number;
    const kitchenWidth = inputs.kitchenWidth as number;
    const clearance = inputs.clearance as number;
    const islandLength = kitchenLength - 2 * clearance;
    const islandWidth = kitchenWidth - 2 * clearance;
    const maxIslandLength = Math.max(islandLength, 2);
    const maxIslandWidth = Math.min(Math.max(islandWidth, 2), 4);
    const islandArea = maxIslandLength * maxIslandWidth;
    return {
      primary: { label: "Max Island Size", value: formatNumber(maxIslandLength) + " x " + formatNumber(maxIslandWidth) + " ft" },
      details: [
        { label: "Island Counter Area", value: formatNumber(islandArea) + " sq ft" },
        { label: "Walkway Clearance", value: clearance + " ft on each side" }
      ]
    };
  },
  }],
  relatedSlugs: ["countertop-square-footage-calculator","cabinet-hardware-calculator"],
  faq: [
    { question: "How much clearance around a kitchen island?", answer: "Allow at least 36 to 48 inches of clearance on all sides." },
    { question: "What is a good kitchen island size?", answer: "A common island size is 4 feet long by 2 feet wide." },
  ],
  formula: "Island Length = Kitchen Length - 2 x Clearance; Width capped at 4 ft",
};
