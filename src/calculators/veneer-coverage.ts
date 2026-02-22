import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const veneerCoverageCalculator: CalculatorDefinition = {
  slug: "veneer-coverage-calculator",
  title: "Veneer Coverage Calculator",
  description: "Free veneer coverage calculator. Estimate the amount of veneer needed for a project including waste allowance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["veneer coverage calculator", "veneer sheet calculator", "wood veneer estimator", "veneer area calculator", "veneer waste"],
  variants: [
    {
      id: "flat-panel",
      name: "Flat Panel Veneer Coverage",
      description: "Calculate veneer needed for flat panels",
      fields: [
        { name: "panelLength", label: "Panel Length (inches)", type: "number", placeholder: "e.g. 48" },
        { name: "panelWidth", label: "Panel Width (inches)", type: "number", placeholder: "e.g. 24" },
        { name: "numPanels", label: "Number of Panels", type: "number", placeholder: "e.g. 4" },
        {
          name: "sides",
          label: "Sides to Veneer",
          type: "select",
          options: [
            { label: "One Side", value: "1" },
            { label: "Both Sides", value: "2" },
          ],
        },
        {
          name: "wastePercent",
          label: "Waste Allowance",
          type: "select",
          options: [
            { label: "10% (experienced)", value: "10" },
            { label: "15% (standard)", value: "15" },
            { label: "20% (matching grain)", value: "20" },
            { label: "25% (complex patterns)", value: "25" },
          ],
        },
      ],
      calculate: (inputs) => {
        const panelLength = inputs.panelLength as number;
        const panelWidth = inputs.panelWidth as number;
        const numPanels = inputs.numPanels as number;
        const sides = parseInt(inputs.sides as string);
        const wastePct = parseFloat(inputs.wastePercent as string);
        if (!panelLength || !panelWidth || !numPanels) return null;
        const panelArea = panelLength * panelWidth;
        const totalArea = panelArea * numPanels * sides;
        const wasteArea = totalArea * (wastePct / 100);
        const totalNeeded = totalArea + wasteArea;
        const sqFeet = totalNeeded / 144;
        const vSheets = Math.ceil(totalNeeded / (96 * 48));
        return {
          primary: { label: "Total Veneer Needed", value: `${formatNumber(sqFeet, 1)} sq ft` },
          details: [
            { label: "Net Area", value: `${formatNumber(totalArea / 144, 1)} sq ft` },
            { label: "Waste Allowance", value: `${formatNumber(wasteArea / 144, 1)} sq ft (${formatNumber(wastePct, 0)}%)` },
            { label: "Total with Waste", value: `${formatNumber(totalNeeded, 0)} sq inches` },
            { label: "Standard Sheets (4x8 ft)", value: formatNumber(vSheets, 0) },
            { label: "Area per Panel", value: `${formatNumber(panelArea / 144, 2)} sq ft` },
            { label: "Number of Panels", value: formatNumber(numPanels, 0) },
            { label: "Sides Veneered", value: formatNumber(sides, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wood-stain-coverage-calculator", "cutting-diagram-calculator", "board-footage-calculator"],
  faq: [
    { question: "How much waste should I plan for?", answer: "Plan for 10-15% waste for simple panels, 20% for grain matching, and 25% or more for complex patterns like sunbursts or book matching." },
    { question: "Should I veneer both sides?", answer: "Yes, veneering both sides of a panel helps prevent warping. The back veneer does not need to match but should be of similar thickness." },
  ],
  formula: "Total Veneer = (Panel Area x Panels x Sides) x (1 + Waste%) | Sheets = Total / Sheet Area",
};
