import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const photoPrintSizeCalculator: CalculatorDefinition = {
  slug: "photo-print-size-calculator",
  title: "Photo Print Size Calculator",
  description: "Free photo print size calculator. Calculate optimal print dimensions, crop ratios, and resolution for printing photos from any camera or phone.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["photo print size calculator", "print photo calculator", "photo crop calculator", "photo resize for print", "image print size"],
  variants: [
    {
      id: "resize",
      name: "Image to Print Size",
      description: "Calculate maximum print size from image resolution",
      fields: [
        { name: "imageWidth", label: "Image Width (pixels)", type: "number", placeholder: "e.g. 4032" },
        { name: "imageHeight", label: "Image Height (pixels)", type: "number", placeholder: "e.g. 3024" },
        { name: "dpi", label: "Print DPI", type: "select", options: [
          { label: "150 DPI (acceptable)", value: "150" },
          { label: "200 DPI (good)", value: "200" },
          { label: "300 DPI (professional)", value: "300" },
          { label: "600 DPI (fine art)", value: "600" },
        ], defaultValue: "300" },
      ],
      calculate: (inputs) => {
        const w = inputs.imageWidth as number;
        const h = inputs.imageHeight as number;
        const dpi = parseInt(inputs.dpi as string) || 300;
        if (!w || !h) return null;

        const printW = w / dpi;
        const printH = h / dpi;
        const megapixels = (w * h) / 1000000;

        return {
          primary: { label: "Max Print Size", value: `${formatNumber(printW, 1)}" x ${formatNumber(printH, 1)}"` },
          details: [
            { label: "Print width", value: `${formatNumber(printW, 2)} inches (${formatNumber(printW * 2.54, 1)} cm)` },
            { label: "Print height", value: `${formatNumber(printH, 2)} inches (${formatNumber(printH * 2.54, 1)} cm)` },
            { label: "Image resolution", value: `${w} x ${h} pixels` },
            { label: "Megapixels", value: formatNumber(megapixels, 1) },
            { label: "Print DPI", value: `${dpi}` },
            { label: "Aspect ratio", value: `${formatNumber(w / h, 2)}:1` },
          ],
          note: "300 DPI is the standard for high-quality prints. 150 DPI is acceptable for large prints viewed from a distance.",
        };
      },
    },
    {
      id: "crop",
      name: "Crop for Print Size",
      description: "Calculate pixels needed for a specific print size",
      fields: [
        { name: "printWidth", label: "Desired Print Width (inches)", type: "number", placeholder: "e.g. 8" },
        { name: "printHeight", label: "Desired Print Height (inches)", type: "number", placeholder: "e.g. 10" },
        { name: "dpi", label: "Print DPI", type: "select", options: [
          { label: "150 DPI (acceptable)", value: "150" },
          { label: "200 DPI (good)", value: "200" },
          { label: "300 DPI (professional)", value: "300" },
          { label: "600 DPI (fine art)", value: "600" },
        ], defaultValue: "300" },
      ],
      calculate: (inputs) => {
        const pw = inputs.printWidth as number;
        const ph = inputs.printHeight as number;
        const dpi = parseInt(inputs.dpi as string) || 300;
        if (!pw || !ph) return null;

        const pixelsW = Math.ceil(pw * dpi);
        const pixelsH = Math.ceil(ph * dpi);
        const megapixels = (pixelsW * pixelsH) / 1000000;

        return {
          primary: { label: "Required Resolution", value: `${pixelsW} x ${pixelsH} px` },
          details: [
            { label: "Width needed", value: `${formatNumber(pixelsW)} pixels` },
            { label: "Height needed", value: `${formatNumber(pixelsH)} pixels` },
            { label: "Total pixels", value: `${formatNumber(megapixels, 1)} MP` },
            { label: "Print size", value: `${pw}" x ${ph}"` },
            { label: "DPI", value: `${dpi}` },
            { label: "File size estimate (JPEG)", value: `~${formatNumber(megapixels * 0.5, 1)} MB` },
          ],
        };
      },
    },
    {
      id: "standard",
      name: "Standard Print Sizes",
      description: "Minimum resolution for common print sizes at 300 DPI",
      fields: [
        { name: "printSize", label: "Print Size", type: "select", options: [
          { label: "4x6 (Wallet)", value: "4x6" },
          { label: "5x7", value: "5x7" },
          { label: "8x10", value: "8x10" },
          { label: "11x14", value: "11x14" },
          { label: "16x20", value: "16x20" },
          { label: "20x30 (Poster)", value: "20x30" },
          { label: "24x36 (Large Poster)", value: "24x36" },
        ], defaultValue: "8x10" },
        { name: "imageWidth", label: "Your Image Width (pixels)", type: "number", placeholder: "e.g. 4032" },
        { name: "imageHeight", label: "Your Image Height (pixels)", type: "number", placeholder: "e.g. 3024" },
      ],
      calculate: (inputs) => {
        const size = inputs.printSize as string;
        const iw = inputs.imageWidth as number;
        const ih = inputs.imageHeight as number;
        if (!size) return null;

        const [pw, ph] = size.split("x").map(Number);
        const neededW = pw * 300;
        const neededH = ph * 300;

        const details = [
          { label: "Print size", value: `${pw}" x ${ph}"` },
          { label: "Required resolution (300 DPI)", value: `${neededW} x ${neededH} px` },
          { label: "Required megapixels", value: `${formatNumber((neededW * neededH) / 1000000, 1)} MP` },
        ];

        if (iw && ih) {
          const canPrintW = iw >= neededW;
          const canPrintH = ih >= neededH;
          const canPrint = canPrintW && canPrintH;
          const actualDpiW = iw / pw;
          const actualDpiH = ih / ph;
          details.push(
            { label: "Your image", value: `${iw} x ${ih} px` },
            { label: "Your DPI at this size", value: `${Math.round(Math.min(actualDpiW, actualDpiH))} DPI` },
            { label: "Quality", value: canPrint ? "Excellent (300+ DPI)" : Math.min(actualDpiW, actualDpiH) >= 150 ? "Acceptable (150+ DPI)" : "Low quality - image too small" },
          );
        }

        return {
          primary: { label: "Minimum Resolution", value: `${neededW} x ${neededH} px` },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["depth-of-field-calculator", "crop-factor-calculator", "aspect-ratio-calculator"],
  faq: [
    { question: "What DPI do I need for photo printing?", answer: "300 DPI is the professional standard for photo prints. 150 DPI is acceptable for larger prints viewed from a distance. 600 DPI is used for fine art or gallery prints where extreme detail matters." },
    { question: "How many megapixels do I need for an 8x10 print?", answer: "At 300 DPI, an 8x10 print needs 2400x3000 pixels, which is 7.2 megapixels. Most modern smartphones (12+ MP) can easily produce 8x10 prints." },
    { question: "What happens if my image DPI is too low?", answer: "If your image has fewer pixels than needed, the print will appear blurry or pixelated. You can either print at a smaller size or accept lower quality." },
  ],
  formula: "Print Size (inches) = Image Pixels / DPI | Required Pixels = Print Size (inches) x DPI",
};
