import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const toKgM3: Record<string, number> = {
  "kg/m³": 1,
  "g/cm³": 1000,
  "g/mL": 1000,
  "lb/ft³": 16.0185,
  "lb/gal": 119.826,
};

const unitLabels: Record<string, string> = {
  "kg/m³": "Kilograms per cubic metre",
  "g/cm³": "Grams per cubic centimetre",
  "g/mL": "Grams per millilitre",
  "lb/ft³": "Pounds per cubic foot",
  "lb/gal": "Pounds per gallon (US)",
};

const unitOptions = Object.keys(toKgM3).map((u) => ({ label: `${unitLabels[u]} (${u})`, value: u }));

export const densityUnitConverter: CalculatorDefinition = {
  slug: "density-unit-converter",
  title: "Density Unit Converter",
  description: "Free density unit converter. Convert between kg/m³, g/cm³, g/mL, lb/ft³, and lb/gal instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["density", "kg/m³", "g/cm³", "lb/ft³", "lb/gal", "converter"],
  variants: [
    {
      id: "convert",
      name: "Convert",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 1000" },
        { name: "from", label: "From", type: "select", options: unitOptions },
        { name: "to", label: "To", type: "select", options: unitOptions },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "kg/m³";
        const to = (inputs.to as string) || "g/cm³";
        if (!val) return null;
        const baseKgM3 = val * toKgM3[from];
        const result = baseKgM3 / toKgM3[to];
        return {
          primary: { label: `${formatNumber(val, 4)} ${from}`, value: `${formatNumber(result, 6)} ${to}` },
          details: [
            { label: "Base value (kg/m³)", value: formatNumber(baseKgM3, 6) },
            { label: "Reference: Water", value: "1000 kg/m³ = 1 g/cm³" },
            { label: "Reference: Air at STP", value: "≈ 1.225 kg/m³" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["viscosity-converter", "torque-unit-converter"],
  faq: [
    { question: "What is the density of water?", answer: "Water has a density of approximately 1000 kg/m³ or 1 g/cm³ at 4°C." },
    { question: "Are g/cm³ and g/mL the same?", answer: "Yes, 1 cm³ = 1 mL, so g/cm³ and g/mL are numerically equivalent." },
  ],
  formula: "result = value × (fromFactor / toFactor), where factors are relative to kg/m³. 1 g/cm³ = 1000 kg/m³.",
};
