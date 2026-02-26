import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beamLoadCalculator: CalculatorDefinition = {
  slug: "beam-load-calculator",
  title: "Beam Load Capacity Calculator",
  description:
    "Calculate the maximum load capacity and bending stress of structural beams. Analyze uniformly distributed and point loads for steel and wood beams.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "beam load calculator",
    "beam capacity",
    "beam stress calculator",
    "structural beam load",
    "bending moment",
  ],
  variants: [
    {
      id: "uniform-load",
      name: "Uniform Load on Simple Beam",
      description:
        "Calculate bending stress and deflection for a uniformly loaded simple beam",
      fields: [
        {
          name: "span",
          label: "Beam Span (feet)",
          type: "number",
          placeholder: "e.g. 16",
        },
        {
          name: "loadPerFoot",
          label: "Load per Linear Foot (lbs/ft)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "beamType",
          label: "Beam Type",
          type: "select",
          options: [
            { label: "2x8 SPF Lumber", value: "2x8" },
            { label: "2x10 SPF Lumber", value: "2x10" },
            { label: "2x12 SPF Lumber", value: "2x12" },
            { label: "4x8 Timber", value: "4x8" },
            { label: "6x8 Timber", value: "6x8" },
            { label: "W8x18 Steel", value: "w8x18" },
            { label: "W10x22 Steel", value: "w10x22" },
          ],
          defaultValue: "2x10",
        },
      ],
      calculate: (inputs) => {
        const span = parseFloat(inputs.span as string);
        const loadPerFoot = parseFloat(inputs.loadPerFoot as string);
        const beamType = inputs.beamType as string;
        if (!span || !loadPerFoot) return null;

        // Section modulus (in^3) and Moment of Inertia (in^4) for common beams
        const beamProps: Record<string, { S: number; I: number; Fb: number; E: number }> = {
          "2x8": { S: 13.14, I: 47.63, Fb: 1000, E: 1400000 },
          "2x10": { S: 21.39, I: 98.93, Fb: 1000, E: 1400000 },
          "2x12": { S: 31.64, I: 178.0, Fb: 1000, E: 1400000 },
          "4x8": { S: 30.66, I: 111.1, Fb: 1000, E: 1400000 },
          "6x8": { S: 51.56, I: 193.4, Fb: 1000, E: 1400000 },
          "w8x18": { S: 15.2, I: 61.9, Fb: 36000, E: 29000000 },
          "w10x22": { S: 23.2, I: 118.0, Fb: 36000, E: 29000000 },
        };

        const props = beamProps[beamType];
        if (!props) return null;

        const totalLoad = loadPerFoot * span;
        const spanIn = span * 12;
        const wPerInch = loadPerFoot / 12;

        // Max moment for uniform load on simple beam: M = wL^2/8
        const maxMoment = (wPerInch * spanIn * spanIn) / 8; // in-lbs

        // Bending stress: fb = M / S
        const bendingStress = maxMoment / props.S;

        // Deflection: delta = 5wL^4 / (384EI)
        const deflection =
          (5 * wPerInch * Math.pow(spanIn, 4)) / (384 * props.E * props.I);
        const deflectionLimit = spanIn / 360;

        const stressRatio = bendingStress / props.Fb;
        const passStress = stressRatio <= 1.0;
        const passDeflection = deflection <= deflectionLimit;

        return {
          primary: {
            label: "Total Load on Beam",
            value: `${formatNumber(totalLoad)} lbs`,
          },
          details: [
            { label: "Max bending moment", value: `${formatNumber(maxMoment)} in-lbs` },
            { label: "Bending stress", value: `${formatNumber(bendingStress)} psi` },
            { label: "Allowable stress", value: `${formatNumber(props.Fb)} psi` },
            { label: "Stress ratio", value: `${formatNumber(stressRatio, 2)} (${passStress ? "OK" : "EXCEEDS"})` },
            { label: "Max deflection", value: `${formatNumber(deflection, 3)} inches` },
            { label: "Deflection limit (L/360)", value: `${formatNumber(deflectionLimit, 3)} inches` },
            { label: "Deflection check", value: passDeflection ? "PASS" : "FAIL" },
          ],
          note: `${passStress && passDeflection ? "Beam passes both stress and deflection checks." : "WARNING: Beam does NOT pass all checks. Select a larger beam or reduce span/load."} Values are for preliminary estimation only. Consult a structural engineer for final design.`,
        };
      },
    },
    {
      id: "point-load",
      name: "Center Point Load",
      description: "Calculate stress from a single point load at beam center",
      fields: [
        {
          name: "span",
          label: "Beam Span (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "pointLoad",
          label: "Point Load (lbs)",
          type: "number",
          placeholder: "e.g. 2000",
        },
        {
          name: "beamType",
          label: "Beam Type",
          type: "select",
          options: [
            { label: "2x8 SPF Lumber", value: "2x8" },
            { label: "2x10 SPF Lumber", value: "2x10" },
            { label: "2x12 SPF Lumber", value: "2x12" },
            { label: "W8x18 Steel", value: "w8x18" },
            { label: "W10x22 Steel", value: "w10x22" },
          ],
          defaultValue: "2x10",
        },
      ],
      calculate: (inputs) => {
        const span = parseFloat(inputs.span as string);
        const pointLoad = parseFloat(inputs.pointLoad as string);
        const beamType = inputs.beamType as string;
        if (!span || !pointLoad) return null;

        const beamProps: Record<string, { S: number; I: number; Fb: number; E: number }> = {
          "2x8": { S: 13.14, I: 47.63, Fb: 1000, E: 1400000 },
          "2x10": { S: 21.39, I: 98.93, Fb: 1000, E: 1400000 },
          "2x12": { S: 31.64, I: 178.0, Fb: 1000, E: 1400000 },
          "w8x18": { S: 15.2, I: 61.9, Fb: 36000, E: 29000000 },
          "w10x22": { S: 23.2, I: 118.0, Fb: 36000, E: 29000000 },
        };

        const props = beamProps[beamType];
        if (!props) return null;

        const spanIn = span * 12;
        // Center point load: M = PL/4
        const maxMoment = (pointLoad * spanIn) / 4;
        const bendingStress = maxMoment / props.S;
        // Deflection: delta = PL^3 / (48EI)
        const deflection = (pointLoad * Math.pow(spanIn, 3)) / (48 * props.E * props.I);
        const deflectionLimit = spanIn / 360;
        const stressRatio = bendingStress / props.Fb;

        return {
          primary: {
            label: "Bending Stress",
            value: `${formatNumber(bendingStress)} psi`,
          },
          details: [
            { label: "Max bending moment", value: `${formatNumber(maxMoment)} in-lbs` },
            { label: "Allowable stress", value: `${formatNumber(props.Fb)} psi` },
            { label: "Stress ratio", value: `${formatNumber(stressRatio, 2)} (${stressRatio <= 1 ? "OK" : "EXCEEDS"})` },
            { label: "Max deflection", value: `${formatNumber(deflection, 3)} inches` },
            { label: "Deflection limit (L/360)", value: `${formatNumber(deflectionLimit, 3)} inches` },
            { label: "Each support reaction", value: `${formatNumber(pointLoad / 2)} lbs` },
          ],
          note: "For a single concentrated load at the center of a simply supported beam. Consult a structural engineer for actual design.",
        };
      },
    },
  ],
  relatedSlugs: ["wood-beam-span-calculator", "force-calculator", "concrete-calculator"],
  faq: [
    {
      question: "How do I calculate beam load capacity?",
      answer:
        "Beam load capacity depends on the beam's section modulus (S), allowable bending stress (Fb), and span length. For a uniform load: Max load = 8 x Fb x S / L (in inches). For wood beams, Fb is typically 1,000-1,500 psi. For steel (A36), Fb is about 36,000 psi on yield.",
    },
    {
      question: "What is the L/360 deflection limit?",
      answer:
        "L/360 is a common deflection limit for floor beams, meaning the maximum allowable deflection is the span length divided by 360. For a 16-foot span, that is 0.53 inches. This limit prevents noticeable sagging and prevents damage to finishes.",
    },
  ],
  formula:
    "Uniform Load: M = wL^2/8 | Point Load: M = PL/4 | Stress = M/S | Deflection (uniform) = 5wL^4/(384EI)",
};
