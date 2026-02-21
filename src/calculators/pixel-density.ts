import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pixelDensityCalculator: CalculatorDefinition = {
  slug: "pixel-density-calculator",
  title: "PPI / Pixel Density Calculator",
  description: "Free PPI calculator. Calculate pixel density (pixels per inch) from screen resolution and display size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["ppi calculator", "pixel density calculator", "pixels per inch", "screen resolution calculator", "dpi calculator"],
  variants: [
    {
      id: "ppi",
      name: "Calculate PPI",
      fields: [
        { name: "width", label: "Horizontal Resolution (px)", type: "number", placeholder: "e.g. 2560" },
        { name: "height", label: "Vertical Resolution (px)", type: "number", placeholder: "e.g. 1440" },
        { name: "diagonal", label: "Screen Diagonal (inches)", type: "number", placeholder: "e.g. 27" },
      ],
      calculate: (inputs) => {
        const w = inputs.width as number, h = inputs.height as number, d = inputs.diagonal as number;
        if (!w || !h || !d) return null;
        const diagonalPx = Math.sqrt(w * w + h * h);
        const ppi = diagonalPx / d;
        const totalPx = w * h;
        const widthIn = d * w / diagonalPx;
        const heightIn = d * h / diagonalPx;
        return {
          primary: { label: "PPI", value: formatNumber(ppi, 1) },
          details: [
            { label: "Total pixels", value: formatNumber(totalPx, 0) },
            { label: "Megapixels", value: `${formatNumber(totalPx / 1000000, 2)} MP` },
            { label: "Screen width", value: `${formatNumber(widthIn, 1)}"` },
            { label: "Screen height", value: `${formatNumber(heightIn, 1)}"` },
            { label: "Dot pitch", value: `${formatNumber(25.4 / ppi, 4)} mm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["aspect-ratio-calculator", "unit-converter", "data-storage-calculator"],
  faq: [{ question: "What is PPI?", answer: "PPI (Pixels Per Inch) measures display sharpness. Higher PPI = sharper display. Retina displays are ≥220 PPI. Typical: phone 300-500 PPI, laptop 100-250 PPI, monitor 80-160 PPI. Formula: PPI = √(W² + H²) / diagonal." }],
  formula: "PPI = √(W² + H²) / diagonal",
};
