import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

// Conversion factors to kilometres
const toKm: Record<string, number> = {
  "AU": 149597870.7,       // 1 AU = 149,597,870.7 km
  "km": 1,
  "miles": 1.60934,        // 1 mile = 1.60934 km
  "ly": 9.461e12,          // 1 light-year = 9.461 × 10¹² km
  "pc": 3.086e13,          // 1 parsec = 3.086 × 10¹³ km
};

const unitLabels: Record<string, string> = {
  "AU": "Astronomical Units (AU)",
  "km": "Kilometres (km)",
  "miles": "Miles (mi)",
  "ly": "Light-years (ly)",
  "pc": "Parsecs (pc)",
};

const unitOptions = Object.keys(toKm).map((u) => ({ label: unitLabels[u], value: u }));

export const astronomicalUnitConverter: CalculatorDefinition = {
  slug: "astronomical-unit-converter",
  title: "Astronomical Unit Converter",
  description: "Free astronomical unit converter. Convert between AU, kilometres, miles, light-years, and parsecs for space distances.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["astronomical unit", "AU", "light-year", "parsec", "space", "distance", "converter"],
  variants: [
    {
      id: "convert",
      name: "Convert",
      fields: [
        { name: "value", label: "Value", type: "number", placeholder: "e.g. 1" },
        { name: "from", label: "From", type: "select", options: unitOptions },
        { name: "to", label: "To", type: "select", options: unitOptions },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const from = (inputs.from as string) || "AU";
        const to = (inputs.to as string) || "km";
        if (!val) return null;
        const baseKm = val * toKm[from];
        const result = baseKm / toKm[to];
        return {
          primary: { label: `${formatNumber(val, 6)} ${from}`, value: `${formatNumber(result, 6)} ${to}` },
          details: [
            { label: "Base value (km)", value: formatNumber(baseKm, 2) },
            { label: "In AU", value: formatNumber(baseKm / toKm["AU"], 8) },
            { label: "In light-years", value: formatNumber(baseKm / toKm["ly"], 10) },
            { label: "In parsecs", value: formatNumber(baseKm / toKm["pc"], 10) },
            { label: "In miles", value: formatNumber(baseKm / toKm["miles"], 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["nautical-converter", "map-scale-calculator"],
  faq: [
    { question: "What is an Astronomical Unit?", answer: "One AU is the average distance from Earth to the Sun, approximately 149,597,870.7 km (about 93 million miles)." },
    { question: "How far is one light-year?", answer: "One light-year is the distance light travels in one year, approximately 9.461 trillion km (5.879 trillion miles)." },
    { question: "What is a parsec?", answer: "A parsec is approximately 3.086 × 10¹³ km, or about 3.26 light-years. It is defined as the distance at which 1 AU subtends an angle of one arcsecond." },
  ],
  formula: "1 AU = 149,597,870.7 km. 1 ly = 9.461 × 10¹² km. 1 pc = 3.086 × 10¹³ km. 1 mile = 1.60934 km.",
};
