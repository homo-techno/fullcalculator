import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const toNm: Record<string, number> = {
  "Nm": 1,
  "ft-lb": 1.35582,
  "in-lb": 0.112985,
  "kgf-m": 9.80665,
};

const unitLabels: Record<string, string> = {
  "Nm": "Newton-metres",
  "ft-lb": "Foot-pounds",
  "in-lb": "Inch-pounds",
  "kgf-m": "Kilogram-force metres",
};

const unitOptions = Object.keys(toNm).map((u) => ({ label: `${unitLabels[u]} (${u})`, value: u }));

export const torqueUnitConverter: CalculatorDefinition = {
  slug: "torque-unit-converter",
  title: "Torque Unit Converter",
  description: "Free torque unit converter. Convert between Newton-metres, foot-pounds, inch-pounds, and kilogram-force metres instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["torque", "newton-metre", "foot-pound", "inch-pound", "kgf-m", "converter"],
  variants: [
    {
      id: "convert",
      name: "Convert",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 100" },
        { name: "from", label: "From", type: "select", options: unitOptions },
        { name: "to", label: "To", type: "select", options: unitOptions },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "Nm";
        const to = (inputs.to as string) || "ft-lb";
        if (!val) return null;
        const baseNm = val * toNm[from];
        const result = baseNm / toNm[to];
        return {
          primary: { label: `${formatNumber(val, 4)} ${from}`, value: `${formatNumber(result, 6)} ${to}` },
          details: [
            { label: "Base value (Nm)", value: formatNumber(baseNm, 6) },
            { label: "Conversion factor (from → Nm)", value: String(toNm[from]) },
            { label: "Conversion factor (Nm → to)", value: formatNumber(1 / toNm[to], 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["power-unit-converter", "frequency-unit-converter"],
  faq: [
    { question: "How do I convert Nm to ft-lb?", answer: "Multiply the Newton-metre value by 0.7376 to get foot-pounds. This converter handles it automatically." },
    { question: "What is the base unit for torque?", answer: "The SI base unit for torque is the Newton-metre (Nm)." },
  ],
  formula: "result = value × (fromFactor / toFactor), where factors are relative to Newton-metres (Nm).",
};
