import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vectorCalculator: CalculatorDefinition = {
  slug: "vector-calculator",
  title: "Vector Calculator",
  description: "Free vector calculator. Calculate dot product, cross product, magnitude, and angle between 2D and 3D vectors.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["vector calculator", "dot product calculator", "cross product", "vector magnitude", "angle between vectors"],
  variants: [
    {
      id: "ops2d",
      name: "2D Vector Operations",
      fields: [
        { name: "ax", label: "A x-component", type: "number", placeholder: "e.g. 3" },
        { name: "ay", label: "A y-component", type: "number", placeholder: "e.g. 4" },
        { name: "bx", label: "B x-component", type: "number", placeholder: "e.g. -1" },
        { name: "by", label: "B y-component", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const ax = inputs.ax as number, ay = inputs.ay as number;
        const bx = inputs.bx as number, by = inputs.by as number;
        if (ax === undefined || ay === undefined || bx === undefined || by === undefined) return null;
        const dot = ax * bx + ay * by;
        const magA = Math.sqrt(ax * ax + ay * ay);
        const magB = Math.sqrt(bx * bx + by * by);
        const angle = magA && magB ? Math.acos(Math.max(-1, Math.min(1, dot / (magA * magB)))) * 180 / Math.PI : 0;
        const cross2d = ax * by - ay * bx;
        return {
          primary: { label: "Dot Product", value: formatNumber(dot, 6) },
          details: [
            { label: "|A|", value: formatNumber(magA, 6) },
            { label: "|B|", value: formatNumber(magB, 6) },
            { label: "Angle between", value: `${formatNumber(angle, 4)}°` },
            { label: "Cross (z-component)", value: formatNumber(cross2d, 6) },
            { label: "A + B", value: `(${formatNumber(ax + bx, 4)}, ${formatNumber(ay + by, 4)})` },
            { label: "A − B", value: `(${formatNumber(ax - bx, 4)}, ${formatNumber(ay - by, 4)})` },
          ],
        };
      },
    },
    {
      id: "ops3d",
      name: "3D Vector Operations",
      fields: [
        { name: "ax", label: "A x", type: "number", placeholder: "e.g. 1" },
        { name: "ay", label: "A y", type: "number", placeholder: "e.g. 2" },
        { name: "az", label: "A z", type: "number", placeholder: "e.g. 3" },
        { name: "bx", label: "B x", type: "number", placeholder: "e.g. 4" },
        { name: "by", label: "B y", type: "number", placeholder: "e.g. 5" },
        { name: "bz", label: "B z", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const ax = inputs.ax as number, ay = inputs.ay as number, az = inputs.az as number;
        const bx = inputs.bx as number, by = inputs.by as number, bz = inputs.bz as number;
        if ([ax,ay,az,bx,by,bz].some(v => v === undefined)) return null;
        const dot = ax*bx + ay*by + az*bz;
        const magA = Math.sqrt(ax*ax + ay*ay + az*az);
        const magB = Math.sqrt(bx*bx + by*by + bz*bz);
        const angle = magA && magB ? Math.acos(Math.max(-1, Math.min(1, dot / (magA * magB)))) * 180 / Math.PI : 0;
        const cx = ay*bz - az*by, cy = az*bx - ax*bz, cz = ax*by - ay*bx;
        return {
          primary: { label: "Dot Product", value: formatNumber(dot, 6) },
          details: [
            { label: "Cross Product", value: `(${formatNumber(cx,4)}, ${formatNumber(cy,4)}, ${formatNumber(cz,4)})` },
            { label: "|A|", value: formatNumber(magA, 6) },
            { label: "|B|", value: formatNumber(magB, 6) },
            { label: "|A×B|", value: formatNumber(Math.sqrt(cx*cx+cy*cy+cz*cz), 6) },
            { label: "Angle between", value: `${formatNumber(angle, 4)}°` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["matrix-calculator", "slope-calculator", "midpoint-calculator"],
  faq: [{ question: "What is the dot product?", answer: "The dot product A·B = a₁b₁ + a₂b₂ + a₃b₃. It equals |A||B|cos(θ), where θ is the angle between vectors. If dot product = 0, the vectors are perpendicular." }],
  formula: "A·B = Σaᵢbᵢ | A×B = (a₂b₃−a₃b₂, a₃b₁−a₁b₃, a₁b₂−a₂b₁)",
};
