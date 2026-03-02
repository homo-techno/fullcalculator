import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const containerLoadCalculator: CalculatorDefinition = {
  slug: "container-load-calculator",
  title: "Container Load Calculator",
  description: "Calculate how many boxes fit in a shipping container.",
  category: "Everyday",
  categorySlug: "~",
  icon: "Package",
  keywords: ["container","shipping","boxes","load","cargo"],
  variants: [{
    id: "standard",
    name: "Container Load",
    description: "Calculate how many boxes fit in a shipping container.",
    fields: [
      { name: "containerLength", label: "Container Length (ft)", type: "number", min: 1, max: 60, defaultValue: 40 },
      { name: "containerWidth", label: "Container Width (ft)", type: "number", min: 1, max: 20, defaultValue: 8 },
      { name: "containerHeight", label: "Container Height (ft)", type: "number", min: 1, max: 20, defaultValue: 8 },
      { name: "boxLength", label: "Box Length (ft)", type: "number", min: 0.1, max: 20, defaultValue: 2 },
      { name: "boxWidth", label: "Box Width (ft)", type: "number", min: 0.1, max: 20, defaultValue: 1.5 },
      { name: "boxHeight", label: "Box Height (ft)", type: "number", min: 0.1, max: 20, defaultValue: 1.5 },
    ],
    calculate: (inputs) => {
    const containerLength = inputs.containerLength as number;
    const containerWidth = inputs.containerWidth as number;
    const containerHeight = inputs.containerHeight as number;
    const boxLength = inputs.boxLength as number;
    const boxWidth = inputs.boxWidth as number;
    const boxHeight = inputs.boxHeight as number;
    const containerVol = containerLength * containerWidth * containerHeight;
    const boxVol = boxLength * boxWidth * boxHeight;
    const lengthFit = Math.floor(containerLength / boxLength);
    const widthFit = Math.floor(containerWidth / boxWidth);
    const heightFit = Math.floor(containerHeight / boxHeight);
    const totalBoxes = lengthFit * widthFit * heightFit;
    const utilization = (totalBoxes * boxVol) / containerVol * 100;
    return {
      primary: { label: "Total Boxes", value: formatNumber(totalBoxes) },
      details: [
        { label: "Container Volume (cu ft)", value: formatNumber(containerVol) },
        { label: "Box Volume (cu ft)", value: formatNumber(boxVol) },
        { label: "Space Utilization", value: formatNumber(utilization) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["pallet-load-calculator","cbm-calculator","container-weight-calculator"],
  faq: [
    { question: "What are standard container sizes?", answer: "Common sizes are 20-foot and 40-foot containers with 8-foot width and height." },
    { question: "How is container utilization calculated?", answer: "Divide total box volume by container volume and multiply by 100." },
  ],
  formula: "Total Boxes = floor(CL/BL) x floor(CW/BW) x floor(CH/BH)",
};
