import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ampsToWattsConverter: CalculatorDefinition = {
  slug: "amps-to-watts-converter",
  title: "Amps to Watts Converter",
  description:
    "Free amps to watts converter. Quickly convert amperes to watts with our easy calculator. Watts = Amps × Volts.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "amps to watts",
    "a to w",
    "amp to watt",
    "convert amps to watts",
    "electrical converter",
    "amperes to watts",
  ],
  variants: [
    {
      id: "amps-to-watts",
      name: "Amps to Watts",
      fields: [
        {
          name: "amps",
          label: "Amps (A)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "volts",
          label: "Volts (V)",
          type: "number",
          placeholder: "e.g. 120",
        },
      ],
      calculate: (inputs) => {
        const amps = inputs.amps as number;
        const volts = inputs.volts as number;
        if (amps === undefined || amps === null || volts === undefined || volts === null) return null;
        const watts = amps * volts;
        return {
          primary: {
            label: `${formatNumber(amps, 4)} A at ${formatNumber(volts, 2)} V`,
            value: `${formatNumber(watts, 2)} W`,
          },
          details: [
            { label: "Watts", value: formatNumber(watts, 2) },
            { label: "Kilowatts", value: formatNumber(watts / 1000, 4) },
            { label: "Milliamps", value: formatNumber(amps * 1000, 2) },
            { label: "Horsepower", value: formatNumber(watts / 745.7, 4) },
            { label: "BTU/hour", value: formatNumber(watts * 3.412, 2) },
          ],
        };
      },
    },
    {
      id: "watts-to-amps",
      name: "Watts to Amps",
      fields: [
        {
          name: "watts",
          label: "Watts (W)",
          type: "number",
          placeholder: "e.g. 1800",
        },
        {
          name: "volts",
          label: "Volts (V)",
          type: "number",
          placeholder: "e.g. 120",
        },
      ],
      calculate: (inputs) => {
        const watts = inputs.watts as number;
        const volts = inputs.volts as number;
        if (watts === undefined || watts === null || volts === undefined || volts === null || volts === 0) return null;
        const amps = watts / volts;
        return {
          primary: {
            label: `${formatNumber(watts, 2)} W at ${formatNumber(volts, 2)} V`,
            value: `${formatNumber(amps, 4)} A`,
          },
          details: [
            { label: "Amps", value: formatNumber(amps, 4) },
            { label: "Milliamps", value: formatNumber(amps * 1000, 2) },
            { label: "Kilowatts", value: formatNumber(watts / 1000, 4) },
            { label: "Horsepower", value: formatNumber(watts / 745.7, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "watts-to-amps-converter",
    "ohms-law-calculator",
    "electrical-power-calculator",
    "unit-converter",
  ],
  faq: [
    {
      question: "How do I convert amps to watts?",
      answer:
        "Multiply the amps by the voltage. Watts = Amps × Volts. For example, 15A at 120V = 15 × 120 = 1,800 watts.",
    },
    {
      question: "How many watts is 15 amps at 120V?",
      answer:
        "15 amps at 120 volts = 1,800 watts. Use the formula: Watts = Amps × Volts.",
    },
  ],
  formula: "Watts = Amps × Volts",
};
