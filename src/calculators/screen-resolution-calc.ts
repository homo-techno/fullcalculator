import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const screenResolutionCalculator: CalculatorDefinition = {
  slug: "screen-resolution-calc",
  title: "Screen Resolution Calculator",
  description:
    "Free screen resolution and aspect ratio calculator. Calculate PPI, total pixels, and display properties from screen dimensions and resolution.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "screen resolution calculator",
    "display PPI",
    "pixel density",
    "monitor resolution",
    "screen size calculator",
    "aspect ratio",
    "retina display",
  ],
  variants: [
    {
      id: "resolution-info",
      name: "Resolution Details",
      description: "Get full display info from screen size and resolution",
      fields: [
        {
          name: "screenSize",
          label: "Screen Diagonal (inches)",
          type: "number",
          placeholder: "e.g. 27",
        },
        {
          name: "resWidth",
          label: "Horizontal Resolution (pixels)",
          type: "number",
          placeholder: "e.g. 2560",
        },
        {
          name: "resHeight",
          label: "Vertical Resolution (pixels)",
          type: "number",
          placeholder: "e.g. 1440",
        },
      ],
      calculate: (inputs) => {
        const screenSize = parseFloat(inputs.screenSize as string);
        const resWidth = parseFloat(inputs.resWidth as string);
        const resHeight = parseFloat(inputs.resHeight as string);
        if (isNaN(screenSize) || isNaN(resWidth) || isNaN(resHeight)) return null;
        if (screenSize <= 0 || resWidth <= 0 || resHeight <= 0) return null;

        const diagPixels = Math.sqrt(resWidth * resWidth + resHeight * resHeight);
        const ppi = diagPixels / screenSize;
        const totalPixels = resWidth * resHeight;
        const megapixels = totalPixels / 1000000;

        // Calculate physical dimensions
        const aspectRatio = resWidth / resHeight;
        const heightIn = screenSize / Math.sqrt(aspectRatio * aspectRatio + 1);
        const widthIn = heightIn * aspectRatio;

        // Simplify aspect ratio
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const g = gcd(resWidth, resHeight);
        const arW = resWidth / g;
        const arH = resHeight / g;

        return {
          primary: {
            label: "Pixel Density (PPI)",
            value: formatNumber(ppi, 1),
            suffix: "PPI",
          },
          details: [
            { label: "Resolution", value: `${formatNumber(resWidth, 0)} x ${formatNumber(resHeight, 0)}` },
            { label: "Total Pixels", value: formatNumber(totalPixels) + " (" + formatNumber(megapixels, 2) + " MP)" },
            { label: "Aspect Ratio", value: `${formatNumber(arW, 0)}:${formatNumber(arH, 0)}` },
            { label: "Physical Width", value: formatNumber(widthIn, 1) + " in (" + formatNumber(widthIn * 2.54, 1) + " cm)" },
            { label: "Physical Height", value: formatNumber(heightIn, 1) + " in (" + formatNumber(heightIn * 2.54, 1) + " cm)" },
            { label: "Dot Pitch", value: formatNumber(25.4 / ppi, 4) + " mm" },
          ],
        };
      },
    },
    {
      id: "common-resolutions",
      name: "Common Resolutions",
      description: "Reference common display resolutions",
      fields: [
        {
          name: "preset",
          label: "Resolution Preset",
          type: "select",
          options: [
            { label: "HD (1280x720)", value: "720" },
            { label: "Full HD (1920x1080)", value: "1080" },
            { label: "QHD / 2K (2560x1440)", value: "1440" },
            { label: "4K UHD (3840x2160)", value: "2160" },
            { label: "5K (5120x2880)", value: "2880" },
            { label: "8K (7680x4320)", value: "4320" },
            { label: "Ultrawide FHD (2560x1080)", value: "uw1080" },
            { label: "Ultrawide QHD (3440x1440)", value: "uw1440" },
          ],
          defaultValue: "1080",
        },
        {
          name: "screenSize",
          label: "Screen Diagonal (inches)",
          type: "number",
          placeholder: "e.g. 27",
        },
      ],
      calculate: (inputs) => {
        const preset = inputs.preset as string;
        const screenSize = parseFloat(inputs.screenSize as string);
        if (isNaN(screenSize) || screenSize <= 0) return null;

        const resolutions: Record<string, { w: number; h: number; name: string }> = {
          "720": { w: 1280, h: 720, name: "HD" },
          "1080": { w: 1920, h: 1080, name: "Full HD" },
          "1440": { w: 2560, h: 1440, name: "QHD / 2K" },
          "2160": { w: 3840, h: 2160, name: "4K UHD" },
          "2880": { w: 5120, h: 2880, name: "5K" },
          "4320": { w: 7680, h: 4320, name: "8K" },
          "uw1080": { w: 2560, h: 1080, name: "Ultrawide FHD" },
          "uw1440": { w: 3440, h: 1440, name: "Ultrawide QHD" },
        };

        const r = resolutions[preset];
        if (!r) return null;

        const diagPixels = Math.sqrt(r.w * r.w + r.h * r.h);
        const ppi = diagPixels / screenSize;
        const totalPixels = r.w * r.h;

        return {
          primary: {
            label: `${r.name} PPI at ${formatNumber(screenSize, 0)}"`,
            value: formatNumber(ppi, 1),
            suffix: "PPI",
          },
          details: [
            { label: "Resolution", value: `${formatNumber(r.w, 0)} x ${formatNumber(r.h, 0)}` },
            { label: "Total Pixels", value: formatNumber(totalPixels) + " (" + formatNumber(totalPixels / 1000000, 2) + " MP)" },
            { label: "Dot Pitch", value: formatNumber(25.4 / ppi, 4) + " mm" },
            { label: "Retina Qualifying", value: ppi >= 200 ? "Yes (PPI >= 200)" : "No (PPI < 200)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["aspect-ratio-calc", "dpi-ppi-calc", "data-storage-calculator"],
  faq: [
    {
      question: "What is PPI and why does it matter?",
      answer:
        "PPI (Pixels Per Inch) measures pixel density. Higher PPI means sharper images and text. Apple considers 200+ PPI as Retina quality. For desktop monitors, 100-110 PPI is standard, while smartphones often exceed 400 PPI.",
    },
    {
      question: "Is 4K worth it on a 27-inch monitor?",
      answer:
        "4K (3840x2160) on a 27\" monitor gives about 163 PPI, which is noticeably sharper than 1440p (109 PPI). However, you may need display scaling at 125-150% to keep text readable. It is well worth it for photo/video work.",
    },
    {
      question: "What resolution is best for gaming?",
      answer:
        "It depends on your GPU. 1080p is ideal for budget/mid-range GPUs, 1440p for mid/high-end, and 4K requires a top-tier GPU. Higher refresh rates (144Hz+) often matter more than resolution for competitive gaming.",
    },
  ],
  formula:
    "PPI = √(W² + H²) / Diagonal | Total Pixels = Width x Height | Dot Pitch = 25.4 / PPI",
};
