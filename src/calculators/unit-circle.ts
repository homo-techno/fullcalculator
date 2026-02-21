import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const unitCircleCalculator: CalculatorDefinition = {
  slug: "unit-circle-calculator",
  title: "Unit Circle Calculator",
  description: "Free unit circle calculator. Find exact coordinates, trig values, and reference angles for any angle on the unit circle.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["unit circle calculator", "unit circle values", "unit circle coordinates", "reference angle", "exact trig values"],
  variants: [
    {
      id: "angle-lookup",
      name: "Unit Circle Coordinates",
      description: "Find (cos θ, sin θ) and all trig values for an angle",
      fields: [
        { name: "angle", label: "Angle", type: "number", placeholder: "e.g. 60" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Degrees", value: "deg" },
          { label: "Radians (as multiple of π, e.g. 0.25 = π/4)", value: "rad" },
        ], defaultValue: "deg" },
      ],
      calculate: (inputs) => {
        const angle = inputs.angle as number;
        const unit = inputs.unit as string;
        if (angle === undefined) return null;

        let rad: number;
        let deg: number;
        if (unit === "rad") {
          rad = angle * Math.PI;
          deg = angle * 180;
        } else {
          deg = angle;
          rad = (angle * Math.PI) / 180;
        }

        // Normalize to [0, 360)
        let normDeg = ((deg % 360) + 360) % 360;

        const cosVal = Math.cos(rad);
        const sinVal = Math.sin(rad);

        // Reference angle
        let refAngle: number;
        if (normDeg <= 90) refAngle = normDeg;
        else if (normDeg <= 180) refAngle = 180 - normDeg;
        else if (normDeg <= 270) refAngle = normDeg - 180;
        else refAngle = 360 - normDeg;

        // Quadrant
        let quadrant: string;
        if (normDeg >= 0 && normDeg < 90) quadrant = "I (sin+, cos+)";
        else if (normDeg >= 90 && normDeg < 180) quadrant = "II (sin+, cos-)";
        else if (normDeg >= 180 && normDeg < 270) quadrant = "III (sin-, cos-)";
        else quadrant = "IV (sin-, cos+)";

        // Check for exact values
        const exactValues: Record<number, string> = {
          0: "(1, 0)",
          30: "(√3/2, 1/2)",
          45: "(√2/2, √2/2)",
          60: "(1/2, √3/2)",
          90: "(0, 1)",
          120: "(-1/2, √3/2)",
          135: "(-√2/2, √2/2)",
          150: "(-√3/2, 1/2)",
          180: "(-1, 0)",
          210: "(-√3/2, -1/2)",
          225: "(-√2/2, -√2/2)",
          240: "(-1/2, -√3/2)",
          270: "(0, -1)",
          300: "(1/2, -√3/2)",
          315: "(√2/2, -√2/2)",
          330: "(√3/2, -1/2)",
          360: "(1, 0)",
        };

        const exact = exactValues[normDeg];

        return {
          primary: { label: `(cos θ, sin θ)`, value: `(${formatNumber(cosVal, 8)}, ${formatNumber(sinVal, 8)})` },
          details: [
            { label: "cos θ (x)", value: formatNumber(cosVal, 10) },
            { label: "sin θ (y)", value: formatNumber(sinVal, 10) },
            { label: "tan θ", value: Math.abs(cosVal) < 1e-10 ? "undefined" : formatNumber(sinVal / cosVal, 10) },
            { label: "Quadrant", value: quadrant },
            { label: "Reference angle", value: formatNumber(refAngle, 4) + "°" },
            { label: "Normalized angle", value: formatNumber(normDeg, 4) + "°" },
            { label: "Exact coordinates", value: exact || "Use decimal approximation" },
            { label: "Radians", value: formatNumber(rad, 8) + " rad" },
          ],
        };
      },
    },
    {
      id: "common-angles",
      name: "Common Angle Lookup",
      description: "Look up exact values for standard unit circle angles",
      fields: [
        { name: "angle", label: "Standard Angle", type: "select", options: [
          { label: "0° (0)", value: "0" },
          { label: "30° (π/6)", value: "30" },
          { label: "45° (π/4)", value: "45" },
          { label: "60° (π/3)", value: "60" },
          { label: "90° (π/2)", value: "90" },
          { label: "120° (2π/3)", value: "120" },
          { label: "135° (3π/4)", value: "135" },
          { label: "150° (5π/6)", value: "150" },
          { label: "180° (π)", value: "180" },
          { label: "210° (7π/6)", value: "210" },
          { label: "225° (5π/4)", value: "225" },
          { label: "240° (4π/3)", value: "240" },
          { label: "270° (3π/2)", value: "270" },
          { label: "300° (5π/3)", value: "300" },
          { label: "315° (7π/4)", value: "315" },
          { label: "330° (11π/6)", value: "330" },
        ], defaultValue: "30" },
      ],
      calculate: (inputs) => {
        const degStr = inputs.angle as string;
        const deg = parseInt(degStr);
        const rad = (deg * Math.PI) / 180;

        const exactSin: Record<number, string> = {
          0: "0", 30: "1/2", 45: "√2/2", 60: "√3/2", 90: "1",
          120: "√3/2", 135: "√2/2", 150: "1/2", 180: "0",
          210: "-1/2", 225: "-√2/2", 240: "-√3/2", 270: "-1",
          300: "-√3/2", 315: "-√2/2", 330: "-1/2",
        };

        const exactCos: Record<number, string> = {
          0: "1", 30: "√3/2", 45: "√2/2", 60: "1/2", 90: "0",
          120: "-1/2", 135: "-√2/2", 150: "-√3/2", 180: "-1",
          210: "-√3/2", 225: "-√2/2", 240: "-1/2", 270: "0",
          300: "1/2", 315: "√2/2", 330: "√3/2",
        };

        const exactTan: Record<number, string> = {
          0: "0", 30: "√3/3", 45: "1", 60: "√3", 90: "undefined",
          120: "-√3", 135: "-1", 150: "-√3/3", 180: "0",
          210: "√3/3", 225: "1", 240: "√3", 270: "undefined",
          300: "-√3", 315: "-1", 330: "-√3/3",
        };

        const radianStr: Record<number, string> = {
          0: "0", 30: "π/6", 45: "π/4", 60: "π/3", 90: "π/2",
          120: "2π/3", 135: "3π/4", 150: "5π/6", 180: "π",
          210: "7π/6", 225: "5π/4", 240: "4π/3", 270: "3π/2",
          300: "5π/3", 315: "7π/4", 330: "11π/6",
        };

        return {
          primary: { label: `${deg}° = ${radianStr[deg]}`, value: `(${exactCos[deg]}, ${exactSin[deg]})` },
          details: [
            { label: "sin (exact)", value: exactSin[deg] },
            { label: "cos (exact)", value: exactCos[deg] },
            { label: "tan (exact)", value: exactTan[deg] },
            { label: "sin (decimal)", value: formatNumber(Math.sin(rad), 10) },
            { label: "cos (decimal)", value: formatNumber(Math.cos(rad), 10) },
            { label: "Radians", value: radianStr[deg] + ` ≈ ${formatNumber(rad, 6)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["trig-calculator", "inverse-trig-calculator", "law-of-cosines-calculator"],
  faq: [
    { question: "What is the unit circle?", answer: "The unit circle is a circle with radius 1 centered at the origin. For any angle θ, the point on the unit circle is (cos θ, sin θ). It provides a geometric way to understand trig functions for all angles, not just those in right triangles." },
    { question: "What are the key angles to memorize?", answer: "Memorize 0°, 30°, 45°, 60°, 90° and their multiples. Key coordinates: 30° → (√3/2, 1/2), 45° → (√2/2, √2/2), 60° → (1/2, √3/2). Other angles use the same values with appropriate signs based on quadrant." },
  ],
  formula: "Point on unit circle: (cos θ, sin θ) | x²+y²=1 | Reference angle determines the absolute values",
};
