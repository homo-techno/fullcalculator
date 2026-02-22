import type { CalculatorDefinition } from "./types";

export const hexToRgbConverter: CalculatorDefinition = {
  slug: "hex-to-rgb-converter",
  title: "HEX to RGB Color Converter",
  description: "Free HEX to RGB color converter. Convert hexadecimal color codes to RGB values instantly. Includes HSL and CSS output formats.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["hex to rgb", "hex color converter", "color code converter", "hex to rgba", "css color converter"],
  variants: [
    {
      id: "convert",
      name: "Convert HEX to RGB",
      fields: [
        { name: "hex", label: "HEX Color Code", type: "number", placeholder: "e.g. 255116 (for #FF7474, enter without #)" },
        { name: "r", label: "Red (0-255)", type: "number", placeholder: "e.g. 255", min: 0, max: 255 },
        { name: "g", label: "Green (0-255)", type: "number", placeholder: "e.g. 116", min: 0, max: 255 },
        { name: "b", label: "Blue (0-255)", type: "number", placeholder: "e.g. 116", min: 0, max: 255 },
        { name: "mode", label: "Mode", type: "select", options: [
          { label: "Use RGB values", value: "rgb" },
        ], defaultValue: "rgb" },
      ],
      calculate: (inputs) => {
        const r = Math.min(255, Math.max(0, Math.round(inputs.r as number || 0)));
        const g = Math.min(255, Math.max(0, Math.round(inputs.g as number || 0)));
        const b = Math.min(255, Math.max(0, Math.round(inputs.b as number || 0)));
        const hex = `#${r.toString(16).padStart(2, "0").toUpperCase()}${g.toString(16).padStart(2, "0").toUpperCase()}${b.toString(16).padStart(2, "0").toUpperCase()}`;
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        const l = (max + min) / 2;
        let h = 0;
        let s = 0;
        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          if (max === rNorm) h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
          else if (max === gNorm) h = ((bNorm - rNorm) / d + 2) / 6;
          else h = ((rNorm - gNorm) / d + 4) / 6;
        }
        return {
          primary: { label: `RGB(${r}, ${g}, ${b})`, value: hex },
          details: [
            { label: "HEX", value: hex },
            { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
            { label: "RGBA", value: `rgba(${r}, ${g}, ${b}, 1)` },
            { label: "HSL", value: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)` },
            { label: "CSS Variable", value: `--color: ${hex};` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rgb-to-hex-converter", "color-converter-calculator", "px-to-em-converter"],
  faq: [
    { question: "How do I convert HEX to RGB?", answer: "Split the 6-digit hex code into 3 pairs (RR, GG, BB) and convert each pair from hexadecimal to decimal. For #FF7474: FF=255, 74=116, 74=116, so RGB is (255, 116, 116)." },
    { question: "What is a HEX color code?", answer: "A HEX color code is a 6-digit hexadecimal representation of a color used in web design. It starts with # followed by pairs representing Red, Green, and Blue values (00-FF each). For example, #FF0000 is pure red." },
  ],
  formula: "R = parseInt(hex[0..1], 16) | G = parseInt(hex[2..3], 16) | B = parseInt(hex[4..5], 16) | Each channel: 0-255 (00-FF)",
};
