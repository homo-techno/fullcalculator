import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inverseTrigCalculator: CalculatorDefinition = {
  slug: "inverse-trig-calculator",
  title: "Inverse Trigonometry Calculator",
  description: "Free inverse trigonometry calculator. Calculate arcsin, arccos, arctan (sin⁻¹, cos⁻¹, tan⁻¹) in degrees and radians.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["inverse trig calculator", "arcsin calculator", "arccos calculator", "arctan calculator", "inverse sine cosine tangent"],
  variants: [
    {
      id: "arcsin",
      name: "Arcsin (sin⁻¹)",
      description: "Find the angle whose sine is x",
      fields: [
        { name: "value", label: "sin⁻¹(x), where x =", type: "number", placeholder: "e.g. 0.5", min: -1, max: 1, step: 0.01 },
      ],
      calculate: (inputs) => {
        const x = inputs.value as number;
        if (x === undefined || x < -1 || x > 1) return null;

        const rad = Math.asin(x);
        const deg = (rad * 180) / Math.PI;

        return {
          primary: { label: `sin⁻¹(${x})`, value: formatNumber(deg, 8) + "°" },
          details: [
            { label: "Degrees", value: formatNumber(deg, 8) + "°" },
            { label: "Radians", value: formatNumber(rad, 8) + " rad" },
            { label: "Domain", value: "-1 ≤ x ≤ 1" },
            { label: "Range", value: "-90° ≤ θ ≤ 90° (-π/2 ≤ θ ≤ π/2)" },
            { label: "Verification: sin(θ)", value: formatNumber(Math.sin(rad), 10) },
          ],
        };
      },
    },
    {
      id: "arccos",
      name: "Arccos (cos⁻¹)",
      description: "Find the angle whose cosine is x",
      fields: [
        { name: "value", label: "cos⁻¹(x), where x =", type: "number", placeholder: "e.g. 0.5", min: -1, max: 1, step: 0.01 },
      ],
      calculate: (inputs) => {
        const x = inputs.value as number;
        if (x === undefined || x < -1 || x > 1) return null;

        const rad = Math.acos(x);
        const deg = (rad * 180) / Math.PI;

        return {
          primary: { label: `cos⁻¹(${x})`, value: formatNumber(deg, 8) + "°" },
          details: [
            { label: "Degrees", value: formatNumber(deg, 8) + "°" },
            { label: "Radians", value: formatNumber(rad, 8) + " rad" },
            { label: "Domain", value: "-1 ≤ x ≤ 1" },
            { label: "Range", value: "0° ≤ θ ≤ 180° (0 ≤ θ ≤ π)" },
            { label: "Verification: cos(θ)", value: formatNumber(Math.cos(rad), 10) },
          ],
        };
      },
    },
    {
      id: "arctan",
      name: "Arctan (tan⁻¹)",
      description: "Find the angle whose tangent is x",
      fields: [
        { name: "value", label: "tan⁻¹(x), where x =", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const x = inputs.value as number;
        if (x === undefined) return null;

        const rad = Math.atan(x);
        const deg = (rad * 180) / Math.PI;

        return {
          primary: { label: `tan⁻¹(${x})`, value: formatNumber(deg, 8) + "°" },
          details: [
            { label: "Degrees", value: formatNumber(deg, 8) + "°" },
            { label: "Radians", value: formatNumber(rad, 8) + " rad" },
            { label: "Domain", value: "All real numbers" },
            { label: "Range", value: "-90° < θ < 90° (-π/2 < θ < π/2)" },
            { label: "Verification: tan(θ)", value: formatNumber(Math.tan(rad), 10) },
          ],
        };
      },
    },
    {
      id: "atan2",
      name: "Arctan2 (two-argument)",
      description: "Find angle from coordinates (y, x) in correct quadrant",
      fields: [
        { name: "y", label: "y coordinate", type: "number", placeholder: "e.g. 1" },
        { name: "x", label: "x coordinate", type: "number", placeholder: "e.g. 1" },
      ],
      calculate: (inputs) => {
        const y = inputs.y as number;
        const x = inputs.x as number;
        if (y === undefined || x === undefined) return null;
        if (y === 0 && x === 0) return null;

        const rad = Math.atan2(y, x);
        const deg = (rad * 180) / Math.PI;
        const degPositive = deg < 0 ? deg + 360 : deg;

        let quadrant: string;
        if (x > 0 && y > 0) quadrant = "I";
        else if (x < 0 && y > 0) quadrant = "II";
        else if (x < 0 && y < 0) quadrant = "III";
        else if (x > 0 && y < 0) quadrant = "IV";
        else quadrant = "On axis";

        return {
          primary: { label: `atan2(${y}, ${x})`, value: formatNumber(deg, 8) + "°" },
          details: [
            { label: "Degrees (-180 to 180)", value: formatNumber(deg, 8) + "°" },
            { label: "Degrees (0 to 360)", value: formatNumber(degPositive, 8) + "°" },
            { label: "Radians", value: formatNumber(rad, 8) + " rad" },
            { label: "Quadrant", value: quadrant },
            { label: "Distance from origin", value: formatNumber(Math.sqrt(x * x + y * y), 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["trig-calculator", "unit-circle-calculator", "law-of-sines-calculator"],
  faq: [
    { question: "What is an inverse trig function?", answer: "Inverse trig functions find the angle when you know the ratio. sin⁻¹(0.5) = 30° because sin(30°) = 0.5. They are also written as arcsin, arccos, arctan." },
    { question: "Why is the range of arcsin restricted?", answer: "Since sin(x) is not one-to-one over all reals, we restrict its domain to [-π/2, π/2] to create an invertible function. This gives arcsin a range of [-90°, 90°]. Similarly, arccos has range [0°, 180°] and arctan has range (-90°, 90°)." },
  ],
  formula: "arcsin: [-1,1] → [-π/2, π/2] | arccos: [-1,1] → [0, π] | arctan: ℝ → (-π/2, π/2)",
};
