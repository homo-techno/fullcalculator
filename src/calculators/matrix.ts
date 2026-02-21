import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const matrixCalculator: CalculatorDefinition = {
  slug: "matrix-calculator",
  title: "Matrix Calculator",
  description: "Free matrix calculator. Calculate the determinant, inverse, and transpose of 2×2 and 3×3 matrices.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["matrix calculator", "determinant calculator", "matrix inverse", "2x2 matrix", "3x3 determinant"],
  variants: [
    {
      id: "det2",
      name: "2×2 Determinant & Inverse",
      fields: [
        { name: "a", label: "a (row1,col1)", type: "number", placeholder: "e.g. 3" },
        { name: "b", label: "b (row1,col2)", type: "number", placeholder: "e.g. 1" },
        { name: "c", label: "c (row2,col1)", type: "number", placeholder: "e.g. 2" },
        { name: "d", label: "d (row2,col2)", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number, c = inputs.c as number, d = inputs.d as number;
        if (a === undefined || b === undefined || c === undefined || d === undefined) return null;
        const det = a * d - b * c;
        const details = [
          { label: "Determinant", value: formatNumber(det) },
          { label: "Trace", value: formatNumber(a + d) },
        ];
        if (det !== 0) {
          details.push({ label: "Inverse [1,1]", value: formatNumber(d / det, 6) });
          details.push({ label: "Inverse [1,2]", value: formatNumber(-b / det, 6) });
          details.push({ label: "Inverse [2,1]", value: formatNumber(-c / det, 6) });
          details.push({ label: "Inverse [2,2]", value: formatNumber(a / det, 6) });
        } else {
          details.push({ label: "Inverse", value: "Does not exist (det = 0)" });
        }
        return { primary: { label: "Determinant", value: formatNumber(det) }, details };
      },
    },
    {
      id: "det3",
      name: "3×3 Determinant",
      fields: [
        { name: "a11", label: "a₁₁", type: "number", placeholder: "1" }, { name: "a12", label: "a₁₂", type: "number", placeholder: "2" }, { name: "a13", label: "a₁₃", type: "number", placeholder: "3" },
        { name: "a21", label: "a₂₁", type: "number", placeholder: "4" }, { name: "a22", label: "a₂₂", type: "number", placeholder: "5" }, { name: "a23", label: "a₂₃", type: "number", placeholder: "6" },
        { name: "a31", label: "a₃₁", type: "number", placeholder: "7" }, { name: "a32", label: "a₃₂", type: "number", placeholder: "8" }, { name: "a33", label: "a₃₃", type: "number", placeholder: "9" },
      ],
      calculate: (inputs) => {
        const m = (k: string) => inputs[k] as number;
        const keys = ["a11","a12","a13","a21","a22","a23","a31","a32","a33"];
        if (keys.some(k => m(k) === undefined)) return null;
        const det = m("a11")*(m("a22")*m("a33")-m("a23")*m("a32")) - m("a12")*(m("a21")*m("a33")-m("a23")*m("a31")) + m("a13")*(m("a21")*m("a32")-m("a22")*m("a31"));
        const trace = m("a11") + m("a22") + m("a33");
        return {
          primary: { label: "Determinant", value: formatNumber(det) },
          details: [
            { label: "Trace", value: formatNumber(trace) },
            { label: "Singular?", value: det === 0 ? "Yes (no inverse)" : "No (invertible)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["scientific-calculator", "quadratic-equation-calculator"],
  faq: [
    { question: "What is a determinant?", answer: "The determinant is a scalar value computed from a square matrix. For 2×2 matrix [[a,b],[c,d]]: det = ad - bc. It tells if the matrix is invertible (det ≠ 0) and represents the scaling factor of the linear transformation." },
  ],
  formula: "2×2: det = ad - bc | 3×3: Sarrus' rule or cofactor expansion",
};
