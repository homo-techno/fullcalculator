import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gamingStreamingBitrateCalculator: CalculatorDefinition = {
  slug: "gaming-streaming-bitrate-calculator",
  title: "Gaming Streaming Bitrate Calculator",
  description: "Calculate the optimal streaming bitrate for your gaming streams based on resolution, frame rate, and upload speed to maximize quality without buffering.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["streaming bitrate calculator","OBS bitrate settings","Twitch bitrate","stream quality calculator"],
  variants: [{
    id: "standard",
    name: "Gaming Streaming Bitrate",
    description: "Calculate the optimal streaming bitrate for your gaming streams based on resolution, frame rate, and upload speed to maximize quality without buffering.",
    fields: [
      { name: "resolution", label: "Stream Resolution", type: "select", options: [{ value: "1", label: "720p" }, { value: "2", label: "900p" }, { value: "3", label: "1080p" }, { value: "4", label: "1440p" }, { value: "5", label: "4K" }], defaultValue: "3" },
      { name: "fps", label: "Frame Rate", type: "select", options: [{ value: "30", label: "30 FPS" }, { value: "60", label: "60 FPS" }], defaultValue: "60" },
      { name: "uploadSpeed", label: "Upload Speed (Mbps)", type: "number", min: 1, max: 1000, defaultValue: 20 },
      { name: "gameMotion", label: "Game Motion Level", type: "select", options: [{ value: "1", label: "Low (card/strategy)" }, { value: "2", label: "Medium (RPG/MOBA)" }, { value: "3", label: "High (FPS/racing)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const res = parseInt(inputs.resolution as string);
    const fps = parseInt(inputs.fps as string);
    const upload = inputs.uploadSpeed as number;
    const motion = parseInt(inputs.gameMotion as string);
    const baseBitrate = { 1: 3000, 2: 4500, 3: 6000, 4: 9000, 5: 20000 };
    const fpsMultiplier = fps === 60 ? 1.5 : 1.0;
    const motionMultiplier = { 1: 0.8, 2: 1.0, 3: 1.2 };
    const idealBitrate = Math.round((baseBitrate[res] || 6000) * fpsMultiplier * (motionMultiplier[motion] || 1.0));
    const maxUsable = Math.round(upload * 1000 * 0.75);
    const recommendedBitrate = Math.min(idealBitrate, maxUsable);
    const twitchMax = 6000;
    const platformCapped = Math.min(recommendedBitrate, twitchMax);
    const audioBitrate = 160;
    const totalBitrate = recommendedBitrate + audioBitrate;
    return {
      primary: { label: "Recommended Bitrate", value: formatNumber(recommendedBitrate) + " Kbps" },
      details: [
        { label: "Ideal Bitrate", value: formatNumber(idealBitrate) + " Kbps" },
        { label: "Max Usable (75% upload)", value: formatNumber(maxUsable) + " Kbps" },
        { label: "Twitch-Capped Bitrate", value: formatNumber(platformCapped) + " Kbps" },
        { label: "Total with Audio", value: formatNumber(totalBitrate) + " Kbps" }
      ]
    };
  },
  }],
  relatedSlugs: ["game-download-time-calculator","twitch-streamer-revenue-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Ideal Bitrate = Base Bitrate x FPS Multiplier x Motion Multiplier; Max Usable = Upload Speed x 1000 x 0.75; Recommended = min(Ideal, Max Usable); Platform Capped = min(Recommended, Platform Max)",
};
