import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tapDrillSizeCalculator: CalculatorDefinition = {
  slug: "tap-drill-size-calculator",
  title: "Tap Drill Size Calculator",
  description: "Calculate the tap drill diameter for threaded holes.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["tap drill","thread tap calculator"],
  variants: [{
    id: "standard",
    name: "Tap Drill Size",
    description: "Calculate the tap drill diameter for threaded holes.",
    fields: [
      { name: "majorDia", label: "Major Diameter (inches)", type: "number", min: 0.05, max: 4, defaultValue: 0.25 },
      { name: "tpi", label: "Threads Per Inch", type: "number", min: 4, max: 80, defaultValue: 20 },
      { name: "threadPct", label: "Thread Percentage (%)", type: "number", min: 50, max: 100, defaultValue: 75 },
    ],
    calculate: (inputs) => {
      const maj = inputs.majorDia as number;
      const tpi = inputs.tpi as number;
      const pct = inputs.threadPct as number;
      if (!maj || !tpi || !pct) return null;
      const pitch = 1 / tpi;
      const basicPD = maj - 0.6495 * pitch;
      const drillSize = maj - (pct / 100) * 0.6495 * 2 * pitch;
      var drill64 = Math.round(drillSize * 64);
      return {
        primary: { label: "Tap Drill Size", value: formatNumber(Math.round(drillSize * 10000) / 10000) + " in" },
        details: [
          { label: "Nearest 64th", value: drill64 + "/64 in" },
          { label: "Pitch", value: formatNumber(Math.round(pitch * 10000) / 10000) + " in" },
          { label: "Thread Engagement", value: pct + "%" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What thread percentage should I use?", answer: "Use 75 percent for most applications. Going above 80 percent adds little strength." },
    { question: "How do I find threads per inch?", answer: "Use a thread pitch gauge or count threads over one inch of the fastener." },
  ],
  formula: "Drill = Major Dia - Thread% x 1.299 x Pitch",
};
