import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lbsToNewtonsConverter: CalculatorDefinition = {
  slug: "lbs-to-newtons-converter",
  title: "Pounds to Newtons Converter",
  description: "Free pounds to Newtons converter. Convert pound-force (lbf) to Newtons (N) instantly with accurate conversion factors.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["lbs to newtons", "pounds to newtons", "lbf to n", "pound force to newtons", "force converter"],
  variants: [
    {
      id: "convert",
      name: "Convert lbs to Newtons",
      fields: [
        { name: "value", label: "Pounds-force (lbf)", type: "number", placeholder: "e.g. 10" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Pounds to Newtons", value: "lbf_to_n" },
          { label: "Newtons to Pounds", value: "n_to_lbf" },
        ], defaultValue: "lbf_to_n" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        const factor = 4.44822;
        if (direction === "n_to_lbf") {
          const lbf = value / factor;
          return {
            primary: { label: `${formatNumber(value)} N`, value: `${formatNumber(lbf, 4)} lbf` },
            details: [
              { label: "Pounds-force (lbf)", value: formatNumber(lbf, 6) },
              { label: "Kilonewtons (kN)", value: formatNumber(value / 1000, 6) },
              { label: "Kilograms-force (kgf)", value: formatNumber(value / 9.80665, 6) },
              { label: "Dynes", value: formatNumber(value * 100000, 0) },
            ],
          };
        }
        const newtons = value * factor;
        return {
          primary: { label: `${formatNumber(value)} lbf`, value: `${formatNumber(newtons, 4)} N` },
          details: [
            { label: "Newtons (N)", value: formatNumber(newtons, 6) },
            { label: "Kilonewtons (kN)", value: formatNumber(newtons / 1000, 6) },
            { label: "Kilograms-force (kgf)", value: formatNumber(newtons / 9.80665, 6) },
            { label: "Dynes", value: formatNumber(newtons * 100000, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "force-calculator", "acceleration-calculator"],
  faq: [
    { question: "How many Newtons are in a pound?", answer: "1 pound-force (lbf) = 4.44822 Newtons (N). To convert, multiply the number of pounds by 4.44822." },
    { question: "What is a Newton?", answer: "A Newton (N) is the SI unit of force. It is the force needed to accelerate 1 kilogram at 1 meter per second squared (1 N = 1 kg·m/s²)." },
  ],
  formula: "1 lbf = 4.44822 N | 1 N = 0.224809 lbf | 1 kgf = 9.80665 N",
};
