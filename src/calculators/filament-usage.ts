import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const filamentUsageCalculator: CalculatorDefinition = {
  slug: "filament-usage-calculator",
  title: "3D Printing Filament Usage Estimator",
  description: "Free online 3D printing filament usage estimator. Calculate filament length, weight, and remaining spool life for your prints.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["filament usage calculator", "3d printing filament estimator", "spool life calculator", "filament weight calculator", "how much filament left"],
  variants: [
    {
      id: "spool-life",
      name: "Spool Life Estimator",
      description: "Calculate how many prints you can get from a spool",
      fields: [
        { name: "spoolWeight", label: "Spool Net Weight (grams)", type: "select", options: [
          { label: "250g spool", value: "250" },
          { label: "500g spool", value: "500" },
          { label: "1kg spool (standard)", value: "1000" },
          { label: "2kg spool", value: "2000" },
          { label: "5kg spool", value: "5000" },
        ], defaultValue: "1000" },
        { name: "gramsPerPrint", label: "Filament per Print (grams)", type: "number", placeholder: "e.g. 35" },
        { name: "spoolCost", label: "Spool Cost ($)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "usedGrams", label: "Already Used (grams)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const spoolWeight = parseFloat(inputs.spoolWeight as string) || 1000;
        const gramsPerPrint = parseFloat(inputs.gramsPerPrint as string) || 0;
        const spoolCost = parseFloat(inputs.spoolCost as string) || 20;
        const usedGrams = parseFloat(inputs.usedGrams as string) || 0;
        if (!gramsPerPrint) return null;

        const remainingGrams = spoolWeight - usedGrams;
        const printsRemaining = Math.floor(remainingGrams / gramsPerPrint);
        const costPerGram = spoolCost / spoolWeight;
        const costPerPrint = gramsPerPrint * costPerGram;
        const percentUsed = (usedGrams / spoolWeight) * 100;

        return {
          primary: { label: "Prints Remaining", value: formatNumber(printsRemaining, 0) },
          details: [
            { label: "Filament remaining", value: `${formatNumber(remainingGrams)} g` },
            { label: "Spool used", value: `${formatNumber(percentUsed, 1)}%` },
            { label: "Cost per print", value: `$${formatNumber(costPerPrint, 2)}` },
            { label: "Cost per gram", value: `$${formatNumber(costPerGram, 3)}` },
            { label: "Filament per print", value: `${formatNumber(gramsPerPrint)} g` },
          ],
        };
      },
    },
    {
      id: "length-weight",
      name: "Length to Weight Converter",
      description: "Convert between filament length (meters) and weight (grams)",
      fields: [
        { name: "filamentDiameter", label: "Filament Diameter", type: "select", options: [
          { label: "1.75 mm", value: "1.75" },
          { label: "2.85 mm", value: "2.85" },
        ], defaultValue: "1.75" },
        { name: "material", label: "Material", type: "select", options: [
          { label: "PLA (1.24 g/cm³)", value: "1.24" },
          { label: "ABS (1.04 g/cm³)", value: "1.04" },
          { label: "PETG (1.27 g/cm³)", value: "1.27" },
          { label: "TPU (1.21 g/cm³)", value: "1.21" },
          { label: "Nylon (1.14 g/cm³)", value: "1.14" },
        ], defaultValue: "1.24" },
        { name: "lengthMeters", label: "Filament Length (meters)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const diameter = parseFloat(inputs.filamentDiameter as string) || 1.75;
        const density = parseFloat(inputs.material as string) || 1.24;
        const lengthMeters = parseFloat(inputs.lengthMeters as string) || 0;
        if (!lengthMeters) return null;

        const radiusCm = (diameter / 10) / 2;
        const crossSectionArea = Math.PI * radiusCm * radiusCm;
        const lengthCm = lengthMeters * 100;
        const volumeCm3 = crossSectionArea * lengthCm;
        const weightGrams = volumeCm3 * density;

        return {
          primary: { label: "Filament Weight", value: `${formatNumber(weightGrams, 1)} g` },
          details: [
            { label: "Filament length", value: `${formatNumber(lengthMeters, 1)} m` },
            { label: "Cross-section area", value: `${formatNumber(crossSectionArea, 4)} cm²` },
            { label: "Volume", value: `${formatNumber(volumeCm3, 2)} cm³` },
            { label: "Material density", value: `${density} g/cm³` },
            { label: "Filament diameter", value: `${diameter} mm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["3d-printing-cost-calculator", "unit-converter"],
  faq: [
    { question: "How much filament is on a standard spool?", answer: "A standard spool contains 1 kg (1000 g) of filament. For 1.75mm PLA, this is approximately 330 meters. Smaller spools (250g, 500g) and larger spools (2kg, 5kg) are also available." },
    { question: "How do I know how much filament is left?", answer: "Weigh your spool including the empty spool (typically 200-250g for plastic spools). Subtract the empty spool weight to get the remaining filament weight. Some printers also track filament usage digitally." },
    { question: "Does filament diameter matter for calculations?", answer: "Yes. 1.75mm filament has a much smaller cross-section than 2.85mm, so 1 meter of 1.75mm filament weighs less. Most modern FDM printers use 1.75mm filament." },
  ],
  formula: "Weight (g) = π × (diameter/2)² × length (cm) × density (g/cm³)",
};
