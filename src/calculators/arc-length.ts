import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const arcLengthCalculator: CalculatorDefinition = {
  slug: "arc-length-calculator",
  title: "Arc Length Calculator",
  description: "Free arc length calculator. Calculate the arc length, sector area, and chord length from radius and central angle.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["arc length calculator", "arc calculator", "length of arc", "circular arc", "arc of circle"],
  variants: [
    {
      id: "fromDegrees",
      name: "From Radius & Angle (Degrees)",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 10" },
        { name: "angle", label: "Central Angle (degrees)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number, deg = inputs.angle as number;
        if (!r || !deg) return null;
        const rad = (deg * Math.PI) / 180;
        const arcLen = r * rad;
        const sectorArea = 0.5 * r * r * rad;
        const chord = 2 * r * Math.sin(rad / 2);
        return {
          primary: { label: "Arc Length", value: formatNumber(arcLen, 6) },
          details: [
            { label: "Sector area", value: formatNumber(sectorArea, 6) },
            { label: "Chord length", value: formatNumber(chord, 6) },
            { label: "Angle in radians", value: formatNumber(rad, 6) },
          ],
        };
      },
    },
    {
      id: "fromRadians",
      name: "From Radius & Angle (Radians)",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 10" },
        { name: "angle", label: "Central Angle (radians)", type: "number", placeholder: "e.g. 1.047" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number, rad = inputs.angle as number;
        if (!r || !rad) return null;
        const arcLen = r * rad;
        const sectorArea = 0.5 * r * r * rad;
        const chord = 2 * r * Math.sin(rad / 2);
        const deg = (rad * 180) / Math.PI;
        return {
          primary: { label: "Arc Length", value: formatNumber(arcLen, 6) },
          details: [
            { label: "Sector area", value: formatNumber(sectorArea, 6) },
            { label: "Chord length", value: formatNumber(chord, 6) },
            { label: "Angle in degrees", value: formatNumber(deg, 6) + "\u00b0" },
          ],
        };
      },
    },
    {
      id: "fromArcRadius",
      name: "From Arc Length & Radius",
      fields: [
        { name: "arcLength", label: "Arc Length", type: "number", placeholder: "e.g. 10.47" },
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const arc = inputs.arcLength as number, r = inputs.radius as number;
        if (!arc || !r) return null;
        const rad = arc / r;
        const deg = (rad * 180) / Math.PI;
        const sectorArea = 0.5 * r * r * rad;
        const chord = 2 * r * Math.sin(rad / 2);
        return {
          primary: { label: "Central Angle", value: formatNumber(deg, 6) + "\u00b0" },
          details: [
            { label: "Angle in radians", value: formatNumber(rad, 6) },
            { label: "Arc length", value: formatNumber(arc, 6) },
            { label: "Sector area", value: formatNumber(sectorArea, 6) },
            { label: "Chord length", value: formatNumber(chord, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sector-area-calculator", "chord-length-calculator", "area-of-circle-calculator"],
  faq: [
    { question: "How do you calculate arc length?", answer: "Arc length = radius * angle (in radians). If the angle is in degrees, first convert: radians = degrees * pi / 180." },
    { question: "What is the difference between arc length and chord length?", answer: "Arc length is the curved distance along the circle, while chord length is the straight-line distance between the two endpoints of the arc." },
  ],
  formula: "Arc = r * theta | theta(rad) = degrees * pi/180",
};
