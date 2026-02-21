import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const toPaS: Record<string, number> = {
  "Pa·s": 1,
  "cP": 0.001,        // centipoise: 1 cP = 0.001 Pa·s
  "P": 0.1,           // poise: 1 P = 0.1 Pa·s
  "lb/(ft·s)": 1.48816, // 1 lb/(ft·s) ≈ 1.48816 Pa·s
};

const unitLabels: Record<string, string> = {
  "Pa·s": "Pascal-seconds",
  "cP": "Centipoise",
  "P": "Poise",
  "lb/(ft·s)": "Pounds per foot-second",
};

const unitOptions = Object.keys(toPaS).map((u) => ({ label: `${unitLabels[u]} (${u})`, value: u }));

export const viscosityConverter: CalculatorDefinition = {
  slug: "viscosity-converter",
  title: "Viscosity Converter",
  description: "Free viscosity converter. Convert between Pa·s, centipoise, poise, and lb/(ft·s) for dynamic viscosity.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["viscosity", "pascal-second", "centipoise", "poise", "dynamic viscosity", "converter"],
  variants: [
    {
      id: "convert",
      name: "Convert",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 1" },
        { name: "from", label: "From", type: "select", options: unitOptions },
        { name: "to", label: "To", type: "select", options: unitOptions },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "Pa·s";
        const to = (inputs.to as string) || "cP";
        if (!val) return null;
        const basePaS = val * toPaS[from];
        const result = basePaS / toPaS[to];
        return {
          primary: { label: `${formatNumber(val, 4)} ${from}`, value: `${formatNumber(result, 6)} ${to}` },
          details: [
            { label: "Base value (Pa·s)", value: formatNumber(basePaS, 8) },
            { label: "Equivalent (cP)", value: formatNumber(basePaS / 0.001, 6) },
            { label: "Equivalent (P)", value: formatNumber(basePaS / 0.1, 6) },
            { label: "Reference: Water at 20°C", value: "≈ 1.002 cP" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["density-unit-converter", "power-unit-converter"],
  faq: [
    { question: "What is viscosity?", answer: "Dynamic viscosity measures a fluid's resistance to flow. Higher viscosity means thicker, slower-flowing fluid." },
    { question: "How many centipoise in 1 Pa·s?", answer: "1 Pa·s equals 1,000 centipoise (cP)." },
  ],
  formula: "result = value × (fromFactor / toFactor), where factors are relative to Pascal-seconds (Pa·s). 1 Pa·s = 1000 cP = 10 P.",
};
