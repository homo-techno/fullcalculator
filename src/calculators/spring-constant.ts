import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const springConstantCalculator: CalculatorDefinition = {
  slug: "spring-constant-calculator",
  title: "Spring Constant Calculator",
  description: "Free spring constant calculator. Calculate spring constant, force, or displacement using Hooke's Law (F = kx).",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["spring constant calculator", "Hooke's law calculator", "spring force", "elasticity calculator", "spring constant k"],
  variants: [
    {
      id: "findK",
      name: "Find Spring Constant (k)",
      fields: [
        { name: "F", label: "Force (N)", type: "number", placeholder: "e.g. 50" },
        { name: "x", label: "Displacement (m)", type: "number", placeholder: "e.g. 0.1" },
      ],
      calculate: (inputs) => {
        const F = inputs.F as number, x = inputs.x as number;
        if (!F || !x) return null;
        const k = F / x;
        const pe = 0.5 * k * x * x;
        return {
          primary: { label: "Spring Constant (k)", value: `${formatNumber(k, 4)} N/m` },
          details: [
            { label: "Force", value: `${formatNumber(F, 4)} N` },
            { label: "Displacement", value: `${formatNumber(x, 4)} m` },
            { label: "Potential energy", value: `${formatNumber(pe, 6)} J` },
          ],
        };
      },
    },
    {
      id: "findF",
      name: "Find Force (F)",
      fields: [
        { name: "k", label: "Spring Constant (N/m)", type: "number", placeholder: "e.g. 500" },
        { name: "x", label: "Displacement (m)", type: "number", placeholder: "e.g. 0.1" },
      ],
      calculate: (inputs) => {
        const k = inputs.k as number, x = inputs.x as number;
        if (!k || !x) return null;
        const F = k * x;
        return {
          primary: { label: "Force", value: `${formatNumber(F, 4)} N` },
          details: [
            { label: "Spring constant", value: `${formatNumber(k, 4)} N/m` },
            { label: "Displacement", value: `${formatNumber(x, 4)} m` },
            { label: "Potential energy", value: `${formatNumber(0.5 * k * x * x, 6)} J` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["force-calculator", "energy-calculator", "acceleration-calculator"],
  faq: [{ question: "What is Hooke's Law?", answer: "Hooke's Law states F = kx, where F is the force applied to a spring, k is the spring constant (stiffness in N/m), and x is the displacement from equilibrium. The elastic potential energy stored is PE = ½kx²." }],
  formula: "F = kx | PE = ½kx²",
};
