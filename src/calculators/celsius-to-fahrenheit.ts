import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const celsiusToFahrenheitConverter: CalculatorDefinition = {
  slug: "celsius-to-fahrenheit-converter",
  title: "Celsius to Fahrenheit Converter",
  description:
    "Free Celsius to Fahrenheit converter. Quickly convert °C to °F with our easy calculator. Formula: °F = °C × 9/5 + 32.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "celsius to fahrenheit",
    "c to f",
    "centigrade to fahrenheit",
    "convert celsius to fahrenheit",
    "temperature converter",
  ],
  variants: [
    {
      id: "celsius-to-fahrenheit",
      name: "Celsius to Fahrenheit",
      fields: [
        {
          name: "celsius",
          label: "Celsius (°C)",
          type: "number",
          placeholder: "e.g. 100",
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
    {
      id: "fahrenheit-to-celsius",
      name: "Fahrenheit to Celsius",
      fields: [
        {
          name: "fahrenheit",
          label: "Fahrenheit (°F)",
          type: "number",
          placeholder: "e.g. 212",
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
  ],
  relatedSlugs: [
    "fahrenheit-to-celsius-converter",
    "temperature-converter",
    "unit-converter",
  ],
  faq: [
    {
      question: "How do I convert Celsius to Fahrenheit?",
      answer:
        "Multiply the Celsius temperature by 9/5 (or 1.8), then add 32. For example, 100°C = 100 × 1.8 + 32 = 212°F.",
    },
    {
      question: "What is 0°C in Fahrenheit?",
      answer:
        "0°C = 32°F. This is the freezing point of water at standard atmospheric pressure.",
    },
  ],
  formula: "°F = °C × 9/5 + 32",
};
