import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const downspoutCalculator: CalculatorDefinition = {
  slug: "downspout-calculator",
  title: "Downspout Calculator",
  description: "Free downspout calculator. Calculate the number, size, and placement of downspouts needed for your gutter system and roof drainage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["downspout calculator", "downspout sizing", "how many downspouts", "downspout placement", "gutter downspout calculator"],
  variants: [
    {
      id: "downspout-count",
      name: "Downspout Count & Sizing",
      description: "Calculate how many downspouts your gutter system needs",
      fields: [
        { name: "gutterLength", label: "Total Gutter Length (feet)", type: "number", placeholder: "e.g. 120" },
        { name: "roofArea", label: "Total Roof Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "rainfallIntensity", label: "Rainfall Intensity", type: "select", options: [
          { label: "Light (2 in/hr)", value: "2" },
          { label: "Moderate (4 in/hr)", value: "4" },
          { label: "Heavy (6 in/hr)", value: "6" },
          { label: "Extreme (8 in/hr)", value: "8" },
        ], defaultValue: "4" },
        { name: "downspoutSize", label: "Downspout Size", type: "select", options: [
          { label: "2\" × 3\" (Standard)", value: "2x3" },
          { label: "3\" × 4\" (Large)", value: "3x4" },
          { label: "3\" Round", value: "3r" },
          { label: "4\" Round", value: "4r" },
        ], defaultValue: "2x3" },
      ],
      calculate: (inputs) => {
        const gutterLength = inputs.gutterLength as number;
        const roofArea = inputs.roofArea as number;
        const rainfall = parseInt(inputs.rainfallIntensity as string) || 4;
        const downspoutSize = inputs.downspoutSize as string;
        if (!gutterLength || !roofArea) return null;

        // Downspout drainage capacity in sq ft at 1 in/hr
        let capacityPerDownspout: number;
        switch (downspoutSize) {
          case "2x3": capacityPerDownspout = 600; break;
          case "3x4": capacityPerDownspout = 1200; break;
          case "3r": capacityPerDownspout = 706; break;
          case "4r": capacityPerDownspout = 1255; break;
          default: capacityPerDownspout = 600;
        }

        const effectiveCapacity = capacityPerDownspout / (rainfall / 1);
        const downspoutsNeededByArea = Math.ceil(roofArea / effectiveCapacity);
        const downspoutsNeededByLength = Math.ceil(gutterLength / 35); // Max 35 ft between downspouts
        const downspoutsNeeded = Math.max(downspoutsNeededByArea, downspoutsNeededByLength);
        const spacing = gutterLength / downspoutsNeeded;

        return {
          primary: { label: "Downspouts Needed", value: `${downspoutsNeeded}` },
          details: [
            { label: "By drainage capacity", value: `${downspoutsNeededByArea} downspouts` },
            { label: "By gutter spacing (max 35 ft)", value: `${downspoutsNeededByLength} downspouts` },
            { label: "Recommended spacing", value: `${formatNumber(spacing, 1)} ft apart` },
            { label: "Capacity per downspout", value: `${formatNumber(effectiveCapacity, 0)} sq ft of roof` },
            { label: "Roof area served", value: `${formatNumber(roofArea, 0)} sq ft` },
          ],
          note: "Place downspouts at corners and ends of gutter runs. Never exceed 40 feet between downspouts. Extend downspout outlets 4-6 feet away from the foundation.",
        };
      },
    },
    {
      id: "downspout-materials",
      name: "Downspout Materials List",
      description: "Calculate downspout materials and extensions needed",
      fields: [
        { name: "downspoutCount", label: "Number of Downspouts", type: "number", placeholder: "e.g. 4" },
        { name: "stories", label: "Building Height", type: "select", options: [
          { label: "1 Story (~10 ft)", value: "10" },
          { label: "1.5 Story (~15 ft)", value: "15" },
          { label: "2 Story (~20 ft)", value: "20" },
          { label: "3 Story (~30 ft)", value: "30" },
        ], defaultValue: "10" },
        { name: "extensionType", label: "Ground Extension Type", type: "select", options: [
          { label: "Standard Extension (4 ft)", value: "4" },
          { label: "Long Extension (6 ft)", value: "6" },
          { label: "Underground Drain Pipe", value: "12" },
          { label: "Splash Block Only", value: "0" },
        ], defaultValue: "4" },
      ],
      calculate: (inputs) => {
        const count = inputs.downspoutCount as number;
        const height = parseInt(inputs.stories as string) || 10;
        const extensionLength = parseInt(inputs.extensionType as string) || 4;
        if (!count) return null;

        const downspoutPerUnit = height + 2; // +2 ft for offsets at top
        const totalDownspoutFt = downspoutPerUnit * count;
        const elbows = count * 3; // 2 at top offset, 1 at bottom
        const brackets = Math.ceil(downspoutPerUnit / 6) * count; // Every 6 ft
        const outlets = count;
        const extensionsFt = extensionLength * count;

        const downspoutCostPerFt = 3;
        const elbowCost = 5;
        const bracketCost = 2;
        const outletCost = 8;
        const totalCost = totalDownspoutFt * downspoutCostPerFt + elbows * elbowCost + brackets * bracketCost + outlets * outletCost;

        return {
          primary: { label: "Total Downspout Length", value: `${formatNumber(totalDownspoutFt, 0)} linear ft` },
          details: [
            { label: "Downspout sections per unit", value: `${formatNumber(downspoutPerUnit, 0)} ft` },
            { label: "Elbows needed", value: `${elbows} (3 per downspout)` },
            { label: "Mounting brackets", value: `${brackets}` },
            { label: "Outlet drops", value: `${outlets}` },
            { label: "Extension pipe", value: `${formatNumber(extensionsFt, 0)} ft total` },
            { label: "Estimated material cost", value: `$${formatNumber(totalCost, 0)}` },
          ],
          note: "Each downspout needs 2 elbows at the top (for the offset from gutter to wall) and 1 elbow at the bottom for the extension. Secure with brackets every 6 feet.",
        };
      },
    },
  ],
  relatedSlugs: ["gutter-size-calculator", "gutter-calculator", "roofing-calculator"],
  faq: [
    { question: "How many downspouts do I need?", answer: "As a general rule, install one downspout for every 20-35 feet of gutter. A typical home with 120 feet of gutter needs 4-6 downspouts. Increase downspouts in heavy rainfall areas or for steep roofs." },
    { question: "Where should downspouts be placed?", answer: "Place downspouts at the lowest points of gutter runs, near corners, and at the ends of gutter sections. Never run more than 40 feet of gutter to a single downspout. Aim to direct water away from foundations, driveways, and walkways." },
  ],
  formula: "Downspouts = Max(Roof Area / Capacity, Gutter Length / 35) | Length Per Unit = Building Height + 2 ft | Elbows = 3 per downspout",
};
