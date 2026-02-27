import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dpiToPpiCalculator: CalculatorDefinition = {
  slug: "dpi-to-ppi-calculator",
  title: "DPI to PPI Calculator",
  description: "Free dpi to ppi calculator. Convert between DPI and PPI instantly with precise calculations.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["dpi to ppi calculator", "DPI to PPI", "converter"],
  variants: [
    {
      id: "forward",
      name: "DPI to PPI",
      description: "Convert DPI to PPI",
      fields: [
        {
          name: "value",
          label: "Value in DPI",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "DPI",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value * 1;
        return {
          primary: { label: "PPI", value: formatNumber(result) + " PPI" },
          details: [
            { label: "Input", value: formatNumber(value) + " DPI" },
            { label: "Conversion factor", value: "1 DPI = 1 PPI" },
          ],
        };
      },
    },
    {
      id: "reverse",
      name: "PPI to DPI",
      description: "Convert PPI to DPI",
      fields: [
        {
          name: "value",
          label: "Value in PPI",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "PPI",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value / 1;
        return {
          primary: { label: "DPI", value: formatNumber(result) + " DPI" },
          details: [
            { label: "Input", value: formatNumber(value) + " PPI" },
            { label: "Conversion factor", value: "1 PPI = " + formatNumber(1/1) + " DPI" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["unit-converter", "percentage-calculator"],
  faq: [
    {
      question: "How do I convert DPI to PPI?",
      answer: "Multiply the DPI value by 1 to get PPI. For example, 10 DPI = 10 PPI.",
    },
    {
      question: "What is the conversion factor?",
      answer: "1 DPI equals 1 PPI.",
    }
  ],
  formula: "PPI = DPI x 1",
};
