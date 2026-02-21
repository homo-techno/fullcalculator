import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const animationFramesCalculator: CalculatorDefinition = {
  slug: "animation-frames-calculator",
  title: "Animation Frame Calculator",
  description: "Free animation frame calculator. Calculate total frames, timing, duration, and frame intervals for animation, motion graphics, and video production.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["animation frame calculator", "FPS calculator", "frame timing", "animation duration", "keyframe calculator", "motion graphics frames"],
  variants: [
    {
      id: "frames",
      name: "Duration to Frames",
      description: "Calculate total frames from duration and frame rate",
      fields: [
        { name: "hours", label: "Hours", type: "number", placeholder: "0", defaultValue: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "0", defaultValue: 0 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 10" },
        { name: "fps", label: "Frame Rate (FPS)", type: "select", options: [
          { label: "12 FPS (anime limited)", value: "12" },
          { label: "15 FPS (web animation)", value: "15" },
          { label: "24 FPS (film/cinema)", value: "24" },
          { label: "25 FPS (PAL video)", value: "25" },
          { label: "29.97 FPS (NTSC drop-frame)", value: "29.97" },
          { label: "30 FPS (standard video)", value: "30" },
          { label: "48 FPS (HFR film)", value: "48" },
          { label: "60 FPS (smooth animation)", value: "60" },
          { label: "120 FPS (slow motion)", value: "120" },
        ], defaultValue: "24" },
      ],
      calculate: (inputs) => {
        const hours = (inputs.hours as number) || 0;
        const minutes = (inputs.minutes as number) || 0;
        const seconds = (inputs.seconds as number) || 0;
        const fps = parseFloat(inputs.fps as string) || 24;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        if (totalSeconds === 0) return null;

        const totalFrames = Math.ceil(totalSeconds * fps);
        const msPerFrame = 1000 / fps;

        return {
          primary: { label: "Total Frames", value: formatNumber(totalFrames) },
          details: [
            { label: "Total frames", value: formatNumber(totalFrames) },
            { label: "Duration", value: `${hours}h ${minutes}m ${seconds}s (${formatNumber(totalSeconds, 2)}s)` },
            { label: "Frame rate", value: `${fps} FPS` },
            { label: "Milliseconds per frame", value: `${formatNumber(msPerFrame, 2)} ms` },
            { label: "Frames per second", value: `${fps}` },
            { label: "Frames per minute", value: formatNumber(fps * 60) },
          ],
        };
      },
    },
    {
      id: "duration",
      name: "Frames to Duration",
      description: "Calculate duration from frame count",
      fields: [
        { name: "totalFrames", label: "Total Number of Frames", type: "number", placeholder: "e.g. 240" },
        { name: "fps", label: "Frame Rate (FPS)", type: "select", options: [
          { label: "12 FPS", value: "12" },
          { label: "15 FPS", value: "15" },
          { label: "24 FPS", value: "24" },
          { label: "25 FPS", value: "25" },
          { label: "30 FPS", value: "30" },
          { label: "60 FPS", value: "60" },
        ], defaultValue: "24" },
      ],
      calculate: (inputs) => {
        const frames = inputs.totalFrames as number;
        const fps = parseFloat(inputs.fps as string) || 24;
        if (!frames) return null;

        const totalSeconds = frames / fps;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const timecode = `${String(Math.floor(totalSeconds / 3600)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}:${String(Math.floor(seconds)).padStart(2, "0")}:${String(Math.round((seconds % 1) * fps)).padStart(2, "0")}`;

        return {
          primary: { label: "Duration", value: `${formatNumber(totalSeconds, 2)} seconds` },
          details: [
            { label: "Duration (seconds)", value: `${formatNumber(totalSeconds, 3)}s` },
            { label: "Duration (formatted)", value: `${minutes}m ${formatNumber(seconds, 2)}s` },
            { label: "Timecode (HH:MM:SS:FF)", value: timecode },
            { label: "Total frames", value: formatNumber(frames) },
            { label: "Frame rate", value: `${fps} FPS` },
            { label: "Milliseconds total", value: `${formatNumber(totalSeconds * 1000, 1)} ms` },
          ],
        };
      },
    },
    {
      id: "timing",
      name: "Animation Timing",
      description: "Calculate frame holds and exposure sheets",
      fields: [
        { name: "animationType", label: "Animation Style", type: "select", options: [
          { label: "On 1s (every frame) - smooth", value: "1" },
          { label: "On 2s (every 2 frames) - standard anime", value: "2" },
          { label: "On 3s (every 3 frames) - limited", value: "3" },
          { label: "On 4s (every 4 frames) - very limited", value: "4" },
          { label: "On 6s (every 6 frames)", value: "6" },
          { label: "On 8s (every 8 frames) - hold/slow", value: "8" },
        ], defaultValue: "2" },
        { name: "fps", label: "Playback FPS", type: "select", options: [
          { label: "12 FPS", value: "12" },
          { label: "24 FPS", value: "24" },
          { label: "30 FPS", value: "30" },
        ], defaultValue: "24" },
        { name: "durationSec", label: "Duration (seconds)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const holdFrames = parseInt(inputs.animationType as string) || 2;
        const fps = parseFloat(inputs.fps as string) || 24;
        const duration = inputs.durationSec as number;
        if (!duration) return null;

        const totalPlaybackFrames = Math.ceil(duration * fps);
        const uniqueDrawings = Math.ceil(totalPlaybackFrames / holdFrames);
        const effectiveFps = fps / holdFrames;
        const msPerDrawing = 1000 / effectiveFps;

        return {
          primary: { label: "Unique Drawings", value: formatNumber(uniqueDrawings) },
          details: [
            { label: "Unique drawings needed", value: formatNumber(uniqueDrawings) },
            { label: "Total playback frames", value: formatNumber(totalPlaybackFrames) },
            { label: "Hold per drawing", value: `${holdFrames} frame${holdFrames > 1 ? "s" : ""}` },
            { label: "Effective FPS", value: `${formatNumber(effectiveFps, 1)} drawings/sec` },
            { label: "Time per drawing", value: `${formatNumber(msPerDrawing, 1)} ms` },
            { label: "Drawings per minute", value: formatNumber(effectiveFps * 60) },
            { label: "Duration", value: `${duration} seconds` },
          ],
          note: `Animating "on ${holdFrames}s" means each drawing is held for ${holdFrames} frames. This is ${formatNumber(uniqueDrawings / totalPlaybackFrames * 100, 0)}% of full animation work.`,
        };
      },
    },
  ],
  relatedSlugs: ["video-file-size-calculator", "streaming-data-calculator", "audio-file-size-calculator"],
  faq: [
    { question: "What FPS is best for animation?", answer: "24 FPS is the film standard and most common for animation. 12 FPS works for limited/web animation. 30 FPS is standard for video. Higher FPS (60+) creates smoother motion but requires more frames." },
    { question: "What does animating on 2s mean?", answer: "Animating 'on 2s' means each unique drawing is held for 2 frames. At 24 FPS, this gives 12 unique drawings per second. This is the standard for most traditional and anime animation, cutting workload in half." },
    { question: "How many drawings for 1 minute of animation?", answer: "At 24 FPS on 1s (full animation): 1,440 drawings. On 2s: 720 drawings. On 3s: 480 drawings. Disney-quality animation typically uses 18-24 drawings per second." },
  ],
  formula: "Total Frames = Duration (seconds) × FPS | Unique Drawings = Total Frames / Hold Frames | Duration = Frames / FPS",
};
