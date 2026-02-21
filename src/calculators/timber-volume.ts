import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timberVolumeCalculator: CalculatorDefinition = {
  slug: "timber-volume-calculator",
  title: "Timber Volume Calculator",
  description: "Free timber volume calculator. Estimate log board feet using the Doyle rule from diameter and length measurements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["timber", "volume", "board feet", "Doyle rule", "log", "lumber", "calculator"],
  variants: [
    {
      id: "convert",
      name: "Calculate Board Feet (Doyle Rule)",
      fields: [
        { name: "diameter", label: "Small-end Diameter (inches)", type: "number", placeholder: "e.g. 16" },
        { name: "length", label: "Log Length (feet)", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const length = inputs.length as number;
        if (!diameter || !length) return null;
        // Doyle rule: BF = (D - 4)² × L / 16
        const dMinus4 = diameter - 4;
        if (dMinus4 <= 0) {
          return {
            primary: { label: "Board Feet", value: "0 BF" },
            details: [
              { label: "Error", value: "Diameter must be greater than 4 inches for Doyle rule" },
            ],
          };
        }
        const boardFeet = (dMinus4 * dMinus4 * length) / 16;
        // Also show Scribner rule estimate for comparison
        const scribnerEstimate = (0.79 * diameter * diameter - 2 * diameter - 4) * (length / 16);
        // Cubic volume of log (cylinder approximation)
        const radiusFt = diameter / 2 / 12;
        const cubicFt = Math.PI * radiusFt * radiusFt * length;
        return {
          primary: { label: "Board Feet (Doyle)", value: `${formatNumber(boardFeet, 2)} BF` },
          details: [
            { label: "Diameter", value: `${formatNumber(diameter, 1)} inches` },
            { label: "Length", value: `${formatNumber(length, 1)} feet` },
            { label: "Board Feet (Doyle)", value: formatNumber(boardFeet, 2) },
            { label: "Scribner Estimate", value: `${formatNumber(scribnerEstimate, 2)} BF` },
            { label: "Cylinder Volume", value: `${formatNumber(cubicFt, 2)} cubic feet` },
            { label: "Formula", value: `(${formatNumber(diameter, 0)} - 4)² × ${formatNumber(length, 0)} / 16` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wire-length-calculator", "fabric-converter"],
  faq: [
    { question: "What is the Doyle rule?", answer: "The Doyle log rule estimates lumber yield in board feet using: BF = (D-4)² × L / 16, where D is the small-end diameter in inches and L is the length in feet." },
    { question: "What is a board foot?", answer: "A board foot is a unit of lumber volume equal to a piece of wood 1 foot long, 1 foot wide, and 1 inch thick (144 cubic inches)." },
  ],
  formula: "Doyle Rule: Board Feet = (D - 4)² × L / 16, where D = small-end diameter (inches), L = length (feet).",
};
