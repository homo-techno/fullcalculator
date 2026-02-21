import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const toSievert: Record<string, number> = {
  "Sv": 1,
  "mSv": 0.001,
  "rem": 0.01,
  "mrem": 0.00001,
  "Gy": 1,       // Gray (absorbed dose; 1 Gy = 1 Sv for gamma/beta)
  "rad": 0.01,   // 1 rad = 0.01 Gy = 0.01 Sv
};

const unitLabels: Record<string, string> = {
  "Sv": "Sievert",
  "mSv": "Millisievert",
  "rem": "Rem",
  "mrem": "Millirem",
  "Gy": "Gray",
  "rad": "Rad",
};

const unitOptions = Object.keys(toSievert).map((u) => ({ label: `${unitLabels[u]} (${u})`, value: u }));

export const radiationDoseConverter: CalculatorDefinition = {
  slug: "radiation-dose-converter",
  title: "Radiation Dose Converter",
  description: "Free radiation dose converter. Convert between Sievert, millisievert, rem, millirem, Gray, and rad.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["radiation", "dose", "sievert", "rem", "gray", "rad", "converter"],
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
        const from = (inputs.from as string) || "Sv";
        const to = (inputs.to as string) || "mSv";
        if (!val) return null;
        const baseSv = val * toSievert[from];
        const result = baseSv / toSievert[to];
        return {
          primary: { label: `${formatNumber(val, 4)} ${from}`, value: `${formatNumber(result, 6)} ${to}` },
          details: [
            { label: "Base value (Sv)", value: formatNumber(baseSv, 8) },
            { label: "Equivalent (mSv)", value: formatNumber(baseSv * 1000, 6) },
            { label: "Equivalent (rem)", value: formatNumber(baseSv / 0.01, 6) },
            { label: "Note", value: "Gray-to-Sievert assumes radiation weighting factor of 1 (gamma/beta)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["density-unit-converter", "frequency-unit-converter"],
  faq: [
    { question: "What is the difference between Sievert and Gray?", answer: "Gray measures absorbed dose, while Sievert measures equivalent dose accounting for radiation type. For gamma and beta radiation, 1 Gy = 1 Sv." },
    { question: "How many rem are in 1 Sievert?", answer: "1 Sievert equals 100 rem." },
  ],
  formula: "result = value × (fromFactor / toFactor), where factors are relative to Sievert (Sv). 1 Sv = 100 rem. 1 Gy = 1 Sv (for gamma/beta).",
};
