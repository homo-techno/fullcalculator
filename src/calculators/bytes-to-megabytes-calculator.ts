import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bytesToMegabytesCalculator: CalculatorDefinition = {
  slug: "bytes-to-megabytes-calculator",
  title: "Bytes to Megabytes Calculator",
  description: "Free bytes to megabytes calculator. Convert between Bytes and MB instantly with precise calculations.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["bytes to megabytes calculator", "Bytes to MB", "converter"],
  variants: [
    {
      id: "forward",
      name: "Bytes to MB",
      description: "Convert Bytes to MB",
      fields: [
        {
          name: "value",
          label: "Value in Bytes",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "Bytes",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value * 0.000001;
        return {
          primary: { label: "MB", value: formatNumber(result) + " MB" },
          details: [
            { label: "Input", value: formatNumber(value) + " Bytes" },
            { label: "Conversion factor", value: "1 Bytes = 0.000001 MB" },
          ],
        };
      },
    },
    {
      id: "reverse",
      name: "MB to Bytes",
      description: "Convert MB to Bytes",
      fields: [
        {
          name: "value",
          label: "Value in MB",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "MB",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value / 0.000001;
        return {
          primary: { label: "Bytes", value: formatNumber(result) + " Bytes" },
          details: [
            { label: "Input", value: formatNumber(value) + " MB" },
            { label: "Conversion factor", value: "1 MB = " + formatNumber(1/0.000001) + " Bytes" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["unit-converter", "percentage-calculator"],
  faq: [
    {
      question: "How do I convert Bytes to MB?",
      answer: "Multiply the Bytes value by 0.000001 to get MB. For example, 10 Bytes = 0.000009999999999999999 MB.",
    },
    {
      question: "What is the conversion factor?",
      answer: "1 Bytes equals 0.000001 MB.",
    }
  ],
  formula: "MB = Bytes x 0.000001",
};
