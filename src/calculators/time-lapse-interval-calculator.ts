import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const timeLapseIntervalCalculator: CalculatorDefinition = {
  slug: "time-lapse-interval-calculator",
  title: "Time-Lapse Interval Calculator",
  description: "Calculate optimal interval, total shots, and storage requirements for time-lapse photography and video.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["time-lapse calculator","timelapse interval","intervalometer","time lapse shooting"],
  variants: [{
    id: "standard",
    name: "Time-Lapse Interval",
    description: "Calculate optimal interval, total shots, and storage requirements for time-lapse photography and video.",
    fields: [
      { name: "eventDuration", label: "Event Duration (minutes)", type: "number", min: 1, max: 14400, defaultValue: 60 },
      { name: "outputLength", label: "Desired Output Length (seconds)", type: "number", min: 1, max: 600, defaultValue: 30 },
      { name: "fps", label: "Output Frame Rate (fps)", type: "select", options: [{ value: "24", label: "24 fps (Cinema)" }, { value: "25", label: "25 fps (PAL)" }, { value: "30", label: "30 fps (NTSC)" }, { value: "60", label: "60 fps (Smooth)" }], defaultValue: "24" },
      { name: "fileSizeMB", label: "Avg Photo Size (MB)", type: "number", min: 1, max: 100, defaultValue: 25 },
    ],
    calculate: (inputs) => {
    const duration = inputs.eventDuration as number;
    const outputLen = inputs.outputLength as number;
    const fps = parseInt(inputs.fps as string);
    const fileSize = inputs.fileSizeMB as number;
    const totalFrames = outputLen * fps;
    const intervalSec = (duration * 60) / totalFrames;
    const storageGB = Math.round(totalFrames * fileSize / 1024 * 100) / 100;
    const intervalRounded = Math.round(intervalSec * 10) / 10;
    return {
      primary: { label: "Shooting Interval", value: formatNumber(intervalRounded) + " seconds" },
      details: [
        { label: "Total Frames Needed", value: formatNumber(totalFrames) },
        { label: "Storage Required", value: formatNumber(storageGB) + " GB" },
        { label: "Output Duration", value: formatNumber(outputLen) + " sec at " + formatNumber(fps) + " fps" },
        { label: "Event Duration", value: formatNumber(duration) + " minutes" }
      ]
    };
  },
  }],
  relatedSlugs: ["video-bitrate-estimator","video-storage-estimator"],
  faq: [
    { question: "What interval should I use for time-lapse?", answer: "It depends on the subject. Clouds typically use 3-5 second intervals, sunsets 5-10 seconds, stars 20-30 seconds, and construction projects 5-15 minutes." },
    { question: "How many photos do I need for a time-lapse?", answer: "At 24 fps, you need 720 photos for a 30-second video. At 30 fps, you need 900 photos for the same duration." },
    { question: "What frame rate should I use for time-lapse?", answer: "24 fps gives a cinematic look, 30 fps is standard for web video, and 25 fps is used for PAL broadcast." },
  ],
  formula: "Interval = (Event Duration in seconds) / (Output Length x FPS); Total Frames = Output Length x FPS; Storage = Total Frames x File Size",
};
