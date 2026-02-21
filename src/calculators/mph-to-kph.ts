import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mphToKphConverter: CalculatorDefinition = {
  slug: "mph-to-kph-converter",
  title: "MPH to KPH Converter",
  description:
    "Free miles per hour to kilometers per hour converter. Quickly convert MPH to KPH with our easy calculator. 1 mph = 1.60934 kph.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: [
    "mph to kph",
    "miles per hour to kilometers per hour",
    "speed converter",
    "mph converter",
    "kph converter",
  ],
  variants: [
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
        const fps = mph * 1.46667;
        return {
          primary: {
            label: `${formatNumber(mph, 4)} MPH`,
            value: `${formatNumber(kph, 4)} KPH`,
          },
          details: [
            { label: "Kilometers per Hour", value: formatNumber(kph, 4) },
            { label: "Meters per Second", value: formatNumber(mps, 4) },
            { label: "Knots", value: formatNumber(knots, 4) },
            { label: "Feet per Second", value: formatNumber(fps, 4) },
          ],
        };
      },
    },
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
        return {
          primary: {
            label: `${formatNumber(kph, 4)} KPH`,
            value: `${formatNumber(mph, 4)} MPH`,
          },
          details: [
            { label: "Miles per Hour", value: formatNumber(mph, 4) },
            { label: "Meters per Second", value: formatNumber(mps, 4) },
            { label: "Knots", value: formatNumber(knots, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kph-to-mph-converter", "speed-converter", "unit-converter"],
  faq: [
    {
      question: "How do I convert MPH to KPH?",
      answer:
        "Multiply the speed in MPH by 1.60934. For example, 60 MPH = 60 × 1.60934 = 96.56 KPH.",
    },
    {
      question: "What is 100 KPH in MPH?",
      answer:
        "100 KPH equals approximately 62.14 MPH (100 × 0.621371).",
    },
  ],
  formula: "KPH = MPH × 1.60934 | MPH = KPH × 0.621371",
};
