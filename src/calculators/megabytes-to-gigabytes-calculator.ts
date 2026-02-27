import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const megabytesToGigabytesCalculator: CalculatorDefinition = {
  slug: "megabytes-to-gigabytes-calculator",
  title: "Megabytes to Gigabytes Calculator",
  description: "Free megabytes to gigabytes calculator. Convert between MB and GB instantly with precise calculations.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["megabytes to gigabytes calculator", "MB to GB", "converter"],
  variants: [
    {
      id: "forward",
      name: "MB to GB",
      description: "Convert MB to GB",
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
        const result = value * 0.001;
        return {
          primary: { label: "GB", value: formatNumber(result) + " GB" },
          details: [
            { label: "Input", value: formatNumber(value) + " MB" },
            { label: "Conversion factor", value: "1 MB = 0.001 GB" },
          ],
        };
      },
    },
    {
      id: "reverse",
      name: "GB to MB",
      description: "Convert GB to MB",
      fields: [
        {
          name: "value",
          label: "Value in GB",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "GB",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value / 0.001;
        return {
          primary: { label: "MB", value: formatNumber(result) + " MB" },
          details: [
            { label: "Input", value: formatNumber(value) + " GB" },
            { label: "Conversion factor", value: "1 GB = " + formatNumber(1/0.001) + " MB" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["unit-converter", "percentage-calculator"],
  faq: [
    {
      question: "How do I convert MB to GB?",
      answer: "Multiply the MB value by 0.001 to get GB. For example, 10 MB = 0.01 GB.",
    },
    {
      question: "What is the conversion factor?",
      answer: "1 MB equals 0.001 GB.",
    }
  ],
  formula: "GB = MB x 0.001",
};
