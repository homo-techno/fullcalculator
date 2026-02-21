import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const matrixInverseCalculator: CalculatorDefinition = {
  slug: "matrix-inverse-calculator",
  title: "Matrix Inverse Calculator",
  description: "Free matrix inverse calculator. Find the inverse of 2x2 and 3x3 matrices with determinant check and step-by-step adjugate method.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["matrix inverse calculator", "inverse matrix", "2x2 inverse", "3x3 inverse", "adjugate matrix"],
  variants: [
    {
      id: "inverse2x2",
      name: "2×2 Matrix Inverse",
      description: "Find the inverse of a 2×2 matrix using the adjugate formula",
      fields: [
        { name: "a", label: "a (row1,col1)", type: "number", placeholder: "e.g. 4" },
        { name: "b", label: "b (row1,col2)", type: "number", placeholder: "e.g. 7" },
        { name: "c", label: "c (row2,col1)", type: "number", placeholder: "e.g. 2" },
        { name: "d", label: "d (row2,col2)", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const d = inputs.d as number;
        if (a === undefined || b === undefined || c === undefined || d === undefined) return null;

        const det = a * d - b * c;

        if (det === 0) {
          return {
            primary: { label: "Matrix Inverse", value: "Does not exist" },
            details: [
              { label: "Determinant", value: "0" },
              { label: "Reason", value: "Singular matrix (determinant = 0) has no inverse" },
            ],
          };
        }

        const invA = d / det;
        const invB = -b / det;
        const invC = -c / det;
        const invD = a / det;

        return {
          primary: { label: "Determinant", value: formatNumber(det) },
          details: [
            { label: "A⁻¹ [1,1]", value: formatNumber(invA, 6) },
            { label: "A⁻¹ [1,2]", value: formatNumber(invB, 6) },
            { label: "A⁻¹ [2,1]", value: formatNumber(invC, 6) },
            { label: "A⁻¹ [2,2]", value: formatNumber(invD, 6) },
            { label: "Formula", value: "A⁻¹ = (1/det) × [[d, -b], [-c, a]]" },
            { label: "Verification", value: "A × A⁻¹ = I (identity matrix)" },
          ],
        };
      },
    },
    {
      id: "inverse3x3",
      name: "3×3 Matrix Inverse",
      description: "Find the inverse of a 3×3 matrix",
      fields: [
        { name: "a11", label: "a₁₁", type: "number", placeholder: "1" },
        { name: "a12", label: "a₁₂", type: "number", placeholder: "2" },
        { name: "a13", label: "a₁₃", type: "number", placeholder: "3" },
        { name: "a21", label: "a₂₁", type: "number", placeholder: "0" },
        { name: "a22", label: "a₂₂", type: "number", placeholder: "1" },
        { name: "a23", label: "a₂₃", type: "number", placeholder: "4" },
        { name: "a31", label: "a₃₁", type: "number", placeholder: "5" },
        { name: "a32", label: "a₃₂", type: "number", placeholder: "6" },
        { name: "a33", label: "a₃₃", type: "number", placeholder: "0" },
      ],
      calculate: (inputs) => {
        const m = (k: string) => inputs[k] as number;
        const keys = ["a11", "a12", "a13", "a21", "a22", "a23", "a31", "a32", "a33"];
        if (keys.some((k) => m(k) === undefined)) return null;

        const det =
          m("a11") * (m("a22") * m("a33") - m("a23") * m("a32")) -
          m("a12") * (m("a21") * m("a33") - m("a23") * m("a31")) +
          m("a13") * (m("a21") * m("a32") - m("a22") * m("a31"));

        if (det === 0) {
          return {
            primary: { label: "Matrix Inverse", value: "Does not exist" },
            details: [
              { label: "Determinant", value: "0" },
              { label: "Reason", value: "Singular matrix has no inverse" },
            ],
          };
        }

        const cofactors = [
          (m("a22") * m("a33") - m("a23") * m("a32")) / det,
          -(m("a21") * m("a33") - m("a23") * m("a31")) / det,
          (m("a21") * m("a32") - m("a22") * m("a31")) / det,
          -(m("a12") * m("a33") - m("a13") * m("a32")) / det,
          (m("a11") * m("a33") - m("a13") * m("a31")) / det,
          -(m("a11") * m("a32") - m("a12") * m("a31")) / det,
          (m("a12") * m("a23") - m("a13") * m("a22")) / det,
          -(m("a11") * m("a23") - m("a13") * m("a21")) / det,
          (m("a11") * m("a22") - m("a12") * m("a21")) / det,
        ];

        const details: { label: string; value: string }[] = [
          { label: "Determinant", value: formatNumber(det) },
        ];

        const labels = ["[1,1]", "[1,2]", "[1,3]", "[2,1]", "[2,2]", "[2,3]", "[3,1]", "[3,2]", "[3,3]"];
        // Transpose cofactor matrix to get inverse (adjugate / det)
        const invOrder = [0, 3, 6, 1, 4, 7, 2, 5, 8];
        for (let i = 0; i < 9; i++) {
          details.push({ label: `A⁻¹ ${labels[i]}`, value: formatNumber(cofactors[invOrder[i]], 6) });
        }

        return {
          primary: { label: "Determinant", value: formatNumber(det) },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["matrix-calculator", "eigenvalue-calculator", "determinant-calculator"],
  faq: [
    { question: "What is a matrix inverse?", answer: "The inverse of a matrix A, written A⁻¹, is the matrix such that A × A⁻¹ = I (the identity matrix). Only square matrices with non-zero determinants have inverses." },
    { question: "How do you find the inverse of a 2×2 matrix?", answer: "For [[a,b],[c,d]], the inverse is (1/det) × [[d,-b],[-c,a]] where det = ad - bc. If det = 0, the matrix is singular and has no inverse." },
  ],
  formula: "2×2: A⁻¹ = (1/det)[[d,-b],[-c,a]] | 3×3: A⁻¹ = adj(A)/det(A)",
};
