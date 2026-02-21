import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const firewoodCalculator: CalculatorDefinition = {
  slug: "firewood-calculator",
  title: "Firewood Calculator",
  description: "Free firewood cord calculator. Calculate how many cords of firewood you need for the heating season and estimate costs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["firewood calculator", "cord of wood calculator", "how much firewood do I need", "firewood cost calculator", "heating with wood"],
  variants: [
    {
      id: "cords-needed",
      name: "Cords Needed",
      description: "Estimate firewood needed for the heating season",
      fields: [
        { name: "homeSize", label: "Home Size (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "heatingSource", label: "Wood Heating Type", type: "select", options: [
          { label: "Primary heat source (wood stove/insert)", value: "primary" },
          { label: "Supplemental heat (50%)", value: "supplemental" },
          { label: "Occasional use (fireplace ambiance)", value: "occasional" },
        ], defaultValue: "primary" },
        { name: "climate", label: "Winter Climate", type: "select", options: [
          { label: "Mild (3-4 months heating)", value: "mild" },
          { label: "Moderate (5-6 months heating)", value: "moderate" },
          { label: "Cold (7-8 months heating)", value: "cold" },
          { label: "Very Cold (9+ months heating)", value: "very-cold" },
        ], defaultValue: "moderate" },
        { name: "woodType", label: "Wood Type", type: "select", options: [
          { label: "Hardwood (oak, maple, hickory)", value: "hardwood" },
          { label: "Mixed hardwood/softwood", value: "mixed" },
          { label: "Softwood (pine, spruce, fir)", value: "softwood" },
        ], defaultValue: "hardwood" },
      ],
      calculate: (inputs) => {
        const homeSize = inputs.homeSize as number;
        const source = inputs.heatingSource as string;
        const climate = inputs.climate as string;
        const woodType = inputs.woodType as string;
        if (!homeSize) return null;
        // Base: 1 cord per 1000 sq ft for primary heating in moderate climate with hardwood
        const baseCords = homeSize / 1000;
        const sourceFactor: Record<string, number> = { primary: 1.0, supplemental: 0.5, occasional: 0.15 };
        const climateFactor: Record<string, number> = { mild: 0.6, moderate: 1.0, cold: 1.4, "very-cold": 1.8 };
        const woodFactor: Record<string, number> = { hardwood: 1.0, mixed: 1.3, softwood: 1.6 };
        const sf = sourceFactor[source] || 1.0;
        const cf = climateFactor[climate] || 1.0;
        const wf = woodFactor[woodType] || 1.0;
        const cordsNeeded = baseCords * sf * cf * wf;
        const btuPerCord: Record<string, number> = { hardwood: 24000000, mixed: 20000000, softwood: 16000000 };
        const totalBTU = cordsNeeded * (btuPerCord[woodType] || 24000000);
        const pricePerCord: Record<string, number> = { hardwood: 300, mixed: 250, softwood: 200 };
        const totalCost = cordsNeeded * (pricePerCord[woodType] || 300);
        return {
          primary: { label: "Cords Needed", value: `${formatNumber(cordsNeeded, 1)} cords` },
          details: [
            { label: "Face cords (1/3 cord)", value: formatNumber(cordsNeeded * 3, 1) },
            { label: "Estimated BTU output", value: `${formatNumber(totalBTU / 1000000, 1)} million BTU` },
            { label: "Estimated cost", value: `$${formatNumber(totalCost, 0)}` },
            { label: "Volume", value: `${formatNumber(cordsNeeded * 128, 0)} cubic feet` },
            { label: "Weight (approx)", value: `${formatNumber(cordsNeeded * (woodType === "hardwood" ? 3500 : woodType === "softwood" ? 2500 : 3000), 0)} lbs` },
          ],
          note: "A full cord is 4 ft × 4 ft × 8 ft = 128 cubic feet. Season firewood for at least 6-12 months before burning. Well-insulated homes need significantly less.",
        };
      },
    },
    {
      id: "stack-size",
      name: "Measure Your Stack",
      description: "Convert a wood stack to cords",
      fields: [
        { name: "length", label: "Stack Length (feet)", type: "number", placeholder: "e.g. 16" },
        { name: "height", label: "Stack Height (feet)", type: "number", placeholder: "e.g. 4" },
        { name: "depth", label: "Log Depth/Length (inches)", type: "number", placeholder: "e.g. 16" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const height = inputs.height as number;
        const depthIn = inputs.depth as number;
        if (!length || !height || !depthIn) return null;
        const depthFt = depthIn / 12;
        const cubicFeet = length * height * depthFt;
        const cords = cubicFeet / 128;
        const isFaceCord = Math.abs(depthIn - 16) < 2;
        const isFullCord = Math.abs(depthIn - 48) < 2;
        let stackType = "Custom size";
        if (isFullCord) stackType = "Full cord depth";
        else if (isFaceCord) stackType = "Face cord depth";
        return {
          primary: { label: "Cords", value: formatNumber(cords, 2) },
          details: [
            { label: "Cubic feet", value: formatNumber(cubicFeet, 0) },
            { label: "Stack type", value: stackType },
            { label: "Face cords (1/3 cord)", value: formatNumber(cords * 3, 1) },
            { label: "Dimensions", value: `${length}' × ${height}' × ${formatNumber(depthFt, 1)}'` },
          ],
          note: "A full cord has 48\" deep logs. A face cord (1/3 cord) has 16\" deep logs. Stacked wood has about 30% air space.",
        };
      },
    },
  ],
  relatedSlugs: ["btu-heating-calculator", "tree-height-calculator", "campfire-heat-calculator"],
  faq: [
    { question: "How much is a cord of firewood?", answer: "A cord of seasoned hardwood typically costs $250-400 depending on region and wood type. Face cords (1/3 cord) typically cost $100-200. Prices are higher in urban areas and during winter. Green (unseasoned) wood is usually 20-30% cheaper." },
    { question: "What is the difference between a cord and a face cord?", answer: "A full cord is 4 ft × 4 ft × 8 ft = 128 cubic feet. A face cord (also called a rick) is 4 ft × 8 ft × 16 inches deep = about 43 cubic feet, or 1/3 of a full cord. Always clarify which measurement a seller is using." },
    { question: "What is the best firewood?", answer: "Best hardwoods by heat output (BTU per cord): Osage orange (32.9M), Hickory (27.7M), Oak (24-27M), Hard Maple (25.5M), Ash (23.6M). These produce long-lasting coals and less creosote. Avoid softwoods like pine for indoor heating as they create more creosote." },
  ],
  formula: "Cords = Length (ft) × Height (ft) × Depth (ft) / 128 | Full Cord = 4' × 4' × 8' = 128 ft³",
};
