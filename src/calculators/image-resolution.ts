import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export const imageResolutionCalculator: CalculatorDefinition = {
  slug: "image-resolution-calculator",
  title: "Image Resolution Calculator",
  description: "Free image resolution calculator. Calculate megapixels, aspect ratio, and print size at various DPI from image dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["image", "resolution", "megapixel", "aspect ratio", "DPI", "print size", "calculator"],
  variants: [
    {
      id: "convert",
      name: "Calculate",
      fields: [
        { name: "width", label: "Width (pixels)", type: "number", placeholder: "e.g. 4000" },
        { name: "height", label: "Height (pixels)", type: "number", placeholder: "e.g. 3000" },
      ],
      calculate: (inputs) => {
        const width = inputs.width as number;
        const height = inputs.height as number;
        if (!width || !height) return null;
        const megapixels = (width * height) / 1e6;
        const divisor = gcd(width, height);
        const ratioW = width / divisor;
        const ratioH = height / divisor;
        const printAt72W = width / 72;
        const printAt72H = height / 72;
        const printAt150W = width / 150;
        const printAt150H = height / 150;
        const printAt300W = width / 300;
        const printAt300H = height / 300;
        return {
          primary: { label: "Megapixels", value: `${formatNumber(megapixels, 2)} MP` },
          details: [
            { label: "Resolution", value: `${formatNumber(width, 0)} × ${formatNumber(height, 0)} px` },
            { label: "Aspect Ratio", value: `${ratioW}:${ratioH}` },
            { label: "Total Pixels", value: formatNumber(width * height, 0) },
            { label: "Print size at 72 DPI", value: `${formatNumber(printAt72W, 2)} × ${formatNumber(printAt72H, 2)} inches` },
            { label: "Print size at 150 DPI", value: `${formatNumber(printAt150W, 2)} × ${formatNumber(printAt150H, 2)} inches` },
            { label: "Print size at 300 DPI", value: `${formatNumber(printAt300W, 2)} × ${formatNumber(printAt300H, 2)} inches` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["print-size-calculator", "dpi-calculator", "screen-size-calculator"],
  faq: [
    { question: "What is a megapixel?", answer: "A megapixel is one million pixels. It is calculated by multiplying the image width by height in pixels and dividing by 1,000,000." },
    { question: "What DPI should I use for printing?", answer: "For high-quality photo prints, use 300 DPI. For everyday documents, 150 DPI is usually sufficient. For screen/web use, 72 DPI is standard." },
  ],
  formula: "Megapixels = (width × height) / 1,000,000. Print size = pixels / DPI. Aspect ratio = width:height simplified by GCD.",
};
