import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dripIrrigationCalculator: CalculatorDefinition = {
  slug: "drip-irrigation-calculator",
  title: "Drip Irrigation Calculator",
  description: "Free drip irrigation calculator. Calculate the number of emitters, tubing length, flow rate, and run time needed for your drip irrigation system.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["drip irrigation calculator", "drip system calculator", "how many drip emitters", "drip irrigation design", "drip line calculator"],
  variants: [
    {
      id: "emitter-count",
      name: "Emitter Count & Layout",
      description: "Calculate emitters needed for your garden",
      fields: [
        { name: "gardenLength", label: "Garden Bed Length (ft)", type: "number", placeholder: "e.g. 20" },
        { name: "gardenWidth", label: "Garden Bed Width (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "emitterSpacing", label: "Emitter Spacing", type: "select", options: [
          { label: "6 inches (dense plantings, sandy soil)", value: "6" },
          { label: "12 inches (most vegetables)", value: "12" },
          { label: "18 inches (larger plants)", value: "18" },
          { label: "24 inches (trees, shrubs)", value: "24" },
          { label: "36 inches (widely spaced plants)", value: "36" },
        ], defaultValue: "12" },
        { name: "rowSpacing", label: "Row/Line Spacing (inches)", type: "select", options: [
          { label: "12 inches (dense beds)", value: "12" },
          { label: "18 inches (standard)", value: "18" },
          { label: "24 inches (wide rows)", value: "24" },
          { label: "36 inches (wide spacing)", value: "36" },
        ], defaultValue: "18" },
        { name: "emitterRate", label: "Emitter Flow Rate", type: "select", options: [
          { label: "0.5 GPH (Low Flow)", value: "0.5" },
          { label: "1.0 GPH (Standard)", value: "1" },
          { label: "2.0 GPH (High Flow)", value: "2" },
          { label: "4.0 GPH (Trees/Shrubs)", value: "4" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const length = inputs.gardenLength as number;
        const width = inputs.gardenWidth as number;
        const emitterSpacing = parseInt(inputs.emitterSpacing as string);
        const rowSpacing = parseInt(inputs.rowSpacing as string);
        const emitterRate = parseFloat(inputs.emitterRate as string);
        if (!length || !width || !emitterSpacing || !rowSpacing || !emitterRate) return null;

        const lengthIn = length * 12;
        const widthIn = width * 12;
        const numRows = Math.floor(widthIn / rowSpacing) + 1;
        const emittersPerRow = Math.floor(lengthIn / emitterSpacing) + 1;
        const totalEmitters = numRows * emittersPerRow;
        const totalTubing = numRows * length + width;
        const totalFlowGPH = totalEmitters * emitterRate;
        const totalFlowGPM = totalFlowGPH / 60;

        const inchesPerHour = (totalFlowGPH * 231) / (length * width * 144);
        const runTimeFor1Inch = 1 / inchesPerHour;

        return {
          primary: { label: "Total Emitters", value: `${totalEmitters}` },
          details: [
            { label: "Drip lines", value: `${numRows} rows` },
            { label: "Emitters per row", value: `${emittersPerRow}` },
            { label: "Total tubing needed", value: `${formatNumber(totalTubing, 0)} ft` },
            { label: "Total flow rate", value: `${formatNumber(totalFlowGPH, 1)} GPH (${formatNumber(totalFlowGPM, 2)} GPM)` },
            { label: "Run time for 1\" water", value: `${formatNumber(runTimeFor1Inch * 60, 0)} minutes` },
            { label: "Weekly run time (1\" target)", value: `${formatNumber(runTimeFor1Inch * 60, 0)} min, 2-3 times/week` },
          ],
          note: "Check that total flow rate does not exceed your water supply capacity. A typical garden faucet provides 3-5 GPM. Install a pressure regulator (25 PSI) for drip systems.",
        };
      },
    },
    {
      id: "run-time",
      name: "Run Time Calculator",
      description: "Calculate how long to run your drip system",
      fields: [
        { name: "numEmitters", label: "Number of Emitters", type: "number", placeholder: "e.g. 50" },
        { name: "emitterGPH", label: "Emitter Flow Rate (GPH)", type: "select", options: [
          { label: "0.5 GPH", value: "0.5" },
          { label: "1.0 GPH", value: "1" },
          { label: "2.0 GPH", value: "2" },
          { label: "4.0 GPH", value: "4" },
        ], defaultValue: "1" },
        { name: "areaSize", label: "Total Area Covered (sq ft)", type: "number", placeholder: "e.g. 80" },
        { name: "targetInches", label: "Target Water (inches per week)", type: "number", placeholder: "e.g. 1.5", defaultValue: 1.5 },
        { name: "frequency", label: "Watering Frequency", type: "select", options: [
          { label: "Every Day", value: "7" },
          { label: "Every Other Day", value: "3.5" },
          { label: "3 Times per Week", value: "3" },
          { label: "2 Times per Week", value: "2" },
        ], defaultValue: "3" },
      ],
      calculate: (inputs) => {
        const emitters = inputs.numEmitters as number;
        const gph = parseFloat(inputs.emitterGPH as string);
        const area = inputs.areaSize as number;
        const target = inputs.targetInches as number;
        const freqPerWeek = parseFloat(inputs.frequency as string);
        if (!emitters || !gph || !area || !target || !freqPerWeek) return null;

        const weeklyGallons = target * area * 0.623;
        const gallonsPerSession = weeklyGallons / freqPerWeek;
        const systemGPH = emitters * gph;
        const minutesPerSession = (gallonsPerSession / systemGPH) * 60;
        const weeklyMinutes = minutesPerSession * freqPerWeek;
        const weeklyGallonsDelivered = systemGPH * (weeklyMinutes / 60);

        return {
          primary: { label: "Run Time per Session", value: `${formatNumber(minutesPerSession, 0)} minutes` },
          details: [
            { label: "Weekly water target", value: `${formatNumber(weeklyGallons, 0)} gallons (${target}" over ${area} sq ft)` },
            { label: "Water per session", value: `${formatNumber(gallonsPerSession, 1)} gallons` },
            { label: "System flow rate", value: `${formatNumber(systemGPH, 1)} GPH total` },
            { label: "Sessions per week", value: `${freqPerWeek}` },
            { label: "Total weekly run time", value: `${formatNumber(weeklyMinutes, 0)} minutes` },
            { label: "Weekly water used", value: `${formatNumber(weeklyGallonsDelivered, 0)} gallons` },
          ],
          note: "Set a timer to avoid overwatering. Deep watering less frequently is better than shallow watering daily. Check soil moisture before watering.",
        };
      },
    },
  ],
  relatedSlugs: ["garden-water-calculator", "irrigation-calculator", "sprinkler-coverage-calculator"],
  faq: [
    { question: "How many drip emitters do I need?", answer: "Place one emitter per plant for small plants, or space emitters every 12 inches along drip lines for row planting. For trees, use 4-8 emitters per tree arranged in a ring. In sandy soil, use closer spacing (6-12\") to ensure even moisture." },
    { question: "How long should I run drip irrigation?", answer: "Run times depend on emitter flow rate and water needs. For most vegetable gardens with 1 GPH emitters, run 30-60 minutes 2-3 times per week. Adjust based on soil type: sandy soil needs shorter, more frequent runs; clay needs longer, less frequent runs." },
    { question: "What pressure do I need for drip irrigation?", answer: "Drip irrigation operates at 15-30 PSI, much lower than sprinkler systems (40-60 PSI). Always install a pressure regulator to reduce household water pressure (40-80 PSI) to protect drip components. Most drip systems perform best at 25 PSI." },
  ],
  formula: "Emitters = (Bed Length / Spacing + 1) × Number of Rows | Run Time (min) = (Gallons Needed / Total GPH) × 60",
};
