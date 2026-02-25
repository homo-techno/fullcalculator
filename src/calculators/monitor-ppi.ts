import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const monitorPpiCalculator: CalculatorDefinition = {
  slug: "monitor-ppi-calculator",
  title: "Monitor PPI Calculator",
  description: "Free monitor PPI calculator. Calculate pixels per inch for any display based on resolution and screen size. Compare display sharpness.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["ppi calculator", "pixels per inch", "monitor ppi", "screen density", "display sharpness calculator"],
  variants: [
    {
      id: "ppi-calc",
      name: "Calculate PPI",
      description: "Calculate pixels per inch from resolution and screen size",
      fields: [
        { name: "widthPx", label: "Horizontal Resolution (px)", type: "number", placeholder: "e.g. 2560", min: 1 },
        { name: "heightPx", label: "Vertical Resolution (px)", type: "number", placeholder: "e.g. 1440", min: 1 },
        { name: "diagonalInch", label: "Screen Diagonal (inches)", type: "number", placeholder: "e.g. 27", min: 1, step: 0.1 },
      ],
      calculate: (inputs) => {
        const widthPx = inputs.widthPx as number;
        const heightPx = inputs.heightPx as number;
        const diagonal = inputs.diagonalInch as number;
        if (!widthPx || !heightPx || !diagonal) return null;

        const diagonalPx = Math.sqrt(widthPx * widthPx + heightPx * heightPx);
        const ppi = diagonalPx / diagonal;
        const totalPixels = widthPx * heightPx;
        const megapixels = totalPixels / 1000000;
        const aspectRatio = widthPx / heightPx;

        // Calculate physical dimensions
        const aspectWidth = widthPx / diagonalPx;
        const aspectHeight = heightPx / diagonalPx;
        const physicalWidth = diagonal * aspectWidth;
        const physicalHeight = diagonal * aspectHeight;

        // Dot pitch (distance between pixel centers in mm)
        const dotPitch = 25.4 / ppi;

        // Sharpness classification
        let sharpness = "";
        if (ppi >= 300) sharpness = "Retina/HiDPI (excellent)";
        else if (ppi >= 200) sharpness = "Very sharp";
        else if (ppi >= 150) sharpness = "Sharp";
        else if (ppi >= 110) sharpness = "Adequate";
        else if (ppi >= 90) sharpness = "Moderate";
        else sharpness = "Low density";

        // Simplify aspect ratio
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const g = gcd(widthPx, heightPx);
        const ratioStr = `${widthPx / g}:${heightPx / g}`;

        return {
          primary: { label: "Pixels Per Inch", value: `${formatNumber(ppi, 1)} PPI` },
          details: [
            { label: "PPI", value: formatNumber(ppi, 1) },
            { label: "Resolution", value: `${widthPx} x ${heightPx}` },
            { label: "Total Pixels", value: `${formatNumber(megapixels, 2)} MP` },
            { label: "Aspect Ratio", value: ratioStr },
            { label: "Screen Size", value: `${diagonal}" diagonal` },
            { label: "Physical Width", value: `${formatNumber(physicalWidth, 1)}" (${formatNumber(physicalWidth * 2.54, 1)} cm)` },
            { label: "Physical Height", value: `${formatNumber(physicalHeight, 1)}" (${formatNumber(physicalHeight * 2.54, 1)} cm)` },
            { label: "Dot Pitch", value: `${formatNumber(dotPitch, 3)} mm` },
            { label: "Sharpness", value: sharpness },
          ],
        };
      },
    },
    {
      id: "common-displays",
      name: "Common Resolution PPI",
      description: "Calculate PPI for a common resolution at a given screen size",
      fields: [
        { name: "resolution", label: "Resolution", type: "select", options: [
          { label: "1920 x 1080 (Full HD)", value: "1920x1080" },
          { label: "2560 x 1440 (QHD)", value: "2560x1440" },
          { label: "3840 x 2160 (4K UHD)", value: "3840x2160" },
          { label: "5120 x 2880 (5K)", value: "5120x2880" },
          { label: "2560 x 1600 (WQXGA)", value: "2560x1600" },
          { label: "3440 x 1440 (Ultrawide QHD)", value: "3440x1440" },
        ], defaultValue: "2560x1440" },
        { name: "diagonalInch", label: "Screen Diagonal (inches)", type: "number", placeholder: "e.g. 27", min: 1, step: 0.1, defaultValue: 27 },
      ],
      calculate: (inputs) => {
        const resolution = inputs.resolution as string;
        const diagonal = inputs.diagonalInch as number;
        if (!resolution || !diagonal) return null;

        const [widthPx, heightPx] = resolution.split("x").map(Number);
        const diagonalPx = Math.sqrt(widthPx * widthPx + heightPx * heightPx);
        const ppi = diagonalPx / diagonal;
        const dotPitch = 25.4 / ppi;

        let sharpness = "";
        if (ppi >= 300) sharpness = "Retina/HiDPI (excellent)";
        else if (ppi >= 200) sharpness = "Very sharp";
        else if (ppi >= 150) sharpness = "Sharp";
        else if (ppi >= 110) sharpness = "Adequate";
        else if (ppi >= 90) sharpness = "Moderate";
        else sharpness = "Low density";

        // Recommended scaling
        let scaling = "100% (no scaling)";
        if (ppi >= 200) scaling = "200% recommended";
        else if (ppi >= 150) scaling = "150% recommended";
        else if (ppi >= 120) scaling = "125% recommended";

        return {
          primary: { label: "PPI", value: `${formatNumber(ppi, 1)} PPI` },
          details: [
            { label: "Resolution", value: `${widthPx} x ${heightPx}` },
            { label: "Screen Size", value: `${diagonal}" diagonal` },
            { label: "PPI", value: formatNumber(ppi, 1) },
            { label: "Dot Pitch", value: `${formatNumber(dotPitch, 3)} mm` },
            { label: "Sharpness Rating", value: sharpness },
            { label: "Recommended Scaling", value: scaling },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["color-depth-calculator", "image-filesize-calculator", "video-storage-calculator"],
  faq: [
    { question: "What is a good PPI for a monitor?", answer: "For desktop monitors at arm's length (~60cm), 110+ PPI is adequate and 140+ is sharp. Apple's Retina standard is ~220 PPI for laptops. For phones held at ~30cm, 300+ PPI (Retina) makes individual pixels imperceptible. Higher PPI means sharper text and images." },
    { question: "Does higher PPI always mean better?", answer: "Higher PPI means sharper individual pixels, but very high PPI on desktops requires scaling (making UI elements larger), which can reduce effective screen real estate. A 4K 27-inch monitor (163 PPI) at 150% scaling gives the workspace of a 1080p monitor but with much sharper rendering." },
  ],
  formula: "PPI = sqrt(Width^2 + Height^2) / Diagonal (inches) | Dot Pitch = 25.4 / PPI",
};
