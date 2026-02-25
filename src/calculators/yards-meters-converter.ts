import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yardsMetersConverter: CalculatorDefinition = {
  slug: "yards-meters-converter",
  title: "Yards to Meters Converter",
  description: "Free yards to meters converter. Convert yards to meters instantly with formula explanation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["yards to meters","yd to m","yard meter converter","length conversion"],
  variants: [
    {
      id: "convert",
      name: "Yards to Meters Converter",
      fields: [
        { name: "value", label: "Yards (yd)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const meters = value * 0.9144;
        return {
          primary: { label: `${formatNumber(value)} yd`, value: `${formatNumber(meters, 4)} m` },
          details: [
            { label: "Meters", value: formatNumber(meters, 4) },
            { label: "Centimeters", value: formatNumber(meters * 100, 2) },
            { label: "Feet", value: formatNumber(value * 3, 4) },
            { label: "Formula", value: "yd x 0.9144 = m" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["meters-to-yards-converter","unit-converter","length-converter"],
  faq: [
    { question: "How do you convert yards to meters?", answer: "Multiply the yard value by 0.9144. For example, 10 yd = 9.144 m." },
  ],
  formula: "1 yd = 0.9144 m | m = yd x 0.9144",
};
