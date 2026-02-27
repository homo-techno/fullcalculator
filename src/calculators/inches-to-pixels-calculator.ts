import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const inchesToPixelsCalculator: CalculatorDefinition = {
  slug: "inches-to-pixels-calculator",
  title: "Inches to Pixels Calculator",
  description: "Free inches to pixels calculator. Convert between inches and px instantly with precise calculations.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["inches to pixels calculator", "inches to px", "converter"],
  variants: [
    {
      id: "forward",
      name: "inches to px",
      description: "Convert inches to px",
      fields: [
        {
          name: "value",
          label: "Value in inches",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "inches",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value * 96;
        return {
          primary: { label: "px", value: formatNumber(result) + " px" },
          details: [
            { label: "Input", value: formatNumber(value) + " inches" },
            { label: "Conversion factor", value: "1 inches = 96 px" },
          ],
        };
      },
    },
    {
      id: "reverse",
      name: "px to inches",
      description: "Convert px to inches",
      fields: [
        {
          name: "value",
          label: "Value in px",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "px",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value / 96;
        return {
          primary: { label: "inches", value: formatNumber(result) + " inches" },
          details: [
            { label: "Input", value: formatNumber(value) + " px" },
            { label: "Conversion factor", value: "1 px = " + formatNumber(1/96) + " inches" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["unit-converter", "percentage-calculator"],
  faq: [
    {
      question: "How do I convert inches to px?",
      answer: "Multiply the inches value by 96 to get px. For example, 10 inches = 960 px.",
    },
    {
      question: "What is the conversion factor?",
      answer: "1 inches equals 96 px.",
    }
  ],
  formula: "px = inches x 96",
};
