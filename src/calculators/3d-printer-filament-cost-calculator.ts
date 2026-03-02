import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const n3dPrinterFilamentCostCalculator: CalculatorDefinition = {
  slug: "3d-printer-filament-cost-calculator",
  title: "3D Printer Filament Cost Calculator",
  description: "Estimate the filament usage and cost for 3D printing projects based on model volume, infill percentage, filament type, and material cost.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["3d printer filament cost","3d printing cost","filament usage calculator","pla filament price","3d print material cost"],
  variants: [{
    id: "standard",
    name: "3D Printer Filament Cost",
    description: "Estimate the filament usage and cost for 3D printing projects based on model volume, infill percentage, filament type, and material cost.",
    fields: [
      { name: "modelVolume", label: "Model Volume (cubic cm)", type: "number", min: 1, max: 10000, defaultValue: 50 },
      { name: "infillPercent", label: "Infill Percentage (%)", type: "number", min: 5, max: 100, defaultValue: 20 },
      { name: "filamentType", label: "Filament Type", type: "select", options: [{ value: "1.24", label: "PLA ($20/kg)" }, { value: "1.04", label: "ABS ($22/kg)" }, { value: "1.25", label: "PETG ($25/kg)" }, { value: "1.31", label: "TPU ($30/kg)" }, { value: "1.27", label: "Nylon ($35/kg)" }], defaultValue: "1.24" },
      { name: "spoolCost", label: "Spool Cost ($)", type: "number", min: 10, max: 200, defaultValue: 20 },
      { name: "spoolWeight", label: "Spool Weight (grams)", type: "number", min: 250, max: 5000, defaultValue: 1000 },
    ],
    calculate: (inputs) => {
    const volume = inputs.modelVolume as number;
    const infill = inputs.infillPercent as number / 100;
    const density = parseFloat(inputs.filamentType as string);
    const spoolCost = inputs.spoolCost as number;
    const spoolWeight = inputs.spoolWeight as number;
    const shellVolume = volume * 0.15;
    const infillVolume = volume * 0.85 * infill;
    const totalVolume = shellVolume + infillVolume;
    const weightGrams = totalVolume * density;
    const costPerGram = spoolCost / spoolWeight;
    const printCost = weightGrams * costPerGram;
    const spoolPercent = (weightGrams / spoolWeight) * 100;
    const electricityCost = (totalVolume / 10) * 0.02;
    const totalCost = printCost + electricityCost;
    return {
      primary: { label: "Filament Cost", value: "$" + formatNumber(Math.round(printCost * 100) / 100) },
      details: [
        { label: "Filament Weight", value: formatNumber(Math.round(weightGrams * 10) / 10) + "g" },
        { label: "Spool Usage", value: formatNumber(Math.round(spoolPercent * 10) / 10) + "%" },
        { label: "Electricity Estimate", value: "$" + formatNumber(Math.round(electricityCost * 100) / 100) },
        { label: "Total Print Cost", value: "$" + formatNumber(Math.round(totalCost * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["laser-printer-cost-per-page-calculator","printer-ink-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Filament Weight = (Shell Volume + Infill Volume) x Material Density
Shell Volume = Model Volume x 15%
Infill Volume = Model Volume x 85% x Infill %
Cost = Weight x (Spool Cost / Spool Weight)",
};
