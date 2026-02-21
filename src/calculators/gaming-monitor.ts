import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gamingMonitorCalculator: CalculatorDefinition = {
  slug: "gaming-monitor-calculator",
  title: "Gaming Monitor Calculator",
  description:
    "Free gaming monitor calculator. Calculate PPI, pixel density, response time, and ideal viewing distance for any monitor.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "gaming monitor calculator",
    "PPI calculator",
    "pixel density",
    "monitor size",
    "viewing distance",
    "screen resolution",
    "monitor comparison",
  ],
  variants: [
    {
      id: "ppi-density",
      name: "PPI & Pixel Density",
      description: "Calculate pixels per inch and total pixel count for your monitor",
      fields: [
        {
          name: "screenSize",
          label: "Screen Size (diagonal inches)",
          type: "number",
          placeholder: "e.g. 27",
          min: 5,
          max: 100,
          step: 0.1,
        },
        {
          name: "resolution",
          label: "Resolution",
          type: "select",
          options: [
            { label: "1080p (1920x1080)", value: "1920x1080" },
            { label: "1440p (2560x1440)", value: "2560x1440" },
            { label: "4K (3840x2160)", value: "3840x2160" },
            { label: "Ultrawide 1080p (2560x1080)", value: "2560x1080" },
            { label: "Ultrawide 1440p (3440x1440)", value: "3440x1440" },
            { label: "Super Ultrawide (5120x1440)", value: "5120x1440" },
            { label: "720p (1280x720)", value: "1280x720" },
            { label: "5K (5120x2880)", value: "5120x2880" },
          ],
          defaultValue: "2560x1440",
        },
      ],
      calculate: (inputs) => {
        const diagonal = inputs.screenSize as number;
        const resStr = inputs.resolution as string;
        if (!diagonal || !resStr) return null;

        const [widthPx, heightPx] = resStr.split("x").map(Number);
        if (!widthPx || !heightPx) return null;

        const totalPixels = widthPx * heightPx;
        const aspectRatio = widthPx / heightPx;
        const diagonalPx = Math.sqrt(widthPx * widthPx + heightPx * heightPx);
        const ppi = diagonalPx / diagonal;

        // Physical dimensions
        const heightInches = diagonal / Math.sqrt(1 + aspectRatio * aspectRatio);
        const widthInches = heightInches * aspectRatio;

        // Ideal viewing distance (based on visual acuity: ~60 pixels per degree)
        const idealDistanceInches = diagonalPx / (2 * Math.tan((Math.PI / 180) * 30)) / ppi * diagonal;
        const simpleIdealDistance = diagonal * 1.5; // Rule of thumb

        // Retina distance (where individual pixels become invisible, ~57 PPI at arm's length)
        const retinaDistance = 3438 / ppi; // inches

        let qualityRating = "";
        if (ppi > 150) qualityRating = "Excellent (retina-quality at desk distance)";
        else if (ppi > 110) qualityRating = "Very Good (sharp for gaming)";
        else if (ppi > 90) qualityRating = "Good (standard for gaming)";
        else if (ppi > 70) qualityRating = "Acceptable (visible pixels up close)";
        else qualityRating = "Low (noticeable pixelation)";

        return {
          primary: { label: "Pixels Per Inch (PPI)", value: formatNumber(ppi, 1) },
          details: [
            { label: "Resolution", value: `${widthPx} x ${heightPx}` },
            { label: "Total Pixels", value: formatNumber(totalPixels, 0) + " (" + formatNumber(totalPixels / 1000000, 1) + " MP)" },
            { label: "Screen Size (diagonal)", value: formatNumber(diagonal, 1) + " inches" },
            { label: "Screen Width", value: formatNumber(widthInches, 1) + " inches" },
            { label: "Screen Height", value: formatNumber(heightInches, 1) + " inches" },
            { label: "Aspect Ratio", value: `${Math.round(aspectRatio * 9)}:9 (${formatNumber(aspectRatio, 2)}:1)` },
            { label: "Quality Rating", value: qualityRating },
            { label: "Ideal Desk Distance", value: formatNumber(simpleIdealDistance, 0) + " inches (~" + formatNumber(simpleIdealDistance / 12, 1) + " ft)" },
            { label: "Retina Distance", value: formatNumber(retinaDistance, 0) + " inches" },
          ],
        };
      },
    },
    {
      id: "response-time",
      name: "Response Time & Input Lag",
      description: "Calculate total system latency from monitor response time, FPS, and peripherals",
      fields: [
        {
          name: "monitorResponse",
          label: "Monitor Response Time (ms)",
          type: "select",
          options: [
            { label: "1ms (fast TN/IPS)", value: "1" },
            { label: "2ms", value: "2" },
            { label: "4ms (typical IPS)", value: "4" },
            { label: "5ms", value: "5" },
            { label: "8ms (VA panel)", value: "8" },
            { label: "12ms (slow VA)", value: "12" },
          ],
          defaultValue: "4",
        },
        {
          name: "fps",
          label: "Game FPS",
          type: "number",
          placeholder: "e.g. 144",
          min: 1,
          max: 500,
        },
        {
          name: "inputDevice",
          label: "Input Device Latency (ms)",
          type: "select",
          options: [
            { label: "Wired mouse (~1ms)", value: "1" },
            { label: "Good wireless mouse (~2ms)", value: "2" },
            { label: "Bluetooth mouse (~8ms)", value: "8" },
            { label: "Wired keyboard (~1ms)", value: "1" },
            { label: "Wireless keyboard (~4ms)", value: "4" },
            { label: "Controller wired (~4ms)", value: "4" },
            { label: "Controller wireless (~8ms)", value: "8" },
          ],
          defaultValue: "1",
        },
        {
          name: "networkPing",
          label: "Network Ping (ms, 0 for offline)",
          type: "number",
          placeholder: "e.g. 30",
          min: 0,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const responseTime = parseFloat(inputs.monitorResponse as string);
        const fps = inputs.fps as number;
        const inputLag = parseFloat(inputs.inputDevice as string);
        const ping = (inputs.networkPing as number) || 0;
        if (!fps || fps <= 0) return null;

        const frameTime = 1000 / fps;
        // Average display latency = half a frame + response time
        const displayLatency = frameTime / 2 + responseTime;
        // Game engine rendering pipeline (typically 1-2 frames)
        const renderPipeline = frameTime * 1.5;
        const totalLatency = inputLag + renderPipeline + displayLatency + ping;

        let rating = "";
        if (totalLatency < 30) rating = "Excellent (competitive esports level)";
        else if (totalLatency < 50) rating = "Very Good (fast response)";
        else if (totalLatency < 80) rating = "Good (typical gaming)";
        else if (totalLatency < 120) rating = "Average";
        else rating = "High (noticeable delay)";

        return {
          primary: { label: "Total System Latency", value: formatNumber(totalLatency, 1) + " ms" },
          details: [
            { label: "Input Device Latency", value: formatNumber(inputLag, 0) + " ms" },
            { label: "Render Pipeline (~1.5 frames)", value: formatNumber(renderPipeline, 1) + " ms" },
            { label: "Display Latency", value: formatNumber(displayLatency, 1) + " ms" },
            { label: "Network Ping", value: formatNumber(ping, 0) + " ms" },
            { label: "Frame Time", value: formatNumber(frameTime, 2) + " ms" },
            { label: "Latency Rating", value: rating },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["video-game-fps-calculator", "streaming-bitrate-calculator", "speed-calculator"],
  faq: [
    {
      question: "What PPI is good for gaming?",
      answer:
        "For desktop gaming (2-3 ft viewing distance), 90-110 PPI is standard and comfortable. A 27\" 1440p monitor at ~109 PPI is widely considered the sweet spot for gaming. 4K at 27\" (163 PPI) is very sharp but demands a powerful GPU.",
    },
    {
      question: "Does monitor response time matter for gaming?",
      answer:
        "Yes, but it's often overstated. A 4ms vs 1ms response time difference is imperceptible to most players. More important is total system latency including FPS, input lag, and network ping. High FPS matters more than monitor response time.",
    },
    {
      question: "What is the ideal monitor size for gaming?",
      answer:
        "For 1080p: 24 inches is ideal (92 PPI). For 1440p: 27 inches is the sweet spot (109 PPI). For 4K: 27-32 inches works well (110-163 PPI). Going too large at lower resolutions makes individual pixels visible.",
    },
  ],
  formula:
    "PPI = sqrt(W^2 + H^2) / Diagonal | Total Latency = Input + Render Pipeline + Display + Network | Display Latency = Frame Time/2 + Response Time",
};
