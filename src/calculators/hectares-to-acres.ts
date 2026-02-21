import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hectaresToAcresConverter: CalculatorDefinition = {
  slug: "hectares-to-acres-converter",
  title: "Hectares to Acres Converter",
  description:
    "Free hectares to acres converter. Quickly convert hectares to acres with our easy calculator. 1 hectare = 2.47105 acres.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "hectares to acres",
    "ha to acres",
    "hectare to acre",
    "convert hectares to acres",
    "hectare converter",
  ],
  variants: [
    {
      id: "hectares-to-acres",
      name: "Hectares to Acres",
      fields: [
        {
          name: "hectares",
          label: "Hectares",
          type: "number",
          placeholder: "e.g. 5",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.hectares as number;
        if (val === undefined || val === null) return null;
        const acres = val * 2.47105;
        return {
          primary: {
            label: `${formatNumber(val, 4)} hectares`,
            value: `${formatNumber(acres, 4)} acres`,
          },
          details: [
            { label: "Acres", value: formatNumber(acres, 4) },
            { label: "Square Feet", value: formatNumber(acres * 43560, 2) },
            { label: "Square Meters", value: formatNumber(val * 10000, 2) },
            { label: "Square Kilometers", value: formatNumber(val / 100, 6) },
            { label: "Square Miles", value: formatNumber(acres / 640, 6) },
          ],
        };
      },
    },
    {
      id: "acres-to-hectares",
      name: "Acres to Hectares",
      fields: [
        {
          name: "acres",
          label: "Acres",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.acres as number;
        if (val === undefined || val === null) return null;
        const hectares = val / 2.47105;
        return {
          primary: {
            label: `${formatNumber(val, 4)} acres`,
            value: `${formatNumber(hectares, 4)} hectares`,
          },
          details: [
            { label: "Hectares", value: formatNumber(hectares, 4) },
            { label: "Square Meters", value: formatNumber(hectares * 10000, 2) },
            { label: "Square Feet", value: formatNumber(val * 43560, 2) },
            { label: "Square Kilometers", value: formatNumber(hectares / 100, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "acres-to-square-feet-converter",
    "square-meters-to-square-feet-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How many acres in a hectare?",
      answer:
        "1 hectare = 2.47105 acres. A hectare is a metric unit of area equal to 10,000 square meters.",
    },
    {
      question: "How do I convert hectares to acres?",
      answer:
        "Multiply the number of hectares by 2.47105. For example, 5 hectares = 5 × 2.47105 = 12.355 acres.",
    },
  ],
  formula: "acres = hectares × 2.47105",
};
