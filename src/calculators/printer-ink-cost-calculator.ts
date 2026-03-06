import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const printerInkCostCalculator: CalculatorDefinition = {
  slug: "printer-ink-cost-calculator",
  title: "Printer Ink Cost Per Page Calculator",
  description: "Calculate the true cost per page of inkjet printing based on cartridge prices, page yields, and paper costs to track your printing expenses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["printer ink cost","inkjet cost per page","ink cartridge cost","printing cost calculator","ink cost comparison"],
  variants: [{
    id: "standard",
    name: "Printer Ink Cost Per Page",
    description: "Calculate the true cost per page of inkjet printing based on cartridge prices, page yields, and paper costs to track your printing expenses.",
    fields: [
      { name: "blackInkCost", label: "Black Ink Cartridge Cost ($)", type: "number", min: 5, max: 100, defaultValue: 25 },
      { name: "blackYield", label: "Black Ink Page Yield", type: "number", min: 100, max: 5000, defaultValue: 500 },
      { name: "colorInkCost", label: "Color Ink Set Cost ($)", type: "number", min: 10, max: 200, defaultValue: 45 },
      { name: "colorYield", label: "Color Ink Page Yield", type: "number", min: 100, max: 5000, defaultValue: 300 },
      { name: "colorPercent", label: "Percentage of Color Prints (%)", type: "number", min: 0, max: 100, defaultValue: 30 },
      { name: "pagesPerMonth", label: "Pages Per Month", type: "number", min: 10, max: 5000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
    const blackCost = inputs.blackInkCost as number;
    const blackYield = inputs.blackYield as number;
    const colorCost = inputs.colorInkCost as number;
    const colorYield = inputs.colorYield as number;
    const colorPct = inputs.colorPercent as number / 100;
    const pagesMonth = inputs.pagesPerMonth as number;
    const blackPerPage = blackCost / blackYield;
    const colorPerPage = colorCost / colorYield;
    const paperPerPage = 0.012;
    const bwCostPerPage = blackPerPage + paperPerPage;
    const colorCostPerPage = blackPerPage + colorPerPage + paperPerPage;
    const blendedCost = bwCostPerPage * (1 - colorPct) + colorCostPerPage * colorPct;
    const monthlyCost = blendedCost * pagesMonth;
    const annualCost = monthlyCost * 12;
    const blackCartridgesYear = Math.ceil((pagesMonth * 12) / blackYield);
    return {
      primary: { label: "Blended Cost Per Page", value: "$" + formatNumber(Math.round(blendedCost * 10000) / 10000) },
      details: [
        { label: "B/W Only Cost Per Page", value: "$" + formatNumber(Math.round(bwCostPerPage * 10000) / 10000) },
        { label: "Color Cost Per Page", value: "$" + formatNumber(Math.round(colorCostPerPage * 10000) / 10000) },
        { label: "Monthly Printing Cost", value: "$" + formatNumber(Math.round(monthlyCost * 100) / 100) },
        { label: "Annual Printing Cost", value: "$" + formatNumber(Math.round(annualCost * 100) / 100) },
        { label: "Black Cartridges Per Year", value: formatNumber(blackCartridgesYear) }
      ]
    };
  },
  }],
  relatedSlugs: ["laser-printer-cost-per-page-calculator","3d-printer-filament-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Blended Cost = BW Cost x (1 - Color%) + Color Cost x Color%; BW Cost/Page = Black Ink/Yield + Paper Cost; Color Cost/Page = Black Ink/Yield + Color Ink/Yield + Paper Cost",
};
