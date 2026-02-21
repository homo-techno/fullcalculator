import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crossProductCalculator: CalculatorDefinition = {
  slug: "cross-product-calculator",
  title: "Cross Product Calculator",
  description:
    "Free cross product calculator. Compute the cross product of two 3D vectors and find the magnitude of the resulting vector.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "cross product",
    "vector product",
    "3D vectors",
    "linear algebra",
    "physics",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Cross Product",
      fields: [
        { name: "ax", label: "a₁ (x-component of a)", type: "number", placeholder: "e.g. 1" },
        { name: "ay", label: "a₂ (y-component of a)", type: "number", placeholder: "e.g. 2" },
        { name: "az", label: "a₃ (z-component of a)", type: "number", placeholder: "e.g. 3" },
        { name: "bx", label: "b₁ (x-component of b)", type: "number", placeholder: "e.g. 4" },
        { name: "by", label: "b₂ (y-component of b)", type: "number", placeholder: "e.g. 5" },
        { name: "bz", label: "b₃ (z-component of b)", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const ax = inputs.ax as number;
        const ay = inputs.ay as number;
        const az = inputs.az as number;
        const bx = inputs.bx as number;
        const by = inputs.by as number;
        const bz = inputs.bz as number;
        if (
          ax === undefined || ay === undefined || az === undefined ||
          bx === undefined || by === undefined || bz === undefined
        )
          return null;

        const cx = ay * bz - az * by;
        const cy = az * bx - ax * bz;
        const cz = ax * by - ay * bx;
        const magnitude = Math.sqrt(cx * cx + cy * cy + cz * cz);

        return {
          primary: {
            label: "a × b",
            value: `(${formatNumber(cx, 4)}, ${formatNumber(cy, 4)}, ${formatNumber(cz, 4)})`,
          },
          details: [
            { label: "x-component", value: formatNumber(cx, 4) },
            { label: "y-component", value: formatNumber(cy, 4) },
            { label: "z-component", value: formatNumber(cz, 4) },
            { label: "Magnitude", value: formatNumber(magnitude, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "dot-product-calculator",
    "determinant-calculator",
    "polar-coordinates-calculator",
  ],
  faq: [
    {
      question: "What is the cross product?",
      answer:
        "The cross product of two 3D vectors produces a third vector that is perpendicular to both input vectors. Its magnitude equals the area of the parallelogram formed by the two vectors. It is only defined in three dimensions.",
    },
  ],
  formula: "a × b = (a₂b₃ - a₃b₂, a₃b₁ - a₁b₃, a₁b₂ - a₂b₁)",
};
