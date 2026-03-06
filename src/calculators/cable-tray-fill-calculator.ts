import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cableTrayFillCalculator: CalculatorDefinition = {
  slug: "cable-tray-fill-calculator",
  title: "Cable Tray Fill Calculator",
  description: "Calculate cable tray fill area and capacity based on tray dimensions, cable sizes, and NEC fill requirements for organized and code-compliant cable management.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cable tray fill","cable tray sizing","NEC cable tray calculator","cable management sizing"],
  variants: [{
    id: "standard",
    name: "Cable Tray Fill",
    description: "Calculate cable tray fill area and capacity based on tray dimensions, cable sizes, and NEC fill requirements for organized and code-compliant cable management.",
    fields: [
      { name: "trayWidth", label: "Tray Width (inches)", type: "select", options: [{ value: "6", label: "6 inch" }, { value: "12", label: "12 inch" }, { value: "18", label: "18 inch" }, { value: "24", label: "24 inch" }, { value: "30", label: "30 inch" }, { value: "36", label: "36 inch" }], defaultValue: "12" },
      { name: "trayDepth", label: "Tray Depth (inches)", type: "select", options: [{ value: "3", label: "3 inch" }, { value: "4", label: "4 inch" }, { value: "5", label: "5 inch" }, { value: "6", label: "6 inch" }], defaultValue: "4" },
      { name: "cableDiameter", label: "Average Cable OD (inches)", type: "number", min: 0.2, max: 3, defaultValue: 0.75 },
      { name: "cableCount", label: "Number of Cables", type: "number", min: 1, max: 200, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const trayW = parseFloat(inputs.trayWidth as string);
    const trayD = parseFloat(inputs.trayDepth as string);
    const cableOD = inputs.cableDiameter as number;
    const cableCount = inputs.cableCount as number;
    const trayArea = trayW * trayD;
    const cableArea = Math.PI * Math.pow(cableOD / 2, 2);
    const totalCableArea = cableArea * cableCount;
    const fillPct = (totalCableArea / trayArea) * 100;
    const maxFillPct = 40;
    const maxCables = Math.floor((trayArea * maxFillPct / 100) / cableArea);
    const remainingCapacity = maxCables - cableCount;
    const passes = fillPct <= maxFillPct ? "Yes" : "No - tray too full";
    return {
      primary: { label: "Cable Tray Fill", value: formatNumber(Math.round(fillPct * 10) / 10) + "%" },
      details: [
        { label: "Passes NEC Fill Limit (40%)", value: passes },
        { label: "Maximum Cables", value: formatNumber(maxCables) },
        { label: "Remaining Capacity", value: formatNumber(Math.max(remainingCapacity, 0)) + " cables" },
        { label: "Total Cable Area", value: formatNumber(Math.round(totalCableArea * 100) / 100) + " sq in" }
      ]
    };
  },
  }],
  relatedSlugs: ["conduit-fill-calculator","wire-gauge-ampacity-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Tray Area = Tray Width x Tray Depth
Cable Area = Pi x (Cable OD / 2)^2
Total Cable Area = Cable Area x Number of Cables
Fill Percentage = (Total Cable Area / Tray Area) x 100
Max Cables = (Tray Area x 40%) / Cable Area",
};
