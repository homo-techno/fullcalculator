import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const radiansToDegreesConverter: CalculatorDefinition = {
  slug: "radians-to-degrees-converter",
  title: "Radians to Degrees Converter",
  description: "Free radians to degrees converter. Convert radians to degrees instantly. Enter decimal radians or multiples of pi.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["radians to degrees", "rad to deg", "radian converter", "radian to degree conversion", "pi to degrees"],
  variants: [
    {
      id: "convert",
      name: "Convert Radians to Degrees",
      fields: [
        { name: "value", label: "Radians", type: "number", placeholder: "e.g. 3.14159" },
        { name: "inputType", label: "Input Type", type: "select", options: [
          { label: "Decimal Radians", value: "decimal" },
          { label: "Multiples of \u03c0 (enter multiplier)", value: "pi" },
        ], defaultValue: "decimal" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const inputType = inputs.inputType as string;
        if (value === undefined) return null;
        const radians = inputType === "pi" ? value * Math.PI : value;
        const degrees = radians * 180 / Math.PI;
        const gradians = degrees / 0.9;
        const turns = degrees / 360;
        const dmsD = Math.floor(Math.abs(degrees));
        const dmsM = Math.floor((Math.abs(degrees) - dmsD) * 60);
        const dmsS = ((Math.abs(degrees) - dmsD) * 60 - dmsM) * 60;
        const sign = degrees < 0 ? "-" : "";
        return {
          primary: { label: inputType === "pi" ? `${formatNumber(value, 4)}\u03c0 rad` : `${formatNumber(radians, 6)} rad`, value: `${formatNumber(degrees, 6)}\u00b0` },
          details: [
            { label: "Degrees (decimal)", value: `${formatNumber(degrees, 6)}\u00b0` },
            { label: "DMS", value: `${sign}${dmsD}\u00b0 ${dmsM}' ${formatNumber(dmsS, 2)}"` },
            { label: "Gradians", value: formatNumber(gradians, 4) },
            { label: "Turns", value: formatNumber(turns, 6) },
            { label: "sin(\u03b8)", value: formatNumber(Math.sin(radians), 8) },
            { label: "cos(\u03b8)", value: formatNumber(Math.cos(radians), 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["degrees-to-radians-converter", "angle-converter", "scientific-calculator"],
  faq: [
    { question: "How do I convert radians to degrees?", answer: "Multiply radians by 180/\u03c0. For example, \u03c0/2 radians = (\u03c0/2) \u00d7 (180/\u03c0) = 90\u00b0. Key values: \u03c0 rad = 180\u00b0, 2\u03c0 rad = 360\u00b0, 1 rad \u2248 57.2958\u00b0." },
    { question: "What is 1 radian in degrees?", answer: "1 radian \u2248 57.2958 degrees. A radian is the angle subtended at the center of a circle by an arc equal in length to the radius. A full circle is 2\u03c0 \u2248 6.2832 radians." },
  ],
  formula: "Degrees = Radians \u00d7 180/\u03c0 | 1 rad \u2248 57.2958\u00b0 | \u03c0 rad = 180\u00b0 | 2\u03c0 rad = 360\u00b0",
};
