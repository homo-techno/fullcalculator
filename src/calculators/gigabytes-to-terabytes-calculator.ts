import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gigabytesToTerabytesCalculator: CalculatorDefinition = {
  slug: "gigabytes-to-terabytes-calculator",
  title: "Gigabytes to Terabytes Calculator",
  description: "Free gigabytes to terabytes calculator. Convert between GB and TB instantly with precise calculations.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["gigabytes to terabytes calculator", "GB to TB", "converter"],
  variants: [
    {
      id: "forward",
      name: "GB to TB",
      description: "Convert GB to TB",
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
        const result = value * 0.001;
        return {
          primary: { label: "TB", value: formatNumber(result) + " TB" },
          details: [
            { label: "Input", value: formatNumber(value) + " GB" },
            { label: "Conversion factor", value: "1 GB = 0.001 TB" },
          ],
        };
      },
    },
    {
      id: "reverse",
      name: "TB to GB",
      description: "Convert TB to GB",
      fields: [
        {
          name: "value",
          label: "Value in TB",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "TB",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value / 0.001;
        return {
          primary: { label: "GB", value: formatNumber(result) + " GB" },
          details: [
            { label: "Input", value: formatNumber(value) + " TB" },
            { label: "Conversion factor", value: "1 TB = " + formatNumber(1/0.001) + " GB" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["unit-converter", "percentage-calculator"],
  faq: [
    {
      question: "How do I convert GB to TB?",
      answer: "Multiply the GB value by 0.001 to get TB. For example, 10 GB = 0.01 TB.",
    },
    {
      question: "What is the conversion factor?",
      answer: "1 GB equals 0.001 TB.",
    }
  ],
  formula: "TB = GB x 0.001",
};
