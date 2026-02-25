import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chordLengthCalculator: CalculatorDefinition = {
  slug: "chord-length-calculator",
  title: "Chord Length Calculator",
  description: "Free chord length calculator. Calculate the chord length, sagitta, and segment area from radius and central angle.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["chord length calculator", "chord calculator", "chord of circle", "sagitta calculator", "segment area"],
  variants: [
    {
      id: "fromRadiusAngle",
      name: "From Radius & Central Angle",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 10" },
        { name: "angle", label: "Central Angle (degrees)", type: "number", placeholder: "e.g. 90" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number, deg = inputs.angle as number;
        if (!r || !deg || deg >= 360) return null;
        const rad = (deg * Math.PI) / 180;
        const chord = 2 * r * Math.sin(rad / 2);
        const sagitta = r * (1 - Math.cos(rad / 2));
        const arcLen = r * rad;
        const segmentArea = 0.5 * r * r * (rad - Math.sin(rad));
        return {
          primary: { label: "Chord Length", value: formatNumber(chord, 6) },
          details: [
            { label: "Sagitta (height)", value: formatNumber(sagitta, 6) },
            { label: "Arc length", value: formatNumber(arcLen, 6) },
            { label: "Segment area", value: formatNumber(segmentArea, 6) },
            { label: "Distance from center to chord", value: formatNumber(r * Math.cos(rad / 2), 6) },
          ],
        };
      },
    },
    {
      id: "fromRadiusDistance",
      name: "From Radius & Distance to Center",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 10" },
        { name: "distance", label: "Distance from Center to Chord", type: "number", placeholder: "e.g. 7.07" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number, d = inputs.distance as number;
        if (!r || !d || d >= r) return null;
        const halfChord = Math.sqrt(r * r - d * d);
        const chord = 2 * halfChord;
        const rad = 2 * Math.acos(d / r);
        const deg = (rad * 180) / Math.PI;
        const sagitta = r - d;
        return {
          primary: { label: "Chord Length", value: formatNumber(chord, 6) },
          details: [
            { label: "Central angle", value: formatNumber(deg, 6) + "\u00b0" },
            { label: "Sagitta", value: formatNumber(sagitta, 6) },
            { label: "Arc length", value: formatNumber(r * rad, 6) },
          ],
        };
      },
    },
    {
      id: "fromRadiusSagitta",
      name: "From Radius & Sagitta",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 10" },
        { name: "sagitta", label: "Sagitta (Height)", type: "number", placeholder: "e.g. 2.93" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number, s = inputs.sagitta as number;
        if (!r || !s || s >= 2 * r) return null;
        const chord = 2 * Math.sqrt(s * (2 * r - s));
        const d = r - s;
        const rad = 2 * Math.acos(d / r);
        const deg = (rad * 180) / Math.PI;
        return {
          primary: { label: "Chord Length", value: formatNumber(chord, 6) },
          details: [
            { label: "Central angle", value: formatNumber(deg, 6) + "\u00b0" },
            { label: "Distance from center", value: formatNumber(d, 6) },
            { label: "Arc length", value: formatNumber(r * rad, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["arc-length-calculator", "sector-area-calculator", "area-of-circle-calculator"],
  faq: [
    { question: "How do you calculate chord length?", answer: "Chord = 2*r*sin(theta/2), where r is the radius and theta is the central angle in radians. Alternatively, chord = 2*sqrt(r^2 - d^2) where d is the distance from center to chord." },
    { question: "What is a sagitta?", answer: "The sagitta is the distance from the midpoint of a chord to the arc. Sagitta = r - sqrt(r^2 - (chord/2)^2), or equivalently r*(1-cos(theta/2))." },
  ],
  formula: "Chord = 2r*sin(theta/2) | Sagitta = r(1-cos(theta/2))",
};
