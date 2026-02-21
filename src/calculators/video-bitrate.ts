import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const videoBitrateCalculator: CalculatorDefinition = {
  slug: "video-bitrate-calculator",
  title: "Video Bitrate Calculator",
  description: "Free video bitrate calculator. Calculate file size from bitrate and duration, or find the recommended bitrate for a target file size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["video", "bitrate", "file size", "Mbps", "streaming", "encoding", "calculator"],
  variants: [
    {
      id: "size-from-bitrate",
      name: "File Size from Bitrate",
      fields: [
        { name: "bitrate", label: "Bitrate (Mbps)", type: "number", placeholder: "e.g. 8" },
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const bitrate = inputs.bitrate as number;
        const duration = inputs.duration as number;
        if (!bitrate || !duration) return null;
        const durationSec = duration * 60;
        const totalBits = bitrate * 1e6 * durationSec;
        const totalBytes = totalBits / 8;
        const totalMB = totalBytes / (1024 * 1024);
        const totalGB = totalMB / 1024;
        return {
          primary: { label: "File Size", value: totalGB >= 1 ? `${formatNumber(totalGB, 2)} GB` : `${formatNumber(totalMB, 2)} MB` },
          details: [
            { label: "Bitrate", value: `${formatNumber(bitrate, 2)} Mbps` },
            { label: "Duration", value: `${formatNumber(duration, 1)} minutes` },
            { label: "File Size (MB)", value: formatNumber(totalMB, 2) },
            { label: "File Size (GB)", value: formatNumber(totalGB, 3) },
            { label: "Total bits", value: formatNumber(totalBits, 0) },
          ],
        };
      },
    },
    {
      id: "bitrate-from-size",
      name: "Bitrate from Target Size",
      fields: [
        { name: "fileSize", label: "Target File Size (MB)", type: "number", placeholder: "e.g. 700" },
        { name: "duration", label: "Duration (minutes)", type: "number", placeholder: "e.g. 120" },
      ],
      calculate: (inputs) => {
        const fileSize = inputs.fileSize as number;
        const duration = inputs.duration as number;
        if (!fileSize || !duration) return null;
        const durationSec = duration * 60;
        const totalBytes = fileSize * 1024 * 1024;
        const totalBits = totalBytes * 8;
        const bitrateBps = totalBits / durationSec;
        const bitrateMbps = bitrateBps / 1e6;
        const bitrateKbps = bitrateBps / 1e3;
        return {
          primary: { label: "Recommended Bitrate", value: `${formatNumber(bitrateMbps, 3)} Mbps` },
          details: [
            { label: "Target File Size", value: `${formatNumber(fileSize, 2)} MB` },
            { label: "Duration", value: `${formatNumber(duration, 1)} minutes` },
            { label: "Bitrate (Mbps)", value: formatNumber(bitrateMbps, 3) },
            { label: "Bitrate (kbps)", value: formatNumber(bitrateKbps, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["audio-bitrate-calculator", "bandwidth-calculator", "frame-rate-calculator"],
  faq: [
    { question: "What bitrate should I use for 1080p video?", answer: "For 1080p video, a bitrate of 8-12 Mbps is recommended for good quality. Streaming platforms typically use 4-8 Mbps." },
    { question: "How is file size calculated from bitrate?", answer: "File size (bytes) = bitrate (bits/sec) × duration (sec) / 8. Remember: 1 byte = 8 bits." },
  ],
  formula: "File size = (bitrate × duration × 60) / 8. Bitrate = (file size × 8) / (duration × 60). All in consistent units.",
};
