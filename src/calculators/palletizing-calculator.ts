import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const palletizingCalculator: CalculatorDefinition = {
  slug: "palletizing-calculator",
  title: "Palletizing Calculator",
  description: "Calculate optimal pallet stacking layers and arrangement.",
  category: "Math",
  categorySlug: "+",
  icon: "Layers",
  keywords: ["palletizing","stacking","layers","arrangement","boxes"],
  variants: [{
    id: "standard",
    name: "Palletizing",
    description: "Calculate optimal pallet stacking layers and arrangement.",
    fields: [
      { name: "palletLength", label: "Pallet Length (in)", type: "number", min: 1, max: 120, defaultValue: 48 },
      { name: "palletWidth", label: "Pallet Width (in)", type: "number", min: 1, max: 120, defaultValue: 40 },
      { name: "maxHeight", label: "Max Stack Height (in)", type: "number", min: 1, max: 120, defaultValue: 60 },
      { name: "boxLength", label: "Box Length (in)", type: "number", min: 0.5, max: 60, defaultValue: 16 },
      { name: "boxWidth", label: "Box Width (in)", type: "number", min: 0.5, max: 60, defaultValue: 12 },
      { name: "boxHeight", label: "Box Height (in)", type: "number", min: 0.5, max: 60, defaultValue: 10 },
      { name: "boxWeight", label: "Box Weight (lbs)", type: "number", min: 0.1, max: 500, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const palletLength = inputs.palletLength as number;
    const palletWidth = inputs.palletWidth as number;
    const maxHeight = inputs.maxHeight as number;
    const boxLength = inputs.boxLength as number;
    const boxWidth = inputs.boxWidth as number;
    const boxHeight = inputs.boxHeight as number;
    const boxWeight = inputs.boxWeight as number;
    const opt1Row = Math.floor(palletLength / boxLength);
    const opt1Col = Math.floor(palletWidth / boxWidth);
    const opt1PerLayer = opt1Row * opt1Col;
    const opt2Row = Math.floor(palletLength / boxWidth);
    const opt2Col = Math.floor(palletWidth / boxLength);
    const opt2PerLayer = opt2Row * opt2Col;
    const bestPerLayer = Math.max(opt1PerLayer, opt2PerLayer);
    const layers = Math.floor(maxHeight / boxHeight);
    const totalBoxes = bestPerLayer * layers;
    const totalWeight = totalBoxes * boxWeight;
    const palletArea = palletLength * palletWidth;
    const boxArea = bestPerLayer * boxLength * boxWidth;
    const areaUtil = Math.min((boxArea / palletArea) * 100, 100);
    return {
      primary: { label: "Total Boxes on Pallet", value: formatNumber(totalBoxes) },
      details: [
        { label: "Boxes Per Layer", value: formatNumber(bestPerLayer) },
        { label: "Number of Layers", value: formatNumber(layers) },
        { label: "Total Weight (lbs)", value: formatNumber(totalWeight) },
        { label: "Area Utilization", value: formatNumber(areaUtil) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["pallet-load-calculator","container-load-calculator","warehouse-space-calculator"],
  faq: [
    { question: "How do I optimize pallet stacking?", answer: "Try both orientations of the box and choose the one that fits more per layer." },
    { question: "What limits pallet stacking height?", answer: "Height is limited by warehouse clearance, weight, and box crush strength." },
  ],
  formula: "Total = max(Orientation1, Orientation2) per Layer x Layers",
};
