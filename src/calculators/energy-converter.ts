import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const energyUnits: Record<string, number> = {
  J: 1, kJ: 1000, cal: 4.184, kcal: 4184, Wh: 3600, kWh: 3600000,
  BTU: 1055.06, eV: 1.602e-19, ftlb: 1.35582, erg: 1e-7,
};
const unitLabels: Record<string, string> = {
  J: "Joules", kJ: "Kilojoules", cal: "Calories", kcal: "Kilocalories (food Cal)",
  Wh: "Watt-hours", kWh: "Kilowatt-hours", BTU: "BTU", eV: "Electron-volts",
  ftlb: "Foot-pounds", erg: "Ergs",
};

export const energyConverter: CalculatorDefinition = {
  slug: "energy-converter",
  title: "Energy Converter",
  description: "Free energy unit converter. Convert between joules, calories, BTU, kWh, eV, and other energy units.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["energy converter", "joules to calories", "btu to kWh", "energy unit conversion", "calorie to joule"],
  variants: [
    {
      id: "convert",
      name: "Convert Energy",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 1000" },
        { name: "from", label: "From", type: "select", options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })) },
        { name: "to", label: "To", type: "select", options: Object.entries(unitLabels).map(([v, l]) => ({ label: l, value: v })) },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "kJ";
        const to = (inputs.to as string) || "kcal";
        if (!val) return null;
        const joules = val * (energyUnits[from] || 1);
        const result = joules / (energyUnits[to] || 1);
        return {
          primary: { label: `${val} ${unitLabels[from]}`, value: `${formatNumber(result, 6)} ${unitLabels[to]}` },
          details: [
            { label: "Joules", value: formatNumber(joules, 6) },
            { label: "Calories", value: formatNumber(joules / 4.184, 4) },
            { label: "kWh", value: formatNumber(joules / 3600000, 6) },
            { label: "BTU", value: formatNumber(joules / 1055.06, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["energy-calculator", "unit-converter", "specific-heat-calculator"],
  faq: [{ question: "How do I convert between energy units?", answer: "1 calorie = 4.184 joules. 1 food Calorie (kcal) = 4,184 joules. 1 kWh = 3,600,000 joules. 1 BTU = 1,055 joules." }],
  formula: "1 cal = 4.184 J | 1 kWh = 3.6 MJ | 1 BTU = 1055 J",
};
