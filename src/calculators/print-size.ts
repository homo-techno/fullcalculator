import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function getQualityRating(dpi: number): string {
  if (dpi >= 300) return "Excellent (photo quality)";
  if (dpi >= 200) return "Good (sharp print)";
  if (dpi >= 150) return "Acceptable (standard print)";
  if (dpi >= 100) return "Fair (visible pixels up close)";
  return "Poor (noticeably pixelated)";
}

export const printSizeCalculator: CalculatorDefinition = {
  slug: "print-size-calculator",
  title: "Print Size Calculator",
  description: "Free print size calculator. Determine maximum print dimensions from image resolution and desired DPI with quality rating.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["print size", "DPI", "image", "resolution", "print quality", "calculator"],
  variants: [
    {
      id: "convert",
      name: "Calculate Print Size",
      fields: [
        { name: "widthPx", label: "Image Width (pixels)", type: "number", placeholder: "e.g. 4000" },
        { name: "heightPx", label: "Image Height (pixels)", type: "number", placeholder: "e.g. 3000" },
        { name: "dpi", label: "Desired DPI", type: "number", placeholder: "e.g. 300" },
      ],
      calculate: (inputs) => {
        const widthPx = inputs.widthPx as number;
        const heightPx = inputs.heightPx as number;
        const dpi = inputs.dpi as number;
        if (!widthPx || !heightPx || !dpi) return null;
        const widthIn = widthPx / dpi;
        const heightIn = heightPx / dpi;
        const widthCm = widthIn * 2.54;
        const heightCm = heightIn * 2.54;
        const quality = getQualityRating(dpi);
        return {
          primary: { label: "Max Print Size", value: `${formatNumber(widthIn, 2)} × ${formatNumber(heightIn, 2)} inches` },
          details: [
            { label: "Image Resolution", value: `${formatNumber(widthPx, 0)} × ${formatNumber(heightPx, 0)} px` },
            { label: "Print DPI", value: formatNumber(dpi, 0) },
            { label: "Width (inches)", value: formatNumber(widthIn, 2) },
            { label: "Height (inches)", value: formatNumber(heightIn, 2) },
            { label: "Width (cm)", value: formatNumber(widthCm, 2) },
            { label: "Height (cm)", value: formatNumber(heightCm, 2) },
            { label: "Quality Rating", value: quality },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["image-resolution-calculator", "dpi-calculator", "paper-size-converter"],
  faq: [
    { question: "What DPI do I need for a good print?", answer: "300 DPI is the standard for photo-quality prints. 150 DPI is acceptable for larger prints viewed from a distance." },
    { question: "How do I calculate print size?", answer: "Divide the pixel dimension by the DPI to get the print size in inches. For example, 3000 pixels at 300 DPI = 10 inches." },
  ],
  formula: "Print size (inches) = pixels / DPI. Print size (cm) = (pixels / DPI) × 2.54.",
};
