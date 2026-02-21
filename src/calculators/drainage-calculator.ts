import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drainageCalculator: CalculatorDefinition = {
  slug: "drainage-calculator",
  title: "Drainage Calculator",
  description: "Free drainage calculator. Calculate stormwater runoff volume, drainage pipe size, and flow rates for your property using the Rational Method.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["drainage calculator", "stormwater runoff calculator", "drainage pipe size calculator", "runoff calculator", "drainage area calculator"],
  variants: [
    {
      id: "runoff",
      name: "Stormwater Runoff (Rational Method)",
      description: "Calculate peak runoff flow from rainfall and area",
      fields: [
        { name: "area", label: "Drainage Area (acres)", type: "number", placeholder: "e.g. 0.25", step: 0.01 },
        { name: "rainfallIntensity", label: "Rainfall Intensity (in/hr)", type: "number", placeholder: "e.g. 4", step: 0.5 },
        { name: "surfaceType", label: "Surface Type", type: "select", options: [
          { label: "Impervious (roof, concrete) C=0.95", value: "0.95" },
          { label: "Asphalt pavement C=0.90", value: "0.90" },
          { label: "Gravel surface C=0.50", value: "0.50" },
          { label: "Lawn (flat, sandy) C=0.10", value: "0.10" },
          { label: "Lawn (avg slope, clay) C=0.35", value: "0.35" },
          { label: "Lawn (steep, clay) C=0.50", value: "0.50" },
          { label: "Wooded/Forest C=0.15", value: "0.15" },
          { label: "Mixed residential C=0.45", value: "0.45" },
        ], defaultValue: "0.45" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const intensity = inputs.rainfallIntensity as number;
        const C = parseFloat(inputs.surfaceType as string) || 0.45;
        if (!area || !intensity) return null;
        // Rational Method: Q = C × I × A
        const qCfs = C * intensity * area; // cubic feet per second
        const qGpm = qCfs * 448.831;
        const areaSqFt = area * 43560;
        const totalVolumeGal = areaSqFt * (intensity / 12) * C * 7.481; // volume per hour
        return {
          primary: { label: "Peak Runoff", value: `${formatNumber(qCfs, 2)} cfs (${formatNumber(qGpm, 0)} GPM)` },
          details: [
            { label: "Runoff coefficient (C)", value: `${C}` },
            { label: "Rainfall intensity", value: `${intensity} in/hr` },
            { label: "Drainage area", value: `${area} acres (${formatNumber(areaSqFt, 0)} sq ft)` },
            { label: "Runoff volume per hour", value: `${formatNumber(totalVolumeGal, 0)} gallons` },
            { label: "Percent running off", value: `${formatNumber(C * 100, 0)}%` },
          ],
          note: "The Rational Method (Q=CIA) is used for small drainage areas (typically < 200 acres). Rainfall intensity should be based on your area's IDF curves for the design storm return period.",
        };
      },
    },
    {
      id: "pipe-size",
      name: "Drainage Pipe Size",
      description: "Determine pipe size needed for a given flow",
      fields: [
        { name: "flowCfs", label: "Design Flow (cfs)", type: "number", placeholder: "e.g. 1.5", step: 0.1 },
        { name: "slope", label: "Pipe Slope (%)", type: "number", placeholder: "e.g. 1", step: 0.25, defaultValue: 1 },
        { name: "material", label: "Pipe Material", type: "select", options: [
          { label: "Smooth PVC/HDPE (n=0.010)", value: "0.010" },
          { label: "Corrugated Metal (n=0.024)", value: "0.024" },
          { label: "Corrugated Plastic (n=0.015)", value: "0.015" },
          { label: "Concrete (n=0.013)", value: "0.013" },
          { label: "Clay/Vitrified (n=0.013)", value: "0.013" },
        ], defaultValue: "0.010" },
      ],
      calculate: (inputs) => {
        const Q = inputs.flowCfs as number;
        const slopePct = (inputs.slope as number) || 1;
        const n = parseFloat(inputs.material as string) || 0.010;
        if (!Q) return null;
        const S = slopePct / 100;
        // Manning's equation solved for diameter (circular pipe flowing full)
        // Q = (1/n) × A × R^(2/3) × S^(1/2)
        // For circular pipe: A = πD²/4, R = D/4
        // D = (Q × n × 4^(5/3) / (π × S^(1/2)))^(3/8) × some constant
        // Simplified: D = ((Q × n × 20.16) / (Math.sqrt(S)))^(3/8)
        const dFt = Math.pow((Q * n * 20.16) / Math.sqrt(S), 3 / 8);
        const dInches = dFt * 12;
        // Round up to standard pipe size
        const standardSizes = [4, 6, 8, 10, 12, 15, 18, 24, 30, 36, 42, 48];
        const recommendedSize = standardSizes.find(s => s >= dInches) || standardSizes[standardSizes.length - 1];
        // Calculate velocity
        const rFt = (recommendedSize / 12) / 4;
        const aFt = Math.PI * Math.pow(recommendedSize / 12, 2) / 4;
        const velocity = (1 / n) * Math.pow(rFt, 2 / 3) * Math.sqrt(S);
        return {
          primary: { label: "Recommended Pipe Size", value: `${recommendedSize}" diameter` },
          details: [
            { label: "Calculated diameter", value: `${formatNumber(dInches, 1)} inches` },
            { label: "Flow capacity", value: `${formatNumber(Q, 2)} cfs` },
            { label: "Flow velocity", value: `${formatNumber(velocity, 1)} ft/sec` },
            { label: "Pipe slope", value: `${slopePct}% (${formatNumber(slopePct / 100 * 12, 2)} in/ft)` },
            { label: "Manning's n", value: n.toString() },
          ],
          note: "Minimum recommended velocity is 2 ft/sec to prevent sediment buildup. Maximum is typically 10-15 ft/sec to prevent erosion. Pipe should be sized for the design storm (typically 10-25 year return period).",
        };
      },
    },
  ],
  relatedSlugs: ["rainfall-calculator", "water-flow-rate-calculator", "septic-size-calculator"],
  faq: [
    { question: "What is the Rational Method?", answer: "The Rational Method (Q = C × I × A) estimates peak stormwater runoff flow. Q is flow in cfs, C is a runoff coefficient (0-1), I is rainfall intensity in in/hr, and A is drainage area in acres. It is the standard method for small drainage design." },
    { question: "What size drain pipe do I need?", answer: "Common residential drainage: 4\" pipe handles about 0.3 cfs at 1% slope, sufficient for most residential lots. For larger areas: 6\" handles ~0.8 cfs, 8\" handles ~1.7 cfs, and 12\" handles ~5 cfs at 1% slope with PVC pipe." },
    { question: "How much does a concrete surface increase runoff?", answer: "Dramatically. Natural lawn absorbs 60-90% of rainfall (C=0.10-0.40), while concrete and asphalt produce 85-95% runoff (C=0.85-0.95). A 1,000 sq ft concrete pad produces about 5× more runoff than the same area of lawn." },
  ],
  formula: "Rational Method: Q = C × I × A | Manning's Equation: Q = (1/n) × A × R^(2/3) × S^(1/2)",
};
