import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const thermalResistanceCalculator: CalculatorDefinition = {
  slug: "thermal-resistance-calculator",
  title: "Thermal Resistance (R-value) Calculator",
  description: "Free thermal resistance calculator. Calculate R-value for insulation layers, composite walls, and building assemblies.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["R-value calculator", "thermal resistance", "insulation R-value", "U-value calculator", "building insulation"],
  variants: [
    {
      id: "single-layer",
      name: "Single Layer R-value",
      description: "Calculate R-value from material thickness and conductivity",
      fields: [
        { name: "thickness", label: "Thickness (inches)", type: "number", placeholder: "e.g. 3.5" },
        { name: "material", label: "Material", type: "select", options: [
          { label: "Fiberglass Batt (R-3.2/in)", value: "3.2" },
          { label: "Cellulose (R-3.7/in)", value: "3.7" },
          { label: "Spray Foam Open Cell (R-3.6/in)", value: "3.6" },
          { label: "Spray Foam Closed Cell (R-6.5/in)", value: "6.5" },
          { label: "Rigid Foam XPS (R-5.0/in)", value: "5.0" },
          { label: "Rigid Foam Polyiso (R-6.0/in)", value: "6.0" },
          { label: "Mineral Wool (R-3.3/in)", value: "3.3" },
          { label: "Plywood (R-1.25/in)", value: "1.25" },
          { label: "Concrete (R-0.08/in)", value: "0.08" },
          { label: "Brick (R-0.2/in)", value: "0.2" },
        ], defaultValue: "3.2" },
      ],
      calculate: (inputs) => {
        const thickness = inputs.thickness as number;
        const rPerInch = parseFloat(inputs.material as string);
        if (!thickness || !rPerInch) return null;
        const rValue = thickness * rPerInch;
        const uValue = 1 / rValue;
        const rsi = rValue * 0.1761;
        return {
          primary: { label: "R-Value", value: `${formatNumber(rValue, 2)}` },
          details: [
            { label: "U-Value", value: `${formatNumber(uValue, 4)}` + " BTU/(hr*ft2*F)" },
            { label: "RSI (metric)", value: `${formatNumber(rsi, 3)}` + " m2*K/W" },
            { label: "Thickness", value: `${formatNumber(thickness, 2)}` + " inches" },
            { label: "R per Inch", value: `${formatNumber(rPerInch, 2)}` },
          ],
        };
      },
    },
    {
      id: "composite",
      name: "Composite Wall R-value",
      description: "Add up R-values for a wall assembly",
      fields: [
        { name: "rExteriorFilm", label: "Exterior Air Film R-value", type: "number", placeholder: "e.g. 0.17", defaultValue: 0.17 },
        { name: "rSheathing", label: "Sheathing R-value", type: "number", placeholder: "e.g. 0.62", defaultValue: 0.62 },
        { name: "rInsulation", label: "Insulation R-value", type: "number", placeholder: "e.g. 13" },
        { name: "rDrywall", label: "Interior Finish R-value", type: "number", placeholder: "e.g. 0.45", defaultValue: 0.45 },
        { name: "rInteriorFilm", label: "Interior Air Film R-value", type: "number", placeholder: "e.g. 0.68", defaultValue: 0.68 },
      ],
      calculate: (inputs) => {
        const rExt = inputs.rExteriorFilm as number;
        const rSheath = inputs.rSheathing as number;
        const rInsul = inputs.rInsulation as number;
        const rDry = inputs.rDrywall as number;
        const rInt = inputs.rInteriorFilm as number;
        if (!rInsul) return null;
        const totalR = (rExt || 0) + (rSheath || 0) + rInsul + (rDry || 0) + (rInt || 0);
        const uValue = 1 / totalR;
        return {
          primary: { label: "Total Wall R-Value", value: `${formatNumber(totalR, 2)}` },
          details: [
            { label: "U-Value", value: `${formatNumber(uValue, 4)}` },
            { label: "Exterior Film", value: "R-" + `${formatNumber(rExt || 0, 2)}` },
            { label: "Sheathing", value: "R-" + `${formatNumber(rSheath || 0, 2)}` },
            { label: "Insulation", value: "R-" + `${formatNumber(rInsul, 2)}` },
            { label: "Interior Finish", value: "R-" + `${formatNumber(rDry || 0, 2)}` },
            { label: "Interior Film", value: "R-" + `${formatNumber(rInt || 0, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heat-loss-calculator", "cooling-load-calculator", "boiler-size-calculator"],
  faq: [
    { question: "What is R-value?", answer: "R-value measures thermal resistance - how well a material resists heat flow. Higher R-value means better insulation. R-values are additive for layers in series." },
    { question: "What R-value do I need?", answer: "It depends on climate zone and location in the building. Walls typically need R-13 to R-21, attics R-30 to R-60, and floors R-13 to R-30. Check local energy codes." },
  ],
  formula: "R = Thickness x R-per-inch | R_total = R1 + R2 + ... | U = 1/R",
};