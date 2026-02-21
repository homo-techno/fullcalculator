import type { CalculatorDefinition } from "./types";

export const colorConverter: CalculatorDefinition = {
  slug: "color-converter",
  title: "Color Converter",
  description: "Free color converter. Convert between HEX, RGB, and HSL color formats. Preview colors and get CSS values.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["color converter", "hex to rgb", "rgb to hex", "color code converter", "hsl converter"],
  variants: [
    {
      id: "rgb",
      name: "RGB to HEX & HSL",
      fields: [
        { name: "r", label: "Red (0-255)", type: "number", placeholder: "e.g. 66", min: 0, max: 255 },
        { name: "g", label: "Green (0-255)", type: "number", placeholder: "e.g. 133", min: 0, max: 255 },
        { name: "b", label: "Blue (0-255)", type: "number", placeholder: "e.g. 244", min: 0, max: 255 },
      ],
      calculate: (inputs) => {
        const r = inputs.r as number;
        const g = inputs.g as number;
        const b = inputs.b as number;
        if (r === undefined || g === undefined || b === undefined) return null;
        const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
        const rn = r / 255, gn = g / 255, bn = b / 255;
        const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
        const l = (max + min) / 2;
        let h = 0, s = 0;
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
          else if (max === gn) h = ((bn - rn) / d + 2) * 60;
          else h = ((rn - gn) / d + 4) * 60;
        }
        return {
          primary: { label: `RGB(${r}, ${g}, ${b})`, value: hex },
          details: [
            { label: "HEX", value: hex },
            { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
            { label: "HSL", value: `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)` },
            { label: "CSS", value: hex },
          ],
        };
      },
    },
    {
      id: "hex",
      name: "HEX to RGB",
      description: "Enter hex color code as a decimal number (e.g., 4285F4 = enter R, G, B separately above)",
      fields: [
        { name: "hexR", label: "HEX Red (00-FF as decimal 0-255)", type: "number", placeholder: "e.g. 66", min: 0, max: 255 },
        { name: "hexG", label: "HEX Green (0-255)", type: "number", placeholder: "e.g. 133", min: 0, max: 255 },
        { name: "hexB", label: "HEX Blue (0-255)", type: "number", placeholder: "e.g. 244", min: 0, max: 255 },
      ],
      calculate: (inputs) => {
        const r = inputs.hexR as number;
        const g = inputs.hexG as number;
        const b = inputs.hexB as number;
        if (r === undefined || g === undefined || b === undefined) return null;
        const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
        return {
          primary: { label: hex, value: `RGB(${r}, ${g}, ${b})` },
          details: [
            { label: "HEX", value: hex },
            { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
            { label: "Tailwind CSS", value: `text-[${hex}]` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["binary-hex-converter", "unit-converter", "percentage-calculator"],
  faq: [
    { question: "What is HEX color?", answer: "HEX is a 6-digit hexadecimal representation of RGB color. #FF0000 = Red (FF=255, 00=0, 00=0). #FFFFFF = White, #000000 = Black. Each pair represents Red, Green, Blue (0-255)." },
  ],
  formula: "HEX = #RRGGBB (base 16) | RGB = (0-255, 0-255, 0-255)",
};
