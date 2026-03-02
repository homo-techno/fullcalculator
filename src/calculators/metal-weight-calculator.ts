import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metalWeightCalculator: CalculatorDefinition = {
  slug: "metal-weight-calculator",
  title: "Metal Weight Calculator",
  description: "Calculate the weight of a metal piece by shape and alloy.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["metal weight","steel weight calculator"],
  variants: [{
    id: "standard",
    name: "Metal Weight",
    description: "Calculate the weight of a metal piece by shape and alloy.",
    fields: [
      { name: "shape", label: "Shape", type: "select", options: [{ value: "flat", label: "Flat Plate" }, { value: "round", label: "Round Bar" }, { value: "tube", label: "Round Tube" }], defaultValue: "flat" },
      { name: "length", label: "Length (inches)", type: "number", min: 0.1, max: 1000, defaultValue: 24 },
      { name: "dim1", label: "Width or OD (inches)", type: "number", min: 0.01, max: 100, defaultValue: 4 },
      { name: "dim2", label: "Thickness or Wall (inches)", type: "number", min: 0.01, max: 20, defaultValue: 0.25 },
      { name: "density", label: "Density (lb/cu in)", type: "number", min: 0.05, max: 0.5, defaultValue: 0.283 },
    ],
    calculate: (inputs) => {
      const shape = inputs.shape as string;
      const len = inputs.length as number;
      const d1 = inputs.dim1 as number;
      const d2 = inputs.dim2 as number;
      const den = inputs.density as number;
      if (!len || !d1 || !d2 || !den) return null;
      var vol = 0;
      if (shape === "round") {
        vol = Math.PI * Math.pow(d1 / 2, 2) * len;
      } else if (shape === "tube") {
        var innerR = (d1 / 2) - d2;
        vol = Math.PI * (Math.pow(d1 / 2, 2) - Math.pow(innerR, 2)) * len;
      } else {
        vol = d1 * d2 * len;
      }
      var weight = Math.round(vol * den * 1000) / 1000;
      return {
        primary: { label: "Weight", value: formatNumber(weight) + " lb" },
        details: [
          { label: "Volume", value: formatNumber(Math.round(vol * 1000) / 1000) + " cu in" },
          { label: "Shape", value: shape === "flat" ? "Flat Plate" : shape === "round" ? "Round Bar" : "Round Tube" },
          { label: "Length", value: formatNumber(len) + " in" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What density should I use for aluminum?", answer: "Aluminum alloys have a density of about 0.098 pounds per cubic inch." },
    { question: "How do I weigh stainless steel?", answer: "Use a density of 0.289 pounds per cubic inch for 304 stainless steel." },
  ],
  formula: "Weight = Volume x Density",
};
