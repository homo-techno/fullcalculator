import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windowReplacementCostCalculator: CalculatorDefinition = {
  slug: "window-replacement-cost-calculator",
  title: "Window Replacement Cost Calculator",
  description: "Free window replacement cost calculator. Estimate the cost of replacing windows based on type, material, and number of windows.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["window replacement cost", "window cost calculator", "how much to replace windows", "new window cost", "window installation cost"],
  variants: [
    {
      id: "replace",
      name: "Window Replacement",
      fields: [
        { name: "numWindows", label: "Number of Windows", type: "number", placeholder: "e.g. 10" },
        { name: "windowType", label: "Window Type", type: "select", options: [
          { label: "Double-hung (most common)", value: "doublehung" },
          { label: "Casement", value: "casement" },
          { label: "Sliding", value: "sliding" },
          { label: "Bay/Bow", value: "bay" },
          { label: "Picture (fixed)", value: "picture" },
        ], defaultValue: "doublehung" },
        { name: "frameMaterial", label: "Frame Material", type: "select", options: [
          { label: "Vinyl ($200-$600/window)", value: "400" },
          { label: "Wood ($300-$1,000/window)", value: "650" },
          { label: "Fiberglass ($400-$1,200/window)", value: "800" },
          { label: "Aluminum ($200-$700/window)", value: "450" },
          { label: "Clad wood ($400-$1,500/window)", value: "900" },
        ], defaultValue: "400" },
        { name: "glassType", label: "Glass Type", type: "select", options: [
          { label: "Double pane (standard)", value: "1.0" },
          { label: "Triple pane (+20-30%)", value: "1.25" },
          { label: "Low-E coated (+10-15%)", value: "1.12" },
          { label: "Triple pane + Low-E (+35-50%)", value: "1.4" },
        ], defaultValue: "1.0" },
        { name: "installType", label: "Installation Type", type: "select", options: [
          { label: "Retrofit/pocket ($100-200/window)", value: "150" },
          { label: "Full frame replacement ($200-400/window)", value: "300" },
        ], defaultValue: "150" },
      ],
      calculate: (inputs) => {
        const numWindows = inputs.numWindows as number;
        const windowType = inputs.windowType as string;
        const frameCost = parseInt(inputs.frameMaterial as string) || 400;
        const glassFactor = parseFloat(inputs.glassType as string) || 1.0;
        const installCost = parseInt(inputs.installType as string) || 150;
        if (!numWindows) return null;
        let typeFactor = 1.0;
        if (windowType === "casement") typeFactor = 1.1;
        else if (windowType === "bay") typeFactor = 2.5;
        else if (windowType === "sliding") typeFactor = 0.95;
        else if (windowType === "picture") typeFactor = 0.85;
        const windowCostEach = frameCost * glassFactor * typeFactor;
        const totalWindowCost = windowCostEach * numWindows;
        const totalInstall = installCost * numWindows;
        const trimPerWindow = 50;
        const totalTrim = trimPerWindow * numWindows;
        const totalCost = totalWindowCost + totalInstall + totalTrim;
        const annualSavings = numWindows * 35; // estimated energy savings
        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost)}` },
          details: [
            { label: "Cost per window", value: `$${formatNumber(windowCostEach + installCost + trimPerWindow)}` },
            { label: "Windows cost", value: `$${formatNumber(totalWindowCost)}` },
            { label: "Installation", value: `$${formatNumber(totalInstall)}` },
            { label: "Trim & finishing", value: `$${formatNumber(totalTrim)}` },
            { label: "Number of windows", value: `${numWindows}` },
            { label: "Est. annual energy savings", value: `$${formatNumber(annualSavings)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["door-replacement-cost-calculator", "siding-cost-calculator", "central-ac-cost-calculator"],
  faq: [
    { question: "How much does it cost to replace windows?", answer: "Average: $300-$1,000 per window installed. Vinyl double-hung: $300-$700. Wood: $500-$1,200. Fiberglass: $600-$1,500. Bay/bow windows: $1,000-$4,000. Replacing 10 windows averages $5,000-$12,000. Energy-efficient windows can save $100-$500/year on heating/cooling." },
  ],
  formula: "Total = (Frame Cost × Glass Factor × Type Factor + Install + Trim) × Number of Windows",
};
