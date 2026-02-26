import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dpiPpiCalculator: CalculatorDefinition = {
  slug: "dpi-ppi-calc",
  title: "DPI / PPI Calculator",
  description:
    "Free DPI and PPI calculator. Calculate dots per inch for printing, pixels per inch for screens, and convert between print and digital resolutions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "DPI calculator",
    "PPI calculator",
    "dots per inch",
    "pixels per inch",
    "print resolution",
    "image DPI",
    "screen pixel density",
  ],
  variants: [
    {
      id: "print-dpi",
      name: "Print Size from DPI",
      description: "Calculate print size from image resolution and DPI",
      fields: [
        {
          name: "imageWidth",
          label: "Image Width (pixels)",
          type: "number",
          placeholder: "e.g. 4000",
        },
        {
          name: "imageHeight",
          label: "Image Height (pixels)",
          type: "number",
          placeholder: "e.g. 3000",
        },
        {
          name: "dpi",
          label: "Print DPI",
          type: "number",
          placeholder: "e.g. 300",
          defaultValue: 300,
        },
      ],
      calculate: (inputs) => {
        const imageWidth = parseFloat(inputs.imageWidth as string);
        const imageHeight = parseFloat(inputs.imageHeight as string);
        const dpi = parseFloat(inputs.dpi as string);
        if (isNaN(imageWidth) || isNaN(imageHeight) || isNaN(dpi)) return null;
        if (imageWidth <= 0 || imageHeight <= 0 || dpi <= 0) return null;

        const printWidthIn = imageWidth / dpi;
        const printHeightIn = imageHeight / dpi;
        const printWidthCm = printWidthIn * 2.54;
        const printHeightCm = printHeightIn * 2.54;
        const megapixels = (imageWidth * imageHeight) / 1000000;

        let quality = "Excellent (photo quality)";
        if (dpi < 150) quality = "Low (draft/web only)";
        else if (dpi < 250) quality = "Acceptable (general printing)";
        else if (dpi < 300) quality = "Good (most printing)";

        return {
          primary: {
            label: "Print Size",
            value: `${formatNumber(printWidthIn, 2)} x ${formatNumber(printHeightIn, 2)}`,
            suffix: "inches",
          },
          details: [
            { label: "Print Size (cm)", value: `${formatNumber(printWidthCm, 1)} x ${formatNumber(printHeightCm, 1)} cm` },
            { label: "Image Resolution", value: `${formatNumber(imageWidth, 0)} x ${formatNumber(imageHeight, 0)} px` },
            { label: "Megapixels", value: formatNumber(megapixels, 2) + " MP" },
            { label: "Print Quality", value: quality },
            { label: "DPI", value: formatNumber(dpi) },
          ],
        };
      },
    },
    {
      id: "required-resolution",
      name: "Required Pixels for Print",
      description: "Calculate required image resolution for a target print size",
      fields: [
        {
          name: "printWidth",
          label: "Print Width (inches)",
          type: "number",
          placeholder: "e.g. 8",
        },
        {
          name: "printHeight",
          label: "Print Height (inches)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "dpi",
          label: "Target DPI",
          type: "select",
          options: [
            { label: "72 DPI (Web/Screen)", value: "72" },
            { label: "150 DPI (Draft Print)", value: "150" },
            { label: "300 DPI (Photo Quality)", value: "300" },
            { label: "600 DPI (High Quality)", value: "600" },
          ],
          defaultValue: "300",
        },
      ],
      calculate: (inputs) => {
        const printWidth = parseFloat(inputs.printWidth as string);
        const printHeight = parseFloat(inputs.printHeight as string);
        const dpi = parseFloat(inputs.dpi as string);
        if (isNaN(printWidth) || isNaN(printHeight) || isNaN(dpi)) return null;
        if (printWidth <= 0 || printHeight <= 0 || dpi <= 0) return null;

        const pixelsW = Math.ceil(printWidth * dpi);
        const pixelsH = Math.ceil(printHeight * dpi);
        const megapixels = (pixelsW * pixelsH) / 1000000;
        const fileSizeMB = (pixelsW * pixelsH * 3) / (1024 * 1024); // 3 bytes/pixel RGB

        return {
          primary: {
            label: "Required Resolution",
            value: `${formatNumber(pixelsW, 0)} x ${formatNumber(pixelsH, 0)}`,
            suffix: "pixels",
          },
          details: [
            { label: "Megapixels Required", value: formatNumber(megapixels, 2) + " MP" },
            { label: "Print Size", value: `${formatNumber(printWidth, 1)} x ${formatNumber(printHeight, 1)} inches` },
            { label: "Uncompressed File Size", value: formatNumber(fileSizeMB, 1) + " MB (RGB)" },
            { label: "DPI", value: formatNumber(dpi) },
          ],
        };
      },
    },
    {
      id: "screen-ppi",
      name: "Screen PPI Calculator",
      description: "Calculate pixel density of a screen",
      fields: [
        {
          name: "resWidth",
          label: "Screen Width (pixels)",
          type: "number",
          placeholder: "e.g. 2560",
        },
        {
          name: "resHeight",
          label: "Screen Height (pixels)",
          type: "number",
          placeholder: "e.g. 1440",
        },
        {
          name: "diagonal",
          label: "Screen Diagonal (inches)",
          type: "number",
          placeholder: "e.g. 27",
        },
      ],
      calculate: (inputs) => {
        const resWidth = parseFloat(inputs.resWidth as string);
        const resHeight = parseFloat(inputs.resHeight as string);
        const diagonal = parseFloat(inputs.diagonal as string);
        if (isNaN(resWidth) || isNaN(resHeight) || isNaN(diagonal)) return null;
        if (resWidth <= 0 || resHeight <= 0 || diagonal <= 0) return null;

        const diagPixels = Math.sqrt(resWidth * resWidth + resHeight * resHeight);
        const ppi = diagPixels / diagonal;
        const dotPitch = 25.4 / ppi;

        let category = "Standard density";
        if (ppi >= 300) category = "Ultra high density (Retina+)";
        else if (ppi >= 200) category = "High density (Retina-class)";
        else if (ppi >= 140) category = "Medium-high density";

        return {
          primary: {
            label: "Pixel Density",
            value: formatNumber(ppi, 1),
            suffix: "PPI",
          },
          details: [
            { label: "Dot Pitch", value: formatNumber(dotPitch, 4) + " mm" },
            { label: "Total Pixels", value: formatNumber(resWidth * resHeight) },
            { label: "Diagonal Pixels", value: formatNumber(Math.round(diagPixels)) },
            { label: "Category", value: category },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["screen-resolution-calc", "aspect-ratio-calc", "paper-weight-converter"],
  faq: [
    {
      question: "What is the difference between DPI and PPI?",
      answer:
        "DPI (Dots Per Inch) refers to physical dots printed by a printer. PPI (Pixels Per Inch) refers to pixels displayed on a screen. While often used interchangeably, DPI is technically for print and PPI for digital displays.",
    },
    {
      question: "What DPI should I use for printing photos?",
      answer:
        "300 DPI is the standard for high-quality photo printing. 150 DPI is acceptable for large posters viewed from a distance. 72 DPI is only suitable for screen display. For professional offset printing, 300-600 DPI is recommended.",
    },
    {
      question: "How many megapixels do I need for a large print?",
      answer:
        "For a 300 DPI print: 8x10\" needs 7.2 MP, 11x14\" needs 14 MP, 16x20\" needs 29 MP, 24x36\" needs 62 MP. You can use lower DPI (200-250) for large prints viewed from further away.",
    },
  ],
  formula:
    "PPI = √(W² + H²) / Diagonal | Print Size = Pixels / DPI | Required Pixels = Print Size x DPI",
};
