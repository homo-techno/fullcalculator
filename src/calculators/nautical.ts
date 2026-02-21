import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

// Speed conversion factors to knots
const toKnots: Record<string, number> = {
  "knots": 1,
  "mph": 0.868976,      // 1 mph = 0.868976 knots
  "km/h": 0.539957,     // 1 km/h = 0.539957 knots
  "m/s": 1.94384,       // 1 m/s = 1.94384 knots
};

const speedLabels: Record<string, string> = {
  "knots": "Knots (kn)",
  "mph": "Miles per hour (mph)",
  "km/h": "Kilometres per hour (km/h)",
  "m/s": "Metres per second (m/s)",
};

const speedOptions = Object.keys(toKnots).map((u) => ({ label: speedLabels[u], value: u }));

// Distance conversion factors to nautical miles
const toNmi: Record<string, number> = {
  "nmi": 1,
  "km": 0.539957,       // 1 km = 0.539957 nmi
  "miles": 0.868976,    // 1 statute mile = 0.868976 nmi
};

const distLabels: Record<string, string> = {
  "nmi": "Nautical miles (nmi)",
  "km": "Kilometres (km)",
  "miles": "Statute miles (mi)",
};

const distOptions = Object.keys(toNmi).map((u) => ({ label: distLabels[u], value: u }));

export const nauticalConverter: CalculatorDefinition = {
  slug: "nautical-converter",
  title: "Nautical Converter",
  description: "Free nautical converter. Convert speeds between knots, mph, km/h, m/s and distances between nautical miles, km, and miles.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["nautical", "knots", "nautical miles", "speed", "marine", "sailing", "converter"],
  variants: [
    {
      id: "speed",
      name: "Speed Conversion",
      fields: [
        { name: "value", label: "Speed Value", type: "number", placeholder: "e.g. 10" },
        { name: "from", label: "From", type: "select", options: speedOptions },
        { name: "to", label: "To", type: "select", options: speedOptions },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "knots";
        const to = (inputs.to as string) || "km/h";
        if (!val) return null;
        const baseKnots = val * toKnots[from];
        const result = baseKnots / toKnots[to];
        return {
          primary: { label: `${formatNumber(val, 4)} ${from}`, value: `${formatNumber(result, 6)} ${to}` },
          details: [
            { label: "Base value (knots)", value: formatNumber(baseKnots, 6) },
            { label: "km/h equivalent", value: formatNumber(baseKnots / toKnots["km/h"], 4) },
            { label: "mph equivalent", value: formatNumber(baseKnots / toKnots["mph"], 4) },
            { label: "m/s equivalent", value: formatNumber(baseKnots / toKnots["m/s"], 4) },
            { label: "Reference", value: "1 knot = 1.852 km/h" },
          ],
        };
      },
    },
    {
      id: "distance",
      name: "Distance Conversion",
      fields: [
        { name: "value", label: "Distance Value", type: "number", placeholder: "e.g. 100" },
        { name: "from", label: "From", type: "select", options: distOptions },
        { name: "to", label: "To", type: "select", options: distOptions },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "nmi";
        const to = (inputs.to as string) || "km";
        if (!val) return null;
        const baseNmi = val * toNmi[from];
        const result = baseNmi / toNmi[to];
        return {
          primary: { label: `${formatNumber(val, 4)} ${from}`, value: `${formatNumber(result, 6)} ${to}` },
          details: [
            { label: "Base value (nmi)", value: formatNumber(baseNmi, 6) },
            { label: "km equivalent", value: formatNumber(baseNmi / toNmi["km"], 4) },
            { label: "miles equivalent", value: formatNumber(baseNmi / toNmi["miles"], 4) },
            { label: "Reference", value: "1 nmi = 1.852 km" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["map-scale-calculator", "astronomical-unit-converter"],
  faq: [
    { question: "What is a knot?", answer: "A knot is one nautical mile per hour, which equals 1.852 km/h or approximately 1.151 mph. It is the standard speed unit in maritime and aviation." },
    { question: "How long is a nautical mile?", answer: "One nautical mile equals 1.852 kilometres or approximately 1.151 statute miles. It is based on one minute of arc of latitude." },
  ],
  formula: "1 knot = 1.852 km/h = 1.151 mph. 1 nautical mile = 1.852 km = 1.151 miles.",
};
