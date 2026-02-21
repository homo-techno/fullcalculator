import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const complexNumberCalculator: CalculatorDefinition = {
  slug: "complex-number-calculator",
  title: "Complex Number Calculator",
  description: "Free complex number calculator. Add, subtract, multiply, divide complex numbers. Convert between rectangular and polar forms.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["complex number calculator", "imaginary number calculator", "complex arithmetic", "polar form", "rectangular form"],
  variants: [
    {
      id: "arithmetic",
      name: "Arithmetic (a+bi ○ c+di)",
      fields: [
        { name: "a", label: "a (real part of z₁)", type: "number", placeholder: "e.g. 3" },
        { name: "b", label: "b (imaginary part of z₁)", type: "number", placeholder: "e.g. 4" },
        { name: "op", label: "Operation", type: "select", options: [
          { label: "Add (+)", value: "add" }, { label: "Subtract (−)", value: "sub" },
          { label: "Multiply (×)", value: "mul" }, { label: "Divide (÷)", value: "div" },
        ]},
        { name: "c", label: "c (real part of z₂)", type: "number", placeholder: "e.g. 1" },
        { name: "d", label: "d (imaginary part of z₂)", type: "number", placeholder: "e.g. -2" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number;
        const c = inputs.c as number, d = inputs.d as number;
        const op = (inputs.op as string) || "add";
        if (a === undefined || b === undefined || c === undefined || d === undefined) return null;
        let re: number, im: number;
        switch (op) {
          case "sub": re = a - c; im = b - d; break;
          case "mul": re = a * c - b * d; im = a * d + b * c; break;
          case "div": {
            const den = c * c + d * d;
            if (den === 0) return { primary: { label: "Error", value: "Division by zero" }, details: [] };
            re = (a * c + b * d) / den; im = (b * c - a * d) / den; break;
          }
          default: re = a + c; im = b + d;
        }
        const fmt = (r: number, i: number) => {
          if (i === 0) return formatNumber(r, 6);
          if (r === 0) return `${formatNumber(i, 6)}i`;
          return `${formatNumber(r, 6)} ${i >= 0 ? "+" : "−"} ${formatNumber(Math.abs(i), 6)}i`;
        };
        const mag = Math.sqrt(re * re + im * im);
        const angle = Math.atan2(im, re) * 180 / Math.PI;
        return {
          primary: { label: "Result", value: fmt(re, im) },
          details: [
            { label: "Real part", value: formatNumber(re, 6) },
            { label: "Imaginary part", value: formatNumber(im, 6) },
            { label: "Magnitude |z|", value: formatNumber(mag, 6) },
            { label: "Angle (degrees)", value: `${formatNumber(angle, 4)}°` },
          ],
        };
      },
    },
    {
      id: "polar",
      name: "Rectangular ↔ Polar",
      fields: [
        { name: "a", label: "Real part (a)", type: "number", placeholder: "e.g. 3" },
        { name: "b", label: "Imaginary part (b)", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const a = inputs.a as number, b = inputs.b as number;
        if (a === undefined || b === undefined) return null;
        const r = Math.sqrt(a * a + b * b);
        const theta = Math.atan2(b, a);
        const deg = theta * 180 / Math.PI;
        return {
          primary: { label: "Polar Form", value: `${formatNumber(r, 6)} ∠ ${formatNumber(deg, 4)}°` },
          details: [
            { label: "Magnitude (r)", value: formatNumber(r, 6) },
            { label: "Angle (degrees)", value: `${formatNumber(deg, 4)}°` },
            { label: "Angle (radians)", value: formatNumber(theta, 6) },
            { label: "Conjugate", value: `${formatNumber(a, 6)} ${b >= 0 ? "−" : "+"} ${formatNumber(Math.abs(b), 6)}i` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["matrix-calculator", "scientific-calculator", "quadratic-equation-calculator"],
  faq: [{ question: "What is a complex number?", answer: "A complex number has the form a + bi, where a is the real part, b is the imaginary part, and i = √(-1). Complex numbers can be added, subtracted, multiplied, and divided. They can also be expressed in polar form: r∠θ." }],
  formula: "z = a + bi | |z| = √(a²+b²) | θ = atan2(b,a)",
};
