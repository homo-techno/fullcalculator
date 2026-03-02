import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const palletLoadCalculator: CalculatorDefinition = {
  slug: "pallet-load-calculator",
  title: "Pallet Load Calculator",
  description: "Calculate how many items fit on a pallet by dimensions.",
  category: "Everyday",
  categorySlug: "~",
  icon: "Package",
  keywords: ["pallet","load","items","dimensions","stacking"],
  variants: [{
    id: "standard",
    name: "Pallet Load",
    description: "Calculate how many items fit on a pallet by dimensions.",
    fields: [
      { name: "palletLength", label: "Pallet Length (in)", type: "number", min: 1, max: 120, defaultValue: 48 },
      { name: "palletWidth", label: "Pallet Width (in)", type: "number", min: 1, max: 120, defaultValue: 40 },
      { name: "palletHeight", label: "Max Stack Height (in)", type: "number", min: 1, max: 120, defaultValue: 60 },
      { name: "itemLength", label: "Item Length (in)", type: "number", min: 0.1, max: 120, defaultValue: 12 },
      { name: "itemWidth", label: "Item Width (in)", type: "number", min: 0.1, max: 120, defaultValue: 10 },
      { name: "itemHeight", label: "Item Height (in)", type: "number", min: 0.1, max: 120, defaultValue: 8 },
    ],
    calculate: (inputs) => {
    const palletLength = inputs.palletLength as number;
    const palletWidth = inputs.palletWidth as number;
    const palletHeight = inputs.palletHeight as number;
    const itemLength = inputs.itemLength as number;
    const itemWidth = inputs.itemWidth as number;
    const itemHeight = inputs.itemHeight as number;
    const itemsPerRow = Math.floor(palletLength / itemLength);
    const itemsPerCol = Math.floor(palletWidth / itemWidth);
    const layers = Math.floor(palletHeight / itemHeight);
    const perLayer = itemsPerRow * itemsPerCol;
    const totalItems = perLayer * layers;
    return {
      primary: { label: "Total Items on Pallet", value: formatNumber(totalItems) },
      details: [
        { label: "Items Per Layer", value: formatNumber(perLayer) },
        { label: "Number of Layers", value: formatNumber(layers) },
        { label: "Items Per Row", value: formatNumber(itemsPerRow) },
        { label: "Items Per Column", value: formatNumber(itemsPerCol) }
      ]
    };
  },
  }],
  relatedSlugs: ["container-load-calculator","palletizing-calculator","cbm-calculator"],
  faq: [
    { question: "How do I calculate items per pallet?", answer: "Divide pallet dimensions by item dimensions to find rows, columns, and layers." },
    { question: "What is a standard pallet size?", answer: "The most common US pallet is 48 by 40 inches." },
  ],
  formula: "Total Items = floor(PL / IL) x floor(PW / IW) x floor(PH / IH)",
};
