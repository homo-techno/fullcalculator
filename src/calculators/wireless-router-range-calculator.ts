import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wirelessRouterRangeCalculator: CalculatorDefinition = {
  slug: "wireless-router-range-calculator",
  title: "Wireless Router Range Calculator",
  description: "Estimate the effective Wi-Fi coverage area of your wireless router based on frequency band, walls, and obstructions for optimal router placement.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wifi range calculator","router coverage area","wireless signal range","wifi distance estimator","router placement"],
  variants: [{
    id: "standard",
    name: "Wireless Router Range",
    description: "Estimate the effective Wi-Fi coverage area of your wireless router based on frequency band, walls, and obstructions for optimal router placement.",
    fields: [
      { name: "routerType", label: "Router Standard", type: "select", options: [{ value: "1", label: "Wi-Fi 5 (802.11ac)" }, { value: "2", label: "Wi-Fi 6 (802.11ax)" }, { value: "3", label: "Wi-Fi 6E" }, { value: "4", label: "Wi-Fi 7 (802.11be)" }], defaultValue: "2" },
      { name: "band", label: "Frequency Band", type: "select", options: [{ value: "24", label: "2.4 GHz (longer range)" }, { value: "5", label: "5 GHz (faster speed)" }, { value: "6", label: "6 GHz (fastest, shortest range)" }], defaultValue: "24" },
      { name: "walls", label: "Number of Walls to Penetrate", type: "number", min: 0, max: 10, defaultValue: 2 },
      { name: "wallType", label: "Wall Material", type: "select", options: [{ value: "1", label: "Drywall (light)" }, { value: "2", label: "Wood (medium)" }, { value: "3", label: "Brick/Concrete (heavy)" }, { value: "4", label: "Metal (severe)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const router = parseInt(inputs.routerType as string);
    const band = parseInt(inputs.band as string);
    const walls = inputs.walls as number;
    const wallType = parseInt(inputs.wallType as string);
    const baseRange = { 24: 150, 5: 80, 6: 50 };
    const routerBonus = { 1: 1.0, 2: 1.15, 3: 1.2, 4: 1.3 };
    const wallLoss = { 1: 0.08, 2: 0.12, 3: 0.20, 4: 0.35 };
    const maxRange = Math.round((baseRange[band] || 100) * (routerBonus[router] || 1.0));
    const effectiveRange = Math.round(maxRange * Math.pow(1 - (wallLoss[wallType] || 0.1), walls));
    const coverageArea = Math.round(Math.PI * Math.pow(effectiveRange, 2));
    const signalLoss = Math.round((1 - effectiveRange / maxRange) * 100);
    return {
      primary: { label: "Effective Range", value: formatNumber(effectiveRange) + " feet" },
      details: [
        { label: "Max Open-Air Range", value: formatNumber(maxRange) + " feet" },
        { label: "Coverage Area", value: formatNumber(coverageArea) + " sq ft" },
        { label: "Signal Loss from Walls", value: formatNumber(signalLoss) + "%" },
        { label: "Recommendation", value: effectiveRange < 30 ? "Consider a mesh system" : effectiveRange < 60 ? "Good for small spaces" : "Good coverage" }
      ]
    };
  },
  }],
  relatedSlugs: ["bluetooth-range-estimator-calculator","security-camera-storage-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Effective Range = Max Range x (1 - Wall Loss per Wall) ^ Number of Walls
Coverage Area = Pi x Effective Range^2
Max Range = Base Range (by band) x Router Bonus",
};
