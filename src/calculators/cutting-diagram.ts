import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cuttingDiagramCalculator: CalculatorDefinition = {
  slug: "cutting-diagram-calculator",
  title: "Cutting Diagram Optimizer",
  description: "Free cutting diagram optimizer. Calculate the number of sheet goods or boards needed and estimate material yield for your project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cutting diagram calculator", "board yield calculator", "plywood cutting optimizer", "sheet goods calculator", "material yield"],
  variants: [
    {
      id: "sheet-goods",
      name: "Sheet Goods Yield",
      description: "Calculate how many pieces you can get from sheet goods",
      fields: [
        { name: "sheetLength", label: "Sheet Length (inches)", type: "number", placeholder: "e.g. 96" },
        { name: "sheetWidth", label: "Sheet Width (inches)", type: "number", placeholder: "e.g. 48" },
        { name: "partLength", label: "Part Length (inches)", type: "number", placeholder: "e.g. 24" },
        { name: "partWidth", label: "Part Width (inches)", type: "number", placeholder: "e.g. 12" },
        { name: "numParts", label: "Number of Parts Needed", type: "number", placeholder: "e.g. 10" },
        {
          name: "kerf",
          label: "Saw Blade Kerf",
          type: "select",
          options: [
            { label: "1/8 inch (standard)", value: "0.125" },
            { label: "3/32 inch (thin kerf)", value: "0.09375" },
            { label: "1/4 inch (dado blade)", value: "0.25" },
          ],
        },
      ],
      calculate: (inputs) => {
        const sheetL = inputs.sheetLength as number;
        const sheetW = inputs.sheetWidth as number;
        const partL = inputs.partLength as number;
        const partW = inputs.partWidth as number;
        const numParts = inputs.numParts as number;
        const kerf = parseFloat(inputs.kerf as string);
        if (!sheetL || !sheetW || !partL || !partW || !numParts) return null;
        const partsAlongL = Math.floor(sheetL / (partL + kerf));
        const partsAlongW = Math.floor(sheetW / (partW + kerf));
        const partsPerSheet = partsAlongL * partsAlongW;
        const partsAlongL2 = Math.floor(sheetL / (partW + kerf));
        const partsAlongW2 = Math.floor(sheetW / (partL + kerf));
        const partsPerSheet2 = partsAlongL2 * partsAlongW2;
        const bestPerSheet = Math.max(partsPerSheet, partsPerSheet2);
        const sheetsNeeded = bestPerSheet > 0 ? Math.ceil(numParts / bestPerSheet) : 0;
        const totalPartArea = partL * partW * numParts;
        const totalSheetArea = sheetL * sheetW * sheetsNeeded;
        const yieldPercent = totalSheetArea > 0 ? (totalPartArea / totalSheetArea) * 100 : 0;
        const wastePercent = 100 - yieldPercent;
        const wasteArea = totalSheetArea - totalPartArea;
        return {
          primary: { label: "Sheets Needed", value: formatNumber(sheetsNeeded, 0) },
          details: [
            { label: "Parts Per Sheet", value: formatNumber(bestPerSheet, 0) },
            { label: "Total Parts Available", value: formatNumber(bestPerSheet * sheetsNeeded, 0) },
            { label: "Parts Needed", value: formatNumber(numParts, 0) },
            { label: "Material Yield", value: `${formatNumber(yieldPercent, 1)}%` },
            { label: "Waste", value: `${formatNumber(wastePercent, 1)}%` },
            { label: "Waste Area", value: `${formatNumber(wasteArea / 144, 1)} sq ft` },
            { label: "Total Part Area", value: `${formatNumber(totalPartArea / 144, 1)} sq ft` },
            { label: "Kerf Width", value: `${formatNumber(kerf, 4)} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["board-footage-calculator", "veneer-coverage-calculator", "wood-stain-coverage-calculator"],
  faq: [
    { question: "How do I minimize waste?", answer: "Try rotating parts 90 degrees to see if more fit on a sheet. Group cuts by dimension, and plan to use offcuts for smaller parts in your project." },
    { question: "Should I account for saw kerf?", answer: "Yes. Each cut removes material equal to the blade width (kerf). A standard blade removes 1/8 inch per cut. Over many cuts, this adds up significantly." },
  ],
  formula: "Parts Per Sheet = floor(Sheet_L / (Part_L + Kerf)) x floor(Sheet_W / (Part_W + Kerf)) | Sheets = ceil(Total Parts / Parts Per Sheet)",
};
