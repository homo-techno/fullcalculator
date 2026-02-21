import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const videoFileSizeCalculator: CalculatorDefinition = {
  slug: "video-file-size-calculator",
  title: "Video File Size Calculator",
  description: "Free video file size calculator. Estimate video file size based on resolution, bitrate, duration, and codec for filming and editing projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["video file size calculator", "video size estimator", "video storage calculator", "video bitrate calculator", "filming storage"],
  variants: [
    {
      id: "bitrate",
      name: "From Bitrate & Duration",
      description: "Calculate file size from video bitrate and duration",
      fields: [
        { name: "videoBitrate", label: "Video Bitrate (Mbps)", type: "number", placeholder: "e.g. 50", step: 0.1 },
        { name: "audioBitrate", label: "Audio Bitrate (kbps)", type: "select", options: [
          { label: "96 kbps (low)", value: "96" },
          { label: "128 kbps (standard)", value: "128" },
          { label: "192 kbps (good)", value: "192" },
          { label: "256 kbps (high)", value: "256" },
          { label: "320 kbps (maximum)", value: "320" },
          { label: "1536 kbps (PCM/lossless)", value: "1536" },
        ], defaultValue: "192" },
        { name: "hours", label: "Hours", type: "number", placeholder: "0", defaultValue: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 30", defaultValue: 10 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const vBitrate = inputs.videoBitrate as number;
        const aBitrate = parseInt(inputs.audioBitrate as string) || 192;
        const hours = (inputs.hours as number) || 0;
        const minutes = (inputs.minutes as number) || 0;
        const seconds = (inputs.seconds as number) || 0;
        if (!vBitrate) return null;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        if (totalSeconds === 0) return null;

        const totalBitrateMbps = vBitrate + aBitrate / 1000;
        const fileSizeMB = (totalBitrateMbps * totalSeconds) / 8;
        const fileSizeGB = fileSizeMB / 1024;

        return {
          primary: { label: "File Size", value: fileSizeGB >= 1 ? `${formatNumber(fileSizeGB, 2)} GB` : `${formatNumber(fileSizeMB, 1)} MB` },
          details: [
            { label: "File size (MB)", value: `${formatNumber(fileSizeMB, 1)} MB` },
            { label: "File size (GB)", value: `${formatNumber(fileSizeGB, 2)} GB` },
            { label: "Duration", value: `${hours}h ${minutes}m ${seconds}s (${formatNumber(totalSeconds)} sec)` },
            { label: "Video bitrate", value: `${vBitrate} Mbps` },
            { label: "Audio bitrate", value: `${aBitrate} kbps` },
            { label: "Total bitrate", value: `${formatNumber(totalBitrateMbps, 2)} Mbps` },
            { label: "Per minute", value: `${formatNumber(totalBitrateMbps * 60 / 8, 1)} MB/min` },
          ],
        };
      },
    },
    {
      id: "preset",
      name: "From Resolution & Codec",
      description: "Estimate file size from common recording presets",
      fields: [
        { name: "resolution", label: "Resolution", type: "select", options: [
          { label: "720p HD (1280x720)", value: "5" },
          { label: "1080p Full HD (1920x1080)", value: "10" },
          { label: "1440p QHD (2560x1440)", value: "20" },
          { label: "4K UHD (3840x2160)", value: "40" },
          { label: "6K (6144x3456)", value: "75" },
          { label: "8K (7680x4320)", value: "100" },
        ], defaultValue: "10" },
        { name: "codec", label: "Codec", type: "select", options: [
          { label: "H.264 (standard)", value: "1.0" },
          { label: "H.265/HEVC (50% smaller)", value: "0.5" },
          { label: "AV1 (40% smaller than H.264)", value: "0.6" },
          { label: "ProRes 422 (high quality)", value: "5.0" },
          { label: "ProRes 4444 (very high)", value: "7.5" },
          { label: "RAW (uncompressed)", value: "12.0" },
        ], defaultValue: "1.0" },
        { name: "fps", label: "Frame Rate", type: "select", options: [
          { label: "24 fps (cinema)", value: "24" },
          { label: "25 fps (PAL)", value: "25" },
          { label: "30 fps (standard)", value: "30" },
          { label: "60 fps (smooth)", value: "60" },
          { label: "120 fps (slow motion)", value: "120" },
          { label: "240 fps (super slow-mo)", value: "240" },
        ], defaultValue: "30" },
        { name: "minutes", label: "Duration (minutes)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const baseBitrate = parseFloat(inputs.resolution as string) || 10;
        const codecMultiplier = parseFloat(inputs.codec as string) || 1.0;
        const fps = parseInt(inputs.fps as string) || 30;
        const minutes = inputs.minutes as number;
        if (!minutes) return null;

        const fpsMultiplier = fps / 30;
        const effectiveBitrate = baseBitrate * codecMultiplier * fpsMultiplier;
        const totalSeconds = minutes * 60;
        const fileSizeMB = (effectiveBitrate * totalSeconds) / 8;
        const fileSizeGB = fileSizeMB / 1024;

        return {
          primary: { label: "Estimated File Size", value: fileSizeGB >= 1 ? `${formatNumber(fileSizeGB, 2)} GB` : `${formatNumber(fileSizeMB, 1)} MB` },
          details: [
            { label: "File size", value: `${formatNumber(fileSizeMB, 0)} MB (${formatNumber(fileSizeGB, 2)} GB)` },
            { label: "Estimated bitrate", value: `${formatNumber(effectiveBitrate, 1)} Mbps` },
            { label: "Duration", value: `${minutes} minutes` },
            { label: "Frame rate", value: `${fps} fps` },
            { label: "Per minute", value: `${formatNumber(effectiveBitrate * 60 / 8, 1)} MB/min` },
            { label: "Per hour", value: `${formatNumber(effectiveBitrate * 3600 / 8 / 1024, 2)} GB/hr` },
          ],
          note: "These are estimates. Actual file sizes vary based on scene complexity, encoder settings, and variable bitrate encoding.",
        };
      },
    },
    {
      id: "storage",
      name: "Storage Capacity",
      description: "How much video fits on your storage",
      fields: [
        { name: "storageGB", label: "Storage Size (GB)", type: "select", options: [
          { label: "32 GB", value: "32" },
          { label: "64 GB", value: "64" },
          { label: "128 GB", value: "128" },
          { label: "256 GB", value: "256" },
          { label: "512 GB", value: "512" },
          { label: "1 TB (1024 GB)", value: "1024" },
          { label: "2 TB (2048 GB)", value: "2048" },
        ], defaultValue: "128" },
        { name: "bitrate", label: "Video Bitrate (Mbps)", type: "number", placeholder: "e.g. 50", step: 0.1 },
      ],
      calculate: (inputs) => {
        const storageGB = parseInt(inputs.storageGB as string) || 128;
        const bitrate = inputs.bitrate as number;
        if (!bitrate) return null;

        const usableGB = storageGB * 0.93;
        const totalSeconds = (usableGB * 1024 * 8) / bitrate;
        const totalMinutes = totalSeconds / 60;
        const totalHours = totalMinutes / 60;

        return {
          primary: { label: "Recording Time", value: totalHours >= 1 ? `${formatNumber(totalHours, 1)} hours` : `${formatNumber(totalMinutes, 0)} minutes` },
          details: [
            { label: "Total recording time", value: `${Math.floor(totalHours)}h ${Math.round(totalMinutes % 60)}m` },
            { label: "Storage capacity", value: `${storageGB} GB (${formatNumber(usableGB, 0)} GB usable)` },
            { label: "Video bitrate", value: `${bitrate} Mbps` },
            { label: "Data per minute", value: `${formatNumber(bitrate * 60 / 8, 1)} MB` },
            { label: "Data per hour", value: `${formatNumber(bitrate * 3600 / 8 / 1024, 2)} GB` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["audio-file-size-calculator", "streaming-data-calculator", "animation-frames-calculator"],
  faq: [
    { question: "How big is a 1-hour 4K video?", answer: "At typical H.264 encoding (40 Mbps), 1 hour of 4K video is about 18 GB. With H.265/HEVC, it's about 9 GB. ProRes 422 4K can be 100+ GB per hour." },
    { question: "What is video bitrate?", answer: "Video bitrate is the amount of data used per second of video, measured in Mbps (megabits per second). Higher bitrate means better quality but larger files." },
    { question: "H.264 vs H.265 - what's the difference?", answer: "H.265 (HEVC) is about 50% more efficient than H.264, producing similar quality at half the file size. However, H.265 requires more processing power to encode and decode." },
  ],
  formula: "File Size (MB) = (Bitrate in Mbps × Duration in seconds) / 8 | 1 GB = 1024 MB",
};
