import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fahrenheitToCelsiusConverter: CalculatorDefinition = {
  slug: "fahrenheit-to-celsius-converter",
  title: "Fahrenheit to Celsius Converter",
  description:
    "Free Fahrenheit to Celsius converter. Quickly convert °F to °C with our easy calculator. Formula: °C = (°F - 32) × 5/9.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "fahrenheit to celsius",
    "f to c",
    "fahrenheit to centigrade",
    "convert fahrenheit to celsius",
    "temperature converter",
  ],
  variants: [
    {
      id: "fahrenheit-to-celsius",
      name: "Fahrenheit to Celsius",
      fields: [
        {
          name: "fahrenheit",
          label: "Fahrenheit (°F)",
          type: "number",
          placeholder: "e.g. 72",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.fahrenheit as number;
        if (val === undefined || val === null) return null;
        const c = (val - 32) * 5 / 9;
        const k = c + 273.15;
        return {
          primary: {
            label: `${formatNumber(val, 2)}°F`,
            value: `${formatNumber(c, 2)}°C`,
          },
          details: [
            { label: "Celsius", value: `${formatNumber(c, 4)}°C` },
            { label: "Kelvin", value: `${formatNumber(k, 4)} K` },
            { label: "Rankine", value: `${formatNumber(val + 459.67, 4)}°R` },
          ],
        };
      },
    },
    {
      id: "celsius-to-fahrenheit",
      name: "Celsius to Fahrenheit",
      fields: [
        {
          name: "celsius",
          label: "Celsius (°C)",
          type: "number",
          placeholder: "e.g. 22",
        },
      ],
      calculate: (inputs) => {
        const val = inputs.celsius as number;
        if (val === undefined || val === null) return null;
        const f = val * 9 / 5 + 32;
        const k = val + 273.15;
        return {
          primary: {
            label: `${formatNumber(val, 2)}°C`,
            value: `${formatNumber(f, 2)}°F`,
          },
          details: [
            { label: "Fahrenheit", value: `${formatNumber(f, 4)}°F` },
            { label: "Kelvin", value: `${formatNumber(k, 4)} K` },
            { label: "Rankine", value: `${formatNumber(f + 459.67, 4)}°R` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "celsius-to-fahrenheit-converter",
    "temperature-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How do I convert Fahrenheit to Celsius?",
      answer:
        "Subtract 32 from the Fahrenheit temperature, then multiply by 5/9. For example, 72°F = (72 - 32) × 5/9 = 22.22°C.",
    },
    {
      question: "What is 32°F in Celsius?",
      answer:
        "32°F = 0°C. This is the freezing point of water at standard atmospheric pressure.",
    },
  ],
  formula: "°C = (°F - 32) × 5/9",
};
