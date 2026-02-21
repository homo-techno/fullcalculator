import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ruleOfThirdsCalculator: CalculatorDefinition = {
  slug: "rule-of-thirds-calculator",
  title: "Rule of Thirds Calculator",
  description: "Free rule of thirds grid calculator. Calculate grid lines and power points for any image or canvas size for photography and design composition.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rule of thirds calculator", "composition grid", "photography grid", "thirds grid calculator", "power points"],
  variants: [
    {
      id: "grid",
      name: "Rule of Thirds Grid",
      description: "Calculate grid positions for any image size",
      fields: [
        { name: "width", label: "Width", type: "number", placeholder: "e.g. 1920" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 1080" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Pixels", value: "px" },
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
          { label: "Millimeters", value: "mm" },
        ], defaultValue: "px" },
      ],
      calculate: (inputs) => {
        const w = inputs.width as number;
        const h = inputs.height as number;
        const unit = inputs.unit as string;
        if (!w || !h) return null;

        const thirdW = w / 3;
        const thirdH = h / 3;

        return {
          primary: { label: "Grid Spacing", value: `${formatNumber(thirdW, 1)} x ${formatNumber(thirdH, 1)} ${unit}` },
          details: [
            { label: "Left vertical line", value: `${formatNumber(thirdW, 1)} ${unit}` },
            { label: "Right vertical line", value: `${formatNumber(thirdW * 2, 1)} ${unit}` },
            { label: "Top horizontal line", value: `${formatNumber(thirdH, 1)} ${unit}` },
            { label: "Bottom horizontal line", value: `${formatNumber(thirdH * 2, 1)} ${unit}` },
            { label: "Upper-left power point", value: `(${formatNumber(thirdW, 1)}, ${formatNumber(thirdH, 1)}) ${unit}` },
            { label: "Upper-right power point", value: `(${formatNumber(thirdW * 2, 1)}, ${formatNumber(thirdH, 1)}) ${unit}` },
            { label: "Lower-left power point", value: `(${formatNumber(thirdW, 1)}, ${formatNumber(thirdH * 2, 1)}) ${unit}` },
            { label: "Lower-right power point", value: `(${formatNumber(thirdW * 2, 1)}, ${formatNumber(thirdH * 2, 1)}) ${unit}` },
          ],
          note: "Place key subjects at power points (intersections) for strong composition. Align horizons with horizontal lines.",
        };
      },
    },
    {
      id: "phi-grid",
      name: "Phi Grid (Golden Ratio)",
      description: "Calculate composition grid using the golden ratio instead of thirds",
      fields: [
        { name: "width", label: "Width", type: "number", placeholder: "e.g. 1920" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 1080" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Pixels", value: "px" },
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "px" },
      ],
      calculate: (inputs) => {
        const w = inputs.width as number;
        const h = inputs.height as number;
        const unit = inputs.unit as string;
        if (!w || !h) return null;

        const phi = 1.6180339887;
        const phiW = w / (1 + phi);
        const phiH = h / (1 + phi);

        return {
          primary: { label: "Phi Grid", value: `${formatNumber(phiW, 1)} / ${formatNumber(w - phiW, 1)} ${unit}` },
          details: [
            { label: "Left vertical line", value: `${formatNumber(phiW, 1)} ${unit}` },
            { label: "Right vertical line", value: `${formatNumber(w - phiW, 1)} ${unit}` },
            { label: "Top horizontal line", value: `${formatNumber(phiH, 1)} ${unit}` },
            { label: "Bottom horizontal line", value: `${formatNumber(h - phiH, 1)} ${unit}` },
            { label: "Phi intersection (UL)", value: `(${formatNumber(phiW, 1)}, ${formatNumber(phiH, 1)}) ${unit}` },
            { label: "Phi intersection (UR)", value: `(${formatNumber(w - phiW, 1)}, ${formatNumber(phiH, 1)}) ${unit}` },
            { label: "Phi intersection (LL)", value: `(${formatNumber(phiW, 1)}, ${formatNumber(h - phiH, 1)}) ${unit}` },
            { label: "Phi intersection (LR)", value: `(${formatNumber(w - phiW, 1)}, ${formatNumber(h - phiH, 1)}) ${unit}` },
          ],
          note: "The phi grid places lines closer to center than the rule of thirds, based on the golden ratio (1:1.618). Many consider it more aesthetically pleasing.",
        };
      },
    },
  ],
  relatedSlugs: ["golden-ratio-calculator", "grid-calculator", "canvas-size-calculator"],
  faq: [
    { question: "What is the rule of thirds?", answer: "The rule of thirds divides an image into a 3x3 grid. Placing key elements along the lines or at their intersections (power points) creates more balanced and engaging compositions than centering the subject." },
    { question: "What are power points in composition?", answer: "Power points are the four intersections where the rule of thirds grid lines cross. These are the strongest positions to place your main subject, as the eye naturally gravitates to these points." },
    { question: "What is the phi grid?", answer: "The phi grid is similar to the rule of thirds but uses the golden ratio (1.618) to position the lines. The lines are closer to the center, creating a tighter composition that some photographers prefer for portraits." },
  ],
  formula: "Third Lines: width/3, 2×width/3, height/3, 2×height/3 | Phi Lines: width/(1+phi), width×phi/(1+phi)",
};
