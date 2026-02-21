import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const aspectRatios: Record<string, { w: number; h: number }> = {
  "16:9": { w: 16, h: 9 },
  "16:10": { w: 16, h: 10 },
  "4:3": { w: 4, h: 3 },
  "21:9": { w: 21, h: 9 },
};

const ratioOptions = Object.keys(aspectRatios).map((r) => ({ label: r, value: r }));

export const screenSizeCalculator: CalculatorDefinition = {
  slug: "screen-size-calculator",
  title: "Screen Size Calculator",
  description: "Free screen size calculator. Calculate screen width, height, and area from diagonal size and aspect ratio.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["screen size", "diagonal", "aspect ratio", "monitor", "display", "TV", "calculator"],
  variants: [
    {
      id: "convert",
      name: "Calculate",
      fields: [
        { name: "diagonal", label: "Diagonal (inches)", type: "number", placeholder: "e.g. 27" },
        { name: "ratio", label: "Aspect Ratio", type: "select", options: ratioOptions },
      ],
      calculate: (inputs) => {
        const diagonal = inputs.diagonal as number;
        const ratioKey = (inputs.ratio as string) || "16:9";
        if (!diagonal) return null;
        const ratio = aspectRatios[ratioKey];
        if (!ratio) return null;
        // diagonal² = width² + height²
        // width = ratio.w × k, height = ratio.h × k
        // diagonal² = k² × (ratio.w² + ratio.h²)
        // k = diagonal / sqrt(ratio.w² + ratio.h²)
        const k = diagonal / Math.sqrt(ratio.w * ratio.w + ratio.h * ratio.h);
        const width = ratio.w * k;
        const height = ratio.h * k;
        const area = width * height;
        const widthCm = width * 2.54;
        const heightCm = height * 2.54;
        const areaCm2 = area * 2.54 * 2.54;
        return {
          primary: { label: "Screen Dimensions", value: `${formatNumber(width, 2)} × ${formatNumber(height, 2)} inches` },
          details: [
            { label: "Diagonal", value: `${formatNumber(diagonal, 1)} inches` },
            { label: "Aspect Ratio", value: ratioKey },
            { label: "Width (inches)", value: formatNumber(width, 2) },
            { label: "Height (inches)", value: formatNumber(height, 2) },
            { label: "Width (cm)", value: formatNumber(widthCm, 2) },
            { label: "Height (cm)", value: formatNumber(heightCm, 2) },
            { label: "Area (in²)", value: formatNumber(area, 2) },
            { label: "Area (cm²)", value: formatNumber(areaCm2, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dpi-calculator", "image-resolution-calculator"],
  faq: [
    { question: "How do I calculate screen width from diagonal?", answer: "Using the aspect ratio and Pythagorean theorem: width = diagonal × (W / sqrt(W² + H²)), where W:H is the aspect ratio." },
    { question: "What is the most common aspect ratio?", answer: "16:9 is the most common aspect ratio for modern TVs, monitors, and laptops." },
  ],
  formula: "k = diagonal / sqrt(W² + H²). Width = W × k. Height = H × k. Area = width × height. (W:H = aspect ratio).",
};
