import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const canvasSizeCalculator: CalculatorDefinition = {
  slug: "canvas-size-calculator",
  title: "Canvas Size Calculator",
  description: "Free canvas size calculator. Calculate art canvas dimensions, area, and proportions for painting, drawing, and digital art projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["canvas size calculator", "art canvas calculator", "painting size calculator", "canvas dimensions", "art size guide"],
  variants: [
    {
      id: "standard",
      name: "Standard Canvas Sizes",
      description: "Get dimensions and area for standard canvas sizes",
      fields: [
        { name: "canvasSize", label: "Canvas Size", type: "select", options: [
          { label: "5x7 inches", value: "5x7" },
          { label: "8x10 inches", value: "8x10" },
          { label: "9x12 inches", value: "9x12" },
          { label: "11x14 inches", value: "11x14" },
          { label: "12x16 inches", value: "12x16" },
          { label: "16x20 inches", value: "16x20" },
          { label: "18x24 inches", value: "18x24" },
          { label: "20x24 inches", value: "20x24" },
          { label: "24x30 inches", value: "24x30" },
          { label: "24x36 inches", value: "24x36" },
          { label: "30x40 inches", value: "30x40" },
          { label: "36x48 inches", value: "36x48" },
        ], defaultValue: "16x20" },
        { name: "quantity", label: "Number of Canvases", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const size = inputs.canvasSize as string;
        const qty = (inputs.quantity as number) || 1;
        if (!size) return null;

        const [w, h] = size.split("x").map(Number);
        const areaInch = w * h;
        const areaSqFt = areaInch / 144;
        const wCm = w * 2.54;
        const hCm = h * 2.54;

        return {
          primary: { label: "Canvas Size", value: `${w}" x ${h}" (${formatNumber(wCm, 1)} x ${formatNumber(hCm, 1)} cm)` },
          details: [
            { label: "Width", value: `${w} inches (${formatNumber(wCm, 1)} cm)` },
            { label: "Height", value: `${h} inches (${formatNumber(hCm, 1)} cm)` },
            { label: "Area", value: `${areaInch} sq in (${formatNumber(areaSqFt, 2)} sq ft)` },
            { label: "Aspect ratio", value: `${w}:${h}` },
            { label: "Diagonal", value: `${formatNumber(Math.sqrt(w * w + h * h), 1)} inches` },
            { label: "Orientation", value: w > h ? "Landscape" : w < h ? "Portrait" : "Square" },
            { label: "Quantity", value: `${qty}` },
            { label: "Total area", value: `${formatNumber(areaInch * qty)} sq in` },
          ],
        };
      },
    },
    {
      id: "custom",
      name: "Custom Canvas Size",
      description: "Calculate dimensions and proportions for custom sizes",
      fields: [
        { name: "width", label: "Width", type: "number", placeholder: "e.g. 24", step: 0.1 },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 36", step: 0.1 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
          { label: "Millimeters", value: "mm" },
        ], defaultValue: "in" },
        { name: "depth", label: "Canvas Depth (optional)", type: "number", placeholder: "e.g. 1.5", step: 0.1 },
      ],
      calculate: (inputs) => {
        const w = inputs.width as number;
        const h = inputs.height as number;
        const unit = inputs.unit as string;
        const depth = inputs.depth as number;
        if (!w || !h) return null;

        const area = w * h;
        const diagonal = Math.sqrt(w * w + h * h);
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const g = gcd(Math.round(w * 10), Math.round(h * 10));
        const ratioW = Math.round(w * 10) / g;
        const ratioH = Math.round(h * 10) / g;

        const toIn = unit === "cm" ? 1 / 2.54 : unit === "mm" ? 1 / 25.4 : 1;
        const toCm = unit === "in" ? 2.54 : unit === "mm" ? 0.1 : 1;

        const details = [
          { label: "Width", value: `${w} ${unit}` },
          { label: "Height", value: `${h} ${unit}` },
          { label: "Area", value: `${formatNumber(area, 1)} ${unit}²` },
          { label: "Diagonal", value: `${formatNumber(diagonal, 2)} ${unit}` },
          { label: "Aspect ratio", value: `${ratioW}:${ratioH}` },
          { label: "Orientation", value: w > h ? "Landscape" : w < h ? "Portrait" : "Square" },
        ];

        if (unit === "in") {
          details.push({ label: "Metric size", value: `${formatNumber(w * 2.54, 1)} x ${formatNumber(h * 2.54, 1)} cm` });
        } else {
          details.push({ label: "Imperial size", value: `${formatNumber(w * toIn, 1)} x ${formatNumber(h * toIn, 1)} in` });
        }

        if (depth) {
          const sideArea = 2 * (w + h) * depth;
          details.push({ label: "Canvas depth", value: `${depth} ${unit}` });
          details.push({ label: "Side area (gallery wrap)", value: `${formatNumber(sideArea, 1)} ${unit}²` });
        }

        return {
          primary: { label: "Canvas Dimensions", value: `${w} x ${h} ${unit}` },
          details,
        };
      },
    },
    {
      id: "scale",
      name: "Scale Canvas",
      description: "Scale a canvas size up or down proportionally",
      fields: [
        { name: "origWidth", label: "Original Width", type: "number", placeholder: "e.g. 8" },
        { name: "origHeight", label: "Original Height", type: "number", placeholder: "e.g. 10" },
        { name: "scaleMethod", label: "Scale By", type: "select", options: [
          { label: "New width", value: "width" },
          { label: "New height", value: "height" },
          { label: "Scale percentage", value: "percent" },
        ], defaultValue: "width" },
        { name: "newValue", label: "New Value", type: "number", placeholder: "e.g. 16" },
      ],
      calculate: (inputs) => {
        const ow = inputs.origWidth as number;
        const oh = inputs.origHeight as number;
        const method = inputs.scaleMethod as string;
        const nv = inputs.newValue as number;
        if (!ow || !oh || !nv) return null;

        let nw: number, nh: number, scaleFactor: number;
        if (method === "width") {
          nw = nv;
          scaleFactor = nv / ow;
          nh = oh * scaleFactor;
        } else if (method === "height") {
          nh = nv;
          scaleFactor = nv / oh;
          nw = ow * scaleFactor;
        } else {
          scaleFactor = nv / 100;
          nw = ow * scaleFactor;
          nh = oh * scaleFactor;
        }

        return {
          primary: { label: "Scaled Size", value: `${formatNumber(nw, 1)} x ${formatNumber(nh, 1)}` },
          details: [
            { label: "Original size", value: `${ow} x ${oh}` },
            { label: "New width", value: formatNumber(nw, 2) },
            { label: "New height", value: formatNumber(nh, 2) },
            { label: "Scale factor", value: `${formatNumber(scaleFactor * 100, 1)}%` },
            { label: "Area change", value: `${formatNumber(scaleFactor * scaleFactor * 100, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["frame-size-calculator", "mat-board-calculator", "golden-ratio-calculator"],
  faq: [
    { question: "What are standard canvas sizes for painting?", answer: "Common canvas sizes include 8x10, 11x14, 16x20, 18x24, 24x30, and 24x36 inches. Sizes vary by country. US sizes are in inches while European sizes use centimeters." },
    { question: "What canvas size should I use for a beginner?", answer: "Start with 11x14 or 16x20 inches. These are large enough to paint comfortably but small enough to be manageable and affordable. They also fit standard frames." },
    { question: "What is gallery wrap canvas?", answer: "Gallery wrap canvas is stretched around thick wooden stretcher bars (typically 1.5 inches deep) so the sides are also covered with canvas. The painting can hang without a frame." },
  ],
  formula: "Area = Width × Height | Diagonal = sqrt(W² + H²) | Scale Factor = New Dimension / Original Dimension",
};
