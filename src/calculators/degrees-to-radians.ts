import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const degreesToRadiansConverter: CalculatorDefinition = {
  slug: "degrees-to-radians-converter",
  title: "Degrees to Radians Converter",
  description: "Free degrees to radians converter. Convert degrees to radians instantly with exact pi notation. Includes common angle reference table.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["degrees to radians", "deg to rad", "angle converter", "degree radian conversion", "trigonometry converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Degrees to Radians",
      fields: [
        { name: "value", label: "Degrees (\u00b0)", type: "number", placeholder: "e.g. 180" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (value === undefined) return null;
        const radians = value * Math.PI / 180;
        const piMultiple = value / 180;
        const gradians = value / 0.9;
        const turns = value / 360;
        let piNotation = `${formatNumber(piMultiple, 6)}\u03c0`;
        if (Math.abs(piMultiple - Math.round(piMultiple)) < 0.00001) {
          const rounded = Math.round(piMultiple);
          piNotation = rounded === 1 ? "\u03c0" : rounded === -1 ? "-\u03c0" : rounded === 0 ? "0" : `${rounded}\u03c0`;
        } else {
          const fractions = [
            [1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6],
            [5, 4], [4, 3], [3, 2], [5, 3], [7, 4], [11, 6],
          ];
          for (const [n, d] of fractions) {
            if (Math.abs(piMultiple - n / d) < 0.00001) {
              piNotation = n === 1 ? `\u03c0/${d}` : `${n}\u03c0/${d}`;
              break;
            }
            if (Math.abs(piMultiple + n / d) < 0.00001) {
              piNotation = n === 1 ? `-\u03c0/${d}` : `-${n}\u03c0/${d}`;
              break;
            }
          }
        }
        return {
          primary: { label: `${formatNumber(value)}\u00b0`, value: `${formatNumber(radians, 6)} rad` },
          details: [
            { label: "Radians (decimal)", value: formatNumber(radians, 8) },
            { label: "Radians (\u03c0 notation)", value: piNotation },
            { label: "Gradians", value: formatNumber(gradians, 4) },
            { label: "Turns", value: formatNumber(turns, 6) },
            { label: "sin(\u03b8)", value: formatNumber(Math.sin(radians), 8) },
            { label: "cos(\u03b8)", value: formatNumber(Math.cos(radians), 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["radians-to-degrees-converter", "angle-converter", "scientific-calculator"],
  faq: [
    { question: "How do I convert degrees to radians?", answer: "Multiply degrees by \u03c0/180. For example, 90\u00b0 = 90 \u00d7 \u03c0/180 = \u03c0/2 \u2248 1.5708 radians. Common conversions: 30\u00b0=\u03c0/6, 45\u00b0=\u03c0/4, 60\u00b0=\u03c0/3, 180\u00b0=\u03c0, 360\u00b0=2\u03c0." },
    { question: "Why do we use radians?", answer: "Radians are the natural unit for measuring angles in mathematics and physics. They simplify many formulas: arc length = r\u03b8, sector area = \u00bdr\u00b2\u03b8, and derivatives of trig functions are cleaner in radians." },
  ],
  formula: "Radians = Degrees \u00d7 \u03c0/180 | 180\u00b0 = \u03c0 rad | 360\u00b0 = 2\u03c0 rad | 1\u00b0 \u2248 0.01745 rad",
};
