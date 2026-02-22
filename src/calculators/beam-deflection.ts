import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beamDeflectionCalculator: CalculatorDefinition = {
  slug: "beam-deflection-calculator",
  title: "Beam Deflection Calculator",
  description: "Free beam deflection calculator. Calculate maximum deflection, bending stress, and shear for simply supported and cantilever beams under various loading conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["beam deflection calculator", "beam bending calculator", "structural beam calculator", "beam stress calculator", "beam load calculator"],
  variants: [
    {
      id: "simply-supported-uniform",
      name: "Simply Supported – Uniform Load",
      description: "Calculate deflection for a simply supported beam with a uniformly distributed load",
      fields: [
        { name: "length", label: "Beam Length (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "load", label: "Total Uniform Load (lbs/ft)", type: "number", placeholder: "e.g. 200" },
        { name: "elasticity", label: "Modulus of Elasticity (psi)", type: "select", options: [
          { label: "Douglas Fir (1,700,000)", value: "1700000" },
          { label: "Southern Pine (1,800,000)", value: "1800000" },
          { label: "Steel (29,000,000)", value: "29000000" },
          { label: "Aluminum (10,000,000)", value: "10000000" },
        ], defaultValue: "1700000" },
        { name: "momentOfInertia", label: "Moment of Inertia (in\u2074)", type: "number", placeholder: "e.g. 98.9" },
      ],
      calculate: (inputs) => {
        const lengthFt = inputs.length as number;
        const w = inputs.load as number;
        const E = parseInt(inputs.elasticity as string) || 1700000;
        const I = inputs.momentOfInertia as number;
        if (!lengthFt || !w || !I) return null;

        const L = lengthFt * 12;
        const wPerInch = w / 12;
        const maxDeflection = (5 * wPerInch * Math.pow(L, 4)) / (384 * E * I);
        const maxMoment = (w * lengthFt * lengthFt) / 8;
        const maxShear = (w * lengthFt) / 2;
        const allowableDeflection = L / 360;
        const ratio = L / maxDeflection;

        return {
          primary: { label: "Maximum Deflection", value: `${formatNumber(maxDeflection, 4)} inches` },
          details: [
            { label: "Allowable deflection (L/360)", value: `${formatNumber(allowableDeflection, 4)} in` },
            { label: "Span/deflection ratio", value: `L/${formatNumber(ratio, 0)}` },
            { label: "Pass L/360 check", value: maxDeflection <= allowableDeflection ? "Yes" : "No" },
            { label: "Max bending moment", value: `${formatNumber(maxMoment, 0)} ft-lbs` },
            { label: "Max shear", value: `${formatNumber(maxShear, 0)} lbs` },
          ],
          note: "Deflection formula: \u03B4 = 5wL\u2074 / (384EI). L/360 is the typical allowable deflection for floor beams per building codes.",
        };
      },
    },
    {
      id: "cantilever-point",
      name: "Cantilever – Point Load at End",
      description: "Calculate deflection for a cantilever beam with a concentrated load at the free end",
      fields: [
        { name: "length", label: "Beam Length (feet)", type: "number", placeholder: "e.g. 6" },
        { name: "load", label: "Point Load (lbs)", type: "number", placeholder: "e.g. 500" },
        { name: "elasticity", label: "Modulus of Elasticity (psi)", type: "select", options: [
          { label: "Douglas Fir (1,700,000)", value: "1700000" },
          { label: "Southern Pine (1,800,000)", value: "1800000" },
          { label: "Steel (29,000,000)", value: "29000000" },
          { label: "Aluminum (10,000,000)", value: "10000000" },
        ], defaultValue: "1700000" },
        { name: "momentOfInertia", label: "Moment of Inertia (in\u2074)", type: "number", placeholder: "e.g. 98.9" },
      ],
      calculate: (inputs) => {
        const lengthFt = inputs.length as number;
        const P = inputs.load as number;
        const E = parseInt(inputs.elasticity as string) || 1700000;
        const I = inputs.momentOfInertia as number;
        if (!lengthFt || !P || !I) return null;

        const L = lengthFt * 12;
        const maxDeflection = (P * Math.pow(L, 3)) / (3 * E * I);
        const maxMoment = P * lengthFt;
        const allowableDeflection = L / 180;

        return {
          primary: { label: "Maximum Deflection", value: `${formatNumber(maxDeflection, 4)} inches` },
          details: [
            { label: "Allowable deflection (L/180)", value: `${formatNumber(allowableDeflection, 4)} in` },
            { label: "Pass L/180 check", value: maxDeflection <= allowableDeflection ? "Yes" : "No" },
            { label: "Max bending moment", value: `${formatNumber(maxMoment, 0)} ft-lbs` },
            { label: "Max shear", value: `${formatNumber(P, 0)} lbs` },
          ],
          note: "Deflection formula: \u03B4 = PL\u00B3 / (3EI). L/180 is a typical allowable deflection for cantilever beams.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "square-footage-calculator", "volume-calculator"],
  faq: [
    { question: "What is beam deflection?", answer: "Beam deflection is the displacement of a beam from its original position when subjected to loads. It depends on the beam's length, load, material stiffness (modulus of elasticity), and cross-section (moment of inertia). Excessive deflection can cause structural problems and code violations." },
    { question: "What is the L/360 rule for beam deflection?", answer: "L/360 means the maximum allowable deflection is the beam span divided by 360. For a 12-foot beam, that is 0.4 inches. This is the standard limit for floor joists and beams per most building codes (IBC/IRC). Roof beams typically use L/240." },
  ],
  formula: "Simply Supported Uniform: \u03B4 = 5wL\u2074/(384EI) | Cantilever Point: \u03B4 = PL\u00B3/(3EI)",
};
