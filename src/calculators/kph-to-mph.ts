import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kphToMphConverter: CalculatorDefinition = {
  slug: "kph-to-mph-converter",
  title: "KPH to MPH Converter",
  description:
    "Free kilometers per hour to miles per hour converter. Quickly convert KPH to MPH with our easy calculator. 1 kph = 0.621371 mph.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "kph to mph",
    "kilometers per hour to miles per hour",
    "speed converter",
    "kph converter",
    "mph converter",
  ],
  variants: [
    {
      id: "kph-to-mph",
      name: "KPH to MPH",
      fields: [
        {
          name: "kph",
          label: "Kilometers per Hour (KPH)",
          type: "number",
          placeholder: "e.g. 100",
        },
      ],
      calculate: (inputs) => {
        const kph = inputs.kph as number;
        if (kph === undefined || kph === null) return null;
        const mph = kph * 0.621371;
        const mps = kph / 3.6;
        const knots = kph * 0.539957;
        const fps = mph * 1.46667;
        return {
          primary: {
            label: `${formatNumber(kph, 4)} KPH`,
            value: `${formatNumber(mph, 4)} MPH`,
          },
          details: [
            { label: "Miles per Hour", value: formatNumber(mph, 4) },
            { label: "Meters per Second", value: formatNumber(mps, 4) },
            { label: "Knots", value: formatNumber(knots, 4) },
            { label: "Feet per Second", value: formatNumber(fps, 4) },
          ],
        };
      },
    },
    {
      id: "mph-to-kph",
      name: "MPH to KPH",
      fields: [
        {
          name: "mph",
          label: "Miles per Hour (MPH)",
          type: "number",
          placeholder: "e.g. 60",
        },
      ],
      calculate: (inputs) => {
        const mph = inputs.mph as number;
        if (mph === undefined || mph === null) return null;
        const kph = mph * 1.60934;
        const mps = mph * 0.44704;
        const knots = mph * 0.868976;
        return {
          primary: {
            label: `${formatNumber(mph, 4)} MPH`,
            value: `${formatNumber(kph, 4)} KPH`,
          },
          details: [
            { label: "Kilometers per Hour", value: formatNumber(kph, 4) },
            { label: "Meters per Second", value: formatNumber(mps, 4) },
            { label: "Knots", value: formatNumber(knots, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mph-to-kph-converter", "speed-converter", "unit-converter"],
  faq: [
    {
      question: "How do I convert KPH to MPH?",
      answer:
        "Multiply the speed in KPH by 0.621371. For example, 100 KPH = 100 × 0.621371 = 62.14 MPH.",
    },
    {
      question: "What is 60 MPH in KPH?",
      answer:
        "60 MPH equals approximately 96.56 KPH (60 × 1.60934).",
    },
  ],
  formula: "MPH = KPH × 0.621371 | KPH = MPH × 1.60934",
};
