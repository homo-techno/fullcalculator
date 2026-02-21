import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dotProductCalculator: CalculatorDefinition = {
  slug: "dot-product-calculator",
  title: "Dot Product Calculator",
  description:
    "Free dot product calculator. Compute the dot product of two 3D vectors and find the angle between them.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "dot product",
    "scalar product",
    "inner product",
    "angle between vectors",
    "linear algebra",
  ],
  variants: [
    {
      id: "calculate",
      name: "Calculate Dot Product",
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

        const dot = ax * bx + ay * by + az * bz;
        const magA = Math.sqrt(ax * ax + ay * ay + az * az);
        const magB = Math.sqrt(bx * bx + by * by + bz * bz);

        let angleDeg = "undefined";
        if (magA > 0 && magB > 0) {
          const cosTheta = Math.max(-1, Math.min(1, dot / (magA * magB)));
          const angleRad = Math.acos(cosTheta);
          angleDeg = formatNumber((angleRad * 180) / Math.PI, 4);
        }

        return {
          primary: { label: "a · b", value: formatNumber(dot, 6) },
          details: [
            { label: "Angle between vectors", value: `${angleDeg}°` },
            { label: "|a|", value: formatNumber(magA, 6) },
            { label: "|b|", value: formatNumber(magB, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cross-product-calculator",
    "determinant-calculator",
    "polar-coordinates-calculator",
  ],
  faq: [
    {
      question: "What is the dot product?",
      answer:
        "The dot product (or scalar product) of two vectors yields a single number. It equals the sum of the products of corresponding components: a·b = a₁b₁ + a₂b₂ + a₃b₃. It also equals |a||b|cos(θ), where θ is the angle between the vectors.",
    },
  ],
  formula: "a · b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b|cos(θ)",
};
