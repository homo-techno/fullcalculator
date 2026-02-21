import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const decibelCalculator: CalculatorDefinition = {
  slug: "decibel-calculator",
  title: "Decibel (dB) Calculator",
  description:
    "Free decibel calculator. Convert between dB and power/voltage ratios. Add and subtract dB values. Calculate dBm, dBW, and dBV.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "decibel calculator",
    "dB calculator",
    "dBm calculator",
    "power ratio dB",
    "voltage ratio dB",
    "decibel conversion",
  ],
  variants: [
    {
      id: "power-ratio",
      name: "Power Ratio to dB",
      description: "dB = 10 × log₁₀(P2/P1)",
      fields: [
        {
          name: "p1",
          label: "Input Power P1",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "p2",
          label: "Output Power P2",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "unit",
          label: "Power Unit",
          type: "select",
          options: [
            { label: "Watts (W)", value: "W" },
            { label: "Milliwatts (mW)", value: "mW" },
            { label: "Microwatts (µW)", value: "uW" },
          ],
          defaultValue: "W",
        },
      ],
      calculate: (inputs) => {
        const p1 = inputs.p1 as number;
        const p2 = inputs.p2 as number;
        if (!p1 || !p2) return null;
        if (p1 <= 0 || p2 <= 0) return null;

        const dB = 10 * Math.log10(p2 / p1);
        const ratio = p2 / p1;

        return {
          primary: {
            label: "Gain/Loss",
            value: `${formatNumber(dB, 4)} dB`,
          },
          details: [
            { label: "Decibels", value: `${formatNumber(dB, 4)} dB` },
            { label: "Power Ratio (P2/P1)", value: formatNumber(ratio, 6) },
            { label: "Type", value: dB >= 0 ? "Gain (amplification)" : "Loss (attenuation)" },
            { label: "Percentage", value: dB >= 0 ? `${formatNumber((ratio - 1) * 100, 2)}% increase` : `${formatNumber((1 - ratio) * 100, 2)}% decrease` },
          ],
        };
      },
    },
    {
      id: "voltage-ratio",
      name: "Voltage Ratio to dB",
      description: "dB = 20 × log₁₀(V2/V1)",
      fields: [
        {
          name: "v1",
          label: "Input Voltage V1",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "v2",
          label: "Output Voltage V2",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const v1 = inputs.v1 as number;
        const v2 = inputs.v2 as number;
        if (!v1 || !v2) return null;
        if (v1 <= 0 || v2 <= 0) return null;

        const dB = 20 * Math.log10(v2 / v1);
        const voltageRatio = v2 / v1;
        const powerRatio = Math.pow(v2 / v1, 2);

        return {
          primary: {
            label: "Gain/Loss",
            value: `${formatNumber(dB, 4)} dB`,
          },
          details: [
            { label: "Decibels", value: `${formatNumber(dB, 4)} dB` },
            { label: "Voltage Ratio (V2/V1)", value: formatNumber(voltageRatio, 6) },
            { label: "Power Ratio", value: formatNumber(powerRatio, 6) },
            { label: "Type", value: dB >= 0 ? "Gain (amplification)" : "Loss (attenuation)" },
          ],
        };
      },
    },
    {
      id: "db-to-ratio",
      name: "dB to Power/Voltage Ratio",
      description: "Convert dB value to power and voltage ratios",
      fields: [
        {
          name: "dB",
          label: "Decibels (dB)",
          type: "number",
          placeholder: "e.g. 20",
        },
      ],
      calculate: (inputs) => {
        const dB = inputs.dB as number;
        if (dB === undefined || dB === null || String(dB) === "") return null;

        const powerRatio = Math.pow(10, dB / 10);
        const voltageRatio = Math.pow(10, dB / 20);

        return {
          primary: {
            label: "Power Ratio",
            value: formatNumber(powerRatio, 6),
          },
          details: [
            { label: "Power Ratio", value: `${formatNumber(powerRatio, 6)}×` },
            { label: "Voltage Ratio", value: `${formatNumber(voltageRatio, 6)}×` },
            { label: "Power in %", value: `${formatNumber(powerRatio * 100, 2)}%` },
            { label: "Voltage in %", value: `${formatNumber(voltageRatio * 100, 2)}%` },
          ],
        };
      },
    },
    {
      id: "watts-to-dbm",
      name: "Watts to dBm / dBW",
      description: "Convert power in watts to dBm and dBW",
      fields: [
        {
          name: "power",
          label: "Power",
          type: "number",
          placeholder: "e.g. 1",
        },
        {
          name: "powerUnit",
          label: "Power Unit",
          type: "select",
          options: [
            { label: "Watts (W)", value: "1" },
            { label: "Milliwatts (mW)", value: "0.001" },
            { label: "Microwatts (µW)", value: "0.000001" },
            { label: "Kilowatts (kW)", value: "1000" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const power = inputs.power as number;
        const unit = Number(inputs.powerUnit);
        if (!power || power <= 0) return null;

        const watts = power * unit;
        const dBW = 10 * Math.log10(watts);
        const dBm = 10 * Math.log10(watts * 1000);

        return {
          primary: {
            label: "Power Level",
            value: `${formatNumber(dBm, 2)} dBm`,
          },
          details: [
            { label: "dBm", value: `${formatNumber(dBm, 4)} dBm` },
            { label: "dBW", value: `${formatNumber(dBW, 4)} dBW` },
            { label: "Watts", value: `${formatNumber(watts, 6)} W` },
            { label: "Milliwatts", value: `${formatNumber(watts * 1000, 4)} mW` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["signal-to-noise-calculator", "noise-level-calculator", "audio-bitrate-calculator"],
  faq: [
    {
      question: "What is a decibel (dB)?",
      answer:
        "A decibel (dB) is a logarithmic unit used to express the ratio between two values, usually power or amplitude. For power: dB = 10 × log₁₀(P2/P1). For voltage/amplitude: dB = 20 × log₁₀(V2/V1). It is widely used in electronics, acoustics, and telecommunications.",
    },
    {
      question: "What is the difference between dBm and dBW?",
      answer:
        "dBm is decibels relative to 1 milliwatt (0 dBm = 1 mW). dBW is decibels relative to 1 watt (0 dBW = 1 W). The relationship is: dBm = dBW + 30. For example, 1 W = 0 dBW = 30 dBm.",
    },
    {
      question: "How do common dB values translate to ratios?",
      answer:
        "3 dB = 2× power (1.41× voltage), 6 dB = 4× power (2× voltage), 10 dB = 10× power, 20 dB = 100× power (10× voltage), -3 dB = half power, -10 dB = 1/10 power, -20 dB = 1/100 power.",
    },
  ],
  formula:
    "Power: dB = 10 × log₁₀(P2/P1) | Voltage: dB = 20 × log₁₀(V2/V1) | dBm = 10 × log₁₀(P_mW) | dBW = 10 × log₁₀(P_W)",
};
