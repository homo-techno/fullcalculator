import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const photoStorageCalculator: CalculatorDefinition = {
  slug: "photo-storage-calculator",
  title: "Photo Storage Calculator",
  description: "Estimate storage space needed for your photo library.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["photo storage estimate","camera storage calculator"],
  variants: [{
    id: "standard",
    name: "Photo Storage",
    description: "Estimate storage space needed for your photo library.",
    fields: [
      { name: "photoCount", label: "Number of Photos", type: "number", min: 1, max: 1000000, defaultValue: 5000 },
      { name: "avgSizeMB", label: "Avg Photo Size (MB)", type: "number", min: 0.5, max: 100, defaultValue: 5 },
      { name: "rawPercent", label: "RAW Photos (%)", type: "number", min: 0, max: 100, defaultValue: 20 },
    ],
    calculate: (inputs) => {
      const count = inputs.photoCount as number;
      const avgMB = inputs.avgSizeMB as number;
      const rawPct = inputs.rawPercent as number;
      if (!count || !avgMB) return null;
      const rawCount = Math.round(count * (rawPct / 100));
      const jpegCount = count - rawCount;
      const rawAvg = avgMB * 5;
      const totalMB = (jpegCount * avgMB) + (rawCount * rawAvg);
      const totalGB = totalMB / 1024;
      const totalTB = totalGB / 1024;
      return {
        primary: { label: "Storage Needed", value: formatNumber(Math.round(totalGB * 10) / 10) + " GB" },
        details: [
          { label: "JPEG Photos", value: formatNumber(jpegCount) },
          { label: "RAW Photos", value: formatNumber(rawCount) },
          { label: "Total (TB)", value: formatNumber(Math.round(totalTB * 100) / 100) + " TB" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How big is a RAW photo file?", answer: "RAW files are typically 20 to 50 MB depending on the camera sensor." },
    { question: "How many photos fit on 1 TB?", answer: "About 200,000 JPEG photos at 5 MB each fit on 1 TB." },
  ],
  formula: "Storage = (JPEG Count x Avg Size) + (RAW Count x RAW Size)",
};
