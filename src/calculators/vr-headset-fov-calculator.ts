import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vrHeadsetFovCalculator: CalculatorDefinition = {
  slug: "vr-headset-fov-calculator",
  title: "VR Headset FOV Calculator",
  description: "Calculate the effective field of view for your VR headset based on lens type, IPD setting, and face gasket depth to optimize your immersion.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["VR FOV calculator","virtual reality field of view","VR headset comparison","VR lens calculator"],
  variants: [{
    id: "standard",
    name: "VR Headset FOV",
    description: "Calculate the effective field of view for your VR headset based on lens type, IPD setting, and face gasket depth to optimize your immersion.",
    fields: [
      { name: "headsetType", label: "Headset Category", type: "select", options: [{ value: "1", label: "Budget (90-100 deg)" }, { value: "2", label: "Mid-Range (100-110 deg)" }, { value: "3", label: "High-End (110-120 deg)" }, { value: "4", label: "Ultra-Wide (120-140 deg)" }], defaultValue: "2" },
      { name: "ipd", label: "IPD - Interpupillary Distance (mm)", type: "number", min: 55, max: 75, defaultValue: 63 },
      { name: "faceDepth", label: "Face Gasket Depth (mm)", type: "number", min: 5, max: 30, defaultValue: 12 },
      { name: "lensType", label: "Lens Type", type: "select", options: [{ value: "1", label: "Fresnel" }, { value: "2", label: "Pancake" }, { value: "3", label: "Aspheric" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const headset = parseInt(inputs.headsetType as string);
    const ipd = inputs.ipd as number;
    const depth = inputs.faceDepth as number;
    const lens = parseInt(inputs.lensType as string);
    const baseFov = { 1: 95, 2: 105, 3: 115, 4: 130 };
    const lensModifier = { 1: 0, 2: -3, 3: 4 };
    const ipdOffset = (63 - ipd) * 0.4;
    const depthOffset = (12 - depth) * 1.5;
    const horizontalFov = Math.round((baseFov[headset] || 105) + ipdOffset + depthOffset + (lensModifier[lens] || 0));
    const verticalFov = Math.round(horizontalFov * 0.82);
    const diagonalFov = Math.round(Math.sqrt(horizontalFov * horizontalFov + verticalFov * verticalFov));
    const sweetSpotRating = lens === 2 ? "Large" : lens === 3 ? "Medium-Large" : "Medium";
    return {
      primary: { label: "Horizontal FOV", value: formatNumber(horizontalFov) + " degrees" },
      details: [
        { label: "Vertical FOV", value: formatNumber(verticalFov) + " degrees" },
        { label: "Diagonal FOV", value: formatNumber(diagonalFov) + " degrees" },
        { label: "Sweet Spot Size", value: sweetSpotRating },
        { label: "Immersion Rating", value: horizontalFov >= 120 ? "Excellent" : horizontalFov >= 105 ? "Good" : "Adequate" }
      ]
    };
  },
  }],
  relatedSlugs: ["gaming-monitor-input-lag-calculator","gpu-benchmark-score-estimator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Horizontal FOV = Base FOV + IPD Offset + Depth Offset + Lens Modifier; IPD Offset = (63 - IPD) x 0.4; Depth Offset = (12 - Face Depth) x 1.5; Vertical FOV = Horizontal FOV x 0.82",
};
