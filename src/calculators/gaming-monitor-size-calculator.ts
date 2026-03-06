import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gamingMonitorSizeCalculator: CalculatorDefinition = {
  slug: "gaming-monitor-size-calculator",
  title: "Gaming Monitor Size Calculator",
  description: "Determine the optimal monitor size and resolution based on your viewing distance, desk depth, and primary use case for the best visual experience.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gaming monitor size","monitor distance calculator","screen size guide","gaming display calculator"],
  variants: [{
    id: "standard",
    name: "Gaming Monitor Size",
    description: "Determine the optimal monitor size and resolution based on your viewing distance, desk depth, and primary use case for the best visual experience.",
    fields: [
      { name: "deskDepth", label: "Desk Depth / Viewing Distance (inches)", type: "number", min: 15, max: 60, defaultValue: 28 },
      { name: "primaryUse", label: "Primary Use", type: "select", options: [{ value: "1", label: "Competitive FPS" }, { value: "2", label: "RPG/Story games" }, { value: "3", label: "Sim racing/flight" }, { value: "4", label: "Mixed gaming and work" }], defaultValue: "4" },
      { name: "budgetRange", label: "Budget Range", type: "select", options: [{ value: "1", label: "Under $200" }, { value: "2", label: "$200-400" }, { value: "3", label: "$400-700" }, { value: "4", label: "$700+" }], defaultValue: "2" },
      { name: "multiMonitor", label: "Multi-Monitor Setup", type: "select", options: [{ value: "1", label: "Single monitor" }, { value: "2", label: "Dual monitors" }, { value: "3", label: "Triple monitors" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const distance = inputs.deskDepth as number;
    const use = parseInt(inputs.primaryUse as string);
    const budget = parseInt(inputs.budgetRange as string);
    const multi = parseInt(inputs.multiMonitor as string);
    const idealSize = Math.round(distance * 0.95);
    const clampedSize = Math.max(24, Math.min(idealSize, 42));
    const resolution = clampedSize >= 32 ? "4K (3840x2160)" : clampedSize >= 27 ? "1440p (2560x1440)" : "1080p (1920x1080)";
    const refreshRate = use === 1 ? "240Hz+" : use === 2 ? "60-144Hz" : use === 3 ? "120-165Hz" : "144Hz";
    const panelType = use === 1 ? "TN or Fast IPS" : use === 2 ? "IPS or OLED" : use === 3 ? "VA or OLED" : "IPS";
    const estimatedCost = (budget === 1 ? 150 : budget === 2 ? 300 : budget === 3 ? 550 : 900) * multi;
    return {
      primary: { label: "Recommended Size", value: formatNumber(clampedSize) + " inches" },
      details: [
        { label: "Recommended Resolution", value: resolution },
        { label: "Ideal Refresh Rate", value: refreshRate },
        { label: "Best Panel Type", value: panelType },
        { label: "Estimated Total Cost (" + multi + " monitor" + (multi > 1 ? "s" : "") + ")", value: "$" + formatNumber(estimatedCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["gaming-monitor-input-lag-calculator","gaming-desk-setup-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Ideal Size = Viewing Distance x 0.95 (clamped 24-42 inches)
Resolution = Based on screen size
Refresh Rate = Based on primary use case
Panel Type = Based on primary use case",
};
