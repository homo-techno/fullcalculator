import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const horsepowerCalculator: CalculatorDefinition = {
  slug: "horsepower-calculator",
  title: "Horsepower Calculator",
  description: "Free horsepower calculator. Calculate engine horsepower from torque and RPM, or convert between HP, kW, and PS.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["horsepower calculator", "hp calculator", "torque to hp", "engine horsepower", "kw to hp"],
  variants: [
    {
      id: "fromTorque",
      name: "HP from Torque & RPM",
      fields: [
        { name: "torque", label: "Torque (lb-ft)", type: "number", placeholder: "e.g. 300" },
        { name: "rpm", label: "RPM", type: "number", placeholder: "e.g. 5000" },
      ],
      calculate: (inputs) => {
        const torque = inputs.torque as number, rpm = inputs.rpm as number;
        if (!torque || !rpm) return null;
        const hp = (torque * rpm) / 5252;
        return {
          primary: { label: "Horsepower", value: `${formatNumber(hp, 2)} HP` },
          details: [
            { label: "Kilowatts", value: `${formatNumber(hp * 0.7457, 2)} kW` },
            { label: "PS (metric HP)", value: `${formatNumber(hp * 1.01387, 2)} PS` },
            { label: "Torque", value: `${torque} lb-ft` },
            { label: "RPM", value: formatNumber(rpm, 0) },
          ],
        };
      },
    },
    {
      id: "convert",
      name: "Convert Power Units",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 200" },
        {
          name: "from", label: "From Unit", type: "select",
          options: [
            { label: "HP (mechanical)", value: "hp" },
            { label: "kW", value: "kw" },
            { label: "PS (metric HP)", value: "ps" },
            { label: "Watts", value: "w" },
          ],
        },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number, from = (inputs.from as string) || "hp";
        if (!val) return null;
        const toKw: Record<string, number> = { hp: 0.7457, kw: 1, ps: 0.7355, w: 0.001 };
        const kw = val * (toKw[from] || 1);
        return {
          primary: { label: "Conversions", value: `${formatNumber(kw, 4)} kW` },
          details: [
            { label: "HP (mechanical)", value: formatNumber(kw / 0.7457, 4) },
            { label: "kW", value: formatNumber(kw, 4) },
            { label: "PS (metric)", value: formatNumber(kw / 0.7355, 4) },
            { label: "Watts", value: formatNumber(kw * 1000, 2) },
            { label: "BTU/hr", value: formatNumber(kw * 3412.14, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["force-calculator", "energy-calculator", "speed-calculator"],
  faq: [{ question: "How is horsepower calculated?", answer: "HP = (Torque × RPM) / 5252. One horsepower equals 745.7 watts or 33,000 ft-lbs of work per minute. Metric horsepower (PS) is slightly different: 1 HP = 1.01387 PS." }],
  formula: "HP = (Torque × RPM) / 5252 | 1 HP = 745.7 W",
};
