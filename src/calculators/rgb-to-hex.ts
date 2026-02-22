import type { CalculatorDefinition } from "./types";

export const rgbToHexConverter: CalculatorDefinition = {
  slug: "rgb-to-hex-converter",
  title: "RGB to HEX Color Converter",
  description: "Free RGB to HEX color converter. Convert RGB color values to hexadecimal color codes for web design and CSS.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["rgb to hex", "rgb color converter", "rgb to hexadecimal", "color picker converter", "css color code"],
  variants: [
    {
      id: "convert",
      name: "Convert RGB to HEX",
      fields: [
        { name: "r", label: "Red (0-255)", type: "number", placeholder: "e.g. 255", min: 0, max: 255 },
        { name: "g", label: "Green (0-255)", type: "number", placeholder: "e.g. 128", min: 0, max: 255 },
        { name: "b", label: "Blue (0-255)", type: "number", placeholder: "e.g. 0", min: 0, max: 255 },
        { name: "format", label: "Output Format", type: "select", options: [
          { label: "Uppercase (#FF8000)", value: "upper" },
          { label: "Lowercase (#ff8000)", value: "lower" },
        ], defaultValue: "upper" },
      ],
      calculate: (inputs) => {
        const r = Math.min(255, Math.max(0, Math.round(inputs.r as number || 0)));
        const g = Math.min(255, Math.max(0, Math.round(inputs.g as number || 0)));
        const b = Math.min(255, Math.max(0, Math.round(inputs.b as number || 0)));
        const format = inputs.format as string;
        const hexR = r.toString(16).padStart(2, "0");
        const hexG = g.toString(16).padStart(2, "0");
        const hexB = b.toString(16).padStart(2, "0");
        const hex = format === "lower" ? `#${hexR}${hexG}${hexB}` : `#${hexR.toUpperCase()}${hexG.toUpperCase()}${hexB.toUpperCase()}`;
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
            { label: "Integer", value: String((r << 16) + (g << 8) + b) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hex-to-rgb-converter", "color-converter-calculator", "px-to-em-converter"],
  faq: [
    { question: "How do I convert RGB to HEX?", answer: "Convert each RGB value (0-255) to a 2-digit hexadecimal number and concatenate them with a # prefix. For RGB(255, 128, 0): 255=FF, 128=80, 0=00, so HEX is #FF8000." },
    { question: "Why use HEX instead of RGB in CSS?", answer: "HEX codes are more compact (7 characters vs ~16 for rgb()) and are widely recognized by designers. However, RGB is easier to read and modify. Both are fully supported in modern CSS." },
  ],
  formula: "HEX = #RRGGBB where RR, GG, BB are each value in base-16 | Each channel: decimal 0-255 = hex 00-FF",
};
