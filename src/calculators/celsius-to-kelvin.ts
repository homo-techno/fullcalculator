import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const celsiusToKelvinConverter: CalculatorDefinition = {
  slug: "celsius-to-kelvin-converter",
  title: "Celsius to Kelvin Converter",
  description:
    "Free Celsius to Kelvin converter. Instantly convert °C to K with formula and examples. Formula: K = °C + 273.15.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "celsius to kelvin",
    "C to K",
    "centigrade to kelvin",
    "convert celsius to kelvin",
    "temperature conversion",
  ],
  variants: [
    {
      id: "celsius-to-kelvin",
      name: "Celsius to Kelvin",
      fields: [
        {
          name: "celsius",
          label: "Celsius (°C)",
          type: "number",
          placeholder: "e.g. 100",
        },
      ],
      calculate: (inputs) => {
        const c = inputs.celsius as number;
        if (c === undefined || c === null) return null;
        const kelvin = c + 273.15;
        const fahrenheit = c * 9 / 5 + 32;
        return {
          primary: {
            label: `${formatNumber(c, 2)} °C`,
            value: `${formatNumber(kelvin, 2)} K`,
          },
          details: [
            { label: "Kelvin", value: `${formatNumber(kelvin, 4)} K` },
            { label: "Fahrenheit", value: `${formatNumber(fahrenheit, 4)} °F` },
            { label: "Formula", value: "K = °C + 273.15" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "kelvin-to-celsius-converter",
    "celsius-to-fahrenheit-converter",
    "fahrenheit-to-celsius-converter",
    "temperature-converter",
  ],
  faq: [
    {
      question: "How do you convert Celsius to Kelvin?",
      answer:
        "Add 273.15 to the Celsius value. For example, 100 °C = 100 + 273.15 = 373.15 K.",
    },
    {
      question: "What is 0 °C in Kelvin?",
      answer:
        "0 °C = 273.15 K. This is the freezing point of water at standard atmospheric pressure.",
    },
  ],
  formula: "K = °C + 273.15",
};
