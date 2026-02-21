import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beamSizeCalculator: CalculatorDefinition = {
  slug: "beam-size-calculator",
  title: "Beam Size Calculator",
  description: "Free beam size calculator. Estimate the required beam size based on span, tributary width, and load for residential construction.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["beam size calculator", "beam span calculator", "header size calculator", "load bearing beam calculator", "structural beam calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Beam Size",
      description: "Estimate beam size for residential applications",
      fields: [
        { name: "span", label: "Beam Span (ft)", type: "number", placeholder: "e.g. 12" },
        { name: "tributaryWidth", label: "Tributary Width (ft)", type: "number", placeholder: "e.g. 8" },
        { name: "load", label: "Total Load (psf)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const span = inputs.span as number;
        const tributaryWidth = inputs.tributaryWidth as number;
        const load = (inputs.load as number) || 50;
        if (!span || !tributaryWidth) return null;

        // Total load calculation
        const totalLoadPerFt = tributaryWidth * load; // lbs per linear foot
        const totalLoad = totalLoadPerFt * span; // total lbs on beam
        const halfLoad = totalLoad / 2; // reaction at each support

        // Simplified beam sizing (for #2 Douglas Fir, Fb = 900 psi, conservative)
        // Required section modulus S = M / Fb where M = wL^2/8
        const momentInLbs = (totalLoadPerFt * span * span * 12) / 8; // in-lbs
        const requiredS = momentInLbs / 900; // section modulus needed

        // Common beam section moduli
        const beamOptions = [
          { name: "2x8 (doubled)", s: 2 * 13.14, desc: "(2) 2x8" },
          { name: "2x10 (doubled)", s: 2 * 21.39, desc: "(2) 2x10" },
          { name: "2x12 (doubled)", s: 2 * 31.64, desc: "(2) 2x12" },
          { name: "2x10 (tripled)", s: 3 * 21.39, desc: "(3) 2x10" },
          { name: "2x12 (tripled)", s: 3 * 31.64, desc: "(3) 2x12" },
          { name: "6x8 solid", s: 51.56, desc: "6x8 timber" },
          { name: "6x10 solid", s: 82.73, desc: "6x10 timber" },
          { name: "6x12 solid", s: 121.23, desc: "6x12 timber" },
        ];

        const recommended = beamOptions.find(b => b.s >= requiredS);
        const recommendedName = recommended ? recommended.desc : "Engineered beam required (consult engineer)";

        return {
          primary: { label: "Recommended Beam", value: recommendedName },
          details: [
            { label: "Beam span", value: `${span} ft` },
            { label: "Tributary width", value: `${tributaryWidth} ft` },
            { label: "Design load", value: `${load} psf` },
            { label: "Load per linear foot", value: `${formatNumber(totalLoadPerFt)} lbs/ft` },
            { label: "Total load on beam", value: `${formatNumber(totalLoad)} lbs` },
            { label: "Reaction per support", value: `${formatNumber(halfLoad)} lbs` },
            { label: "Required section modulus", value: `${formatNumber(requiredS, 2)} in^3` },
            { label: "Beam section modulus", value: recommended ? `${formatNumber(recommended.s, 2)} in^3` : "N/A" },
          ],
          note: "This is a simplified estimate for #2 Douglas Fir (Fb=900 psi). Actual beam sizing must account for deflection limits, bearing conditions, and local codes. Always consult a structural engineer for load-bearing applications.",
        };
      },
    },
  ],
  relatedSlugs: ["joist-span-calculator", "stud-spacing-calculator", "lumber-calculator"],
  faq: [
    { question: "How do I size a beam for a residential floor?", answer: "Calculate the total load (tributary width x floor load x span), then determine the required section modulus. For residential floors, use 40 psf live + 10 psf dead = 50 psf total. Match the required section modulus to available beam sizes." },
    { question: "What is tributary width?", answer: "Tributary width is the distance from the beam to the midpoint of the spans on either side. If joists span 16 feet on one side and 12 feet on the other, the tributary width is (16/2) + (12/2) = 14 feet." },
    { question: "Do I need an engineer for a load-bearing beam?", answer: "Yes. While this calculator provides estimates, load-bearing beams are structural elements that require engineering calculations considering deflection, shear, bearing, and local building codes. Always get professional engineering for structural work." },
  ],
  formula: "Total Load = Tributary Width x Load x Span | Moment = wL^2/8 | Required S = Moment / Fb",
};
