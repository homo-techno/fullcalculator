import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const threeDPrintingCostCalculator: CalculatorDefinition = {
  slug: "3d-printing-cost-calculator",
  title: "3D Printing Cost Calculator",
  description: "Free online 3D printing cost calculator. Estimate filament, electricity, and total cost for your 3D printing projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["3d printing cost calculator", "filament cost calculator", "3d print price calculator", "FDM cost calculator", "printing cost estimator"],
  variants: [
    {
      id: "total-cost",
      name: "Total Print Cost",
      description: "Calculate total cost including filament, electricity, and depreciation",
      fields: [
        { name: "filamentUsed", label: "Filament Used (grams)", type: "number", placeholder: "e.g. 50" },
        { name: "filamentType", label: "Filament Type", type: "select", options: [
          { label: "PLA ($20/kg)", value: "20" },
          { label: "ABS ($22/kg)", value: "22" },
          { label: "PETG ($25/kg)", value: "25" },
          { label: "TPU ($30/kg)", value: "30" },
          { label: "Nylon ($35/kg)", value: "35" },
          { label: "ASA ($28/kg)", value: "28" },
          { label: "Custom", value: "0" },
        ], defaultValue: "20" },
        { name: "customSpoolCost", label: "Custom Spool Cost ($/kg, if Custom)", type: "number", placeholder: "e.g. 25" },
        { name: "printTime", label: "Print Time (hours)", type: "number", placeholder: "e.g. 4" },
        { name: "printerWattage", label: "Printer Wattage", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "electricityCost", label: "Electricity Cost ($/kWh)", type: "number", placeholder: "e.g. 0.12", defaultValue: 0.12 },
        { name: "failureRate", label: "Failure Rate (%)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const filamentGrams = parseFloat(inputs.filamentUsed as string) || 0;
        const filamentCostKg = parseFloat(inputs.filamentType as string) || 0;
        const customCost = parseFloat(inputs.customSpoolCost as string) || 0;
        const printTime = parseFloat(inputs.printTime as string) || 0;
        const wattage = parseFloat(inputs.printerWattage as string) || 200;
        const electricityRate = parseFloat(inputs.electricityCost as string) || 0.12;
        const failureRate = parseFloat(inputs.failureRate as string) || 10;
        if (!filamentGrams) return null;

        const costPerKg = filamentCostKg > 0 ? filamentCostKg : customCost;
        const filamentCost = (filamentGrams / 1000) * costPerKg;
        const electricityCost = (wattage / 1000) * printTime * electricityRate;
        const subtotal = filamentCost + electricityCost;
        const failureAdj = subtotal * (failureRate / 100);
        const totalCost = subtotal + failureAdj;

        return {
          primary: { label: "Total Print Cost", value: `$${formatNumber(totalCost, 2)}` },
          details: [
            { label: "Filament cost", value: `$${formatNumber(filamentCost, 2)}` },
            { label: "Electricity cost", value: `$${formatNumber(electricityCost, 2)}` },
            { label: "Failure rate adjustment", value: `$${formatNumber(failureAdj, 2)} (${failureRate}%)` },
            { label: "Cost per gram", value: `$${formatNumber(totalCost / filamentGrams, 3)}` },
            { label: "Filament used", value: `${formatNumber(filamentGrams)} g` },
            { label: "Print time", value: `${formatNumber(printTime, 1)} hours` },
          ],
          note: "Actual costs vary with print settings, support material usage, and printer model. This is an estimate.",
        };
      },
    },
    {
      id: "pricing",
      name: "Print Pricing (Sell Price)",
      description: "Calculate a sell price for 3D printed items",
      fields: [
        { name: "materialCost", label: "Material Cost ($)", type: "number", placeholder: "e.g. 2.50" },
        { name: "printTime", label: "Print Time (hours)", type: "number", placeholder: "e.g. 4" },
        { name: "hourlyRate", label: "Machine Hourly Rate ($)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "markup", label: "Markup (%)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "postProcessing", label: "Post-processing Time (min)", type: "number", placeholder: "e.g. 15", defaultValue: 0 },
        { name: "laborRate", label: "Labor Rate ($/hr)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const materialCost = parseFloat(inputs.materialCost as string) || 0;
        const printTime = parseFloat(inputs.printTime as string) || 0;
        const hourlyRate = parseFloat(inputs.hourlyRate as string) || 3;
        const markup = parseFloat(inputs.markup as string) || 50;
        const postMinutes = parseFloat(inputs.postProcessing as string) || 0;
        const laborRate = parseFloat(inputs.laborRate as string) || 15;
        if (!materialCost && !printTime) return null;

        const machineCost = printTime * hourlyRate;
        const laborCost = (postMinutes / 60) * laborRate;
        const baseCost = materialCost + machineCost + laborCost;
        const sellPrice = baseCost * (1 + markup / 100);

        return {
          primary: { label: "Suggested Sell Price", value: `$${formatNumber(sellPrice, 2)}` },
          details: [
            { label: "Material cost", value: `$${formatNumber(materialCost, 2)}` },
            { label: "Machine cost", value: `$${formatNumber(machineCost, 2)}` },
            { label: "Labor cost", value: `$${formatNumber(laborCost, 2)}` },
            { label: "Base cost", value: `$${formatNumber(baseCost, 2)}` },
            { label: "Markup", value: `${markup}%` },
            { label: "Profit per unit", value: `$${formatNumber(sellPrice - baseCost, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electricity-cost-calculator", "unit-converter"],
  faq: [
    { question: "How much does 3D printing cost per hour?", answer: "Electricity costs are typically $0.02-0.05 per hour for FDM printers (150-300W). Most of the cost is in filament. A typical 1kg spool of PLA ($20) prints about 300-400 small parts." },
    { question: "How do I find filament usage?", answer: "Most slicer software (Cura, PrusaSlicer, etc.) shows estimated filament usage in grams and meters before you print. Use that number in this calculator." },
    { question: "What failure rate should I use?", answer: "Beginners may experience 15-25% failure rates. Experienced users with tuned printers typically see 5-10%. Adjust based on your setup and experience." },
  ],
  formula: "Total Cost = (Filament g / 1000 × $/kg) + (Watts/1000 × Hours × $/kWh) × (1 + Failure%/100)",
};
