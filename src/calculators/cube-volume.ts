import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cubeVolumeCalculator: CalculatorDefinition = {
  slug: "cube-volume-calculator",
  title: "Cube Volume Calculator",
  description: "Free cube volume calculator. Calculate the volume, surface area, diagonal, and edge length of a cube.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["cube volume calculator", "cube calculator", "volume of cube", "cube surface area", "cube diagonal"],
  variants: [
    {
      id: "fromEdge",
      name: "From Edge Length",
      fields: [
        { name: "edge", label: "Edge Length", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const e = inputs.edge as number;
        if (!e) return null;
        const volume = e * e * e;
        const surfaceArea = 6 * e * e;
        const faceDiag = e * Math.sqrt(2);
        const spaceDiag = e * Math.sqrt(3);
        return {
          primary: { label: "Volume", value: formatNumber(volume, 6) },
          details: [
            { label: "Surface area", value: formatNumber(surfaceArea, 6) },
            { label: "Face diagonal", value: formatNumber(faceDiag, 6) },
            { label: "Space diagonal", value: formatNumber(spaceDiag, 6) },
            { label: "Edge length", value: formatNumber(e, 6) },
          ],
        };
      },
    },
    {
      id: "fromVolume",
      name: "From Volume",
      fields: [
        { name: "volume", label: "Volume", type: "number", placeholder: "e.g. 125" },
      ],
      calculate: (inputs) => {
        const v = inputs.volume as number;
        if (!v) return null;
        const e = Math.cbrt(v);
        const surfaceArea = 6 * e * e;
        const spaceDiag = e * Math.sqrt(3);
        return {
          primary: { label: "Edge Length", value: formatNumber(e, 6) },
          details: [
            { label: "Volume", value: formatNumber(v, 6) },
            { label: "Surface area", value: formatNumber(surfaceArea, 6) },
            { label: "Space diagonal", value: formatNumber(spaceDiag, 6) },
          ],
        };
      },
    },
    {
      id: "fromSurfaceArea",
      name: "From Surface Area",
      fields: [
        { name: "surfaceArea", label: "Surface Area", type: "number", placeholder: "e.g. 150" },
      ],
      calculate: (inputs) => {
        const sa = inputs.surfaceArea as number;
        if (!sa) return null;
        const e = Math.sqrt(sa / 6);
        const volume = e * e * e;
        const spaceDiag = e * Math.sqrt(3);
        return {
          primary: { label: "Edge Length", value: formatNumber(e, 6) },
          details: [
            { label: "Volume", value: formatNumber(volume, 6) },
            { label: "Surface area", value: formatNumber(sa, 6) },
            { label: "Space diagonal", value: formatNumber(spaceDiag, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rectangular-prism-calculator", "sphere-calculator", "cylinder-volume-calculator"],
  faq: [
    { question: "How do you calculate the volume of a cube?", answer: "Volume = edge^3. For a cube with edge length 5, volume = 5^3 = 125 cubic units." },
    { question: "What is the space diagonal of a cube?", answer: "The space diagonal = edge * sqrt(3). It connects two opposite vertices passing through the interior of the cube." },
  ],
  formula: "V = e^3 | SA = 6e^2 | Space diagonal = e*sqrt(3)",
};
