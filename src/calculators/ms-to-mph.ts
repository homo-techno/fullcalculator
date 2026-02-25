import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const msToMph: CalculatorDefinition = {
  slug: "ms-to-mph",
  title: "Meters per Second to MPH",
  description: "Free meters per second to MPH converter. Convert m/s to miles per hour instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["m/s to mph", "meters per second to mph", "ms to miles per hour", "speed conversion"],
  variants: [
    {
      id: "ms-to-mph",
      name: "m/s to MPH",
      fields: [
        { name: "ms", label: "Speed (m/s)", type: "number", placeholder: "e.g. 10", suffix: "m/s" },
      ],
      calculate: (inputs) => {
        const ms = inputs.ms as number;
        if (ms === undefined) return null;
        const mph = ms / 0.44704;
        const kmh = ms * 3.6;
        const fts = ms * 3.28084;
        const knots = ms / 0.51444;
        return {
          primary: { label: "Miles per Hour", value: formatNumber(mph, 2), suffix: "mph" },
          details: [
            { label: "m/s", value: `${formatNumber(ms, 4)} m/s` },
            { label: "MPH", value: `${formatNumber(mph, 2)} mph` },
            { label: "km/h", value: `${formatNumber(kmh, 2)} km/h` },
            { label: "ft/s", value: `${formatNumber(fts, 2)} ft/s` },
            { label: "Knots", value: formatNumber(knots, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mph-to-ms", "speed-converter", "kmh-to-ms"],
  faq: [
    { question: "How do I convert m/s to MPH?", answer: "Divide the speed in m/s by 0.44704, or multiply by 2.23694. For example, 10 m/s = 22.37 mph." },
    { question: "What is the speed of sound in mph?", answer: "The speed of sound is approximately 343 m/s, which equals about 767.3 mph at sea level." },
  ],
  formula: "mph = m/s ÷ 0.44704",
};
