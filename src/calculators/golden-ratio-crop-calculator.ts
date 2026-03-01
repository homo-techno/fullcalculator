import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const goldenRatioCropCalculator: CalculatorDefinition = {
  slug: "golden-ratio-crop-calculator",
  title: "Golden Ratio Crop Calculator",
  description: "Calculate golden ratio crop dimensions for images.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["golden ratio crop","golden rectangle calculator"],
  variants: [{
    id: "standard",
    name: "Golden Ratio Crop",
    description: "Calculate golden ratio crop dimensions for images.",
    fields: [
      { name: "width", label: "Image Width (px)", type: "number", min: 1, max: 50000, defaultValue: 1920 },
      { name: "height", label: "Image Height (px)", type: "number", min: 1, max: 50000, defaultValue: 1080 },
    ],
    calculate: (inputs) => {
      const w = inputs.width as number;
      const h = inputs.height as number;
      if (!w || !h) return null;
      const phi = 1.618;
      const currentRatio = w / h;
      let cropW, cropH;
      if (currentRatio > phi) {
        cropH = h;
        cropW = Math.round(h * phi);
      } else {
        cropW = w;
        cropH = Math.round(w / phi);
      }
      const removedPx = (w * h) - (cropW * cropH);
      return {
        primary: { label: "Golden Crop", value: formatNumber(cropW) + " x " + formatNumber(cropH) + " px" },
        details: [
          { label: "Original Size", value: formatNumber(w) + " x " + formatNumber(h) + " px" },
          { label: "Current Ratio", value: formatNumber(Math.round(currentRatio * 1000) / 1000) },
          { label: "Pixels Removed", value: formatNumber(removedPx) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the golden ratio?", answer: "The golden ratio is approximately 1.618, found throughout nature and art." },
    { question: "Why use the golden ratio for cropping?", answer: "It creates visually balanced and aesthetically pleasing compositions." },
  ],
  formula: "Golden Width = Height x 1.618 (or Height = Width / 1.618)",
};
