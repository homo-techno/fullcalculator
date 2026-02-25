import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const celsiusKelvinConverter: CalculatorDefinition = {
  slug: "celsius-kelvin-converter",
  title: "Celsius to Kelvin Converter",
  description: "Free Celsius to Kelvin converter. Instantly convert temperatures between Celsius and Kelvin scales.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["celsius to kelvin", "kelvin to celsius", "temperature converter", "C to K", "K to C"],
  variants: [
    {
      id: "celsius-to-kelvin",
      name: "Celsius to Kelvin",
      fields: [
        { name: "celsius", label: "Temperature (°C)", type: "number", placeholder: "e.g. 100", suffix: "°C" },
      ],
      calculate: (inputs) => {
        const celsius = inputs.celsius as number;
        if (celsius === undefined) return null;
        const kelvin = celsius + 273.15;
        const fahrenheit = (celsius * 9) / 5 + 32;
        return {
          primary: { label: "Kelvin", value: formatNumber(kelvin, 2), suffix: "K" },
          details: [
            { label: "Celsius", value: `${formatNumber(celsius, 2)} °C` },
            { label: "Kelvin", value: `${formatNumber(kelvin, 2)} K` },
            { label: "Fahrenheit", value: `${formatNumber(fahrenheit, 2)} °F` },
          ],
        };
      },
    },
    {
      id: "kelvin-to-celsius",
      name: "Kelvin to Celsius",
      fields: [
        { name: "kelvin", label: "Temperature (K)", type: "number", placeholder: "e.g. 373.15", suffix: "K" },
      ],
      calculate: (inputs) => {
        const kelvin = inputs.kelvin as number;
        if (kelvin === undefined) return null;
        const celsius = kelvin - 273.15;
        const fahrenheit = (celsius * 9) / 5 + 32;
        return {
          primary: { label: "Celsius", value: formatNumber(celsius, 2), suffix: "°C" },
          details: [
            { label: "Kelvin", value: `${formatNumber(kelvin, 2)} K` },
            { label: "Celsius", value: `${formatNumber(celsius, 2)} °C` },
            { label: "Fahrenheit", value: `${formatNumber(fahrenheit, 2)} °F` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kelvin-to-fahrenheit", "fahrenheit-to-kelvin", "unit-converter"],
  faq: [
    { question: "How do I convert Celsius to Kelvin?", answer: "Add 273.15 to the Celsius temperature. For example, 0°C = 273.15 K and 100°C = 373.15 K." },
    { question: "What is absolute zero in Celsius?", answer: "Absolute zero is -273.15°C, which equals 0 K. This is the lowest possible temperature." },
  ],
  formula: "K = °C + 273.15",
};
