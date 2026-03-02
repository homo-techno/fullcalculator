import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const containerWeightCalculator: CalculatorDefinition = {
  slug: "container-weight-calculator",
  title: "Container Weight Calculator",
  description: "Calculate shipping container gross weight.",
  category: "Everyday",
  categorySlug: "~",
  icon: "Package",
  keywords: ["container","weight","gross","tare","shipping"],
  variants: [{
    id: "standard",
    name: "Container Weight",
    description: "Calculate shipping container gross weight.",
    fields: [
      { name: "tareWeight", label: "Container Tare Weight (lbs)", type: "number", min: 1000, max: 20000, defaultValue: 5070 },
      { name: "cargoWeight", label: "Cargo Weight (lbs)", type: "number", min: 0, max: 100000, defaultValue: 35000 },
      { name: "maxGross", label: "Max Gross Weight (lbs)", type: "number", min: 10000, max: 100000, defaultValue: 67200 },
      { name: "palletCount", label: "Number of Pallets", type: "number", min: 0, max: 100, defaultValue: 20 },
      { name: "palletWeight", label: "Pallet Weight Each (lbs)", type: "number", min: 0, max: 100, defaultValue: 40 },
    ],
    calculate: (inputs) => {
    const tareWeight = inputs.tareWeight as number;
    const cargoWeight = inputs.cargoWeight as number;
    const maxGross = inputs.maxGross as number;
    const palletCount = inputs.palletCount as number;
    const palletWeight = inputs.palletWeight as number;
    const totalPalletWeight = palletCount * palletWeight;
    const grossWeight = tareWeight + cargoWeight + totalPalletWeight;
    const remainingCapacity = maxGross - grossWeight;
    const utilization = (grossWeight / maxGross) * 100;
    return {
      primary: { label: "Gross Weight (lbs)", value: formatNumber(grossWeight) },
      details: [
        { label: "Cargo Weight (lbs)", value: formatNumber(cargoWeight) },
        { label: "Pallet Weight Total (lbs)", value: formatNumber(totalPalletWeight) },
        { label: "Remaining Capacity (lbs)", value: formatNumber(remainingCapacity) },
        { label: "Weight Utilization", value: formatNumber(utilization) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["container-load-calculator","cbm-calculator","pallet-load-calculator"],
  faq: [
    { question: "What is tare weight?", answer: "The weight of the empty container before any cargo is loaded." },
    { question: "What is the max weight for a 40-foot container?", answer: "A standard 40-foot container has a max gross weight of about 67200 lbs." },
  ],
  formula: "Gross Weight = Tare Weight + Cargo Weight + Pallet Weight",
};
