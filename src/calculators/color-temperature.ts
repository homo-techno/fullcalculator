import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function classifyTemp(kelvin: number): { classification: string; useCase: string } {
  if (kelvin < 2700) return { classification: "Very Warm (Candlelight)", useCase: "Ambient/decorative lighting, restaurants, bedrooms" };
  if (kelvin <= 3000) return { classification: "Warm White", useCase: "Living rooms, bedrooms, hospitality, cozy environments" };
  if (kelvin < 3500) return { classification: "Warm to Neutral", useCase: "Kitchens, bathrooms, transitional spaces" };
  if (kelvin <= 4500) return { classification: "Neutral White", useCase: "Offices, retail, task lighting, kitchens" };
  if (kelvin < 5000) return { classification: "Cool Neutral", useCase: "Commercial spaces, workshops, detailed task work" };
  if (kelvin <= 6500) return { classification: "Cool Daylight", useCase: "Art studios, photography, hospitals, garages, daylight simulation" };
  return { classification: "Very Cool (Blue Sky)", useCase: "Specialised applications, aquariums, high-CRI environments" };
}

export const colorTemperatureCalculator: CalculatorDefinition = {
  slug: "color-temperature-calculator",
  title: "Color Temperature Calculator",
  description: "Free color temperature calculator. Classify Kelvin temperatures into warm, neutral, and cool categories with recommended use cases.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["color temperature", "Kelvin", "warm", "cool", "daylight", "lighting", "LED", "calculator"],
  variants: [
    {
      id: "convert",
      name: "Classify",
      fields: [
        { name: "kelvin", label: "Temperature (Kelvin)", type: "number", placeholder: "e.g. 4000" },
      ],
      calculate: (inputs) => {
        const kelvin = inputs.kelvin as number;
        if (!kelvin) return null;
        const { classification, useCase } = classifyTemp(kelvin);
        const mireds = 1e6 / kelvin;
        return {
          primary: { label: `${formatNumber(kelvin, 0)} K`, value: classification },
          details: [
            { label: "Temperature", value: `${formatNumber(kelvin, 0)} K` },
            { label: "Classification", value: classification },
            { label: "Recommended Use", value: useCase },
            { label: "Mireds (micro reciprocal degrees)", value: formatNumber(mireds, 1) },
            { label: "Range: Warm White", value: "2700 - 3000 K" },
            { label: "Range: Neutral White", value: "3500 - 4500 K" },
            { label: "Range: Cool Daylight", value: "5000 - 6500 K" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["luminosity-converter", "frequency-unit-converter"],
  faq: [
    { question: "What is color temperature?", answer: "Color temperature, measured in Kelvin (K), describes the colour appearance of light. Lower values (2700K) appear warm/yellow, higher values (6500K) appear cool/blue." },
    { question: "What color temperature is best for an office?", answer: "Neutral white (3500-4500K) is generally recommended for office environments as it promotes alertness without being harsh." },
  ],
  formula: "Classification based on Kelvin ranges: Warm (2700-3000K), Neutral (3500-4500K), Cool Daylight (5000-6500K). Mireds = 1,000,000 / Kelvin.",
};
