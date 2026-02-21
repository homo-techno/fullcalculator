import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const speedConverter: CalculatorDefinition = {
  slug: "speed-converter",
  title: "Speed Converter",
  description: "Free speed converter. Convert between mph, km/h, m/s, knots, and Mach number instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["speed converter", "mph to kph", "km/h to mph", "knots to mph", "mach speed converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Speed",
      fields: [
        { name: "value", label: "Speed", type: "number", placeholder: "e.g. 60" },
        { name: "from", label: "From", type: "select", options: [
          { label: "mph", value: "mph" },
          { label: "km/h", value: "kmh" },
          { label: "m/s", value: "ms" },
          { label: "knots", value: "knots" },
          { label: "ft/s", value: "fts" },
        ], defaultValue: "mph" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const from = inputs.from as string;
        if (value === undefined) return null;
        const toMs: Record<string, number> = { mph: 0.44704, kmh: 0.27778, ms: 1, knots: 0.51444, fts: 0.3048 };
        const ms = value * (toMs[from] || 1);
        const mach = ms / 343;
        return {
          primary: { label: `${value} ${from}`, value: from === "mph" ? `${formatNumber(ms / toMs.kmh, 2)} km/h` : `${formatNumber(ms / toMs.mph, 2)} mph` },
          details: [
            { label: "mph", value: formatNumber(ms / toMs.mph, 3) },
            { label: "km/h", value: formatNumber(ms / toMs.kmh, 3) },
            { label: "m/s", value: formatNumber(ms, 3) },
            { label: "knots", value: formatNumber(ms / toMs.knots, 3) },
            { label: "ft/s", value: formatNumber(ms / toMs.fts, 3) },
            { label: "Mach", value: formatNumber(mach, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "speed-distance-time-calculator", "pace-calculator"],
  faq: [
    { question: "How do I convert mph to km/h?", answer: "Multiply mph by 1.60934. So 60 mph = 96.56 km/h. Quick estimate: multiply by 1.6. For km/h to mph: divide by 1.6." },
  ],
  formula: "1 mph = 1.60934 km/h = 0.44704 m/s = 0.86898 knots",
};
