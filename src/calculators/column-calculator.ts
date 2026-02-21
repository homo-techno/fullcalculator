import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const columnCalculator: CalculatorDefinition = {
  slug: "column-calculator",
  title: "Column Load Calculator",
  description: "Free column load calculator. Calculate the load capacity of wood, steel, and concrete columns based on dimensions, material, and unbraced length.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["column calculator", "column load capacity", "column sizing calculator", "structural column calculator", "post load calculator"],
  variants: [
    {
      id: "wood-column",
      name: "Wood Column Capacity",
      description: "Calculate the load capacity of a wood post or column",
      fields: [
        { name: "columnSize", label: "Column Size (nominal)", type: "select", options: [
          { label: "4×4 (3.5\" × 3.5\")", value: "3.5" },
          { label: "4×6 (3.5\" × 5.5\")", value: "4.5" },
          { label: "6×6 (5.5\" × 5.5\")", value: "5.5" },
          { label: "6×8 (5.5\" × 7.5\")", value: "6.5" },
          { label: "8×8 (7.5\" × 7.5\")", value: "7.5" },
        ], defaultValue: "5.5" },
        { name: "height", label: "Column Height / Unbraced Length (feet)", type: "number", placeholder: "e.g. 8" },
        { name: "species", label: "Wood Species", type: "select", options: [
          { label: "Douglas Fir-Larch (#2)", value: "1350" },
          { label: "Southern Pine (#2)", value: "1300" },
          { label: "Hem-Fir (#2)", value: "1100" },
          { label: "Spruce-Pine-Fir (#2)", value: "1050" },
          { label: "Cedar (#2)", value: "900" },
        ], defaultValue: "1350" },
      ],
      calculate: (inputs) => {
        const dimStr = inputs.columnSize as string;
        const dim = parseFloat(dimStr) || 5.5;
        const height = inputs.height as number;
        const fc = parseInt(inputs.species as string) || 1350;
        if (!height) return null;

        // Simplified NDS column calculation
        // For square columns, both dimensions are the same
        // For rectangular, use the actual dimension from the select
        let b: number, d: number;
        if (dim === 3.5) { b = 3.5; d = 3.5; }
        else if (dim === 4.5) { b = 3.5; d = 5.5; }
        else if (dim === 5.5) { b = 5.5; d = 5.5; }
        else if (dim === 6.5) { b = 5.5; d = 7.5; }
        else { b = 7.5; d = 7.5; }

        const area = b * d;
        const leastDim = Math.min(b, d);
        const heightIn = height * 12;
        const slendernessRatio = heightIn / leastDim;

        // Euler's critical stress (simplified)
        const E = 1600000; // psi for #2 lumber (approximate)
        const Emin = E * 0.58; // Adjusted modulus
        const FcE = (0.822 * Emin) / (slendernessRatio * slendernessRatio);

        // Column stability factor
        const ratio = FcE / fc;
        const c = 0.8; // sawn lumber
        const Cp = (1 + ratio) / (2 * c) - Math.sqrt(Math.pow((1 + ratio) / (2 * c), 2) - ratio / c);

        const allowableLoad = fc * Cp * area;

        const maxSlenderness = 50;
        const maxHeight = (maxSlenderness * leastDim) / 12;

        return {
          primary: { label: "Allowable Load", value: `${formatNumber(allowableLoad, 0)} lbs` },
          details: [
            { label: "Cross-section area", value: `${formatNumber(area, 2)} sq in` },
            { label: "Slenderness ratio (L/d)", value: `${formatNumber(slendernessRatio, 1)}` },
            { label: "Column stability factor (Cp)", value: `${formatNumber(Cp, 3)}` },
            { label: "Adjusted Fc", value: `${formatNumber(fc * Cp, 0)} psi` },
            { label: "Max recommended height", value: `${formatNumber(maxHeight, 1)} ft (L/d = 50)` },
            { label: "Status", value: slendernessRatio <= 50 ? "Acceptable" : "Exceeds L/d limit of 50" },
          ],
          note: "Based on NDS simplified column formula. This is an estimate only. Actual capacity depends on grade, moisture, load duration, and connection details. Always consult a structural engineer for critical applications.",
        };
      },
    },
    {
      id: "tributary-load",
      name: "Column Tributary Load",
      description: "Calculate the load a column must support based on tributary area",
      fields: [
        { name: "tributaryLength", label: "Tributary Length (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "tributaryWidth", label: "Tributary Width (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "stories", label: "Number of Stories Supported", type: "select", options: [
          { label: "1 Story (roof only)", value: "1" },
          { label: "2 Stories (1 floor + roof)", value: "2" },
          { label: "3 Stories (2 floors + roof)", value: "3" },
        ], defaultValue: "1" },
        { name: "roofLoad", label: "Roof Load (PSF)", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "floorLoad", label: "Floor Load (PSF)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const tributaryLength = inputs.tributaryLength as number;
        const tributaryWidth = inputs.tributaryWidth as number;
        const stories = parseInt(inputs.stories as string) || 1;
        const roofLoad = (inputs.roofLoad as number) || 40;
        const floorLoad = (inputs.floorLoad as number) || 50;
        if (!tributaryLength || !tributaryWidth) return null;

        const tributaryArea = tributaryLength * tributaryWidth;
        const roofTotalLoad = tributaryArea * roofLoad;
        const floorTotalLoad = tributaryArea * floorLoad;
        const floorsSupported = Math.max(stories - 1, 0);
        const totalLoad = roofTotalLoad + floorsSupported * floorTotalLoad;

        // Add self-weight of column (estimate)
        const columnWeight = stories * 8 * 10; // rough estimate
        const totalWithSelfWeight = totalLoad + columnWeight;

        return {
          primary: { label: "Total Column Load", value: `${formatNumber(totalWithSelfWeight, 0)} lbs` },
          details: [
            { label: "Tributary area", value: `${formatNumber(tributaryArea, 0)} sq ft` },
            { label: "Roof load", value: `${formatNumber(roofTotalLoad, 0)} lbs (${roofLoad} PSF)` },
            { label: "Floor load (per story)", value: `${formatNumber(floorTotalLoad, 0)} lbs (${floorLoad} PSF)` },
            { label: "Floors supported", value: `${floorsSupported}` },
            { label: "Column self-weight (est.)", value: `${formatNumber(columnWeight, 0)} lbs` },
            { label: "Total design load", value: `${formatNumber(totalWithSelfWeight, 0)} lbs` },
          ],
          note: "Roof loads include dead load + live load (snow). Floor loads include dead load + live load (40 PSF residential). Consult local codes for specific load requirements. Seismic and wind loads require separate analysis.",
        };
      },
    },
  ],
  relatedSlugs: ["beam-size-calculator", "footing-calculator", "joist-span-calculator"],
  faq: [
    { question: "How much weight can a 4x4 post support?", answer: "A standard 8-foot 4×4 (3.5\"×3.5\") Douglas Fir #2 post can support approximately 6,000-7,000 lbs axially. Capacity decreases with height: a 12-foot 4×4 supports roughly 3,500-4,500 lbs. A 6×6 post approximately doubles the 4×4 capacity." },
    { question: "How do I calculate column load?", answer: "Column load = Tributary Area × Total Load Per Square Foot. Tributary area is the floor/roof area the column supports (typically half the span in each direction). Total load includes dead load (structure weight, ~10-15 PSF) plus live load (occupancy, 40 PSF residential; snow, 20-60 PSF)." },
  ],
  formula: "Allowable Load = Fc × Cp × Area | Cp = Column Stability Factor (NDS) | Tributary Load = Area × (Dead + Live Load)",
};
