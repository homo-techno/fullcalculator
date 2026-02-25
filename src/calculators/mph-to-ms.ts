import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mphToMs: CalculatorDefinition = {
  slug: "mph-to-ms",
  title: "MPH to Meters per Second",
  description: "Free MPH to meters per second converter. Convert miles per hour to m/s instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["mph to m/s", "miles per hour to meters per second", "mph meters per second", "speed conversion"],
  variants: [
    {
      id: "mph-to-ms",
      name: "MPH to m/s",
      fields: [
        { name: "mph", label: "Speed (mph)", type: "number", placeholder: "e.g. 60", suffix: "mph" },
      ],
      calculate: (inputs) => {
        const mph = inputs.mph as number;
        if (mph === undefined) return null;
        const ms = mph * 0.44704;
        const kmh = mph * 1.60934;
        const fts = mph * 1.46667;
        const knots = mph * 0.868976;
        return {
          primary: { label: "Meters per Second", value: formatNumber(ms, 4), suffix: "m/s" },
          details: [
            { label: "MPH", value: `${formatNumber(mph, 2)} mph` },
            { label: "m/s", value: `${formatNumber(ms, 4)} m/s` },
            { label: "km/h", value: `${formatNumber(kmh, 2)} km/h` },
            { label: "ft/s", value: `${formatNumber(fts, 2)} ft/s` },
            { label: "Knots", value: formatNumber(knots, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ms-to-mph", "speed-converter", "kmh-to-ms"],
  faq: [
    { question: "How do I convert MPH to m/s?", answer: "Multiply the speed in mph by 0.44704. For example, 60 mph = 26.82 m/s." },
    { question: "Why convert to meters per second?", answer: "Meters per second (m/s) is the SI unit for speed, used in scientific calculations and physics problems." },
  ],
  formula: "m/s = mph × 0.44704",
};
