import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const polarCoordinatesCalculator: CalculatorDefinition = {
  slug: "polar-coordinates-calculator",
  title: "Polar Coordinates Calculator",
  description:
    "Free polar coordinates calculator. Convert between rectangular (x, y) and polar (r, θ) coordinate systems.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: [
    "polar coordinates",
    "rectangular coordinates",
    "cartesian to polar",
    "polar to cartesian",
    "coordinate conversion",
  ],
  variants: [
    {
      id: "rect-to-polar",
      name: "Rectangular → Polar",
      fields: [
        { name: "x", label: "x", type: "number", placeholder: "e.g. 3" },
        { name: "y", label: "y", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const x = inputs.x as number;
        const y = inputs.y as number;
        if (x === undefined || y === undefined) return null;

        const r = Math.sqrt(x * x + y * y);
        const thetaRad = Math.atan2(y, x);
        const thetaDeg = (thetaRad * 180) / Math.PI;

        return {
          primary: {
            label: "Polar (r, θ)",
            value: `(${formatNumber(r, 6)}, ${formatNumber(thetaDeg, 4)}°)`,
          },
          details: [
            { label: "r", value: formatNumber(r, 6) },
            { label: "θ (degrees)", value: `${formatNumber(thetaDeg, 4)}°` },
            { label: "θ (radians)", value: formatNumber(thetaRad, 6) },
          ],
        };
      },
    },
    {
      id: "polar-to-rect",
      name: "Polar → Rectangular",
      fields: [
        { name: "r", label: "r (radius)", type: "number", placeholder: "e.g. 5" },
        {
          name: "theta",
          label: "θ (degrees)",
          type: "number",
          placeholder: "e.g. 53.13",
        },
      ],
      calculate: (inputs) => {
        const r = inputs.r as number;
        const thetaDeg = inputs.theta as number;
        if (r === undefined || thetaDeg === undefined) return null;

        const thetaRad = (thetaDeg * Math.PI) / 180;
        const x = r * Math.cos(thetaRad);
        const y = r * Math.sin(thetaRad);

        return {
          primary: {
            label: "Rectangular (x, y)",
            value: `(${formatNumber(x, 6)}, ${formatNumber(y, 6)})`,
          },
          details: [
            { label: "x", value: formatNumber(x, 6) },
            { label: "y", value: formatNumber(y, 6) },
            { label: "θ (radians)", value: formatNumber(thetaRad, 6) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "cross-product-calculator",
    "dot-product-calculator",
    "interpolation-calculator",
  ],
  faq: [
    {
      question: "What are polar coordinates?",
      answer:
        "Polar coordinates represent a point by its distance from the origin (r) and the angle (θ) measured counter-clockwise from the positive x-axis. They are an alternative to the rectangular (Cartesian) system (x, y). Conversion: x = r·cos(θ), y = r·sin(θ).",
    },
  ],
  formula: "r = √(x² + y²), θ = atan2(y, x); x = r·cos(θ), y = r·sin(θ)",
};
