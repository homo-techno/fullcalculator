import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const videoStorageCalculator: CalculatorDefinition = {
  slug: "video-storage-calculator",
  title: "Video Storage Calculator",
  description: "Free video storage calculator. Estimate storage requirements for video recordings based on resolution, codec, frame rate, and duration.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["video storage calculator", "video file size", "video recording storage", "video bitrate calculator", "video size estimator"],
  variants: [
    {
      id: "video-size",
      name: "Video File Size",
      description: "Estimate video file size from settings and duration",
      fields: [
        { name: "resolution", label: "Resolution", type: "select", options: [
          { label: "720p HD", value: "5" },
          { label: "1080p Full HD", value: "8" },
          { label: "1440p QHD", value: "16" },
          { label: "4K UHD", value: "35" },
          { label: "8K UHD", value: "100" },
        ], defaultValue: "8" },
        { name: "codec", label: "Codec", type: "select", options: [
          { label: "H.264 (AVC) - Standard", value: "1" },
          { label: "H.265 (HEVC) - ~50% smaller", value: "0.5" },
          { label: "AV1 - ~40% smaller", value: "0.6" },
          { label: "ProRes 422 - Professional", value: "6" },
          { label: "Uncompressed", value: "20" },
        ], defaultValue: "1" },
        { name: "fps", label: "Frame Rate", type: "select", options: [
          { label: "24 fps (Cinema)", value: "1" },
          { label: "30 fps (Standard)", value: "1.25" },
          { label: "60 fps (Smooth)", value: "2.5" },
          { label: "120 fps (Slow-motion)", value: "5" },
        ], defaultValue: "1.25" },
        { name: "durationMin", label: "Duration (minutes)", type: "number", placeholder: "e.g. 60", min: 0.1, defaultValue: 60 },
      ],
      calculate: (inputs) => {
        const baseBitrate = parseFloat(inputs.resolution as string) || 8; // Mbps
        const codecMultiplier = parseFloat(inputs.codec as string) || 1;
        const fpsMultiplier = parseFloat(inputs.fps as string) || 1.25;
        const durationMin = inputs.durationMin as number;
        if (!durationMin) return null;

        const effectiveBitrate = baseBitrate * codecMultiplier * fpsMultiplier;
        const durationSeconds = durationMin * 60;
        const fileSizeMB = (effectiveBitrate * durationSeconds) / 8;
        const fileSizeGB = fileSizeMB / 1024;

        const formatSize = (mb: number) => {
          if (mb >= 1048576) return `${formatNumber(mb / 1048576, 2)} TB`;
          if (mb >= 1024) return `${formatNumber(mb / 1024, 2)} GB`;
          return `${formatNumber(mb, 0)} MB`;
        };

        // Audio adds roughly 128-320 kbps
        const audioSizeMB = (256 * durationSeconds) / (8 * 1024); // 256 kbps avg

        return {
          primary: { label: "Estimated File Size", value: formatSize(fileSizeMB + audioSizeMB) },
          details: [
            { label: "Video Bitrate", value: `${formatNumber(effectiveBitrate, 1)} Mbps` },
            { label: "Video Size", value: formatSize(fileSizeMB) },
            { label: "Audio Size (est.)", value: formatSize(audioSizeMB) },
            { label: "Total File Size", value: formatSize(fileSizeMB + audioSizeMB) },
            { label: "Duration", value: `${formatNumber(durationMin, 0)} minutes` },
            { label: "Per Minute", value: formatSize((fileSizeMB + audioSizeMB) / durationMin) },
            { label: "Per Hour", value: formatSize((fileSizeMB + audioSizeMB) * 60 / durationMin) },
          ],
        };
      },
    },
    {
      id: "recording-capacity",
      name: "Recording Capacity",
      description: "How much recording time fits on available storage",
      fields: [
        { name: "storageGB", label: "Available Storage (GB)", type: "number", placeholder: "e.g. 256", min: 1 },
        { name: "bitrate", label: "Video Bitrate (Mbps)", type: "number", placeholder: "e.g. 10", min: 0.1, defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const storageGB = inputs.storageGB as number;
        const bitrate = inputs.bitrate as number;
        if (!storageGB || !bitrate) return null;

        const storageMB = storageGB * 1024;
        const totalBitrateMbps = bitrate + 0.256; // include audio
        const recordingSeconds = (storageMB * 8) / totalBitrateMbps;
        const recordingMinutes = recordingSeconds / 60;
        const recordingHours = recordingMinutes / 60;

        return {
          primary: { label: "Recording Capacity", value: recordingHours >= 1 ? `${formatNumber(recordingHours, 1)} hours` : `${formatNumber(recordingMinutes, 0)} minutes` },
          details: [
            { label: "Available Storage", value: `${formatNumber(storageGB, 0)} GB` },
            { label: "Video Bitrate", value: `${formatNumber(bitrate, 1)} Mbps` },
            { label: "Total Bitrate (with audio)", value: `${formatNumber(totalBitrateMbps, 2)} Mbps` },
            { label: "Recording Time (minutes)", value: formatNumber(recordingMinutes, 0) },
            { label: "Recording Time (hours)", value: formatNumber(recordingHours, 1) },
            { label: "Recording Time (days)", value: formatNumber(recordingHours / 24, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["image-filesize-calculator", "data-storage-converter", "server-bandwidth-calculator"],
  faq: [
    { question: "How much storage does 1 hour of 4K video use?", answer: "It depends heavily on the codec: H.264 at 4K/30fps uses about 20-30 GB/hour. H.265/HEVC cuts that to 10-15 GB/hour. ProRes (professional editing) uses 100-200 GB/hour. AV1 is similar to HEVC. Always check your camera/software settings for exact bitrate." },
    { question: "H.264 vs H.265 vs AV1 -- which codec should I use?", answer: "H.264 has universal compatibility. H.265 (HEVC) is ~50% more efficient but requires licensing fees and more CPU to encode. AV1 is royalty-free, ~30-40% better than H.264, but encoding is slow. For archival, use H.265/AV1. For live streaming, H.264 is safest for compatibility." },
  ],
  formula: "File Size (MB) = Bitrate (Mbps) x Duration (sec) / 8 | Capacity (hrs) = Storage (GB) x 8 / Bitrate (Gbps) / 3600",
};
