import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const toHz: Record<string, number> = {
  "Hz": 1,
  "kHz": 1e3,
  "MHz": 1e6,
  "GHz": 1e9,
  "rpm": 1 / 60,
};

const unitLabels: Record<string, string> = {
  "Hz": "Hertz",
  "kHz": "Kilohertz",
  "MHz": "Megahertz",
  "GHz": "Gigahertz",
  "rpm": "Revolutions per minute",
};

const unitOptions = Object.keys(toHz).map((u) => ({ label: `${unitLabels[u]} (${u})`, value: u }));

export const frequencyUnitConverter: CalculatorDefinition = {
  slug: "frequency-unit-converter",
  title: "Frequency Unit Converter",
  description: "Free frequency unit converter. Convert between Hz, kHz, MHz, GHz, and RPM instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["frequency", "hertz", "kilohertz", "megahertz", "gigahertz", "rpm", "converter"],
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
        const from = (inputs.from as string) || "Hz";
        const to = (inputs.to as string) || "kHz";
        if (!val) return null;
        const baseHz = val * toHz[from];
        const result = baseHz / toHz[to];
        const period = 1 / baseHz;
        return {
          primary: { label: `${formatNumber(val, 4)} ${from}`, value: `${formatNumber(result, 6)} ${to}` },
          details: [
            { label: "Base value (Hz)", value: formatNumber(baseHz, 6) },
            { label: "Period (seconds)", value: formatNumber(period, 10) },
            { label: "Wavelength in air (m)", value: formatNumber(343 / baseHz, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["power-unit-converter", "torque-unit-converter"],
  faq: [
    { question: "What is 1 GHz in MHz?", answer: "1 GHz equals 1,000 MHz." },
    { question: "How do I convert RPM to Hz?", answer: "Divide the RPM value by 60 to get the frequency in hertz." },
  ],
  formula: "result = value × (fromFactor / toFactor), where factors are relative to hertz (Hz). 1 rpm = 1/60 Hz.",
};
