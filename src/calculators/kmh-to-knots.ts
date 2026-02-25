import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kmhToKnots: CalculatorDefinition = {
  slug: "kmh-to-knots",
  title: "km/h to Knots",
  description: "Free km/h to knots converter. Convert speed from kilometers per hour to nautical knots instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["kmh to knots", "km/h to knots", "kilometers per hour to knots", "nautical speed"],
  variants: [
    {
      id: "kmh-to-knots",
      name: "km/h to Knots",
      fields: [
        { name: "kmh", label: "Speed (km/h)", type: "number", placeholder: "e.g. 18.52", suffix: "km/h" },
      ],
      calculate: (inputs) => {
        const kmh = inputs.kmh as number;
        if (kmh === undefined) return null;
        const knots = kmh / 1.852;
        const mph = kmh / 1.60934;
        const ms = kmh / 3.6;
        const fts = ms * 3.28084;
        return {
          primary: { label: "Knots", value: formatNumber(knots, 2), suffix: "kn" },
          details: [
            { label: "km/h", value: `${formatNumber(kmh, 2)} km/h` },
            { label: "Knots", value: `${formatNumber(knots, 2)} kn` },
            { label: "MPH", value: `${formatNumber(mph, 2)} mph` },
            { label: "m/s", value: `${formatNumber(ms, 4)} m/s` },
            { label: "ft/s", value: `${formatNumber(fts, 2)} ft/s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["knots-to-kmh", "speed-converter", "kmh-to-ms"],
  faq: [
    { question: "How do I convert km/h to knots?", answer: "Divide the speed in km/h by 1.852. For example, 18.52 km/h = 10 knots." },
    { question: "Where are knots commonly used?", answer: "Knots are the standard unit of speed in maritime and aviation navigation worldwide." },
  ],
  formula: "knots = km/h ÷ 1.852",
};
