import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const clampPressureCalculator: CalculatorDefinition = {
  slug: "clamp-pressure-calculator",
  title: "Clamping Pressure Calculator",
  description: "Free clamping pressure calculator. Determine the number of clamps needed and proper spacing for strong glue joints in woodworking.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["clamp pressure calculator", "clamping force calculator", "glue joint pressure", "number of clamps", "clamp spacing"],
  variants: [
    {
      id: "edge-gluing",
      name: "Edge Gluing Clamp Setup",
      description: "Calculate clamps needed for edge-to-edge glue-ups",
      fields: [
        { name: "panelLength", label: "Panel Length (inches)", type: "number", placeholder: "e.g. 48" },
        { name: "panelWidth", label: "Panel Width (inches)", type: "number", placeholder: "e.g. 24" },
        {
          name: "woodType",
          label: "Wood Type",
          type: "select",
          options: [
            { label: "Softwood (100-150 psi needed)", value: "125" },
            { label: "Medium Hardwood (150-200 psi needed)", value: "175" },
            { label: "Dense Hardwood (200-250 psi needed)", value: "225" },
          ],
        },
        {
          name: "clampType",
          label: "Clamp Type",
          type: "select",
          options: [
            { label: "Pipe Clamp (1000 lbs max)", value: "1000" },
            { label: "F-Clamp / Bar Clamp (600 lbs max)", value: "600" },
            { label: "Parallel Jaw Clamp (1200 lbs max)", value: "1200" },
            { label: "Spring Clamp (50 lbs max)", value: "50" },
            { label: "Hand Screw Clamp (400 lbs max)", value: "400" },
          ],
        },
        { name: "clampSpacing", label: "Max Clamp Spacing (inches)", type: "number", placeholder: "e.g. 8" },
      ],
      calculate: (inputs) => {
        const panelLength = inputs.panelLength as number;
        const panelWidth = inputs.panelWidth as number;
        const requiredPSI = parseFloat(inputs.woodType as string);
        const clampForce = parseFloat(inputs.clampType as string);
        const maxSpacing = inputs.clampSpacing as number;
        if (!panelLength || !panelWidth || !requiredPSI || !clampForce) return null;
        const spacing = maxSpacing || 8;
        const glueArea = panelLength * panelWidth;
        const totalForceNeeded = glueArea * requiredPSI;
        const numClampsByForce = Math.ceil(totalForceNeeded / clampForce);
        const numClampsBySpacing = Math.ceil(panelLength / spacing) + 1;
        const numClamps = Math.max(numClampsByForce, numClampsBySpacing);
        const actualSpacing = panelLength / (numClamps - 1);
        const actualPressure = (numClamps * clampForce) / glueArea;
        const totalForceApplied = numClamps * clampForce;
        return {
          primary: { label: "Clamps Needed", value: formatNumber(numClamps, 0) },
          details: [
            { label: "Clamp Spacing", value: `${formatNumber(actualSpacing, 1)} inches` },
            { label: "Actual Pressure", value: `${formatNumber(actualPressure, 0)} psi` },
            { label: "Required Pressure", value: `${formatNumber(requiredPSI, 0)} psi` },
            { label: "Total Force Applied", value: `${formatNumber(totalForceApplied, 0)} lbs` },
            { label: "Total Force Needed", value: `${formatNumber(totalForceNeeded, 0)} lbs` },
            { label: "Glue Area", value: `${formatNumber(glueArea, 0)} sq inches` },
            { label: "Force per Clamp", value: `${formatNumber(clampForce, 0)} lbs` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["board-footage-calculator", "dowel-spacing-calculator", "tenon-size-calculator"],
  faq: [
    { question: "How much clamping pressure is needed?", answer: "Softwoods need 100-150 psi, medium hardwoods 150-200 psi, and dense hardwoods 200-250 psi. Too much pressure squeezes out too much glue, creating a starved joint." },
    { question: "How far apart should clamps be?", answer: "Place clamps every 6-8 inches for a good edge joint. Alternate clamps above and below the panel to prevent bowing. Ensure even pressure across the entire glue line." },
  ],
  formula: "Clamps = max(Total Force / Force per Clamp, Length / Spacing + 1) | Total Force = Area x Required PSI",
};
