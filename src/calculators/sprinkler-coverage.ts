import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sprinklerCoverageCalculator: CalculatorDefinition = {
  slug: "sprinkler-coverage-calculator",
  title: "Sprinkler Coverage Calculator",
  description: "Free sprinkler coverage calculator. Calculate sprinkler head coverage, number of heads needed, and watering time for your lawn.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sprinkler coverage calculator", "sprinkler head calculator", "lawn sprinkler calculator", "how many sprinklers do I need", "sprinkler spacing"],
  variants: [
    {
      id: "heads-needed",
      name: "Heads Needed",
      description: "Calculate how many sprinkler heads you need",
      fields: [
        { name: "area", label: "Lawn Area (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "headType", label: "Sprinkler Head Type", type: "select", options: [
          { label: "Fixed Spray (8 ft radius)", value: "fixed8" },
          { label: "Fixed Spray (12 ft radius)", value: "fixed12" },
          { label: "Fixed Spray (15 ft radius)", value: "fixed15" },
          { label: "Rotary/Rotor (25 ft radius)", value: "rotor25" },
          { label: "Rotary/Rotor (35 ft radius)", value: "rotor35" },
          { label: "Rotary/Rotor (45 ft radius)", value: "rotor45" },
          { label: "Impact Sprinkler (50 ft radius)", value: "impact50" },
        ], defaultValue: "rotor25" },
        { name: "pattern", label: "Spray Pattern", type: "select", options: [
          { label: "Full Circle (360°)", value: "360" },
          { label: "Half Circle (180°)", value: "180" },
          { label: "Quarter Circle (90°)", value: "90" },
        ], defaultValue: "360" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const headType = inputs.headType as string;
        const pattern = inputs.pattern as string;
        if (!area) return null;
        const radiusMap: Record<string, { radius: number; gpm: number }> = {
          fixed8: { radius: 8, gpm: 1.5 },
          fixed12: { radius: 12, gpm: 2.0 },
          fixed15: { radius: 15, gpm: 3.0 },
          rotor25: { radius: 25, gpm: 3.5 },
          rotor35: { radius: 35, gpm: 5.0 },
          rotor45: { radius: 45, gpm: 8.0 },
          impact50: { radius: 50, gpm: 6.0 },
        };
        const head = radiusMap[headType] || radiusMap.rotor25;
        const arcFraction = parseInt(pattern) / 360;
        const coveragePerHead = Math.PI * head.radius * head.radius * arcFraction;
        // Head-to-head spacing uses 50% overlap
        const effectiveSpacing = head.radius; // head-to-head = radius (not diameter)
        const effectiveCoverage = effectiveSpacing * effectiveSpacing; // square grid spacing
        const headsNeeded = Math.ceil(area / effectiveCoverage);
        const totalGPM = headsNeeded * head.gpm * arcFraction;
        return {
          primary: { label: "Sprinkler Heads Needed", value: `${headsNeeded}` },
          details: [
            { label: "Throw radius", value: `${head.radius} ft` },
            { label: "Coverage per head", value: `${formatNumber(coveragePerHead, 0)} sq ft` },
            { label: "Effective spacing", value: `${head.radius} ft (head-to-head)` },
            { label: "Flow per head", value: `${(head.gpm * arcFraction).toFixed(1)} GPM` },
            { label: "Total flow required", value: `${formatNumber(totalGPM, 1)} GPM` },
          ],
          note: "Use head-to-head spacing (radius = spacing distance) for even coverage. A typical residential water supply provides 8-12 GPM. Split into zones if total GPM exceeds supply.",
        };
      },
    },
    {
      id: "watering-time",
      name: "Watering Time",
      description: "Calculate how long to run sprinklers",
      fields: [
        { name: "targetInches", label: "Water Needed (inches per week)", type: "number", placeholder: "e.g. 1", defaultValue: 1, step: 0.25 },
        { name: "precipRate", label: "Sprinkler Precipitation Rate (in/hr)", type: "number", placeholder: "e.g. 1.5", defaultValue: 1.5, step: 0.1 },
        { name: "daysPerWeek", label: "Watering Days per Week", type: "select", options: [
          { label: "2 days", value: "2" },
          { label: "3 days", value: "3" },
          { label: "4 days", value: "4" },
          { label: "5 days", value: "5" },
          { label: "7 days (daily)", value: "7" },
        ], defaultValue: "3" },
      ],
      calculate: (inputs) => {
        const target = inputs.targetInches as number;
        const rate = inputs.precipRate as number;
        const days = parseInt(inputs.daysPerWeek as string) || 3;
        if (!target || !rate) return null;
        const inchesPerDay = target / days;
        const minutesPerSession = (inchesPerDay / rate) * 60;
        const totalMinutesPerWeek = minutesPerSession * days;
        return {
          primary: { label: "Run Time per Session", value: `${formatNumber(minutesPerSession, 0)} minutes` },
          details: [
            { label: "Water per session", value: `${formatNumber(inchesPerDay, 2)} inches` },
            { label: "Total run time per week", value: `${formatNumber(totalMinutesPerWeek, 0)} minutes` },
            { label: "Watering frequency", value: `${days} days/week` },
            { label: "Precipitation rate", value: `${rate} in/hr` },
          ],
          note: "Water early morning (4-8 AM) to minimize evaporation. Most lawns need 1-1.5 inches of water per week including rainfall. Deep, infrequent watering encourages deeper roots.",
        };
      },
    },
  ],
  relatedSlugs: ["irrigation-calculator", "lawn-calculator", "water-flow-rate-calculator"],
  faq: [
    { question: "How far apart should sprinkler heads be?", answer: "Use head-to-head spacing where each sprinkler's throw reaches the next head. For a 25-foot radius rotor, space heads 25 feet apart. This provides the 50% overlap needed for uniform coverage." },
    { question: "How long should I run my sprinklers?", answer: "Most lawns need 1-1.5 inches of water per week. With a typical spray head precipitation rate of 1.5 in/hr, run for about 20 minutes per session, 3 times per week. Place a tuna can on the lawn to measure actual output." },
    { question: "How many GPM do I need for sprinklers?", answer: "Spray heads use 1-3 GPM each, rotors use 2-8 GPM. A typical zone has 4-8 heads. Design zones so total GPM does not exceed your water supply (usually 8-15 GPM for residential). Use a flow test at your hose bib to measure." },
  ],
  formula: "Heads = Area / (Spacing²) | Run Time (min) = Target Inches / Precipitation Rate × 60 / Days per Week",
};
