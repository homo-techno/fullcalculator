import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hpToKwConverter: CalculatorDefinition = {
  slug: "hp-to-kw-converter",
  title: "Horsepower to Kilowatts Converter",
  description:
    "Free horsepower to kilowatts converter. Instantly convert hp to kW with formula and examples. Formula: kW = hp × 0.7457.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "horsepower to kilowatts",
    "hp to kw",
    "hp to kilowatts",
    "convert horsepower to kw",
    "power conversion",
  ],
  variants: [
    {
      id: "hp-to-kw",
      name: "Horsepower to Kilowatts",
      fields: [
        {
          name: "hp",
          label: "Horsepower (hp)",
          type: "number",
          placeholder: "e.g. 150",
        },
      ],
      calculate: (inputs) => {
        const hp = inputs.hp as number;
        if (hp === undefined || hp === null) return null;
        const kw = hp * 0.7457;
        const watts = hp * 745.7;
        const btu = hp * 2544.43;
        return {
          primary: {
            label: `${formatNumber(hp, 2)} hp`,
            value: `${formatNumber(kw, 4)} kW`,
          },
          details: [
            { label: "Kilowatts", value: `${formatNumber(kw, 4)} kW` },
            { label: "Watts", value: `${formatNumber(watts, 2)} W` },
            { label: "BTU/hour", value: `${formatNumber(btu, 2)} BTU/h` },
            { label: "Formula", value: "kW = hp × 0.7457" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "watts-to-amps-converter",
    "amps-to-watts-converter",
    "energy-converter",
    "power-unit-converter",
  ],
  faq: [
    {
      question: "How do you convert horsepower to kilowatts?",
      answer:
        "Multiply the horsepower value by 0.7457. For example, 150 hp = 150 × 0.7457 = 111.855 kW.",
    },
    {
      question: "How many kW is 1 horsepower?",
      answer:
        "1 mechanical horsepower = 0.7457 kilowatts (745.7 watts). This is the standard conversion for mechanical/imperial horsepower.",
    },
  ],
  formula: "kW = hp × 0.7457",
};
