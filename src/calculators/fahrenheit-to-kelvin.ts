import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fahrenheitToKelvin: CalculatorDefinition = {
  slug: "fahrenheit-to-kelvin",
  title: "Fahrenheit to Kelvin",
  description: "Free Fahrenheit to Kelvin converter. Convert temperatures from Fahrenheit to the Kelvin scale instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["fahrenheit to kelvin", "F to K", "temperature conversion", "fahrenheit kelvin"],
  variants: [
    {
      id: "fahrenheit-to-kelvin",
      name: "Fahrenheit to Kelvin",
      fields: [
        { name: "fahrenheit", label: "Temperature (°F)", type: "number", placeholder: "e.g. 72", suffix: "°F" },
      ],
      calculate: (inputs) => {
        const fahrenheit = inputs.fahrenheit as number;
        if (fahrenheit === undefined) return null;
        const kelvin = (fahrenheit - 32) * (5 / 9) + 273.15;
        const celsius = (fahrenheit - 32) * (5 / 9);
        const rankine = fahrenheit + 459.67;
        return {
          primary: { label: "Kelvin", value: formatNumber(kelvin, 2), suffix: "K" },
          details: [
            { label: "Fahrenheit", value: `${formatNumber(fahrenheit, 2)} °F` },
            { label: "Kelvin", value: `${formatNumber(kelvin, 2)} K` },
            { label: "Celsius", value: `${formatNumber(celsius, 2)} °C` },
            { label: "Rankine", value: `${formatNumber(rankine, 2)} °R` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kelvin-to-fahrenheit", "celsius-kelvin-converter", "unit-converter"],
  faq: [
    { question: "How do I convert Fahrenheit to Kelvin?", answer: "Subtract 32 from the Fahrenheit value, multiply by 5/9, then add 273.15. Formula: K = (°F − 32) × 5/9 + 273.15." },
    { question: "What is 32°F in Kelvin?", answer: "32°F (the freezing point of water) equals 273.15 K." },
  ],
  formula: "K = (°F − 32) × 5/9 + 273.15",
};
