import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const audioBitrateCalculator: CalculatorDefinition = {
  slug: "audio-bitrate-calculator",
  title: "Audio Bitrate Calculator",
  description: "Free audio bitrate calculator. Calculate audio file size from bitrate and duration for MP3, AAC, and other formats.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["audio", "bitrate", "file size", "MP3", "kbps", "music", "calculator"],
  variants: [
    {
      id: "convert",
      name: "Calculate File Size",
      fields: [
        { name: "bitrate", label: "Bitrate", type: "select", options: [
          { label: "128 kbps (Standard)", value: "128" },
          { label: "192 kbps (High)", value: "192" },
          { label: "256 kbps (Very High)", value: "256" },
          { label: "320 kbps (Maximum)", value: "320" },
        ]},
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 4" },
      ],
      calculate: (inputs) => {
        const bitrateStr = (inputs.bitrate as string) || "128";
        const duration = inputs.duration as number;
        if (!duration) return null;
        const bitrate = parseInt(bitrateStr, 10);
        const durationSec = duration * 60;
        const totalBits = bitrate * 1000 * durationSec;
        const totalBytes = totalBits / 8;
        const totalMB = totalBytes / (1024 * 1024);
        const totalKB = totalBytes / 1024;
        return {
          primary: { label: "File Size", value: `${formatNumber(totalMB, 2)} MB` },
          details: [
            { label: "Bitrate", value: `${bitrate} kbps` },
            { label: "Duration", value: `${formatNumber(duration, 1)} minutes (${formatNumber(durationSec, 0)} seconds)` },
            { label: "File Size (KB)", value: formatNumber(totalKB, 1) },
            { label: "File Size (MB)", value: formatNumber(totalMB, 2) },
            { label: "Per minute", value: `${formatNumber(totalMB / duration, 2)} MB/min` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["video-bitrate-calculator", "bandwidth-calculator"],
  faq: [
    { question: "What bitrate should I use for music?", answer: "For most listeners, 192 kbps offers good quality. Audiophiles prefer 320 kbps or lossless formats. 128 kbps is acceptable for speech and podcasts." },
    { question: "How big is a 3-minute MP3 at 320 kbps?", answer: "A 3-minute MP3 at 320 kbps is approximately 7.03 MB." },
  ],
  formula: "File size (MB) = (bitrate in kbps × duration in seconds × 1000) / (8 × 1024 × 1024).",
};
