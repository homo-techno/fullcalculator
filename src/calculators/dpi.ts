import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dpiCalculator: CalculatorDefinition = {
  slug: "dpi-calculator",
  title: "DPI Calculator",
  description: "Free DPI/PPI calculator. Calculate dots per inch from screen resolution and physical dimensions or diagonal size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["DPI", "PPI", "dots per inch", "pixels per inch", "screen resolution", "display", "calculator"],
  variants: [
    {
      id: "from-width",
      name: "From Width",
      fields: [
        { name: "widthPx", label: "Screen Width (pixels)", type: "number", placeholder: "e.g. 1920" },
        { name: "widthIn", label: "Screen Width (inches)", type: "number", placeholder: "e.g. 13.3" },
      ],
      calculate: (inputs) => {
        const widthPx = inputs.widthPx as number;
        const widthIn = inputs.widthIn as number;
        if (!widthPx || !widthIn) return null;
        const dpi = widthPx / widthIn;
        const dotPitch = 25.4 / dpi; // mm per pixel
        return {
          primary: { label: "DPI / PPI", value: formatNumber(dpi, 2) },
          details: [
            { label: "Pixels", value: formatNumber(widthPx, 0) },
            { label: "Physical Width (inches)", value: formatNumber(widthIn, 2) },
            { label: "DPI (Dots per inch)", value: formatNumber(dpi, 2) },
            { label: "Dot Pitch (mm)", value: formatNumber(dotPitch, 4) },
          ],
        };
      },
    },
    {
      id: "from-diagonal",
      name: "From Diagonal",
      fields: [
        { name: "widthPx", label: "Screen Width (pixels)", type: "number", placeholder: "e.g. 2560" },
        { name: "heightPx", label: "Screen Height (pixels)", type: "number", placeholder: "e.g. 1440" },
        { name: "diagonal", label: "Diagonal (inches)", type: "number", placeholder: "e.g. 27" },
      ],
      calculate: (inputs) => {
        const widthPx = inputs.widthPx as number;
        const heightPx = inputs.heightPx as number;
        const diagonal = inputs.diagonal as number;
        if (!widthPx || !heightPx || !diagonal) return null;
        const diagonalPx = Math.sqrt(widthPx * widthPx + heightPx * heightPx);
        const dpi = diagonalPx / diagonal;
        const dotPitch = 25.4 / dpi;
        const widthIn = widthPx / dpi;
        const heightIn = heightPx / dpi;
        return {
          primary: { label: "DPI / PPI", value: formatNumber(dpi, 2) },
          details: [
            { label: "Resolution", value: `${formatNumber(widthPx, 0)} × ${formatNumber(heightPx, 0)} px` },
            { label: "Diagonal (inches)", value: formatNumber(diagonal, 1) },
            { label: "Diagonal (pixels)", value: formatNumber(diagonalPx, 1) },
            { label: "DPI (Dots per inch)", value: formatNumber(dpi, 2) },
            { label: "Dot Pitch (mm)", value: formatNumber(dotPitch, 4) },
            { label: "Screen Width (inches)", value: formatNumber(widthIn, 2) },
            { label: "Screen Height (inches)", value: formatNumber(heightIn, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["screen-size-calculator", "image-resolution-calculator", "print-size-calculator"],
  faq: [
    { question: "What is the difference between DPI and PPI?", answer: "DPI (dots per inch) originally refers to printer resolution, while PPI (pixels per inch) refers to screen resolution. They are often used interchangeably for screens." },
    { question: "What is a good DPI for a monitor?", answer: "Standard monitors are around 96 PPI. Retina/HiDPI displays are 200+ PPI. Higher PPI means sharper text and images." },
  ],
  formula: "DPI = diagonal pixels / diagonal inches. Diagonal pixels = sqrt(width² + height²). Dot pitch (mm) = 25.4 / DPI.",
};
