import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pixelDensityPpiCalculator: CalculatorDefinition = {
  slug: "pixel-density-ppi-calculator",
  title: "Pixel Density PPI Calculator",
  description: "Calculate pixels per inch (PPI) for displays and prints to determine sharpness and optimal viewing distance for photography.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["pixel density","PPI calculator","pixels per inch","screen resolution density","retina display"],
  variants: [{
    id: "standard",
    name: "Pixel Density PPI",
    description: "Calculate pixels per inch (PPI) for displays and prints to determine sharpness and optimal viewing distance for photography.",
    fields: [
      { name: "widthPx", label: "Width (pixels)", type: "number", min: 1, max: 15360, defaultValue: 3840 },
      { name: "heightPx", label: "Height (pixels)", type: "number", min: 1, max: 8640, defaultValue: 2160 },
      { name: "diagonal", label: "Diagonal Size (inches)", type: "number", min: 1, max: 120, defaultValue: 27 },
    ],
    calculate: (inputs) => {
    const w = inputs.widthPx as number;
    const h = inputs.heightPx as number;
    const diag = inputs.diagonal as number;
    const diagPx = Math.sqrt(w * w + h * h);
    const ppi = Math.round(diagPx / diag * 10) / 10;
    const optimalViewDist = Math.round(3438 / ppi * 10) / 10;
    const isRetina = ppi > 200 ? "Yes (> 200 PPI)" : ppi > 150 ? "Borderline" : "No (< 150 PPI)";
    const totalPixels = w * h;
    const megapixels = Math.round(totalPixels / 1000000 * 10) / 10;
    const dotPitch = Math.round(25.4 / ppi * 1000) / 1000;
    return {
      primary: { label: "Pixel Density", value: formatNumber(ppi) + " PPI" },
      details: [
        { label: "Retina Quality", value: isRetina },
        { label: "Optimal Viewing Distance", value: formatNumber(optimalViewDist) + " inches" },
        { label: "Dot Pitch", value: formatNumber(dotPitch) + " mm" },
        { label: "Total Pixels", value: formatNumber(megapixels) + " MP (" + formatNumber(totalPixels) + ")" }
      ]
    };
  },
  }],
  relatedSlugs: ["print-resolution-calculator","aspect-ratio-resize-calculator","nd-filter-exposure-calculator"],
  faq: [
    { question: "What PPI is considered 'retina' quality?", answer: "Apple defines retina as when pixels are indistinguishable at normal viewing distance — roughly 220+ PPI for phones held at 10 inches, and 110+ PPI for monitors at 20 inches." },
    { question: "What PPI should I use for photo prints?", answer: "300 PPI is the standard for high-quality photo prints. 150 PPI is acceptable for large prints viewed from a distance. Billboards can use 10-30 PPI." },
    { question: "Does higher PPI always mean better?", answer: "Above a certain PPI, the human eye cannot distinguish individual pixels. For desktop monitors at typical viewing distance, 110-140 PPI is standard and 200+ is excellent." },
  ],
  formula: "PPI = sqrt(Width^2 + Height^2) / Diagonal Size
Optimal Viewing Distance = 3438 / PPI (in inches)
Dot Pitch = 25.4 / PPI (in mm)",
};
