import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pixelsToInchesConverter: CalculatorDefinition = {
  slug: "pixels-to-inches-converter",
  title: "Pixels to Inches Converter",
  description: "Free pixels to inches converter. Convert px to inches and inches to pixels at any DPI/PPI. Essential for print design and screen resolution.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["pixels to inches", "px to inches", "inches to pixels", "dpi converter", "print size calculator", "ppi converter"],
  variants: [
    {
      id: "convert",
      name: "Convert Pixels to Inches",
      fields: [
        { name: "value", label: "Pixels (px)", type: "number", placeholder: "e.g. 1920" },
        { name: "dpi", label: "Resolution (DPI/PPI)", type: "select", options: [
          { label: "72 DPI (Web Standard)", value: "72" },
          { label: "96 DPI (Windows Default)", value: "96" },
          { label: "150 DPI (Medium Print)", value: "150" },
          { label: "300 DPI (High Quality Print)", value: "300" },
          { label: "600 DPI (Professional Print)", value: "600" },
        ], defaultValue: "96" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Pixels to Inches", value: "px_to_in" },
          { label: "Inches to Pixels", value: "in_to_px" },
        ], defaultValue: "px_to_in" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const dpi = parseInt(inputs.dpi as string);
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        if (direction === "in_to_px") {
          const px = value * dpi;
          return {
            primary: { label: `${formatNumber(value, 2)} inches`, value: `${formatNumber(px, 0)} px` },
            details: [
              { label: "Pixels", value: formatNumber(px, 0) },
              { label: "Centimeters", value: formatNumber(value * 2.54, 3) },
              { label: "Millimeters", value: formatNumber(value * 25.4, 2) },
              { label: "Points (pt)", value: formatNumber(value * 72, 1) },
              { label: "DPI Used", value: String(dpi) },
            ],
          };
        }
        const inches = value / dpi;
        return {
          primary: { label: `${formatNumber(value, 0)} px`, value: `${formatNumber(inches, 4)} inches` },
          details: [
            { label: "Inches", value: formatNumber(inches, 4) },
            { label: "Centimeters", value: formatNumber(inches * 2.54, 3) },
            { label: "Millimeters", value: formatNumber(inches * 25.4, 2) },
            { label: "Points (pt)", value: formatNumber(inches * 72, 1) },
            { label: "DPI Used", value: String(dpi) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["px-to-em-converter", "unit-converter", "hex-to-rgb-converter"],
  faq: [
    { question: "How do I convert pixels to inches?", answer: "Divide pixels by DPI (dots per inch). For example, at 96 DPI: 1920 px ÷ 96 = 20 inches. At 300 DPI: 1920 px ÷ 300 = 6.4 inches. The result depends on the resolution." },
    { question: "What DPI should I use?", answer: "72 DPI is the web standard, 96 DPI is the Windows default, 150 DPI is medium print quality, and 300 DPI is standard for high-quality printing. Use 300+ DPI for professional print work." },
  ],
  formula: "Inches = Pixels ÷ DPI | Pixels = Inches × DPI | 1 inch = 2.54 cm = 72 points",
};
