import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catenaryCalculator: CalculatorDefinition = {
  slug: "catenary-calculator",
  title: "Catenary Curve Calculator",
  description: "Free catenary curve calculator. Compute the shape, sag, arc length, and tension of a hanging chain or cable using the catenary equation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["catenary calculator", "hanging chain", "cable sag", "catenary curve", "hyperbolic cosine", "suspension cable"],
  variants: [
    {
      id: "sag-tension",
      name: "Cable Sag & Tension",
      description: "Calculate sag and tension for a cable suspended between two points at the same height",
      fields: [
        { name: "span", label: "Horizontal Span (m)", type: "number", placeholder: "e.g. 100", min: 0.01 },
        { name: "cableLength", label: "Cable Length (m)", type: "number", placeholder: "e.g. 105", min: 0.01 },
        { name: "weight", label: "Weight per Unit Length (N/m)", type: "number", placeholder: "e.g. 10", min: 0.001 },
      ],
      calculate: (inputs) => {
        const L = parseFloat(inputs.span as string);
        const S = parseFloat(inputs.cableLength as string);
        const w = parseFloat(inputs.weight as string);
        if (isNaN(L) || isNaN(S) || isNaN(w)) return null;
        if (S <= L) return null; // cable must be longer than span

        // S = 2a·sinh(L/(2a)), solve for a using Newton's method
        let a = L; // initial guess
        for (let i = 0; i < 100; i++) {
          const f = 2 * a * Math.sinh(L / (2 * a)) - S;
          const fPrime = 2 * Math.sinh(L / (2 * a)) - (L / a) * Math.cosh(L / (2 * a));
          if (Math.abs(fPrime) < 1e-15) break;
          const aNew = a - f / fPrime;
          if (Math.abs(aNew - a) < 1e-12) { a = aNew; break; }
          a = aNew;
        }

        const sag = a * (Math.cosh(L / (2 * a)) - 1);
        const horizontalTension = w * a;
        const maxTension = w * a * Math.cosh(L / (2 * a));
        const verticalForce = w * S / 2;

        return {
          primary: { label: "Sag", value: formatNumber(sag, 4), suffix: "m" },
          details: [
            { label: "Catenary Parameter (a)", value: `${formatNumber(a, 4)} m` },
            { label: "Sag (dip)", value: `${formatNumber(sag, 4)} m` },
            { label: "Horizontal Tension", value: `${formatNumber(horizontalTension, 2)} N` },
            { label: "Max Tension (at supports)", value: `${formatNumber(maxTension, 2)} N` },
            { label: "Vertical Force per Support", value: `${formatNumber(verticalForce, 2)} N` },
            { label: "Sag-to-Span Ratio", value: formatNumber(sag / L, 4) },
          ],
        };
      },
    },
    {
      id: "height-at-x",
      name: "Height at Position",
      description: "Calculate the height of the catenary curve y = a·cosh(x/a) at a given horizontal position",
      fields: [
        { name: "a", label: "Catenary Parameter (a)", type: "number", placeholder: "e.g. 50", min: 0.01 },
        { name: "x", label: "Horizontal Position (x)", type: "number", placeholder: "e.g. 20" },
      ],
      calculate: (inputs) => {
        const a = parseFloat(inputs.a as string);
        const x = parseFloat(inputs.x as string);
        if (isNaN(a) || isNaN(x) || a <= 0) return null;

        const y = a * Math.cosh(x / a);
        const yMin = a; // minimum height at x=0
        const heightAboveMin = y - yMin;
        const slope = Math.sinh(x / a);
        const angle = Math.atan(slope) * (180 / Math.PI);
        // Arc length from 0 to x: s = a·sinh(x/a)
        const arcLength = a * Math.sinh(Math.abs(x) / a);
        const curvature = 1 / (a * Math.pow(Math.cosh(x / a), 2));

        return {
          primary: { label: "y(x)", value: formatNumber(y, 6) },
          details: [
            { label: "Height y", value: formatNumber(y, 6) },
            { label: "Height above minimum", value: formatNumber(heightAboveMin, 6) },
            { label: "Minimum height (at x=0)", value: formatNumber(yMin, 6) },
            { label: "Slope dy/dx", value: formatNumber(slope, 6) },
            { label: "Angle with horizontal", value: `${formatNumber(angle, 2)}°` },
            { label: "Arc length from center", value: formatNumber(arcLength, 6) },
            { label: "Curvature", value: formatNumber(curvature, 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["force-calculator", "acceleration-calculator", "scientific-calculator"],
  faq: [
    { question: "What is a catenary?", answer: "A catenary is the curve formed by a uniform flexible chain or cable hanging freely under its own weight between two supports. Its equation is y = a·cosh(x/a), where a = H/w (horizontal tension divided by weight per unit length). It is similar to but distinct from a parabola." },
    { question: "How is a catenary different from a parabola?", answer: "A parabola describes the shape of a cable under a uniform horizontal load (like a suspension bridge deck). A catenary describes a cable under its own weight only. For small sag-to-span ratios, the two curves are nearly identical, but they diverge for large sag." },
  ],
  formula: "y = a·cosh(x/a) | Arc length: s = a·sinh(x/a) | Sag = a·(cosh(L/2a) - 1) | T_h = w·a",
};
