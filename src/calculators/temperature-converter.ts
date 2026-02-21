import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const temperatureConverter: CalculatorDefinition = {
  slug: "temperature-converter",
  title: "Temperature Converter",
  description: "Free temperature converter. Convert between Celsius, Fahrenheit, Kelvin, and Rankine temperature scales.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["temperature converter", "celsius to fahrenheit", "fahrenheit to celsius", "kelvin converter", "temperature conversion"],
  variants: [
    {
      id: "convert",
      name: "Convert Temperature",
      fields: [
        { name: "value", label: "Temperature", type: "number", placeholder: "e.g. 100" },
        {
          name: "from", label: "From", type: "select",
          options: [
            { label: "Celsius (°C)", value: "c" },
            { label: "Fahrenheit (°F)", value: "f" },
            { label: "Kelvin (K)", value: "k" },
            { label: "Rankine (°R)", value: "r" },
          ],
        },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "c";
        if (val === undefined) return null;
        let c: number;
        switch (from) {
          case "f": c = (val - 32) * 5 / 9; break;
          case "k": c = val - 273.15; break;
          case "r": c = (val - 491.67) * 5 / 9; break;
          default: c = val;
        }
        const f = c * 9 / 5 + 32;
        const k = c + 273.15;
        const r = f + 459.67;
        return {
          primary: { label: "Conversions", value: `${formatNumber(c, 2)}°C = ${formatNumber(f, 2)}°F` },
          details: [
            { label: "Celsius", value: `${formatNumber(c, 4)}°C` },
            { label: "Fahrenheit", value: `${formatNumber(f, 4)}°F` },
            { label: "Kelvin", value: `${formatNumber(k, 4)} K` },
            { label: "Rankine", value: `${formatNumber(r, 4)}°R` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "wind-chill-calculator", "heat-index-calculator"],
  faq: [{ question: "How do I convert Celsius to Fahrenheit?", answer: "°F = °C × 9/5 + 32. For example, 100°C = 100 × 1.8 + 32 = 212°F. To convert back: °C = (°F - 32) × 5/9. Key points: water freezes at 0°C/32°F, boils at 100°C/212°F." }],
  formula: "°F = °C × 9/5 + 32 | K = °C + 273.15",
};
