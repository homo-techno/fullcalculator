import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const screenResolutionComparisonCalculator: CalculatorDefinition = {
  slug: "screen-resolution-comparison-calculator",
  title: "Screen Resolution Comparison Calculator",
  description: "Compare screen resolutions by calculating total pixels, pixel density, and aspect ratios to understand the difference between display standards.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["screen resolution comparison","display resolution calculator","pixel density comparison","4k vs 1080p","monitor resolution"],
  variants: [{
    id: "standard",
    name: "Screen Resolution Comparison",
    description: "Compare screen resolutions by calculating total pixels, pixel density, and aspect ratios to understand the difference between display standards.",
    fields: [
      { name: "width1", label: "Resolution 1 - Width (px)", type: "number", min: 320, max: 15360, defaultValue: 1920 },
      { name: "height1", label: "Resolution 1 - Height (px)", type: "number", min: 240, max: 8640, defaultValue: 1080 },
      { name: "width2", label: "Resolution 2 - Width (px)", type: "number", min: 320, max: 15360, defaultValue: 3840 },
      { name: "height2", label: "Resolution 2 - Height (px)", type: "number", min: 240, max: 8640, defaultValue: 2160 },
      { name: "screenSize", label: "Screen Size (inches)", type: "number", min: 5, max: 100, defaultValue: 27 },
    ],
    calculate: (inputs) => {
    const w1 = inputs.width1 as number;
    const h1 = inputs.height1 as number;
    const w2 = inputs.width2 as number;
    const h2 = inputs.height2 as number;
    const size = inputs.screenSize as number;
    const pixels1 = w1 * h1;
    const pixels2 = w2 * h2;
    const diag1 = Math.sqrt(w1 * w1 + h1 * h1);
    const diag2 = Math.sqrt(w2 * w2 + h2 * h2);
    const ppi1 = Math.round(diag1 / size);
    const ppi2 = Math.round(diag2 / size);
    const pixelRatio = Math.round((pixels2 / pixels1) * 100) / 100;
    const ppiDiff = ppi2 - ppi1;
    return {
      primary: { label: "Pixel Count Ratio", value: formatNumber(pixelRatio) + "x more pixels" },
      details: [
        { label: "Resolution 1 Total Pixels", value: formatNumber(pixels1) },
        { label: "Resolution 2 Total Pixels", value: formatNumber(pixels2) },
        { label: "PPI at " + size + " inches (Res 1)", value: formatNumber(ppi1) + " PPI" },
        { label: "PPI at " + size + " inches (Res 2)", value: formatNumber(ppi2) + " PPI" },
        { label: "PPI Difference", value: "+" + formatNumber(ppiDiff) + " PPI" }
      ]
    };
  },
  }],
  relatedSlugs: ["monitor-size-distance-calculator","tv-viewing-distance-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total Pixels = Width x Height
PPI = Diagonal Pixels / Screen Size (inches)
Diagonal Pixels = sqrt(Width^2 + Height^2)
Pixel Ratio = Resolution 2 Pixels / Resolution 1 Pixels",
};
