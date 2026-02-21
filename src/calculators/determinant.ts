import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const determinantCalculator: CalculatorDefinition = {
  slug: "determinant-calculator",
  title: "Determinant Calculator",
  description:
    "Free determinant calculator. Calculate the determinant of 2x2 and 3x3 matrices.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "determinant",
    "matrix determinant",
    "2x2 matrix",
    "3x3 matrix",
    "linear algebra",
  ],
  variants: [
    {
      id: "2x2",
      name: "2×2 Determinant",
      fields: [
        { name: "a", label: "a (row 1, col 1)", type: "number", placeholder: "e.g. 1" },
        { name: "b", label: "b (row 1, col 2)", type: "number", placeholder: "e.g. 2" },
        { name: "c", label: "c (row 2, col 1)", type: "number", placeholder: "e.g. 3" },
        { name: "d", label: "d (row 2, col 2)", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const d = inputs.d as number;
        if (a === undefined || b === undefined || c === undefined || d === undefined)
          return null;

        const det = a * d - b * c;

        return {
          primary: { label: "Determinant", value: formatNumber(det, 6) },
          details: [
            { label: "Matrix", value: `[[${a}, ${b}], [${c}, ${d}]]` },
            { label: "ad", value: formatNumber(a * d, 4) },
            { label: "bc", value: formatNumber(b * c, 4) },
            { label: "Invertible", value: det !== 0 ? "Yes" : "No" },
          ],
        };
      },
    },
    {
      id: "3x3",
      name: "3×3 Determinant",
      fields: [
        { name: "a11", label: "a₁₁", type: "number", placeholder: "e.g. 1" },
        { name: "a12", label: "a₁₂", type: "number", placeholder: "e.g. 2" },
        { name: "a13", label: "a₁₃", type: "number", placeholder: "e.g. 3" },
        { name: "a21", label: "a₂₁", type: "number", placeholder: "e.g. 4" },
        { name: "a22", label: "a₂₂", type: "number", placeholder: "e.g. 5" },
        { name: "a23", label: "a₂₃", type: "number", placeholder: "e.g. 6" },
        { name: "a31", label: "a₃₁", type: "number", placeholder: "e.g. 7" },
        { name: "a32", label: "a₃₂", type: "number", placeholder: "e.g. 8" },
        { name: "a33", label: "a₃₃", type: "number", placeholder: "e.g. 9" },
      ],
      calculate: (inputs) => {
        const a11 = inputs.a11 as number;
        const a12 = inputs.a12 as number;
        const a13 = inputs.a13 as number;
        const a21 = inputs.a21 as number;
        const a22 = inputs.a22 as number;
        const a23 = inputs.a23 as number;
        const a31 = inputs.a31 as number;
        const a32 = inputs.a32 as number;
        const a33 = inputs.a33 as number;
        if (
          a11 === undefined || a12 === undefined || a13 === undefined ||
          a21 === undefined || a22 === undefined || a23 === undefined ||
          a31 === undefined || a32 === undefined || a33 === undefined
        )
          return null;

        // Cofactor expansion along first row
        const det =
          a11 * (a22 * a33 - a23 * a32) -
          a12 * (a21 * a33 - a23 * a31) +
          a13 * (a21 * a32 - a22 * a31);

        return {
          primary: { label: "Determinant", value: formatNumber(det, 6) },
          details: [
            {
              label: "Matrix",
              value: `[[${a11}, ${a12}, ${a13}], [${a21}, ${a22}, ${a23}], [${a31}, ${a32}, ${a33}]]`,
            },
            { label: "Invertible", value: det !== 0 ? "Yes" : "No" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cross-product-calculator",
    "dot-product-calculator",
    "polynomial-calculator",
  ],
  faq: [
    {
      question: "What does the determinant tell you?",
      answer:
        "The determinant of a matrix is a scalar that encodes several properties. A non-zero determinant means the matrix is invertible. For a 2D matrix, |det| gives the area scaling factor of the linear transformation; for 3D, it gives the volume scaling factor. A negative determinant indicates an orientation reversal.",
    },
  ],
  formula: "det(2×2) = ad - bc, det(3×3) = a₁₁(a₂₂a₃₃ - a₂₃a₃₂) - a₁₂(a₂₁a₃₃ - a₂₃a₃₁) + a₁₃(a₂₁a₃₂ - a₂₂a₃₁)",
};
