import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const monitorSizeDistanceCalculator: CalculatorDefinition = {
  slug: "monitor-size-distance-calculator",
  title: "Monitor Size and Viewing Distance Calculator",
  description: "Calculate the optimal viewing distance for any monitor or TV based on screen size, resolution, and panel type for the best visual experience.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["monitor viewing distance","screen size distance","optimal monitor distance","desk monitor size","ergonomic screen distance"],
  variants: [{
    id: "standard",
    name: "Monitor Size and Viewing Distance",
    description: "Calculate the optimal viewing distance for any monitor or TV based on screen size, resolution, and panel type for the best visual experience.",
    fields: [
      { name: "screenSize", label: "Screen Size (inches diagonal)", type: "number", min: 13, max: 100, defaultValue: 27 },
      { name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "1080p (Full HD)" }, { value: "2", label: "1440p (QHD)" }, { value: "3", label: "2160p (4K UHD)" }, { value: "4", label: "720p (HD)" }], defaultValue: "2" },
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [{ value: "16", label: "16:9 Standard" }, { value: "21", label: "21:9 Ultrawide" }, { value: "32", label: "32:9 Super Ultrawide" }], defaultValue: "16" },
      { name: "usage", label: "Primary Use", type: "select", options: [{ value: "1", label: "Productivity/Office" }, { value: "2", label: "Gaming" }, { value: "3", label: "Movie Watching" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const size = inputs.screenSize as number;
    const resolution = parseInt(inputs.resolution as string);
    const aspect = parseInt(inputs.aspectRatio as string);
    const usage = parseInt(inputs.usage as string);
    const resMultiplier = { 1: 1.5, 2: 1.2, 3: 1.0, 4: 2.0 };
    const usageMultiplier = { 1: 1.0, 2: 0.9, 3: 1.3 };
    const minDistance = Math.round(size * (resMultiplier[resolution] || 1.2) * (usageMultiplier[usage] || 1.0));
    const maxDistance = Math.round(minDistance * 1.5);
    const optimalDistance = Math.round((minDistance + maxDistance) / 2);
    const ppi = Math.round(Math.sqrt(Math.pow(1920 * resolution, 2) + Math.pow(1080 * resolution, 2)) / size);
    const screenWidthInches = Math.round(size * (aspect === 16 ? 0.872 : aspect === 21 ? 0.928 : 0.964) * 10) / 10;
    return {
      primary: { label: "Optimal Distance", value: formatNumber(optimalDistance) + " inches" },
      details: [
        { label: "Minimum Distance", value: formatNumber(minDistance) + " inches" },
        { label: "Maximum Distance", value: formatNumber(maxDistance) + " inches" },
        { label: "Approx. Screen Width", value: formatNumber(screenWidthInches) + " inches" },
        { label: "Pixel Density (PPI)", value: formatNumber(ppi) }
      ]
    };
  },
  }],
  relatedSlugs: ["tv-viewing-distance-calculator","screen-resolution-comparison-calculator","projector-throw-distance-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Optimal Distance = Screen Size x Resolution Factor x Usage Factor
Minimum Distance = Size x Resolution Multiplier x Usage Multiplier
Maximum Distance = Minimum Distance x 1.5",
};
