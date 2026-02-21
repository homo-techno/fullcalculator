import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const goldenRatioCalculator: CalculatorDefinition = {
  slug: "golden-ratio-calculator",
  title: "Golden Ratio Calculator",
  description: "Free golden ratio calculator. Calculate golden ratio proportions, golden rectangle dimensions, and Fibonacci-based design measurements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["golden ratio calculator", "phi calculator", "golden proportion", "golden rectangle", "fibonacci design", "1.618 calculator"],
  variants: [
    {
      id: "from-value",
      name: "Golden Ratio from Value",
      description: "Calculate the golden ratio pair from any measurement",
      fields: [
        { name: "value", label: "Known Value", type: "number", placeholder: "e.g. 100", step: 0.1 },
        { name: "position", label: "Value Position", type: "select", options: [
          { label: "Value is the longer segment (a)", value: "longer" },
          { label: "Value is the shorter segment (b)", value: "shorter" },
          { label: "Value is the total (a + b)", value: "total" },
        ], defaultValue: "longer" },
      ],
      calculate: (inputs) => {
        const val = inputs.value as number;
        const pos = inputs.position as string;
        if (!val) return null;

        const phi = 1.6180339887;
        let a: number, b: number, total: number;

        if (pos === "longer") {
          a = val;
          b = val / phi;
          total = a + b;
        } else if (pos === "shorter") {
          b = val;
          a = val * phi;
          total = a + b;
        } else {
          total = val;
          a = total / (1 + 1 / phi);
          b = total - a;
        }

        return {
          primary: { label: "Golden Ratio Pair", value: `${formatNumber(a, 2)} : ${formatNumber(b, 2)}` },
          details: [
            { label: "Longer segment (a)", value: formatNumber(a, 4) },
            { label: "Shorter segment (b)", value: formatNumber(b, 4) },
            { label: "Total (a + b)", value: formatNumber(total, 4) },
            { label: "Ratio a/b", value: formatNumber(a / b, 6) },
            { label: "Ratio total/a", value: formatNumber(total / a, 6) },
            { label: "Golden ratio (phi)", value: "1.618034..." },
          ],
          note: "The golden ratio (phi) = 1.618034... Two quantities are in the golden ratio if their ratio equals the ratio of their sum to the larger quantity.",
        };
      },
    },
    {
      id: "rectangle",
      name: "Golden Rectangle",
      description: "Calculate golden rectangle dimensions for design",
      fields: [
        { name: "width", label: "Width", type: "number", placeholder: "e.g. 960", step: 0.1 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Pixels", value: "px" },
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
          { label: "Millimeters", value: "mm" },
        ], defaultValue: "px" },
      ],
      calculate: (inputs) => {
        const w = inputs.width as number;
        const unit = inputs.unit as string;
        if (!w) return null;

        const phi = 1.6180339887;
        const h = w / phi;
        const smallSquare = h;
        const innerRect = w - h;

        return {
          primary: { label: "Golden Rectangle", value: `${formatNumber(w, 1)} x ${formatNumber(h, 1)} ${unit}` },
          details: [
            { label: "Width", value: `${formatNumber(w, 2)} ${unit}` },
            { label: "Height", value: `${formatNumber(h, 2)} ${unit}` },
            { label: "Square side", value: `${formatNumber(smallSquare, 2)} ${unit}` },
            { label: "Inner rectangle", value: `${formatNumber(smallSquare, 2)} x ${formatNumber(innerRect, 2)} ${unit}` },
            { label: "Area", value: `${formatNumber(w * h, 1)} ${unit}²` },
            { label: "Aspect ratio", value: `1.618:1` },
          ],
        };
      },
    },
    {
      id: "spiral",
      name: "Golden Spiral / Fibonacci",
      description: "Generate Fibonacci-based golden ratio sequence",
      fields: [
        { name: "startValue", label: "Starting Value", type: "number", placeholder: "e.g. 10", step: 0.1 },
        { name: "steps", label: "Number of Steps", type: "select", options: [
          { label: "5 steps", value: "5" },
          { label: "8 steps", value: "8" },
          { label: "10 steps", value: "10" },
          { label: "12 steps", value: "12" },
        ], defaultValue: "8" },
      ],
      calculate: (inputs) => {
        const start = inputs.startValue as number;
        const steps = parseInt(inputs.steps as string) || 8;
        if (!start) return null;

        const phi = 1.6180339887;
        const values: number[] = [start];
        for (let i = 1; i < steps; i++) {
          values.push(values[i - 1] * phi);
        }

        const details = values.map((v, i) => ({
          label: `Step ${i + 1}`,
          value: formatNumber(v, 2),
        }));

        return {
          primary: { label: "Golden Sequence", value: `${formatNumber(values[0], 1)} to ${formatNumber(values[values.length - 1], 1)}` },
          details,
          note: "Each value is multiplied by phi (1.618) to create harmonious proportions. Use this for typography scales, spacing systems, or design layouts.",
        };
      },
    },
  ],
  relatedSlugs: ["rule-of-thirds-calculator", "grid-calculator", "font-scale-calculator"],
  faq: [
    { question: "What is the golden ratio?", answer: "The golden ratio (phi, approximately 1.618034) is a mathematical proportion found throughout nature and considered aesthetically pleasing. Two quantities are in the golden ratio when their ratio equals the ratio of their sum to the larger quantity." },
    { question: "How is the golden ratio used in design?", answer: "Designers use the golden ratio for layout proportions, typography scales, spacing, logo design, and composition. It creates visually harmonious relationships between elements." },
    { question: "What is the golden rectangle?", answer: "A golden rectangle has sides in the golden ratio (1:1.618). When you cut a square from it, the remaining rectangle is also a golden rectangle. This creates the basis for the golden spiral." },
  ],
  formula: "phi = (1 + sqrt(5)) / 2 = 1.618034... | a/b = (a+b)/a = phi | Golden Rectangle: width/height = phi",
};
