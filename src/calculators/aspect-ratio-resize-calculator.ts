import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aspectRatioResizeCalculator: CalculatorDefinition = {
  slug: "aspect-ratio-resize-calculator",
  title: "Aspect Ratio Resize Calculator",
  description: "Calculate new dimensions when resizing images or video while maintaining or converting between aspect ratios.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["aspect ratio resize","image resize calculator","video aspect ratio","resolution converter"],
  variants: [{
    id: "standard",
    name: "Aspect Ratio Resize",
    description: "Calculate new dimensions when resizing images or video while maintaining or converting between aspect ratios.",
    fields: [
      { name: "sourceWidth", label: "Source Width (px)", type: "number", min: 1, max: 15360, defaultValue: 1920 },
      { name: "sourceHeight", label: "Source Height (px)", type: "number", min: 1, max: 8640, defaultValue: 1080 },
      { name: "targetRatio", label: "Target Aspect Ratio", type: "select", options: [{ value: "1", label: "16:9 (Widescreen)" }, { value: "2", label: "4:3 (Standard)" }, { value: "3", label: "1:1 (Square)" }, { value: "4", label: "9:16 (Vertical/TikTok)" }, { value: "5", label: "21:9 (Ultrawide)" }, { value: "6", label: "Keep Original" }], defaultValue: "1" },
      { name: "targetWidth", label: "Target Width (px, 0=auto)", type: "number", min: 0, max: 15360, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const sw = inputs.sourceWidth as number;
    const sh = inputs.sourceHeight as number;
    const ratio = parseInt(inputs.targetRatio as string);
    const tw = inputs.targetWidth as number;
    const sourceRatio = sw / sh;
    const sourceGCD = (a, b) => b === 0 ? a : sourceGCD(b, a % b);
    const ratios = [0, 16/9, 4/3, 1, 9/16, 21/9, sourceRatio];
    const targetAR = ratios[ratio];
    const ratioLabels = ["", "16:9", "4:3", "1:1", "9:16", "21:9", Math.round(sourceRatio * 100) / 100 + ":1"];
    let finalW, finalH;
    if (tw > 0) {
      finalW = tw;
      finalH = Math.round(tw / targetAR);
    } else {
      finalW = sw;
      finalH = Math.round(sw / targetAR);
    }
    const cropW = Math.min(sw, Math.round(sh * targetAR));
    const cropH = Math.min(sh, Math.round(sw / targetAR));
    const megapixels = Math.round(finalW * finalH / 1000000 * 10) / 10;
    return {
      primary: { label: "Output Dimensions", value: formatNumber(finalW) + " x " + formatNumber(finalH) + " px" },
      details: [
        { label: "Target Aspect Ratio", value: ratioLabels[ratio] },
        { label: "Source Aspect Ratio", value: formatNumber(Math.round(sourceRatio * 100) / 100) + ":1" },
        { label: "Crop Region", value: formatNumber(cropW) + " x " + formatNumber(cropH) + " px" },
        { label: "Output Megapixels", value: formatNumber(megapixels) + " MP" }
      ]
    };
  },
  }],
  relatedSlugs: ["golden-ratio-composition-calculator","print-resolution-calculator"],
  faq: [
    { question: "What aspect ratio is best for social media?", answer: "Instagram feeds use 1:1 or 4:5, Stories and Reels use 9:16, YouTube uses 16:9, and TikTok uses 9:16. Each platform has its preferred ratio." },
    { question: "What happens when I change aspect ratio?", answer: "Changing aspect ratio requires either cropping (cutting parts of the image), letterboxing (adding black bars), or stretching (distorting the image). Cropping is usually preferred." },
    { question: "What is the most common video aspect ratio?", answer: "16:9 is the standard for most video content including TV, YouTube, and streaming. Cinema uses wider ratios like 2.39:1 or 21:9." },
  ],
  formula: "Output Height = Width / Aspect Ratio
Crop Width = min(Source Width, Source Height x Aspect Ratio)
Crop Height = min(Source Height, Source Width / Aspect Ratio)",
};
