import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sectorAreaCalculator: CalculatorDefinition = {
  slug: "sector-area-calculator",
  title: "Sector Area Calculator",
  description: "Free sector area calculator. Calculate the area, arc length, and perimeter of a circular sector.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["sector area calculator", "sector calculator", "area of sector", "circular sector", "sector perimeter"],
  variants: [
    {
      id: "fromRadiusDeg",
      name: "From Radius & Angle (Degrees)",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 10" },
        { name: "angle", label: "Central Angle (degrees)", type: "number", placeholder: "e.g. 90" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number, deg = inputs.angle as number;
        if (!r || !deg) return null;
        const rad = (deg * Math.PI) / 180;
        const area = 0.5 * r * r * rad;
        const arcLen = r * rad;
        const perim = arcLen + 2 * r;
        const chord = 2 * r * Math.sin(rad / 2);
        return {
          primary: { label: "Sector Area", value: formatNumber(area, 6) },
          details: [
            { label: "Arc length", value: formatNumber(arcLen, 6) },
            { label: "Sector perimeter", value: formatNumber(perim, 6) },
            { label: "Chord length", value: formatNumber(chord, 6) },
            { label: "Angle in radians", value: formatNumber(rad, 6) },
          ],
        };
      },
    },
    {
      id: "fromRadiusRad",
      name: "From Radius & Angle (Radians)",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 10" },
        { name: "angle", label: "Central Angle (radians)", type: "number", placeholder: "e.g. 1.5708" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number, rad = inputs.angle as number;
        if (!r || !rad) return null;
        const area = 0.5 * r * r * rad;
        const arcLen = r * rad;
        const perim = arcLen + 2 * r;
        const deg = (rad * 180) / Math.PI;
        return {
          primary: { label: "Sector Area", value: formatNumber(area, 6) },
          details: [
            { label: "Arc length", value: formatNumber(arcLen, 6) },
            { label: "Sector perimeter", value: formatNumber(perim, 6) },
            { label: "Angle in degrees", value: formatNumber(deg, 6) + "\u00b0" },
          ],
        };
      },
    },
    {
      id: "fromRadiusArc",
      name: "From Radius & Arc Length",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 10" },
        { name: "arcLength", label: "Arc Length", type: "number", placeholder: "e.g. 15.71" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number, arc = inputs.arcLength as number;
        if (!r || !arc) return null;
        const rad = arc / r;
        const deg = (rad * 180) / Math.PI;
        const area = 0.5 * r * arc;
        const perim = arc + 2 * r;
        return {
          primary: { label: "Sector Area", value: formatNumber(area, 6) },
          details: [
            { label: "Central angle", value: formatNumber(deg, 6) + "\u00b0" },
            { label: "Arc length", value: formatNumber(arc, 6) },
            { label: "Sector perimeter", value: formatNumber(perim, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["arc-length-calculator", "area-of-circle-calculator", "chord-length-calculator"],
  faq: [
    { question: "How do you calculate the area of a sector?", answer: "Sector area = (1/2)*r^2*theta, where theta is in radians. Or equivalently, area = (theta/360)*pi*r^2 when using degrees." },
    { question: "What is the perimeter of a sector?", answer: "The perimeter of a sector = arc length + 2 * radius. It includes the curved part and the two straight radii." },
  ],
  formula: "A = (1/2)*r^2*theta | Arc = r*theta | Perimeter = arc + 2r",
};
