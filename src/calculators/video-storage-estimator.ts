import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const videoStorageEstimatorCalculator: CalculatorDefinition = {
  slug: "video-storage-estimator",
  title: "Video Storage Estimator",
  description: "Calculate total storage needed for video projects based on resolution, codec, frame rate, and shooting duration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["video storage","camera card size","memory card calculator","video footage storage"],
  variants: [{
    id: "standard",
    name: "Video Storage Estimator",
    description: "Calculate total storage needed for video projects based on resolution, codec, frame rate, and shooting duration.",
    fields: [
      { name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "1080p" }, { value: "2", label: "4K" }, { value: "3", label: "6K" }, { value: "4", label: "8K" }], defaultValue: "2" },
      { name: "codec", label: "Recording Codec", type: "select", options: [{ value: "1", label: "H.264 (Compressed)" }, { value: "2", label: "H.265 (HEVC)" }, { value: "3", label: "ProRes 422" }, { value: "4", label: "RAW" }], defaultValue: "1" },
      { name: "fps", label: "Frame Rate (fps)", type: "number", min: 24, max: 240, defaultValue: 30 },
      { name: "duration", label: "Total Recording Time (hours)", type: "number", min: 0.1, max: 100, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const res = parseInt(inputs.resolution as string);
    const codec = parseInt(inputs.codec as string);
    const fps = inputs.fps as number;
    const hours = inputs.duration as number;
    const baseGBperHour = [0, 15, 45, 90, 180];
    const codecMultiplier = codec === 1 ? 1.0 : codec === 2 ? 0.6 : codec === 3 ? 4.5 : codec === 4 ? 8.0 : 1.0;
    const fpsMultiplier = fps / 30;
    const storageGB = Math.round(baseGBperHour[res] * codecMultiplier * fpsMultiplier * hours * 10) / 10;
    const storageTB = Math.round(storageGB / 1024 * 100) / 100;
    const cardsNeeded = Math.ceil(storageGB / 128);
    return {
      primary: { label: "Total Storage Needed", value: storageGB >= 1024 ? formatNumber(storageTB) + " TB" : formatNumber(storageGB) + " GB" },
      details: [
        { label: "Storage (GB)", value: formatNumber(storageGB) + " GB" },
        { label: "128GB Cards Needed", value: formatNumber(cardsNeeded) },
        { label: "Data Rate", value: formatNumber(Math.round(storageGB / hours / 3.6 * 10) / 10) + " MB/s" },
        { label: "Recording Duration", value: formatNumber(hours) + " hours" }
      ]
    };
  },
  }],
  relatedSlugs: ["video-bitrate-estimator","photo-backup-storage-calculator"],
  faq: [
    { question: "How much storage does 4K video use?", answer: "4K H.264 at 30fps uses approximately 45 GB per hour. RAW 4K can use 300-400 GB per hour depending on the camera." },
    { question: "What size memory card do I need for video?", answer: "For a full day of 4K shooting (6-8 hours), plan for at least 256-512 GB in H.264, or several terabytes for RAW formats." },
    { question: "What card speed do I need for 4K?", answer: "4K recording typically requires write speeds of at least 60-100 MB/s. RAW recording may need 300 MB/s or faster." },
  ],
  formula: "Storage (GB) = Base Rate x Codec Multiplier x (FPS / 30) x Hours
Base Rates: 1080p = 15 GB/hr, 4K = 45 GB/hr, 6K = 90 GB/hr, 8K = 180 GB/hr (H.264)",
};
