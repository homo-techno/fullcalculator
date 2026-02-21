import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frameRateCalculator: CalculatorDefinition = {
  slug: "frame-rate-calculator",
  title: "Frame Rate Calculator",
  description: "Free frame rate calculator. Calculate frame duration, total frames, and timing from FPS and video duration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["frame rate", "FPS", "frames per second", "frame duration", "video", "animation", "calculator"],
  variants: [
    {
      id: "convert",
      name: "Calculate",
      fields: [
        { name: "fps", label: "Frames per Second (FPS)", type: "number", placeholder: "e.g. 30" },
        { name: "duration", label: "Video Duration (seconds)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const fps = inputs.fps as number;
        const duration = inputs.duration as number;
        if (!fps) return null;
        const frameDurationMs = 1000 / fps;
        const frameDurationUs = 1000000 / fps;
        const details: { label: string; value: string }[] = [
          { label: "Frame Rate", value: `${formatNumber(fps, 2)} FPS` },
          { label: "Frame Duration", value: `${formatNumber(frameDurationMs, 4)} ms` },
          { label: "Frame Duration (microseconds)", value: formatNumber(frameDurationUs, 2) },
        ];
        let totalFrames: number | null = null;
        if (duration) {
          totalFrames = fps * duration;
          const minutes = Math.floor(duration / 60);
          const secs = duration % 60;
          details.push(
            { label: "Video Duration", value: `${minutes > 0 ? `${minutes}m ` : ""}${formatNumber(secs, 1)}s` },
            { label: "Total Frames", value: formatNumber(totalFrames, 0) },
            { label: "Data per second (uncompressed 1080p)", value: `${formatNumber((1920 * 1080 * 3 * fps) / (1024 * 1024), 1)} MB/s` }
          );
        }
        return {
          primary: { label: "Frame Duration", value: `${formatNumber(frameDurationMs, 4)} ms` },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["video-bitrate-calculator", "screen-size-calculator"],
  faq: [
    { question: "What is a good frame rate for video?", answer: "24 FPS is cinematic standard, 30 FPS is standard for TV/web, 60 FPS is for smooth motion and gaming, and 120+ FPS is for slow-motion or high-refresh displays." },
    { question: "How do I calculate total frames?", answer: "Total frames = FPS × duration in seconds. For example, 30 FPS × 60 seconds = 1,800 frames." },
  ],
  formula: "Frame duration (ms) = 1000 / FPS. Total frames = FPS × duration (seconds).",
};
