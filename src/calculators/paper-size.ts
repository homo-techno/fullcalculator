import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const paperSizes: Record<string, { widthMm: number; heightMm: number; name: string }> = {
  "A3": { widthMm: 297, heightMm: 420, name: "A3" },
  "A4": { widthMm: 210, heightMm: 297, name: "A4" },
  "A5": { widthMm: 148, heightMm: 210, name: "A5" },
  "Letter": { widthMm: 215.9, heightMm: 279.4, name: "US Letter" },
  "Legal": { widthMm: 215.9, heightMm: 355.6, name: "US Legal" },
  "Tabloid": { widthMm: 279.4, heightMm: 431.8, name: "Tabloid" },
};

const MM_TO_INCHES = 0.0393701;

const paperOptions = Object.keys(paperSizes).map((k) => ({ label: paperSizes[k].name, value: k }));

export const paperSizeConverter: CalculatorDefinition = {
  slug: "paper-size-converter",
  title: "Paper Size Converter",
  description: "Free paper size converter. View dimensions of A3, A4, A5, Letter, Legal, and Tabloid in mm and inches.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["paper size", "A4", "A3", "letter", "legal", "tabloid", "dimensions", "converter"],
  variants: [
    {
      id: "convert",
      name: "Convert",
      fields: [
        { name: "paper", label: "Paper Standard", type: "select", options: paperOptions },
      ],
      calculate: (inputs) => {
        const paper = (inputs.paper as string) || "A4";
        const size = paperSizes[paper];
        if (!size) return null;
        const widthIn = size.widthMm * MM_TO_INCHES;
        const heightIn = size.heightMm * MM_TO_INCHES;
        const areaMm2 = size.widthMm * size.heightMm;
        const areaIn2 = widthIn * heightIn;
        return {
          primary: { label: `${size.name} Dimensions`, value: `${formatNumber(size.widthMm, 1)} × ${formatNumber(size.heightMm, 1)} mm` },
          details: [
            { label: "Width (mm)", value: formatNumber(size.widthMm, 1) },
            { label: "Height (mm)", value: formatNumber(size.heightMm, 1) },
            { label: "Width (inches)", value: formatNumber(widthIn, 2) },
            { label: "Height (inches)", value: formatNumber(heightIn, 2) },
            { label: "Dimensions (inches)", value: `${formatNumber(widthIn, 2)} × ${formatNumber(heightIn, 2)} in` },
            { label: "Area (mm²)", value: formatNumber(areaMm2, 0) },
            { label: "Area (in²)", value: formatNumber(areaIn2, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["print-size-calculator", "image-resolution-calculator"],
  faq: [
    { question: "What is the size of A4 paper?", answer: "A4 paper is 210 × 297 mm (8.27 × 11.69 inches)." },
    { question: "What is the difference between Letter and A4?", answer: "US Letter is 215.9 × 279.4 mm (8.5 × 11 in), while A4 is 210 × 297 mm. A4 is slightly narrower and taller." },
  ],
  formula: "Dimensions in inches = dimensions in mm × 0.0393701. Area = width × height.",
};
