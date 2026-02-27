import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nauticalMilesToKmCalculator: CalculatorDefinition = {
  slug: "nautical-miles-to-km",
  title: "Nautical Miles to Kilometers Converter",
  description:
    "Convert between nautical miles, kilometers, and statute miles. Essential for maritime navigation, aviation, and oceanography.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "nautical miles",
    "kilometers",
    "knots",
    "navigation",
    "maritime",
    "aviation",
    "nmi",
    "statute miles",
    "sea miles",
  ],
  variants: [
    {
      slug: "nmi-to-km",
      title: "Nautical Miles to Kilometers",
      fields: [
        {
          name: "nmi",
          label: "Distance (Nautical Miles)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const nmi = parseFloat(inputs.nmi as string);
        if (isNaN(nmi)) return { error: "Please enter a valid nautical mile value." };

        const km = nmi * 1.852;
        const mi = nmi * 1.15078;
        const meters = km * 1000;
        const feet = mi * 5280;
        const yards = feet / 3;

        return {
          results: [
            { label: "Kilometers (km)", value: formatNumber(km) },
            { label: "Statute Miles (mi)", value: formatNumber(mi) },
            { label: "Meters (m)", value: formatNumber(meters) },
            { label: "Feet (ft)", value: formatNumber(feet) },
            { label: "Yards (yd)", value: formatNumber(yards) },
          ],
        };
      },
    },
    {
      slug: "km-to-nmi",
      title: "Kilometers to Nautical Miles",
      fields: [
        {
          name: "km",
          label: "Distance (Kilometers)",
          type: "number",
        },
      ],
      calculate(inputs) {
        const km = parseFloat(inputs.km as string);
        if (isNaN(km)) return { error: "Please enter a valid kilometer value." };

        const nmi = km / 1.852;
        const mi = km * 0.621371;
        const meters = km * 1000;
        const feet = meters * 3.28084;

        return {
          results: [
            { label: "Nautical Miles (nmi)", value: formatNumber(nmi) },
            { label: "Statute Miles (mi)", value: formatNumber(mi) },
            { label: "Meters (m)", value: formatNumber(meters) },
            { label: "Feet (ft)", value: formatNumber(feet) },
          ],
        };
      },
    },
    {
      slug: "speed-conversion",
      title: "Knots / MPH / km/h Converter",
      fields: [
        {
          name: "speed",
          label: "Speed Value",
          type: "number",
        },
        {
          name: "unit",
          label: "Input Unit",
          type: "select",
          options: [
            { label: "Knots (nmi/h)", value: "knots" },
            { label: "Miles per Hour (mph)", value: "mph" },
            { label: "Kilometers per Hour (km/h)", value: "kmh" },
          ],
        },
      ],
      calculate(inputs) {
        const speed = parseFloat(inputs.speed as string);
        const unit = inputs.unit as string;
        if (isNaN(speed)) return { error: "Please enter a valid speed value." };

        let knots: number;
        if (unit === "knots") knots = speed;
        else if (unit === "mph") knots = speed * 0.868976;
        else knots = speed * 0.539957;

        const mph = knots * 1.15078;
        const kmh = knots * 1.852;
        const mps = kmh / 3.6;
        const fps = mps * 3.28084;

        return {
          results: [
            { label: "Knots (nmi/h)", value: formatNumber(knots) },
            { label: "Miles per Hour (mph)", value: formatNumber(mph) },
            { label: "Kilometers per Hour (km/h)", value: formatNumber(kmh) },
            { label: "Meters per Second (m/s)", value: formatNumber(mps) },
            { label: "Feet per Second (ft/s)", value: formatNumber(fps) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["light-years-to-km", "gallons-per-minute", "stone-to-pounds-calc"],
  faq: [
    {
      question: "How many kilometers are in a nautical mile?",
      answer:
        "One nautical mile equals exactly 1.852 kilometers. The nautical mile is based on the circumference of the Earth - it equals one minute of latitude (1/60 of a degree).",
    },
    {
      question: "What is the difference between a nautical mile and a statute mile?",
      answer:
        "A nautical mile (1.852 km) is about 15% longer than a statute mile (1.609 km). Nautical miles are used in maritime and aviation navigation because they directly relate to degrees of latitude on Earth's surface.",
    },
    {
      question: "What is a knot?",
      answer:
        "A knot is one nautical mile per hour (1.852 km/h or 1.151 mph). The term comes from the historical method of measuring ship speed by counting knots on a line over a fixed time interval.",
    },
  ],
  formula:
    "km = nmi x 1.852 | nmi = km / 1.852 | 1 knot = 1 nmi/h = 1.852 km/h = 1.15078 mph",
};
