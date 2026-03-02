import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cbmCalculator: CalculatorDefinition = {
  slug: "cbm-calculator",
  title: "CBM Calculator",
  description: "Calculate cubic meters for a shipment.",
  category: "Conversion",
  categorySlug: "R",
  icon: "Box",
  keywords: ["CBM","cubic","meters","shipment","volume"],
  variants: [{
    id: "standard",
    name: "CBM",
    description: "Calculate cubic meters for a shipment.",
    fields: [
      { name: "length", label: "Length (cm)", type: "number", min: 1, max: 10000, defaultValue: 120 },
      { name: "width", label: "Width (cm)", type: "number", min: 1, max: 10000, defaultValue: 80 },
      { name: "height", label: "Height (cm)", type: "number", min: 1, max: 10000, defaultValue: 60 },
      { name: "quantity", label: "Number of Packages", type: "number", min: 1, max: 100000, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const quantity = inputs.quantity as number;
    const cbmPerUnit = (length * width * height) / 1000000;
    const totalCbm = cbmPerUnit * quantity;
    const cubicFeet = totalCbm * 35.3147;
    return {
      primary: { label: "Total CBM", value: formatNumber(totalCbm) + " m3" },
      details: [
        { label: "CBM Per Package", value: formatNumber(cbmPerUnit) },
        { label: "Total Cubic Feet", value: formatNumber(cubicFeet) },
        { label: "Number of Packages", value: formatNumber(quantity) }
      ]
    };
  },
  }],
  relatedSlugs: ["container-load-calculator","dimensional-weight-calculator","container-weight-calculator"],
  faq: [
    { question: "What is CBM?", answer: "CBM stands for cubic meter, the standard volume unit for international shipping." },
    { question: "How is CBM calculated?", answer: "Multiply length by width by height in centimeters and divide by 1000000." },
  ],
  formula: "CBM = (Length x Width x Height in cm) / 1,000,000",
};
