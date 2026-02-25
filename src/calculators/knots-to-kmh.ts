import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const knotsToKmh: CalculatorDefinition = {
  slug: "knots-to-kmh",
  title: "Knots to km/h",
  description: "Free knots to km/h converter. Convert speed from nautical knots to kilometers per hour instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["knots to kmh", "knots to km/h", "nautical speed", "knots kilometers per hour"],
  variants: [
    {
      id: "knots-to-kmh",
      name: "Knots to km/h",
      fields: [
        { name: "knots", label: "Speed (knots)", type: "number", placeholder: "e.g. 10", suffix: "kn" },
      ],
      calculate: (inputs) => {
        const knots = inputs.knots as number;
        if (knots === undefined) return null;
        const kmh = knots * 1.852;
        const mph = knots * 1.15078;
        const ms = knots * 0.51444;
        const fts = knots * 1.68781;
        return {
          primary: { label: "km/h", value: formatNumber(kmh, 2), suffix: "km/h" },
          details: [
            { label: "Knots", value: `${formatNumber(knots, 2)} kn` },
            { label: "km/h", value: `${formatNumber(kmh, 2)} km/h` },
            { label: "MPH", value: `${formatNumber(mph, 2)} mph` },
            { label: "m/s", value: `${formatNumber(ms, 4)} m/s` },
            { label: "ft/s", value: `${formatNumber(fts, 2)} ft/s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kmh-to-knots", "speed-converter", "mph-to-ms"],
  faq: [
    { question: "How do I convert knots to km/h?", answer: "Multiply the speed in knots by 1.852. For example, 10 knots = 18.52 km/h." },
    { question: "What is a knot?", answer: "A knot is one nautical mile per hour. One nautical mile equals 1.852 kilometers, so 1 knot = 1.852 km/h." },
  ],
  formula: "km/h = knots × 1.852",
};
