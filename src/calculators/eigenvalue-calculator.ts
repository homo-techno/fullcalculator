import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eigenvalueCalculator: CalculatorDefinition = {
  slug: "eigenvalue-calculator",
  title: "Eigenvalue Calculator",
  description: "Free eigenvalue and eigenvector calculator. Find eigenvalues and eigenvectors of 2x2 and 3x3 matrices with step-by-step solutions.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["eigenvalue calculator", "eigenvector calculator", "characteristic equation", "eigenvalue 2x2", "eigenvalue 3x3"],
  variants: [
    {
      id: "eigen2x2",
      name: "2×2 Matrix Eigenvalues",
      description: "Find eigenvalues and eigenvectors of a 2×2 matrix",
      fields: [
        { name: "a", label: "a (row1,col1)", type: "number", placeholder: "e.g. 4" },
        { name: "b", label: "b (row1,col2)", type: "number", placeholder: "e.g. 2" },
        { name: "c", label: "c (row2,col1)", type: "number", placeholder: "e.g. 1" },
        { name: "d", label: "d (row2,col2)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number;
        const b = inputs.b as number;
        const c = inputs.c as number;
        const d = inputs.d as number;
        if (a === undefined || b === undefined || c === undefined || d === undefined) return null;

        const trace = a + d;
        const det = a * d - b * c;
        const discriminant = trace * trace - 4 * det;

        const details: { label: string; value: string }[] = [];
        details.push({ label: "Trace (a + d)", value: formatNumber(trace) });
        details.push({ label: "Determinant (ad - bc)", value: formatNumber(det) });
        details.push({ label: "Discriminant", value: formatNumber(discriminant) });

        let eigenStr: string;

        if (discriminant > 0) {
          const l1 = (trace + Math.sqrt(discriminant)) / 2;
          const l2 = (trace - Math.sqrt(discriminant)) / 2;
          eigenStr = `λ₁ = ${formatNumber(l1, 6)}, λ₂ = ${formatNumber(l2, 6)}`;
          details.push({ label: "λ₁", value: formatNumber(l1, 6) });
          details.push({ label: "λ₂", value: formatNumber(l2, 6) });
          details.push({ label: "Nature", value: "Two distinct real eigenvalues" });

          if (b !== 0) {
            details.push({ label: "Eigenvector for λ₁", value: `[${formatNumber(b, 4)}, ${formatNumber(l1 - a, 4)}]` });
            details.push({ label: "Eigenvector for λ₂", value: `[${formatNumber(b, 4)}, ${formatNumber(l2 - a, 4)}]` });
          } else if (c !== 0) {
            details.push({ label: "Eigenvector for λ₁", value: `[${formatNumber(l1 - d, 4)}, ${formatNumber(c, 4)}]` });
            details.push({ label: "Eigenvector for λ₂", value: `[${formatNumber(l2 - d, 4)}, ${formatNumber(c, 4)}]` });
          }
        } else if (discriminant === 0) {
          const l = trace / 2;
          eigenStr = `λ = ${formatNumber(l, 6)} (repeated)`;
          details.push({ label: "λ (repeated)", value: formatNumber(l, 6) });
          details.push({ label: "Nature", value: "One repeated eigenvalue" });
        } else {
          const realPart = trace / 2;
          const imagPart = Math.sqrt(-discriminant) / 2;
          eigenStr = `${formatNumber(realPart, 4)} ± ${formatNumber(imagPart, 4)}i`;
          details.push({ label: "λ₁", value: `${formatNumber(realPart, 4)} + ${formatNumber(imagPart, 4)}i` });
          details.push({ label: "λ₂", value: `${formatNumber(realPart, 4)} - ${formatNumber(imagPart, 4)}i` });
          details.push({ label: "Nature", value: "Two complex conjugate eigenvalues" });
        }

        details.push({ label: "Characteristic equation", value: `λ² - ${formatNumber(trace)}λ + ${formatNumber(det)} = 0` });

        return {
          primary: { label: "Eigenvalues", value: eigenStr },
          details,
        };
      },
    },
    {
      id: "eigen-properties",
      name: "Eigenvalue Properties (2×2)",
      description: "Check eigenvalue properties: sum equals trace, product equals determinant",
      fields: [
        { name: "lambda1", label: "Eigenvalue λ₁", type: "number", placeholder: "e.g. 5" },
        { name: "lambda2", label: "Eigenvalue λ₂", type: "number", placeholder: "e.g. 2" },
      ],
      calculate: (inputs) => {
        const l1 = inputs.lambda1 as number;
        const l2 = inputs.lambda2 as number;
        if (l1 === undefined || l2 === undefined) return null;

        return {
          primary: { label: "Eigenvalue Properties", value: `λ₁ = ${formatNumber(l1)}, λ₂ = ${formatNumber(l2)}` },
          details: [
            { label: "Sum (= trace)", value: formatNumber(l1 + l2) },
            { label: "Product (= determinant)", value: formatNumber(l1 * l2) },
            { label: "λ₁²", value: formatNumber(l1 * l1) },
            { label: "λ₂²", value: formatNumber(l2 * l2) },
            { label: "Matrix is positive definite?", value: l1 > 0 && l2 > 0 ? "Yes" : "No" },
            { label: "Matrix is invertible?", value: l1 !== 0 && l2 !== 0 ? "Yes" : "No (has zero eigenvalue)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["matrix-calculator", "matrix-inverse-calculator", "determinant-calculator"],
  faq: [
    { question: "What is an eigenvalue?", answer: "An eigenvalue λ of a matrix A satisfies Av = λv, where v is the corresponding eigenvector. This means the matrix multiplication only scales the vector, without changing its direction. Eigenvalues are found by solving det(A - λI) = 0." },
    { question: "How do you find eigenvalues of a 2×2 matrix?", answer: "For a 2×2 matrix [[a,b],[c,d]], solve the characteristic equation: λ² - (a+d)λ + (ad-bc) = 0. The eigenvalues are λ = [(a+d) ± √((a+d)² - 4(ad-bc))] / 2." },
  ],
  formula: "det(A - λI) = 0 | 2×2: λ² - trace·λ + det = 0 | Σλᵢ = trace(A), Πλᵢ = det(A)",
};
