import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const videoGameFpsCalculator: CalculatorDefinition = {
  slug: "video-game-fps-calculator",
  title: "Video Game FPS Calculator",
  description:
    "Free FPS calculator for gaming. Calculate frame time, GPU bottleneck, resolution scaling impact, and performance estimates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "FPS calculator",
    "frame rate calculator",
    "gaming FPS",
    "frame time",
    "GPU performance",
    "resolution scaling",
    "gaming performance",
  ],
  variants: [
    {
      id: "frame-time",
      name: "FPS & Frame Time",
      description: "Convert between FPS and frame time (ms), plus display sync info",
      fields: [
        {
          name: "fps",
          label: "Frames Per Second (FPS)",
          type: "number",
          placeholder: "e.g. 60",
          min: 1,
          max: 1000,
        },
        {
          name: "monitorRefresh",
          label: "Monitor Refresh Rate (Hz)",
          type: "select",
          options: [
            { label: "60 Hz", value: "60" },
            { label: "75 Hz", value: "75" },
            { label: "120 Hz", value: "120" },
            { label: "144 Hz", value: "144" },
            { label: "165 Hz", value: "165" },
            { label: "240 Hz", value: "240" },
            { label: "360 Hz", value: "360" },
          ],
          defaultValue: "144",
        },
      ],
      calculate: (inputs) => {
        const fps = inputs.fps as number;
        const refreshRate = parseInt(inputs.monitorRefresh as string) || 144;
        if (!fps || fps <= 0) return null;

        const frameTimeMs = 1000 / fps;
        const monitorFrameTime = 1000 / refreshRate;
        const utilizationPercent = Math.min((fps / refreshRate) * 100, 100);

        let syncStatus = "";
        if (fps >= refreshRate) {
          syncStatus = "FPS meets or exceeds monitor refresh rate. V-Sync will cap at " + refreshRate + " FPS.";
        } else if (fps >= refreshRate * 0.8) {
          syncStatus = "Slightly below monitor refresh. G-Sync/FreeSync recommended.";
        } else {
          syncStatus = "Significantly below monitor refresh rate. Consider lowering settings.";
        }

        // 1% low estimate (rough)
        const estimated1Low = fps * 0.65;

        return {
          primary: { label: "Frame Time", value: formatNumber(frameTimeMs, 2) + " ms" },
          details: [
            { label: "FPS", value: formatNumber(fps, 0) },
            { label: "Frame Time", value: formatNumber(frameTimeMs, 2) + " ms" },
            { label: "Monitor Refresh Rate", value: refreshRate + " Hz" },
            { label: "Monitor Frame Time", value: formatNumber(monitorFrameTime, 2) + " ms" },
            { label: "Monitor Utilization", value: formatNumber(utilizationPercent, 1) + "%" },
            { label: "Estimated 1% Low", value: formatNumber(estimated1Low, 0) + " FPS" },
            { label: "Sync Status", value: syncStatus },
          ],
        };
      },
    },
    {
      id: "resolution-scaling",
      name: "Resolution Scaling Impact",
      description: "Estimate FPS change when changing resolution",
      fields: [
        {
          name: "currentFps",
          label: "Current FPS",
          type: "number",
          placeholder: "e.g. 90",
          min: 1,
        },
        {
          name: "currentRes",
          label: "Current Resolution",
          type: "select",
          options: [
            { label: "720p (1280x720)", value: "921600" },
            { label: "900p (1600x900)", value: "1440000" },
            { label: "1080p (1920x1080)", value: "2073600" },
            { label: "1440p (2560x1440)", value: "3686400" },
            { label: "4K (3840x2160)", value: "8294400" },
            { label: "Ultrawide 1080p (2560x1080)", value: "2764800" },
            { label: "Ultrawide 1440p (3440x1440)", value: "4953600" },
          ],
          defaultValue: "2073600",
        },
        {
          name: "targetRes",
          label: "Target Resolution",
          type: "select",
          options: [
            { label: "720p (1280x720)", value: "921600" },
            { label: "900p (1600x900)", value: "1440000" },
            { label: "1080p (1920x1080)", value: "2073600" },
            { label: "1440p (2560x1440)", value: "3686400" },
            { label: "4K (3840x2160)", value: "8294400" },
            { label: "Ultrawide 1080p (2560x1080)", value: "2764800" },
            { label: "Ultrawide 1440p (3440x1440)", value: "4953600" },
          ],
          defaultValue: "3686400",
        },
      ],
      calculate: (inputs) => {
        const currentFps = inputs.currentFps as number;
        const currentPixels = parseInt(inputs.currentRes as string);
        const targetPixels = parseInt(inputs.targetRes as string);
        if (!currentFps || !currentPixels || !targetPixels) return null;

        // GPU-bound: FPS scales inversely with pixel count
        const pixelRatio = currentPixels / targetPixels;
        const estimatedFps = currentFps * pixelRatio;
        const fpsChange = estimatedFps - currentFps;
        const percentChange = (fpsChange / currentFps) * 100;

        return {
          primary: { label: "Estimated FPS at Target", value: formatNumber(estimatedFps, 0) },
          details: [
            { label: "Current FPS", value: formatNumber(currentFps, 0) },
            { label: "Pixel Count Ratio", value: formatNumber(pixelRatio, 2) + "x" },
            { label: "FPS Change", value: `${fpsChange >= 0 ? "+" : ""}${formatNumber(fpsChange, 0)} FPS` },
            { label: "Percent Change", value: `${percentChange >= 0 ? "+" : ""}${formatNumber(percentChange, 1)}%` },
            { label: "Current Frame Time", value: formatNumber(1000 / currentFps, 2) + " ms" },
            { label: "Estimated Frame Time", value: formatNumber(1000 / estimatedFps, 2) + " ms" },
          ],
          note: "This assumes the game is fully GPU-bound. CPU-bound games may see smaller FPS changes when changing resolution. Actual results vary by game engine and hardware.",
        };
      },
    },
    {
      id: "bottleneck",
      name: "CPU/GPU Bottleneck Check",
      description: "Simple check if your CPU or GPU is the bottleneck",
      fields: [
        {
          name: "gpuUsage",
          label: "GPU Usage (%)",
          type: "number",
          placeholder: "e.g. 95",
          min: 0,
          max: 100,
        },
        {
          name: "cpuUsage",
          label: "CPU Usage (%)",
          type: "number",
          placeholder: "e.g. 60",
          min: 0,
          max: 100,
        },
        {
          name: "currentFps",
          label: "Current FPS",
          type: "number",
          placeholder: "e.g. 75",
          min: 1,
        },
        {
          name: "targetFps",
          label: "Target FPS",
          type: "number",
          placeholder: "e.g. 144",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const gpu = inputs.gpuUsage as number;
        const cpu = inputs.cpuUsage as number;
        const currentFps = inputs.currentFps as number;
        const targetFps = inputs.targetFps as number;
        if (gpu === undefined || cpu === undefined || !currentFps || !targetFps) return null;

        let bottleneck = "";
        let recommendation = "";

        if (gpu > 95 && cpu < 80) {
          bottleneck = "GPU Bottleneck";
          recommendation = "Lower resolution, graphics settings, or upgrade GPU.";
        } else if (cpu > 95 && gpu < 80) {
          bottleneck = "CPU Bottleneck";
          recommendation = "Lowering resolution won't help much. Reduce CPU-heavy settings (draw distance, physics, NPC count) or upgrade CPU.";
        } else if (gpu > 90 && cpu > 90) {
          bottleneck = "Both (Balanced)";
          recommendation = "System is well balanced. Upgrade either component for gains.";
        } else {
          bottleneck = "Neither (possible other limitation)";
          recommendation = "Check RAM speed, storage (SSD vs HDD), or game engine limitations (frame cap, VSync).";
        }

        const fpsGap = targetFps - currentFps;
        const percentNeeded = (fpsGap / currentFps) * 100;

        return {
          primary: { label: "Bottleneck", value: bottleneck },
          details: [
            { label: "GPU Usage", value: gpu + "%" },
            { label: "CPU Usage", value: cpu + "%" },
            { label: "Current FPS", value: formatNumber(currentFps, 0) },
            { label: "Target FPS", value: formatNumber(targetFps, 0) },
            { label: "FPS Gap", value: `${formatNumber(fpsGap, 0)} FPS (${formatNumber(percentNeeded, 1)}% improvement needed)` },
            { label: "Recommendation", value: recommendation },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gaming-monitor-calculator", "streaming-bitrate-calculator", "speed-calculator"],
  faq: [
    {
      question: "What is frame time and why does it matter?",
      answer:
        "Frame time is the time in milliseconds to render one frame. At 60 FPS, each frame takes 16.67ms. Lower frame times mean smoother gameplay. Frame time consistency matters more than average FPS; spikes cause stuttering even at high average FPS.",
    },
    {
      question: "Does resolution affect FPS?",
      answer:
        "Yes, higher resolution means more pixels to render, which increases GPU load. Going from 1080p to 4K quadruples the pixel count, roughly halving FPS in GPU-bound scenarios. CPU-bound games are less affected by resolution changes.",
    },
    {
      question: "What is 1% low FPS?",
      answer:
        "1% low FPS represents the worst 1% of frame times. It shows how bad your occasional stutters are. A game averaging 100 FPS with a 1% low of 20 FPS will feel worse than one averaging 80 FPS with a 1% low of 60 FPS.",
    },
  ],
  formula:
    "Frame Time (ms) = 1000 / FPS | Resolution FPS estimate = Current FPS x (Current Pixels / Target Pixels) | Monitor Utilization = FPS / Refresh Rate x 100",
};
