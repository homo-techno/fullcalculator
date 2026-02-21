import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wattsToAmpsConverter: CalculatorDefinition = {
  slug: "watts-to-amps-converter",
  title: "Watts to Amps Converter",
  description:
    "Free watts to amps converter. Quickly convert watts to amperes with our easy calculator. Amps = Watts / Volts.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "watts to amps",
    "w to a",
    "watt to amp",
    "convert watts to amps",
    "electrical converter",
    "watts to amperes",
  ],
  variants: [
    {
      id: "watts-to-amps",
      name: "Watts to Amps",
      fields: [
        {
          name: "watts",
          label: "Watts (W)",
          type: "number",
          placeholder: "e.g. 1000",
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
            { label: "Watts", value: formatNumber(watts, 2) },
            { label: "Kilowatts", value: formatNumber(watts / 1000, 4) },
            { label: "Resistance (Ohms)", value: formatNumber(volts / amps, 4) },
          ],
        };
      },
    },
    {
      id: "amps-to-watts",
      name: "Amps to Watts",
      fields: [
        {
          name: "amps",
          label: "Amps (A)",
          type: "number",
          placeholder: "e.g. 10",
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
            { label: "Amps", value: formatNumber(amps, 4) },
            { label: "Milliamps", value: formatNumber(amps * 1000, 2) },
            { label: "Resistance (Ohms)", value: formatNumber(volts / amps, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "amps-to-watts-converter",
    "ohms-law-calculator",
    "electrical-power-calculator",
    "unit-converter",
  ],
  faq: [
    {
      question: "How do I convert watts to amps?",
      answer:
        "Divide the watts by the voltage. Amps = Watts / Volts. For example, 1000W at 120V = 1000 / 120 = 8.33 amps.",
    },
    {
      question: "How many amps is 1000 watts at 120V?",
      answer:
        "1000 watts at 120 volts = 8.33 amps. Use the formula: Amps = Watts / Volts.",
    },
  ],
  formula: "Amps = Watts ÷ Volts",
};
