import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

function gcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }

export const aspectRatioCalculator: CalculatorDefinition = {
  slug: "aspect-ratio-calculator",
  title: "Aspect Ratio Calculator",
  description: "Free aspect ratio calculator. Calculate aspect ratios, resize dimensions, and convert between common formats (16:9, 4:3, etc.).",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["aspect ratio calculator", "screen ratio", "16:9 calculator", "image ratio calculator", "resize calculator"],
  variants: [
    {
      id: "findRatio",
      name: "Find Aspect Ratio",
      fields: [
        { name: "width", label: "Width (px)", type: "number", placeholder: "e.g. 1920" },
        { name: "height", label: "Height (px)", type: "number", placeholder: "e.g. 1080" },
      ],
      calculate: (inputs) => {
        const w = inputs.width as number, h = inputs.height as number;
        if (!w || !h) return null;
        const g = gcd(w, h);
        const rw = w / g, rh = h / g;
        const decimal = w / h;
        return {
          primary: { label: "Aspect Ratio", value: `${rw}:${rh}` },
          details: [
            { label: "Decimal", value: formatNumber(decimal, 4) },
            { label: "Dimensions", value: `${w} × ${h}` },
            { label: "Total pixels", value: formatNumber(w * h, 0) },
            { label: "Megapixels", value: `${formatNumber(w * h / 1000000, 2)} MP` },
          ],
        };
      },
    },
    {
      id: "resize",
      name: "Resize (Keep Ratio)",
      fields: [
        { name: "origW", label: "Original Width", type: "number", placeholder: "e.g. 1920" },
        { name: "origH", label: "Original Height", type: "number", placeholder: "e.g. 1080" },
        { name: "newW", label: "New Width (leave 0 to auto)", type: "number", placeholder: "e.g. 1280", defaultValue: 0 },
        { name: "newH", label: "New Height (leave 0 to auto)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const ow = inputs.origW as number, oh = inputs.origH as number;
        let nw = (inputs.newW as number) || 0, nh = (inputs.newH as number) || 0;
        if (!ow || !oh || (!nw && !nh)) return null;
        if (nw && !nh) nh = Math.round(nw * oh / ow);
        else if (nh && !nw) nw = Math.round(nh * ow / oh);
        const g = gcd(ow, oh);
        return {
          primary: { label: "New Dimensions", value: `${nw} × ${nh}` },
          details: [
            { label: "Aspect ratio", value: `${ow / g}:${oh / g}` },
            { label: "Scale factor", value: `${formatNumber(nw / ow * 100, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pixel-density-calculator", "percentage-calculator", "unit-converter"],
  faq: [{ question: "What is aspect ratio?", answer: "Aspect ratio is the proportional relationship between width and height. Common ratios: 16:9 (widescreen), 4:3 (standard), 21:9 (ultrawide), 1:1 (square). To find it, divide both dimensions by their GCD." }],
  formula: "Ratio = W/GCD(W,H) : H/GCD(W,H)",
};
