import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const video360StitchingTimeCalculator: CalculatorDefinition = {
  slug: "video-360-stitching-time-calculator",
  title: "360 Video Stitching Time Calculator",
  description: "Estimate processing time for stitching 360-degree video from multi-camera rigs based on resolution and hardware.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["360 video stitching","VR video processing","360 camera stitching time","panoramic video"],
  variants: [{
    id: "standard",
    name: "360 Video Stitching Time",
    description: "Estimate processing time for stitching 360-degree video from multi-camera rigs based on resolution and hardware.",
    fields: [
      { name: "duration", label: "Video Duration (minutes)", type: "number", min: 1, max: 120, defaultValue: 10 },
      { name: "cameras", label: "Number of Cameras/Lenses", type: "number", min: 2, max: 24, defaultValue: 6 },
      { name: "outputRes", label: "Output Resolution", type: "select", options: [{ value: "1", label: "4K (3840x1920)" }, { value: "2", label: "5.7K (5760x2880)" }, { value: "3", label: "8K (7680x3840)" }, { value: "4", label: "12K (11520x5760)" }], defaultValue: "2" },
      { name: "hardware", label: "Processing Hardware", type: "select", options: [{ value: "1", label: "Laptop (integrated)" }, { value: "2", label: "Desktop (dedicated GPU)" }, { value: "3", label: "Workstation (high-end GPU)" }, { value: "4", label: "Cloud Rendering" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const duration = inputs.duration as number;
    const cameras = inputs.cameras as number;
    const outputRes = parseInt(inputs.outputRes as string);
    const hardware = parseInt(inputs.hardware as string);
    const resMultiplier = [0, 1, 2, 5, 12][outputRes];
    const cameraMultiplier = cameras / 6;
    const hwSpeed = [0, 0.2, 1, 3, 6][hardware];
    const stitchMinutes = Math.round(duration * resMultiplier * cameraMultiplier * 8 / hwSpeed);
    const stitchHours = Math.floor(stitchMinutes / 60);
    const stitchMins = stitchMinutes % 60;
    const timeStr = stitchHours > 0 ? stitchHours + "h " + stitchMins + "m" : stitchMins + " minutes";
    const ratio = Math.round(stitchMinutes / duration * 10) / 10;
    const storageGB = Math.round(duration * resMultiplier * cameras * 0.5 * 10) / 10;
    return {
      primary: { label: "Estimated Stitching Time", value: timeStr },
      details: [
        { label: "Processing Ratio", value: formatNumber(ratio) + ":1 (process:real)" },
        { label: "Source Footage", value: formatNumber(cameras) + " streams x " + formatNumber(duration) + " min" },
        { label: "Estimated Source Storage", value: formatNumber(storageGB) + " GB" },
        { label: "Stitching Minutes", value: formatNumber(stitchMinutes) }
      ]
    };
  },
  }],
  relatedSlugs: ["video-render-time-estimator","video-storage-estimator"],
  faq: [
    { question: "How long does 360 video stitching take?", answer: "Stitching time depends heavily on resolution and hardware. A 10-minute 5.7K clip can take 20-60 minutes on a desktop with a dedicated GPU." },
    { question: "Can I stitch 360 video in real time?", answer: "Real-time stitching is possible for 4K output with hardware encoders and optimized rigs, but quality is lower than offline stitching." },
    { question: "What software is used for 360 stitching?", answer: "Popular options include Insta360 Studio, Mistika VR, AutoPano Video Pro, and PTGui Pro. Some cameras like Insta360 and GoPro MAX include proprietary software." },
  ],
  formula: "Stitch Time = Duration x Resolution Multiplier x (Cameras / 6) x 8 / Hardware Speed
Source Storage = Duration x Resolution x Cameras x 0.5 GB",
};
