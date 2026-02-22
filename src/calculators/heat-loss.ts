import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heatLossCalculator: CalculatorDefinition = {
  slug: "heat-loss-calculator",
  title: "Heat Loss Calculator",
  description: "Free heat loss calculator. Estimate building heat load based on area, insulation, windows, and temperature difference for HVAC sizing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["heat loss calculator", "building heat load", "BTU heat loss", "heating load calculator", "HVAC sizing", "insulation heat loss"],
  variants: [
    {
      id: "simplified",
      name: "Simplified Heat Loss",
      description: "Quick estimate based on area and insulation level",
      fields: [
        { name: "area", label: "Floor Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "insulation", label: "Insulation Level", type: "select", options: [
          { label: "Poor (older home, no insulation)", value: "poor" },
          { label: "Average (some insulation)", value: "average" },
          { label: "Good (well-insulated)", value: "good" },
          { label: "Excellent (modern, high R-value)", value: "excellent" },
        ], defaultValue: "average" },
        { name: "tempDiff", label: "Design Temp Difference (F)", type: "number", placeholder: "e.g. 60" },
        { name: "windowPercent", label: "Window Area (% of wall)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const ceilingHeight = inputs.ceilingHeight as number;
        const insulation = inputs.insulation as string;
        const tempDiff = inputs.tempDiff as number;
        const windowPercent = inputs.windowPercent as number;
        if (!area || !ceilingHeight || !tempDiff) return null;
        const uFactors: Record<string, number> = { poor: 0.25, average: 0.15, good: 0.08, excellent: 0.04 };
        const uWall = uFactors[insulation] || 0.15;
        const uWindow = 0.5;
        const uCeiling = uWall * 0.8;
        const uFloor = uWall * 0.6;
        const perimeter = 4 * Math.sqrt(area);
        const wallArea = perimeter * ceilingHeight;
        const windowArea = wallArea * ((windowPercent || 15) / 100);
        const netWallArea = wallArea - windowArea;
        const wallLoss = netWallArea * uWall * tempDiff;
        const windowLoss = windowArea * uWindow * tempDiff;
        const ceilingLoss = area * uCeiling * tempDiff;
        const floorLoss = area * uFloor * tempDiff;
        const infiltration = 0.018 * area * ceilingHeight * tempDiff * 0.5;
        const totalBtu = wallLoss + windowLoss + ceilingLoss + floorLoss + infiltration;
        const totalKw = totalBtu / 3412;
        const tonnage = totalBtu / 12000;
        return {
          primary: { label: "Total Heat Loss", value: `${formatNumber(totalBtu, 0)}` + " BTU/hr" },
          details: [
            { label: "Wall Loss", value: `${formatNumber(wallLoss, 0)}` + " BTU/hr" },
            { label: "Window Loss", value: `${formatNumber(windowLoss, 0)}` + " BTU/hr" },
            { label: "Ceiling Loss", value: `${formatNumber(ceilingLoss, 0)}` + " BTU/hr" },
            { label: "Floor Loss", value: `${formatNumber(floorLoss, 0)}` + " BTU/hr" },
            { label: "Infiltration Loss", value: `${formatNumber(infiltration, 0)}` + " BTU/hr" },
            { label: "Equivalent kW", value: `${formatNumber(totalKw, 2)}` + " kW" },
            { label: "Equivalent Tons", value: `${formatNumber(tonnage, 2)}` + " tons" },
          ],
        };
      },
    },
    {
      id: "per-component",
      name: "Component-Based Heat Loss",
      description: "Calculate heat loss for a specific building component",
      fields: [
        { name: "componentArea", label: "Component Area (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "rValue", label: "R-Value of Component", type: "number", placeholder: "e.g. 19" },
        { name: "tempDiff", label: "Temperature Difference (F)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const componentArea = inputs.componentArea as number;
        const rValue = inputs.rValue as number;
        const tempDiff = inputs.tempDiff as number;
        if (!componentArea || !rValue || !tempDiff) return null;
        const uValue = 1 / rValue;
        const heatLoss = componentArea * uValue * tempDiff;
        const heatLossKw = heatLoss / 3412;
        return {
          primary: { label: "Component Heat Loss", value: `${formatNumber(heatLoss, 0)}` + " BTU/hr" },
          details: [
            { label: "U-Value", value: `${formatNumber(uValue, 4)}` + " BTU/(hr*ft2*F)" },
            { label: "Heat Flux", value: `${formatNumber(heatLoss / componentArea, 2)}` + " BTU/(hr*ft2)" },
            { label: "Equivalent kW", value: `${formatNumber(heatLossKw, 3)}` + " kW" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cooling-load-calculator", "boiler-size-calculator", "thermal-resistance-calculator"],
  faq: [
    { question: "What is design temperature difference?", answer: "It is the difference between your desired indoor temperature (typically 70F) and the coldest expected outdoor temperature for your location." },
    { question: "How does insulation affect heat loss?", answer: "Better insulation (higher R-value) dramatically reduces heat loss. Doubling the R-value cuts heat loss through that component in half." },
    { question: "Why is infiltration included?", answer: "Air infiltration through cracks and openings can account for 25-40% of total heat loss in older homes." },
  ],
  formula: "Q = U x A x DeltaT | U = 1/R | Q_total = Q_walls + Q_windows + Q_ceiling + Q_floor + Q_infiltration",
};