import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dripIrrigationLayoutCalculator: CalculatorDefinition = {
  slug: "drip-irrigation-layout-calculator",
  title: "Drip Irrigation Layout Calculator",
  description: "Free drip irrigation layout calculator. Calculate tubing length, emitter count, and water flow needed for your drip irrigation system.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["drip irrigation calculator", "drip line calculator", "irrigation layout planner", "emitter spacing calculator", "drip system calculator"],
  variants: [
    {
      id: "garden-bed",
      name: "Garden Bed Drip Layout",
      description: "Calculate drip irrigation materials for a garden bed",
      fields: [
        { name: "length", label: "Bed Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Bed Width (feet)", type: "number", placeholder: "e.g. 4" },
        { name: "rowSpacing", label: "Drip Line Spacing (inches)", type: "select", options: [
          { label: "6 inches (dense plantings)", value: "6" },
          { label: "9 inches (vegetables)", value: "9" },
          { label: "12 inches (standard)", value: "12" },
          { label: "18 inches (shrubs/trees)", value: "18" },
        ], defaultValue: "12" },
        { name: "emitterSpacing", label: "Emitter Spacing (inches)", type: "select", options: [
          { label: "6 inches", value: "6" },
          { label: "9 inches", value: "9" },
          { label: "12 inches", value: "12" },
          { label: "18 inches", value: "18" },
          { label: "24 inches", value: "24" },
        ], defaultValue: "12" },
        { name: "emitterRate", label: "Emitter Flow Rate (GPH)", type: "select", options: [
          { label: "0.5 GPH", value: "0.5" },
          { label: "1.0 GPH", value: "1.0" },
          { label: "2.0 GPH", value: "2.0" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const rowSpacing = parseInt(inputs.rowSpacing as string) || 12;
        const emitterSpacing = parseInt(inputs.emitterSpacing as string) || 12;
        const emitterRate = parseFloat(inputs.emitterRate as string) || 1.0;
        if (!length || !width) return null;

        const numRows = Math.floor((width * 12) / rowSpacing);
        const tubingPerRow = length;
        const totalTubing = numRows * tubingPerRow;
        const emittersPerRow = Math.floor((length * 12) / emitterSpacing);
        const totalEmitters = numRows * emittersPerRow;
        const totalGPH = totalEmitters * emitterRate;
        const totalGPM = totalGPH / 60;
        const waterPer30Min = totalGPH * 0.5;

        return {
          primary: { label: "Total Tubing Needed", value: `${formatNumber(totalTubing)} ft` },
          details: [
            { label: "Number of drip lines", value: `${numRows}` },
            { label: "Total emitters", value: `${totalEmitters}` },
            { label: "Total flow rate", value: `${formatNumber(totalGPH, 1)} GPH (${formatNumber(totalGPM, 2)} GPM)` },
            { label: "Water per 30-min session", value: `${formatNumber(waterPer30Min, 1)} gallons` },
            { label: "Bed area", value: `${formatNumber(length * width)} sq ft` },
          ],
          note: "Add 10-15% extra tubing for connections and turns. Ensure your water supply can deliver the required GPM.",
        };
      },
    },
    {
      id: "row-garden",
      name: "Row Garden Drip Layout",
      description: "Calculate drip irrigation for traditional row gardens",
      fields: [
        { name: "rowLength", label: "Row Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "numRows", label: "Number of Rows", type: "number", placeholder: "e.g. 8" },
        { name: "emitterSpacing", label: "Emitter Spacing (inches)", type: "select", options: [
          { label: "6 inches", value: "6" },
          { label: "12 inches", value: "12" },
          { label: "18 inches", value: "18" },
          { label: "24 inches", value: "24" },
        ], defaultValue: "12" },
        { name: "emitterRate", label: "Emitter Flow Rate (GPH)", type: "select", options: [
          { label: "0.5 GPH", value: "0.5" },
          { label: "1.0 GPH", value: "1.0" },
          { label: "2.0 GPH", value: "2.0" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const rowLength = inputs.rowLength as number;
        const numRows = inputs.numRows as number;
        const emitterSpacing = parseInt(inputs.emitterSpacing as string) || 12;
        const emitterRate = parseFloat(inputs.emitterRate as string) || 1.0;
        if (!rowLength || !numRows) return null;

        const totalTubing = rowLength * numRows;
        const headerLine = numRows * 3;
        const emittersPerRow = Math.floor((rowLength * 12) / emitterSpacing);
        const totalEmitters = emittersPerRow * numRows;
        const totalGPH = totalEmitters * emitterRate;

        return {
          primary: { label: "Total Tubing", value: `${formatNumber(totalTubing + headerLine)} ft` },
          details: [
            { label: "Row tubing", value: `${formatNumber(totalTubing)} ft` },
            { label: "Header line (est.)", value: `${formatNumber(headerLine)} ft` },
            { label: "Total emitters", value: `${totalEmitters}` },
            { label: "Total flow rate", value: `${formatNumber(totalGPH, 1)} GPH` },
            { label: "Connectors needed", value: `${numRows} tees + ${numRows} end caps` },
          ],
          note: "Use a pressure regulator (25 PSI) and filter at the source. Plan for a header line connecting all rows.",
        };
      },
    },
  ],
  relatedSlugs: ["watering-schedule-calculator", "vegetable-garden-size-calculator", "garden-row-spacing-calculator"],
  faq: [
    { question: "How far apart should drip lines be spaced?", answer: "For vegetables and annuals, space lines 12 inches apart. For dense ground cover, use 6-9 inches. For shrubs and trees, use 18-24 inches or individual emitters at each plant." },
    { question: "How long should I run drip irrigation?", answer: "Run drip irrigation 20-45 minutes per session. Sandy soil needs shorter, more frequent sessions. Clay soil needs longer, less frequent sessions. Adjust based on season and plant needs." },
  ],
  formula: "Tubing = Rows × Row Length | Emitters = Rows × (Row Length × 12 / Emitter Spacing)",
};
