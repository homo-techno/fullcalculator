import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kelvinToCelsiusConverter: CalculatorDefinition = {
  slug: "kelvin-to-celsius-converter",
  title: "Kelvin to Celsius Converter",
  description:
    "Free Kelvin to Celsius converter. Instantly convert K to °C with formula and examples. Formula: °C = K − 273.15.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "kelvin to celsius",
    "K to C",
    "kelvin to centigrade",
    "convert kelvin to celsius",
    "temperature conversion",
  ],
  variants: [
    {
      id: "kelvin-to-celsius",
      name: "Kelvin to Celsius",
      fields: [
        {
          name: "kelvin",
          label: "Kelvin (K)",
          type: "number",
          placeholder: "e.g. 373.15",
        },
      ],
      calculate: (inputs) => {
        const k = inputs.kelvin as number;
        if (k === undefined || k === null) return null;
        const celsius = k - 273.15;
        const fahrenheit = celsius * 9 / 5 + 32;
        return {
          primary: {
            label: `${formatNumber(k, 2)} K`,
            value: `${formatNumber(celsius, 2)} °C`,
          },
          details: [
            { label: "Celsius", value: `${formatNumber(celsius, 4)} °C` },
            { label: "Fahrenheit", value: `${formatNumber(fahrenheit, 4)} °F` },
            { label: "Formula", value: "°C = K − 273.15" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "celsius-to-kelvin-converter",
    "celsius-to-fahrenheit-converter",
    "fahrenheit-to-celsius-converter",
    "temperature-converter",
  ],
  faq: [
    {
      question: "How do you convert Kelvin to Celsius?",
      answer:
        "Subtract 273.15 from the Kelvin value. For example, 373.15 K = 373.15 − 273.15 = 100 °C.",
    },
    {
      question: "What is 0 Kelvin in Celsius?",
      answer:
        "0 K = −273.15 °C. This is absolute zero, the lowest possible temperature.",
    },
  ],
  formula: "°C = K − 273.15",
};
