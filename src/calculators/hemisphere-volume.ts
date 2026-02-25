import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hemisphereVolumeCalculator: CalculatorDefinition = {
  slug: "hemisphere-volume-calculator",
  title: "Hemisphere Volume Calculator",
  description: "Free hemisphere volume calculator. Calculate the volume, curved surface area, and total surface area of a hemisphere.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["hemisphere volume calculator", "hemisphere calculator", "volume of hemisphere", "hemisphere surface area", "half sphere"],
  variants: [
    {
      id: "fromRadius",
      name: "From Radius",
      fields: [
        { name: "radius", label: "Radius", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const r = inputs.radius as number;
        if (!r) return null;
        const volume = (2 / 3) * Math.PI * r * r * r;
        const curvedSA = 2 * Math.PI * r * r;
        const baseSA = Math.PI * r * r;
        const totalSA = curvedSA + baseSA;
        return {
          primary: { label: "Volume", value: formatNumber(volume, 6) },
          details: [
            { label: "Curved surface area", value: formatNumber(curvedSA, 6) },
            { label: "Base area", value: formatNumber(baseSA, 6) },
            { label: "Total surface area", value: formatNumber(totalSA, 6) },
            { label: "Diameter", value: formatNumber(2 * r, 6) },
          ],
        };
      },
    },
    {
      id: "fromDiameter",
      name: "From Diameter",
      fields: [
        { name: "diameter", label: "Diameter", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const d = inputs.diameter as number;
        if (!d) return null;
        const r = d / 2;
        const volume = (2 / 3) * Math.PI * r * r * r;
        const curvedSA = 2 * Math.PI * r * r;
        const totalSA = 3 * Math.PI * r * r;
        return {
          primary: { label: "Volume", value: formatNumber(volume, 6) },
          details: [
            { label: "Radius", value: formatNumber(r, 6) },
            { label: "Curved surface area", value: formatNumber(curvedSA, 6) },
            { label: "Total surface area", value: formatNumber(totalSA, 6) },
          ],
        };
      },
    },
    {
      id: "fromVolume",
      name: "From Volume",
      fields: [
        { name: "volume", label: "Volume", type: "number", placeholder: "e.g. 452.39" },
      ],
      calculate: (inputs) => {
        const v = inputs.volume as number;
        if (!v) return null;
        const r = Math.cbrt((3 * v) / (2 * Math.PI));
        const curvedSA = 2 * Math.PI * r * r;
        const totalSA = 3 * Math.PI * r * r;
        return {
          primary: { label: "Radius", value: formatNumber(r, 6) },
          details: [
            { label: "Volume", value: formatNumber(v, 6) },
            { label: "Curved surface area", value: formatNumber(curvedSA, 6) },
            { label: "Total surface area", value: formatNumber(totalSA, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["sphere-calculator", "cone-volume-calculator", "cylinder-volume-calculator"],
  faq: [
    { question: "How do you calculate the volume of a hemisphere?", answer: "Volume = (2/3)*pi*r^3. This is exactly half the volume of a sphere with the same radius." },
    { question: "What is the total surface area of a hemisphere?", answer: "Total SA = 3*pi*r^2, which includes the curved surface (2*pi*r^2) plus the flat circular base (pi*r^2)." },
  ],
  formula: "V = (2/3)*pi*r^3 | Curved SA = 2*pi*r^2 | Total SA = 3*pi*r^2",
};
