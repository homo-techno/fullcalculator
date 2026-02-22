import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const angularDiameterCalculator: CalculatorDefinition = {
  slug: "angular-diameter-calculator",
  title: "Angular Diameter Calculator",
  description: "Free angular diameter calculator. Calculate the apparent angular size of an object given its physical size and distance.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["angular diameter", "angular size", "apparent size", "angular measure", "astronomy"],
  variants: [
    {
      id: "angular-size",
      name: "Calculate Angular Diameter",
      description: "d = 2 arctan(size / 2D)",
      fields: [
        { name: "physSize", label: "Physical Diameter", type: "number", placeholder: "e.g. 3474" },
        { name: "sizeUnit", label: "Size Unit", type: "select", options: [
          { label: "Kilometers", value: "km" },
          { label: "Meters", value: "m" },
          { label: "AU", value: "au" },
          { label: "Solar Radii", value: "sr" },
        ] },
        { name: "distance", label: "Distance", type: "number", placeholder: "e.g. 384400" },
        { name: "distUnit", label: "Distance Unit", type: "select", options: [
          { label: "Kilometers", value: "km" },
          { label: "AU", value: "au" },
          { label: "Light Years", value: "ly" },
          { label: "Parsecs", value: "pc" },
        ] },
      ],
      calculate: (inputs) => {
        const size = inputs.physSize as number;
        const sU = inputs.sizeUnit as string;
        const dist = inputs.distance as number;
        const dU = inputs.distUnit as string;
        if (!size || !dist) return null;
        const toKm: Record<string, number> = { km: 1, m: 0.001, au: 1.496e8, sr: 696340, ly: 9.461e12, pc: 3.0857e13 };
        const sKm = size * (toKm[sU] || 1);
        const dKm = dist * (toKm[dU] || 1);
        const angRad = 2 * Math.atan(sKm / (2 * dKm));
        const angDeg = angRad * (180 / Math.PI);
        const angArcmin = angDeg * 60;
        const angArcsec = angDeg * 3600;
        return {
          primary: { label: "Angular Diameter", value: angDeg >= 1 ? `${formatNumber(angDeg, 4)}deg` : angArcmin >= 1 ? `${formatNumber(angArcmin, 4)} arcmin` : `${formatNumber(angArcsec, 4)} arcsec` },
          details: [
            { label: "Degrees", value: `${formatNumber(angDeg, 6)}` },
            { label: "Arcminutes", value: formatNumber(angArcmin, 4) },
            { label: "Arcseconds", value: formatNumber(angArcsec, 4) },
            { label: "Radians", value: formatNumber(angRad, 8) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["telescope-magnification-calculator", "telescope-fov-calculator", "parsec-converter-calculator"],
  faq: [
    { question: "What is angular diameter?", answer: "Angular diameter is the apparent size of an object measured as an angle. The Moon is about 0.5 degrees." },
    { question: "Why do objects appear smaller farther away?", answer: "Angular diameter decreases with distance. Twice the distance means half the angular size." },
  ],
  formula: "angular diameter = 2 arctan(physical size / (2 x distance))",
};
