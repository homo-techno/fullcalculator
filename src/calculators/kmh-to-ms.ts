import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kmhToMs: CalculatorDefinition = {
  slug: "kmh-to-ms",
  title: "km/h to Meters per Second",
  description: "Free km/h to meters per second converter. Convert kilometers per hour to m/s instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["km/h to m/s", "kph to meters per second", "kmh to ms", "speed conversion"],
  variants: [
    {
      id: "kmh-to-ms",
      name: "km/h to m/s",
      fields: [
        { name: "kmh", label: "Speed (km/h)", type: "number", placeholder: "e.g. 100", suffix: "km/h" },
      ],
      calculate: (inputs) => {
        const kmh = inputs.kmh as number;
        if (kmh === undefined) return null;
        const ms = kmh / 3.6;
        const mph = kmh / 1.60934;
        const fts = ms * 3.28084;
        const knots = kmh / 1.852;
        return {
          primary: { label: "Meters per Second", value: formatNumber(ms, 4), suffix: "m/s" },
          details: [
            { label: "km/h", value: `${formatNumber(kmh, 2)} km/h` },
            { label: "m/s", value: `${formatNumber(ms, 4)} m/s` },
            { label: "MPH", value: `${formatNumber(mph, 2)} mph` },
            { label: "ft/s", value: `${formatNumber(fts, 2)} ft/s` },
            { label: "Knots", value: formatNumber(knots, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mph-to-ms", "ms-to-mph", "speed-converter"],
  faq: [
    { question: "How do I convert km/h to m/s?", answer: "Divide the speed in km/h by 3.6. For example, 100 km/h = 27.78 m/s." },
    { question: "Why divide by 3.6?", answer: "There are 1000 meters in a kilometer and 3600 seconds in an hour. So 1 km/h = 1000/3600 = 1/3.6 m/s." },
  ],
  formula: "m/s = km/h ÷ 3.6",
};
