import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodBeamSpanCalculator: CalculatorDefinition = {
  slug: "wood-beam-span-calculator",
  title: "Wood Beam Span Calculator",
  description:
    "Calculate the maximum allowable span for wood beams by species, grade, and size. Determine proper beam sizing for floor joists, headers, and ridge beams.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "wood beam span",
    "beam span calculator",
    "lumber span table",
    "joist span calculator",
    "header beam size",
  ],
  variants: [
    {
      id: "floor-joist",
      name: "Floor Joist Span",
      description: "Calculate maximum span for floor joists at 40 PSF live load",
      fields: [
        {
          name: "species",
          label: "Wood Species",
          type: "select",
          options: [
            { label: "Douglas Fir-Larch #2", value: "dfl2" },
            { label: "Southern Pine #2", value: "sp2" },
            { label: "Spruce-Pine-Fir #2", value: "spf2" },
            { label: "Hem-Fir #2", value: "hf2" },
          ],
          defaultValue: "spf2",
        },
        {
          name: "joistSize",
          label: "Joist Size",
          type: "select",
          options: [
            { label: "2x6", value: "2x6" },
            { label: "2x8", value: "2x8" },
            { label: "2x10", value: "2x10" },
            { label: "2x12", value: "2x12" },
          ],
          defaultValue: "2x10",
        },
        {
          name: "spacing",
          label: "Joist Spacing (inches O.C.)",
          type: "select",
          options: [
            { label: '12" O.C.', value: "12" },
            { label: '16" O.C.', value: "16" },
            { label: '24" O.C.', value: "24" },
          ],
          defaultValue: "16",
        },
      ],
      calculate: (inputs) => {
        const species = inputs.species as string;
        const joistSize = inputs.joistSize as string;
        const spacing = parseFloat(inputs.spacing as string);
        if (!species || !joistSize || !spacing) return null;

        // Simplified span tables (feet) based on IRC tables for 40 PSF LL / 10 PSF DL
        const spanTable: Record<string, Record<string, Record<number, number>>> = {
          dfl2: {
            "2x6": { 12: 11.5, 16: 10.5, 24: 9.0 },
            "2x8": { 12: 15.0, 16: 13.5, 24: 11.5 },
            "2x10": { 12: 19.0, 16: 17.0, 24: 14.5 },
            "2x12": { 12: 23.0, 16: 21.0, 24: 17.5 },
          },
          sp2: {
            "2x6": { 12: 11.0, 16: 10.0, 24: 8.5 },
            "2x8": { 12: 14.5, 16: 13.0, 24: 11.0 },
            "2x10": { 12: 18.5, 16: 16.5, 24: 14.0 },
            "2x12": { 12: 22.5, 16: 20.0, 24: 17.0 },
          },
          spf2: {
            "2x6": { 12: 10.5, 16: 9.5, 24: 8.0 },
            "2x8": { 12: 13.5, 16: 12.5, 24: 10.5 },
            "2x10": { 12: 17.5, 16: 15.5, 24: 13.0 },
            "2x12": { 12: 21.0, 16: 19.0, 24: 16.0 },
          },
          hf2: {
            "2x6": { 12: 10.5, 16: 9.5, 24: 8.0 },
            "2x8": { 12: 13.5, 16: 12.0, 24: 10.0 },
            "2x10": { 12: 17.0, 16: 15.0, 24: 12.5 },
            "2x12": { 12: 20.5, 16: 18.5, 24: 15.5 },
          },
        };

        const maxSpan = spanTable[species]?.[joistSize]?.[spacing];
        if (!maxSpan) return null;

        const speciesNames: Record<string, string> = {
          dfl2: "Douglas Fir-Larch #2",
          sp2: "Southern Pine #2",
          spf2: "Spruce-Pine-Fir #2",
          hf2: "Hem-Fir #2",
        };

        return {
          primary: {
            label: "Maximum Span",
            value: `${formatNumber(maxSpan, 1)} feet`,
          },
          details: [
            { label: "Species/Grade", value: speciesNames[species] },
            { label: "Joist size", value: joistSize },
            { label: "Spacing", value: `${formatNumber(spacing)}" O.C.` },
            { label: "Live load", value: "40 PSF" },
            { label: "Dead load", value: "10 PSF" },
            { label: "Max span", value: `${formatNumber(maxSpan, 1)} ft (${formatNumber(maxSpan * 12, 0)} in)` },
          ],
          note: "Based on IRC span tables for residential floor joists. L/360 deflection limit applied. Always verify with local building codes.",
        };
      },
    },
    {
      id: "header-beam",
      name: "Header / Beam Sizing",
      description: "Determine beam size needed for a given span and load",
      fields: [
        {
          name: "span",
          label: "Clear Span (feet)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "tributaryWidth",
          label: "Tributary Width (feet)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "loadType",
          label: "Load Type",
          type: "select",
          options: [
            { label: "Floor (50 PSF total)", value: "50" },
            { label: "Roof Only (30 PSF total)", value: "30" },
            { label: "Floor + Roof (80 PSF total)", value: "80" },
          ],
          defaultValue: "50",
        },
      ],
      calculate: (inputs) => {
        const span = parseFloat(inputs.span as string);
        const tributaryWidth = parseFloat(inputs.tributaryWidth as string);
        const totalPSF = parseFloat(inputs.loadType as string);
        if (!span || !tributaryWidth || !totalPSF) return null;

        const loadPerFoot = totalPSF * tributaryWidth;
        const totalLoad = loadPerFoot * span;
        const maxMoment = (loadPerFoot / 12) * Math.pow(span * 12, 2) / 8;

        // Required section modulus (S = M / Fb), using Fb = 1000 psi for SPF #2
        const Fb = 1000;
        const requiredS = maxMoment / Fb;

        // Beam options with section modulus
        const beamOptions = [
          { name: "2-ply 2x8", S: 26.28 },
          { name: "2-ply 2x10", S: 42.78 },
          { name: "2-ply 2x12", S: 63.28 },
          { name: "3-ply 2x10", S: 64.17 },
          { name: "3-ply 2x12", S: 94.92 },
          { name: "4x10 Timber", S: 49.91 },
          { name: "6x10 Timber", S: 82.73 },
          { name: "6x12 Timber", S: 121.23 },
        ];

        const recommended = beamOptions.find((b) => b.S >= requiredS);
        const beamName = recommended ? recommended.name : "Larger beam or steel required";

        return {
          primary: {
            label: "Recommended Beam",
            value: beamName,
          },
          details: [
            { label: "Total load on beam", value: `${formatNumber(totalLoad)} lbs` },
            { label: "Load per foot", value: `${formatNumber(loadPerFoot)} lbs/ft` },
            { label: "Max bending moment", value: `${formatNumber(maxMoment)} in-lbs` },
            { label: "Required section modulus", value: `${formatNumber(requiredS, 1)} in^3` },
            { label: "Each support reaction", value: `${formatNumber(totalLoad / 2)} lbs` },
          ],
          note: "Based on SPF #2 lumber (Fb = 1,000 psi). For #1 grade or Douglas Fir, smaller beams may work. Always consult a structural engineer.",
        };
      },
    },
  ],
  relatedSlugs: ["beam-load-calculator", "rafter-length-calculator", "square-footage-calculator"],
  faq: [
    {
      question: "How far can a 2x10 span as a floor joist?",
      answer:
        "A #2 SPF 2x10 floor joist at 16\" O.C. spacing can span approximately 15.5 feet for a standard 40 PSF live load floor. Douglas Fir #2 can span about 17 feet. Closer spacing (12\" O.C.) increases the span by 1-2 feet.",
    },
    {
      question: "How do I size a wood beam for a given span?",
      answer:
        "Calculate the total load per linear foot (tributary width x PSF). Then find the maximum bending moment (M = wL^2/8). Divide the moment by the allowable bending stress (Fb) to get the required section modulus (S). Select a beam with S greater than or equal to the required value.",
    },
  ],
  formula:
    "Max Moment = wL^2/8 | Required S = M / Fb | Deflection limit = L/360",
};
