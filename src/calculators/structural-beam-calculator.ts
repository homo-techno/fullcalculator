import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const structuralBeamCalculator: CalculatorDefinition = {
  slug: "structural-beam-calculator",
  title: "Structural Beam Calculator",
  description: "Calculate the maximum load capacity and deflection of a structural beam based on material and dimensions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["structural beam", "beam load capacity", "beam deflection"],
  variants: [{
    id: "standard",
    name: "Structural Beam",
    description: "Calculate the maximum load capacity and deflection of a structural beam based on material and dimensions",
    fields: [
      { name: "beamLength", label: "Beam Length", type: "number", suffix: "feet", min: 1, max: 100, defaultValue: 12 },
      { name: "width", label: "Beam Width", type: "number", suffix: "inches", min: 1, max: 24, defaultValue: 6 },
      { name: "height", label: "Beam Height", type: "number", suffix: "inches", min: 2, max: 48, defaultValue: 10 },
      { name: "material", label: "Material", type: "select", options: [{value:"steel",label:"Steel (A36)"},{value:"wood-sl",label:"Southern Pine"},{value:"wood-df",label:"Douglas Fir"},{value:"aluminum",label:"Aluminum"}], defaultValue: "steel" },
    ],
    calculate: (inputs) => {
      const len = inputs.beamLength as number;
      const w = inputs.width as number;
      const h = inputs.height as number;
      const mat = inputs.material as string;
      if (!len || !w || !h) return null;
      const modulus: Record<string, number> = { steel: 29000000, "wood-sl": 1700000, "wood-df": 1900000, aluminum: 10000000 };
      const allowStress: Record<string, number> = { steel: 36000, "wood-sl": 1500, "wood-df": 1700, aluminum: 21000 };
      const E = modulus[mat] || 29000000;
      const Fb = allowStress[mat] || 36000;
      const I = (w * Math.pow(h, 3)) / 12;
      const S = (w * Math.pow(h, 2)) / 6;
      const lenIn = len * 12;
      const maxLoad = (8 * Fb * S) / lenIn;
      const deflection = (5 * maxLoad * Math.pow(lenIn, 3)) / (384 * E * I);
      const deflectionLimit = lenIn / 360;
      const status = deflection <= deflectionLimit ? "Within limits (L/360)" : "Exceeds deflection limit";
      return {
        primary: { label: "Max Uniform Load", value: formatNumber(Math.round(maxLoad)) + " lbs" },
        details: [
          { label: "Max Deflection", value: deflection.toFixed(3) + " inches" },
          { label: "Deflection Limit (L/360)", value: deflectionLimit.toFixed(3) + " inches" },
          { label: "Status", value: status },
        ],
      };
    },
  }],
  relatedSlugs: ["moment-of-inertia-calculator", "spring-constant-calculator"],
  faq: [
    { question: "How do I calculate beam load capacity?", answer: "Beam load capacity depends on the material strength, cross-section dimensions, and span length. The section modulus and allowable stress determine the maximum bending moment." },
    { question: "What is the L/360 deflection rule?", answer: "The L/360 rule limits beam deflection to the span length divided by 360. For a 12-foot beam that means a maximum deflection of 0.4 inches." },
  ],
  formula: "Max Load = (8 x Allowable Stress x Section Modulus) / Span Length",
};
