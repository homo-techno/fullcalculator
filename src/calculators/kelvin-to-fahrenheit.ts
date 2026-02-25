import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kelvinToFahrenheit: CalculatorDefinition = {
  slug: "kelvin-to-fahrenheit",
  title: "Kelvin to Fahrenheit",
  description: "Free Kelvin to Fahrenheit converter. Convert temperatures from the Kelvin scale to Fahrenheit instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["kelvin to fahrenheit", "K to F", "temperature conversion", "kelvin fahrenheit"],
  variants: [
    {
      id: "kelvin-to-fahrenheit",
      name: "Kelvin to Fahrenheit",
      fields: [
        { name: "kelvin", label: "Temperature (K)", type: "number", placeholder: "e.g. 300", suffix: "K" },
      ],
      calculate: (inputs) => {
        const kelvin = inputs.kelvin as number;
        if (kelvin === undefined) return null;
        const fahrenheit = (kelvin - 273.15) * (9 / 5) + 32;
        const celsius = kelvin - 273.15;
        const rankine = kelvin * 1.8;
        return {
          primary: { label: "Fahrenheit", value: formatNumber(fahrenheit, 2), suffix: "°F" },
          details: [
            { label: "Kelvin", value: `${formatNumber(kelvin, 2)} K` },
            { label: "Fahrenheit", value: `${formatNumber(fahrenheit, 2)} °F` },
            { label: "Celsius", value: `${formatNumber(celsius, 2)} °C` },
            { label: "Rankine", value: `${formatNumber(rankine, 2)} °R` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["fahrenheit-to-kelvin", "celsius-kelvin-converter", "unit-converter"],
  faq: [
    { question: "How do I convert Kelvin to Fahrenheit?", answer: "Subtract 273.15 from the Kelvin value, multiply by 9/5, then add 32. Formula: °F = (K − 273.15) × 9/5 + 32." },
    { question: "What is 0 Kelvin in Fahrenheit?", answer: "0 K (absolute zero) equals -459.67°F. This is the coldest possible temperature." },
  ],
  formula: "°F = (K − 273.15) × 9/5 + 32",
};
