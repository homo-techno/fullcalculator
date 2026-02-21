import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windowSizeCalculator: CalculatorDefinition = {
  slug: "window-size-calculator",
  title: "Window Size Calculator",
  description: "Free window size calculator. Calculate window dimensions, glass area, and replacement window sizes for standard and custom openings.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["window size calculator", "window dimensions", "replacement window size", "window measurement", "window area calculator"],
  variants: [
    {
      id: "window-area",
      name: "Window Area & Glass Size",
      description: "Calculate window glass area and light exposure",
      fields: [
        { name: "width", label: "Window Width (inches)", type: "number", placeholder: "e.g. 36" },
        { name: "height", label: "Window Height (inches)", type: "number", placeholder: "e.g. 48" },
        { name: "windowType", label: "Window Type", type: "select", options: [
          { label: "Single Hung", value: "single-hung" },
          { label: "Double Hung", value: "double-hung" },
          { label: "Casement", value: "casement" },
          { label: "Sliding", value: "sliding" },
          { label: "Picture / Fixed", value: "picture" },
          { label: "Awning", value: "awning" },
        ], defaultValue: "double-hung" },
        { name: "count", label: "Number of Windows", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1 },
      ],
      calculate: (inputs) => {
        const width = inputs.width as number;
        const height = inputs.height as number;
        const windowType = inputs.windowType as string;
        const count = (inputs.count as number) || 1;
        if (!width || !height) return null;

        const totalAreaSqIn = width * height;
        const totalAreaSqFt = totalAreaSqIn / 144;

        // Frame takes roughly 10-15% depending on type
        let frameDeduction: number;
        switch (windowType) {
          case "picture": frameDeduction = 0.05; break;
          case "casement": frameDeduction = 0.10; break;
          default: frameDeduction = 0.12;
        }

        const glassArea = totalAreaSqFt * (1 - frameDeduction);

        // Ventilation area varies by type
        let ventilationPct: number;
        switch (windowType) {
          case "picture": ventilationPct = 0; break;
          case "single-hung": ventilationPct = 0.50; break;
          case "double-hung": ventilationPct = 0.50; break;
          case "casement": ventilationPct = 0.90; break;
          case "sliding": ventilationPct = 0.50; break;
          case "awning": ventilationPct = 0.75; break;
          default: ventilationPct = 0.50;
        }

        const ventilationArea = glassArea * ventilationPct;

        // Rough opening is typically 1/2" larger on each side
        const roughOpeningW = width + 1;
        const roughOpeningH = height + 1;

        return {
          primary: { label: "Window Size", value: `${formatNumber(width, 0)}" × ${formatNumber(height, 0)}"` },
          details: [
            { label: "Total area (per window)", value: `${formatNumber(totalAreaSqFt, 2)} sq ft` },
            { label: "Glass area (per window)", value: `${formatNumber(glassArea, 2)} sq ft` },
            { label: "Ventilation area", value: `${formatNumber(ventilationArea, 2)} sq ft` },
            { label: "Rough opening needed", value: `${formatNumber(roughOpeningW, 0)}" × ${formatNumber(roughOpeningH, 0)}"` },
            { label: "Total glass area (all)", value: `${formatNumber(glassArea * count, 2)} sq ft` },
            { label: "Number of windows", value: `${count}` },
          ],
          note: "Rough opening should be 1/2\" to 1\" larger than the window unit on each side. Always measure existing openings before ordering replacement windows.",
        };
      },
    },
    {
      id: "window-cost",
      name: "Window Replacement Cost",
      description: "Estimate the cost of replacement windows",
      fields: [
        { name: "width", label: "Window Width (inches)", type: "number", placeholder: "e.g. 36" },
        { name: "height", label: "Window Height (inches)", type: "number", placeholder: "e.g. 48" },
        { name: "glassType", label: "Glass Type", type: "select", options: [
          { label: "Single Pane", value: "single" },
          { label: "Double Pane", value: "double" },
          { label: "Triple Pane", value: "triple" },
          { label: "Low-E Double Pane", value: "lowE" },
        ], defaultValue: "double" },
        { name: "frameMaterial", label: "Frame Material", type: "select", options: [
          { label: "Vinyl", value: "vinyl" },
          { label: "Wood", value: "wood" },
          { label: "Aluminum", value: "aluminum" },
          { label: "Fiberglass", value: "fiberglass" },
        ], defaultValue: "vinyl" },
        { name: "count", label: "Number of Windows", type: "number", placeholder: "e.g. 5", defaultValue: 1, min: 1 },
      ],
      calculate: (inputs) => {
        const width = inputs.width as number;
        const height = inputs.height as number;
        const glassType = inputs.glassType as string;
        const frameMaterial = inputs.frameMaterial as string;
        const count = (inputs.count as number) || 1;
        if (!width || !height) return null;

        const areaSqFt = (width * height) / 144;

        let baseCost: number;
        switch (frameMaterial) {
          case "vinyl": baseCost = 300; break;
          case "wood": baseCost = 600; break;
          case "aluminum": baseCost = 350; break;
          case "fiberglass": baseCost = 700; break;
          default: baseCost = 300;
        }

        let glassMultiplier: number;
        switch (glassType) {
          case "single": glassMultiplier = 0.7; break;
          case "double": glassMultiplier = 1.0; break;
          case "triple": glassMultiplier = 1.5; break;
          case "lowE": glassMultiplier = 1.3; break;
          default: glassMultiplier = 1.0;
        }

        // Larger windows cost more; scale by area
        const sizeFactor = areaSqFt > 15 ? 1.5 : areaSqFt > 8 ? 1.2 : 1.0;
        const windowCost = baseCost * glassMultiplier * sizeFactor;
        const installCost = 200;
        const perWindow = windowCost + installCost;
        const totalCost = perWindow * count;

        return {
          primary: { label: "Total Estimated Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Cost per window", value: `$${formatNumber(perWindow, 0)}` },
            { label: "Window cost (material)", value: `$${formatNumber(windowCost, 0)}` },
            { label: "Installation per window", value: `$${formatNumber(installCost, 0)}` },
            { label: "Window area each", value: `${formatNumber(areaSqFt, 2)} sq ft` },
            { label: "Number of windows", value: `${count}` },
          ],
          note: "Prices vary significantly by brand and region. Energy-efficient windows may qualify for tax credits. Get multiple quotes for best pricing.",
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "door-size-calculator", "insulation-calculator"],
  faq: [
    { question: "What are standard window sizes?", answer: "Common residential window sizes: 24\"×36\", 28\"×54\", 32\"×52\", 36\"×48\", 36\"×60\". Double-hung windows typically range from 24\"-48\" wide and 36\"-72\" tall. Always measure your existing opening before ordering." },
    { question: "How do I measure for replacement windows?", answer: "Measure width at three points (top, middle, bottom) and use the smallest. Measure height at three points (left, center, right) and use the smallest. Measure diagonals to check for square. The replacement window should be ordered to the exact smallest measurements." },
  ],
  formula: "Glass Area = (W × H) × (1 - Frame %) | Rough Opening = Window Size + 1\" | Ventilation = Glass Area × Type Factor",
};
