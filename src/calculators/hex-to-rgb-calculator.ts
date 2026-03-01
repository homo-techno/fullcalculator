import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hexToRgbCalculator: CalculatorDefinition = {
  slug: "hex-to-rgb-calculator",
  title: "Hex to RGB Calculator",
  description: "Convert RGB color values to hexadecimal color codes.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["hex to rgb", "color code converter", "hex color converter"],
  variants: [{
    id: "standard",
    name: "RGB to Hex",
    description: "Convert RGB color values to hexadecimal color codes",
    fields: [
      { name: "red", label: "Red (R)", type: "number", min: 0, max: 255, defaultValue: 255 },
      { name: "green", label: "Green (G)", type: "number", min: 0, max: 255, defaultValue: 87 },
      { name: "blue", label: "Blue (B)", type: "number", min: 0, max: 255, defaultValue: 51 },
    ],
    calculate: (inputs) => {
      const r = inputs.red as number;
      const g = inputs.green as number;
      const b = inputs.blue as number;
      if (r === undefined || g === undefined || b === undefined) return null;
      const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0").toUpperCase();
      const hexResult = "#" + toHex(r) + toHex(g) + toHex(b);
      const hsl = (() => {
        const rn = r / 255, gn = g / 255, bn = b / 255;
        const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
        const l = (max + min) / 2;
        if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
        const d = max - min;
        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        let h = 0;
        if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        else if (max === gn) h = ((bn - rn) / d + 2) / 6;
        else h = ((rn - gn) / d + 4) / 6;
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
      })();
      return {
        primary: { label: "Hex Color", value: hexResult },
        details: [
          { label: "RGB", value: "rgb(" + r + ", " + g + ", " + b + ")" },
          { label: "HSL", value: "hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)" },
          { label: "Red", value: formatNumber(r) + " (" + toHex(r) + ")" },
          { label: "Green", value: formatNumber(g) + " (" + toHex(g) + ")" },
          { label: "Blue", value: formatNumber(b) + " (" + toHex(b) + ")" },
        ],
      };
    },
  }],
  relatedSlugs: ["number-base-converter", "ascii-converter"],
  faq: [
    { question: "What is a hex color code?", answer: "A hex color code is a 6-character string representing red, green, and blue values in hexadecimal (00 to FF). For example, FF0000 is pure red." },
    { question: "How do you convert RGB to hex?", answer: "Convert each RGB value (0-255) to its hexadecimal equivalent (00-FF) and concatenate them. For example, RGB(255, 87, 51) becomes #FF5733." },
  ],
  formula: "Hex = Red.toString(16) + Green.toString(16) + Blue.toString(16)",
};
