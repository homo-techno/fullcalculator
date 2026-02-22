import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const refrigerantChargeCalculator: CalculatorDefinition = {
  slug: "refrigerant-charge-calculator",
  title: "Refrigerant Charge Calculator",
  description: "Free refrigerant charge calculator. Estimate additional refrigerant needed based on line set length and system specifications.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["refrigerant charge calculator", "R410A charge", "R22 charge", "line set refrigerant", "HVAC refrigerant"],
  variants: [
    {
      id: "additional-charge",
      name: "Additional Charge for Line Set",
      description: "Calculate extra refrigerant for longer line sets",
      fields: [
        { name: "refrigerant", label: "Refrigerant Type", type: "select", options: [
          { label: "R-410A", value: "r410a" },
          { label: "R-22", value: "r22" },
          { label: "R-32", value: "r32" },
          { label: "R-134a", value: "r134a" },
          { label: "R-407C", value: "r407c" },
        ], defaultValue: "r410a" },
        { name: "lineSize", label: "Liquid Line Size (inches OD)", type: "select", options: [
          { label: "1/4 inch", value: "0.25" },
          { label: "3/8 inch", value: "0.375" },
          { label: "1/2 inch", value: "0.5" },
          { label: "5/8 inch", value: "0.625" },
        ], defaultValue: "0.375" },
        { name: "totalLength", label: "Total Line Set Length (ft)", type: "number", placeholder: "e.g. 50" },
        { name: "factoryCharge", label: "Factory Line Set Length (ft)", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
      ],
      calculate: (inputs) => {
        const refrigerant = inputs.refrigerant as string;
        const lineSize = inputs.lineSize as string;
        const totalLength = inputs.totalLength as number;
        const factoryCharge = inputs.factoryCharge as number;
        if (!totalLength || !factoryCharge) return null;
        const extraLength = Math.max(0, totalLength - factoryCharge);
        const ozPerFt: Record<string, Record<string, number>> = {
          "0.25": { r410a: 0.32, r22: 0.33, r32: 0.29, r134a: 0.34, r407c: 0.31 },
          "0.375": { r410a: 0.6, r22: 0.62, r32: 0.54, r134a: 0.64, r407c: 0.58 },
          "0.5": { r410a: 0.9, r22: 0.95, r32: 0.82, r134a: 0.97, r407c: 0.88 },
          "0.625": { r410a: 1.5, r22: 1.55, r32: 1.35, r134a: 1.6, r407c: 1.45 },
        };
        const rate = ozPerFt[lineSize]?.[refrigerant] || 0.6;
        const additionalOz = extraLength * rate;
        const additionalLbs = additionalOz / 16;
        return {
          primary: { label: "Additional Refrigerant Needed", value: `${formatNumber(additionalOz, 1)}` + " oz" },
          details: [
            { label: "Additional (lbs)", value: `${formatNumber(additionalLbs, 2)}` + " lbs" },
            { label: "Extra Line Length", value: `${formatNumber(extraLength, 0)}` + " ft" },
            { label: "Charge Rate", value: `${formatNumber(rate, 2)}` + " oz/ft" },
            { label: "Refrigerant Type", value: refrigerant.toUpperCase() },
          ],
        };
      },
    },
    {
      id: "subcooling",
      name: "Subcooling Check",
      description: "Check if subcooling is within target range",
      fields: [
        { name: "condensingTemp", label: "Condensing Temperature (F)", type: "number", placeholder: "e.g. 120" },
        { name: "liquidTemp", label: "Liquid Line Temperature (F)", type: "number", placeholder: "e.g. 110" },
        { name: "targetSubcool", label: "Target Subcooling (F)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const condensingTemp = inputs.condensingTemp as number;
        const liquidTemp = inputs.liquidTemp as number;
        const targetSubcool = inputs.targetSubcool as number;
        if (!condensingTemp || !liquidTemp || !targetSubcool) return null;
        const actualSubcool = condensingTemp - liquidTemp;
        const diff = actualSubcool - targetSubcool;
        let status = "Within range";
        if (diff > 3) status = "Overcharged - remove refrigerant";
        else if (diff < -3) status = "Undercharged - add refrigerant";
        return {
          primary: { label: "Actual Subcooling", value: `${formatNumber(actualSubcool, 1)}` + " F" },
          details: [
            { label: "Target Subcooling", value: `${formatNumber(targetSubcool, 1)}` + " F" },
            { label: "Difference from Target", value: `${formatNumber(diff, 1)}` + " F" },
            { label: "Status", value: status },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heat-pump-cop-calculator", "cooling-load-calculator", "air-handler-size-calculator"],
  faq: [
    { question: "How much refrigerant per foot of line set?", answer: "For R-410A with 3/8 inch liquid line, approximately 0.6 oz per foot of additional line beyond the factory charge length." },
    { question: "What is subcooling?", answer: "Subcooling is the temperature difference between the condensing temperature and the actual liquid line temperature. Target is typically 8-12F." },
  ],
  formula: "Additional Charge (oz) = Extra Length (ft) x Charge Rate (oz/ft) | Subcooling = Condensing Temp - Liquid Line Temp",
};