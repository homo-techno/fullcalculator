import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const charlesLawCalculator: CalculatorDefinition = {
  slug: "charles-law-calculator",
  title: "Charles's Law Calculator",
  description:
    "Free Charles's Law calculator. Compute volume or temperature using V1/T1 = V2/T2 for an ideal gas at constant pressure.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "charles law",
    "volume temperature",
    "ideal gas",
    "isobaric",
    "kelvin",
  ],
  variants: [
    {
      id: "find-v2",
      name: "Find V2",
      fields: [
        {
          name: "v1",
          label: "Initial Volume (V1) in L",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "t1",
          label: "Initial Temperature (T1) in K",
          type: "number",
          placeholder: "e.g. 300",
        },
        {
          name: "t2",
          label: "Final Temperature (T2) in K",
          type: "number",
          placeholder: "e.g. 600",
        },
      ],
      calculate: (inputs) => {
        const v1 = inputs.v1 as number;
        const t1 = inputs.t1 as number;
        const t2 = inputs.t2 as number;
        if (!v1 || !t1 || !t2) return null;
        if (t1 <= 0 || t2 <= 0) return null;
        const v2 = (v1 * t2) / t1;
        return {
          primary: { label: "Final Volume (V2)", value: formatNumber(v2, 4) + " L" },
          details: [
            { label: "V1", value: formatNumber(v1, 4) + " L" },
            { label: "T1", value: formatNumber(t1, 2) + " K" },
            { label: "T2", value: formatNumber(t2, 2) + " K" },
            { label: "V1/T1", value: formatNumber(v1 / t1, 6) },
          ],
        };
      },
    },
    {
      id: "find-t2",
      name: "Find T2",
      fields: [
        {
          name: "v1",
          label: "Initial Volume (V1) in L",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "t1",
          label: "Initial Temperature (T1) in K",
          type: "number",
          placeholder: "e.g. 300",
        },
        {
          name: "v2",
          label: "Final Volume (V2) in L",
          type: "number",
          placeholder: "e.g. 10",
        },
      ],
      calculate: (inputs) => {
        const v1 = inputs.v1 as number;
        const t1 = inputs.t1 as number;
        const v2 = inputs.v2 as number;
        if (!v1 || !t1 || !v2) return null;
        if (t1 <= 0) return null;
        const t2 = (v2 * t1) / v1;
        return {
          primary: {
            label: "Final Temperature (T2)",
            value: formatNumber(t2, 2) + " K",
          },
          details: [
            { label: "V1", value: formatNumber(v1, 4) + " L" },
            { label: "T1", value: formatNumber(t1, 2) + " K" },
            { label: "V2", value: formatNumber(v2, 4) + " L" },
            {
              label: "T2 in °C",
              value: formatNumber(t2 - 273.15, 2) + " °C",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["boyles-law-calculator", "dilution-calculator"],
  faq: [
    {
      question: "What is Charles's Law?",
      answer:
        "Charles's Law states that the volume of an ideal gas is directly proportional to its absolute temperature when pressure is held constant: V1/T1 = V2/T2.",
    },
    {
      question: "Why must temperature be in Kelvin?",
      answer:
        "Kelvin is an absolute temperature scale starting at absolute zero. Using Celsius or Fahrenheit would produce incorrect results because they can be zero or negative, breaking the proportional relationship.",
    },
  ],
  formula:
    "V1 / T1 = V2 / T2, where V is volume and T is absolute temperature in Kelvin at constant pressure.",
};
