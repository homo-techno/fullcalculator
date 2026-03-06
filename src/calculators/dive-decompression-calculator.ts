import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const diveDecompressionCalculator: CalculatorDefinition = {
  slug: "dive-decompression-calculator",
  title: "Dive Decompression Calculator",
  description: "Estimate no-decompression limits and safety stop requirements based on dive depth and bottom time using recreational dive tables.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["dive decompression","no deco limit","safety stop calculator","dive table calculator"],
  variants: [{
    id: "standard",
    name: "Dive Decompression",
    description: "Estimate no-decompression limits and safety stop requirements based on dive depth and bottom time using recreational dive tables.",
    fields: [
      { name: "depth", label: "Maximum Depth (feet)", type: "number", min: 15, max: 190, defaultValue: 60 },
      { name: "bottomTime", label: "Bottom Time (minutes)", type: "number", min: 5, max: 240, defaultValue: 30 },
      { name: "safetyStop", label: "Safety Stop", type: "select", options: [{ value: "3", label: "Standard (3 min at 15 ft)" }, { value: "5", label: "Extended (5 min at 15 ft)" }], defaultValue: "3" },
      { name: "surfaceInterval", label: "Surface Interval Before Next Dive (min)", type: "number", min: 0, max: 720, defaultValue: 60 },
    ],
    calculate: (inputs) => {
    const depth = inputs.depth as number;
    const bottomTime = inputs.bottomTime as number;
    const stopDuration = parseFloat(inputs.safetyStop as string);
    const surfaceInterval = inputs.surfaceInterval as number;
    const ndlTable = [[35, 205], [40, 140], [50, 80], [60, 55], [70, 40], [80, 30], [90, 25], [100, 20], [110, 16], [120, 13], [130, 10], [140, 8], [150, 7], [160, 6], [170, 5], [180, 4], [190, 3]];
    let ndl = 300;
    for (let i = 0; i < ndlTable.length; i++) {
      if (depth <= ndlTable[i][0]) { ndl = ndlTable[i][1]; break; }
    }
    const withinNdl = bottomTime <= ndl;
    const usedPercent = ndl > 0 ? Math.min(100, (bottomTime / ndl) * 100) : 100;
    const totalDiveTime = bottomTime + stopDuration + Math.round(depth / 30);
    const offgasCredit = Math.min(100, surfaceInterval / 6);
    return {
      primary: { label: "No-Deco Limit", value: formatNumber(ndl) + " minutes" },
      details: [
        { label: "Bottom Time Used", value: formatNumber(Math.round(usedPercent)) + "% of NDL" },
        { label: "Within No-Deco Limits", value: withinNdl ? "Yes" : "No - Deco Required" },
        { label: "Safety Stop", value: stopDuration + " min at 15 feet" },
        { label: "Total Dive Time (est.)", value: formatNumber(totalDiveTime) + " minutes" },
        { label: "Off-Gassing Credit", value: formatNumber(Math.round(offgasCredit)) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["scuba-tank-duration-calculator","boat-fuel-consumption-calculator"],
  faq: [
    { question: "What is a no-decompression limit?", answer: "The no-decompression limit (NDL) is the maximum time you can spend at a given depth without requiring mandatory decompression stops during ascent. Exceeding the NDL requires staged stops to safely off-gas nitrogen." },
    { question: "Do I always need a safety stop?", answer: "A safety stop at 15 feet for 3 minutes is strongly recommended on all dives deeper than 20 feet. While not mandatory for dives within no-deco limits, it provides an extra margin of safety." },
    { question: "How long should I wait between dives?", answer: "A minimum surface interval of 60 minutes is recommended. For deeper or longer dives, wait at least 2 to 4 hours. Before flying, wait at least 12 hours after a single dive or 18 hours after repetitive dives." },
  ],
  formula: "No-Deco Limit is based on standard recreational dive tables for depth
NDL Usage = (Bottom Time / NDL) x 100
Total Dive Time = Bottom Time + Safety Stop + Ascent Time",
};
