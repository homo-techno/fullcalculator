import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pxToEmConverter: CalculatorDefinition = {
  slug: "px-to-em-converter",
  title: "Pixels to Em Converter",
  description: "Free px to em converter for CSS. Convert pixels to em and rem units based on base font size. Essential for responsive web design.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["px to em", "pixels to em", "px to rem", "css unit converter", "em to px", "responsive design converter"],
  variants: [
    {
      id: "convert",
      name: "Convert px to em",
      fields: [
        { name: "value", label: "Pixels (px)", type: "number", placeholder: "e.g. 24" },
        { name: "base", label: "Base Font Size", type: "select", options: [
          { label: "10px", value: "10" },
          { label: "12px", value: "12" },
          { label: "14px", value: "14" },
          { label: "16px (Browser Default)", value: "16" },
          { label: "18px", value: "18" },
          { label: "20px", value: "20" },
        ], defaultValue: "16" },
        { name: "direction", label: "Direction", type: "select", options: [
          { label: "Pixels to Em/Rem", value: "px_to_em" },
          { label: "Em/Rem to Pixels", value: "em_to_px" },
        ], defaultValue: "px_to_em" },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const base = parseInt(inputs.base as string);
        const direction = inputs.direction as string;
        if (value === undefined) return null;
        if (direction === "em_to_px") {
          const px = value * base;
          return {
            primary: { label: `${formatNumber(value, 4)} em`, value: `${formatNumber(px, 2)} px` },
            details: [
              { label: "Pixels (px)", value: formatNumber(px, 2) },
              { label: "Points (pt)", value: formatNumber(px * 0.75, 2) },
              { label: "Percentage (%)", value: `${formatNumber(value * 100, 2)}%` },
              { label: "Base Size Used", value: `${base}px` },
            ],
          };
        }
        const em = value / base;
        return {
          primary: { label: `${formatNumber(value, 0)} px`, value: `${formatNumber(em, 4)} em` },
          details: [
            { label: "Em/Rem", value: formatNumber(em, 4) },
            { label: "Percentage (%)", value: `${formatNumber(em * 100, 2)}%` },
            { label: "Points (pt)", value: formatNumber(value * 0.75, 2) },
            { label: "Base Size Used", value: `${base}px` },
            { label: "CSS Value", value: `${formatNumber(em, 4)}em` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pixels-to-inches-converter", "hex-to-rgb-converter", "unit-converter"],
  faq: [
    { question: "How do I convert px to em?", answer: "Divide the pixel value by the base font size. With the default browser font size of 16px: 24px ÷ 16 = 1.5em. The formula is: em = px ÷ base font size." },
    { question: "What is the difference between em and rem?", answer: "Em is relative to the font size of the parent element, while rem (root em) is relative to the root element's font size (usually 16px). Rem is more predictable for consistent sizing across a page." },
  ],
  formula: "em = px ÷ base font size | Default base = 16px | 1em = 16px (default) | rem = px ÷ root font size",
};
