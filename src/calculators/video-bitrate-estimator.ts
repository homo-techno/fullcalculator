import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const videoBitrateEstimatorCalculator: CalculatorDefinition = {
  slug: "video-bitrate-estimator",
  title: "Video Bitrate Calculator",
  description: "Calculate recommended video bitrate and file size based on resolution, frame rate, codec, and content type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["video bitrate","video file size calculator","encoding bitrate","streaming bitrate"],
  variants: [{
    id: "standard",
    name: "Video Bitrate",
    description: "Calculate recommended video bitrate and file size based on resolution, frame rate, codec, and content type.",
    fields: [
      { name: "resolution", label: "Resolution", type: "select", options: [{ value: "1", label: "720p (1280x720)" }, { value: "2", label: "1080p (1920x1080)" }, { value: "3", label: "1440p (2560x1440)" }, { value: "4", label: "4K (3840x2160)" }, { value: "5", label: "8K (7680x4320)" }], defaultValue: "2" },
      { name: "fps", label: "Frame Rate", type: "select", options: [{ value: "24", label: "24 fps" }, { value: "30", label: "30 fps" }, { value: "60", label: "60 fps" }, { value: "120", label: "120 fps" }], defaultValue: "30" },
      { name: "codec", label: "Codec", type: "select", options: [{ value: "1", label: "H.264 (AVC)" }, { value: "2", label: "H.265 (HEVC)" }, { value: "3", label: "ProRes 422" }, { value: "4", label: "AV1" }], defaultValue: "1" },
      { name: "duration", label: "Duration (minutes)", type: "number", min: 1, max: 600, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const res = parseInt(inputs.resolution as string);
    const fps = parseInt(inputs.fps as string);
    const codec = parseInt(inputs.codec as string);
    const duration = inputs.duration as number;
    const baseRates = [0, 5, 10, 20, 45, 150];
    const baseMbps = baseRates[res];
    const fpsMultiplier = fps / 30;
    const codecMultiplier = codec === 1 ? 1.0 : codec === 2 ? 0.6 : codec === 3 ? 4.0 : 0.55;
    const bitrate = Math.round(baseMbps * fpsMultiplier * codecMultiplier * 10) / 10;
    const fileSizeGB = Math.round(bitrate * duration * 60 / 8 / 1024 * 100) / 100;
    const fileSizeMB = Math.round(bitrate * duration * 60 / 8);
    return {
      primary: { label: "Recommended Bitrate", value: formatNumber(bitrate) + " Mbps" },
      details: [
        { label: "File Size", value: fileSizeGB >= 1 ? formatNumber(fileSizeGB) + " GB" : formatNumber(fileSizeMB) + " MB" },
        { label: "Duration", value: formatNumber(duration) + " minutes" },
        { label: "FPS Multiplier", value: formatNumber(Math.round(fpsMultiplier * 100) / 100) + "x" },
        { label: "Codec Efficiency", value: formatNumber(codecMultiplier) + "x" }
      ]
    };
  },
  }],
  relatedSlugs: ["video-storage-estimator","video-render-time-estimator"],
  faq: [
    { question: "What bitrate should I use for YouTube uploads?", answer: "YouTube recommends 8 Mbps for 1080p at 30fps with H.264, 12 Mbps for 1080p at 60fps, and 35-45 Mbps for 4K at 30fps." },
    { question: "Is H.265 better than H.264?", answer: "H.265 (HEVC) achieves roughly the same quality at 40-50% lower bitrate compared to H.264, but encoding is slower and not all devices support it." },
    { question: "What is ProRes used for?", answer: "ProRes is an editing codec used in professional post-production. It has high bitrates but is optimized for editing performance rather than delivery." },
  ],
  formula: "Bitrate = Base Rate x (FPS / 30) x Codec Multiplier; File Size (GB) = Bitrate (Mbps) x Duration (sec) / 8 / 1024",
};
