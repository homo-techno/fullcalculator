import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const toWatts: Record<string, number> = {
  "W": 1,
  "kW": 1000,
  "HP": 745.7,
  "BTU/h": 0.29307107,
  "ft-lb/s": 1.35582,
};

const unitLabels: Record<string, string> = {
  "W": "Watts",
  "kW": "Kilowatts",
  "HP": "Horsepower",
  "BTU/h": "BTU per hour",
  "ft-lb/s": "Foot-pounds per second",
};

const unitOptions = Object.keys(toWatts).map((u) => ({ label: `${unitLabels[u]} (${u})`, value: u }));

export const powerUnitConverter: CalculatorDefinition = {
  slug: "power-unit-converter",
  title: "Power Unit Converter",
  description: "Free power unit converter. Convert between watts, kilowatts, horsepower, BTU/h, and foot-pounds per second.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["power", "watts", "kilowatts", "horsepower", "BTU", "converter"],
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
        const from = (inputs.from as string) || "W";
        const to = (inputs.to as string) || "kW";
        if (!val) return null;
        const baseWatts = val * toWatts[from];
        const result = baseWatts / toWatts[to];
        return {
          primary: { label: `${formatNumber(val, 4)} ${from}`, value: `${formatNumber(result, 6)} ${to}` },
          details: [
            { label: "Base value (W)", value: formatNumber(baseWatts, 6) },
            { label: "Conversion factor (from → W)", value: String(toWatts[from]) },
            { label: "Conversion factor (W → to)", value: formatNumber(1 / toWatts[to], 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["torque-unit-converter", "frequency-unit-converter"],
  faq: [
    { question: "How many watts are in one horsepower?", answer: "One mechanical horsepower equals approximately 745.7 watts." },
    { question: "What is BTU/h?", answer: "BTU per hour is a unit of power commonly used in HVAC systems. 1 BTU/h ≈ 0.293 W." },
  ],
  formula: "result = value × (fromFactor / toFactor), where factors are relative to watts (W).",
};
