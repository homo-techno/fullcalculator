import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trigCalculator: CalculatorDefinition = {
  slug: "trig-calculator",
  title: "Trigonometry Calculator",
  description: "Free trigonometry calculator. Calculate sin, cos, tan, sec, csc, cot for any angle in degrees or radians with exact values shown.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["trigonometry calculator", "sin cos tan calculator", "trig functions", "sine cosine tangent", "trig values"],
  variants: [
    {
      id: "evaluate",
      name: "Evaluate Trig Functions",
      description: "Calculate all six trig functions for an angle",
      fields: [
        { name: "angle", label: "Angle", type: "number", placeholder: "e.g. 45" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Degrees", value: "deg" },
          { label: "Radians", value: "rad" },
        ], defaultValue: "deg" },
      ],
      calculate: (inputs) => {
        const angle = inputs.angle as number;
        const unit = inputs.unit as string;
        if (angle === undefined) return null;

        const rad = unit === "deg" ? (angle * Math.PI) / 180 : angle;
        const deg = unit === "deg" ? angle : (angle * 180) / Math.PI;

        const sinVal = Math.sin(rad);
        const cosVal = Math.cos(rad);
        const tanVal = Math.abs(cosVal) < 1e-15 ? NaN : Math.tan(rad);
        const secVal = Math.abs(cosVal) < 1e-15 ? NaN : 1 / cosVal;
        const cscVal = Math.abs(sinVal) < 1e-15 ? NaN : 1 / sinVal;
        const cotVal = Math.abs(sinVal) < 1e-15 ? NaN : cosVal / sinVal;

        return {
          primary: { label: `sin(${angle}${unit === "deg" ? "°" : " rad"})`, value: formatNumber(sinVal, 10) },
          details: [
            { label: "sin", value: formatNumber(sinVal, 10) },
            { label: "cos", value: formatNumber(cosVal, 10) },
            { label: "tan", value: isNaN(tanVal) ? "undefined" : formatNumber(tanVal, 10) },
            { label: "csc (1/sin)", value: isNaN(cscVal) ? "undefined" : formatNumber(cscVal, 10) },
            { label: "sec (1/cos)", value: isNaN(secVal) ? "undefined" : formatNumber(secVal, 10) },
            { label: "cot (cos/sin)", value: isNaN(cotVal) ? "undefined" : formatNumber(cotVal, 10) },
            { label: "Degrees", value: formatNumber(deg, 6) + "°" },
            { label: "Radians", value: formatNumber(rad, 8) + " rad" },
            { label: "sin² + cos²", value: formatNumber(sinVal * sinVal + cosVal * cosVal, 10) },
          ],
        };
      },
    },
    {
      id: "right-triangle",
      name: "Right Triangle (given angle + side)",
      description: "Find all sides and angles of a right triangle",
      fields: [
        { name: "angle", label: "Angle (degrees, not 90°)", type: "number", placeholder: "e.g. 30", min: 0.01, max: 89.99 },
        { name: "side", label: "Known side", type: "select", options: [
          { label: "Opposite", value: "opposite" },
          { label: "Adjacent", value: "adjacent" },
          { label: "Hypotenuse", value: "hypotenuse" },
        ], defaultValue: "hypotenuse" },
        { name: "length", label: "Side length", type: "number", placeholder: "e.g. 10", min: 0.001 },
      ],
      calculate: (inputs) => {
        const angleDeg = inputs.angle as number;
        const sideType = inputs.side as string;
        const length = inputs.length as number;
        if (!angleDeg || !length || angleDeg <= 0 || angleDeg >= 90) return null;

        const rad = (angleDeg * Math.PI) / 180;
        let opp: number, adj: number, hyp: number;

        switch (sideType) {
          case "opposite":
            opp = length;
            hyp = opp / Math.sin(rad);
            adj = opp / Math.tan(rad);
            break;
          case "adjacent":
            adj = length;
            hyp = adj / Math.cos(rad);
            opp = adj * Math.tan(rad);
            break;
          case "hypotenuse":
            hyp = length;
            opp = hyp * Math.sin(rad);
            adj = hyp * Math.cos(rad);
            break;
          default:
            return null;
        }

        const otherAngle = 90 - angleDeg;
        const area = (opp * adj) / 2;

        return {
          primary: { label: "Hypotenuse", value: formatNumber(hyp, 6) },
          details: [
            { label: "Opposite", value: formatNumber(opp, 6) },
            { label: "Adjacent", value: formatNumber(adj, 6) },
            { label: "Hypotenuse", value: formatNumber(hyp, 6) },
            { label: "Angle A", value: formatNumber(angleDeg, 4) + "°" },
            { label: "Angle B", value: formatNumber(otherAngle, 4) + "°" },
            { label: "Angle C (right angle)", value: "90°" },
            { label: "Area", value: formatNumber(area, 4) },
            { label: "Perimeter", value: formatNumber(opp + adj + hyp, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["inverse-trig-calculator", "unit-circle-calculator", "law-of-cosines-calculator"],
  faq: [
    { question: "What are the basic trigonometric functions?", answer: "The six trig functions relate angles to side ratios in a right triangle: sin(θ) = opposite/hypotenuse, cos(θ) = adjacent/hypotenuse, tan(θ) = opposite/adjacent. Their reciprocals are csc, sec, and cot respectively." },
    { question: "How do I convert between degrees and radians?", answer: "Radians = degrees × π/180. Degrees = radians × 180/π. Key values: 180° = π rad, 90° = π/2 rad, 60° = π/3 rad, 45° = π/4 rad, 30° = π/6 rad." },
  ],
  formula: "sin(θ) = opp/hyp | cos(θ) = adj/hyp | tan(θ) = opp/adj | sin²θ + cos²θ = 1",
};
