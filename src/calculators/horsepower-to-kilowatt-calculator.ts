import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const horsepowerToKilowattCalculator: CalculatorDefinition = {
  slug: "horsepower-to-kilowatt-calculator",
  title: "Horsepower to Kilowatt Calculator",
  description: "Free horsepower to kilowatt calculator. Convert between HP and kW instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["horsepower to kilowatt calculator", "HP to kW", "converter"],
  variants: [
    {
      id: "forward",
      name: "HP to kW",
      description: "Convert HP to kW",
      fields: [
        {
          name: "value",
          label: "Value in HP",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "HP",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const v = inputs.value as number;
        if (!v && v !== 0) return null;
        const r = v * 0.7457;
        return {
          primary: { label: "kW", value: formatNumber(r) + " kW" },
          details: [
            { label: "Input", value: formatNumber(v) + " HP" },
            { label: "Factor", value: "1 HP = 0.7457 kW" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter"],
  faq: [
    { question: "How to convert HP to kW?", answer: "Multiply by 0.7457. Example: 10 HP = 7.457000000000001 kW." },
    { question: "Is this conversion exact?", answer: "Yes, this uses the standard conversion factor." },
  ],
  formula: "kW = HP x 0.7457",
};
