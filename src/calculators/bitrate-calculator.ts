import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bitrateCalculator: CalculatorDefinition = {
  slug: "bitrate-calculator",
  title: "Bitrate Calculator",
  description: "Free bitrate calculator. Convert between kbps and MB/min instantly with precise calculations.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["bitrate calculator", "kbps to MB/min", "converter"],
  variants: [
    {
      id: "forward",
      name: "kbps to MB/min",
      description: "Convert kbps to MB/min",
      fields: [
        {
          name: "value",
          label: "Value in kbps",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "kbps",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value * 0.00732;
        return {
          primary: { label: "MB/min", value: formatNumber(result) + " MB/min" },
          details: [
            { label: "Input", value: formatNumber(value) + " kbps" },
            { label: "Conversion factor", value: "1 kbps = 0.00732 MB/min" },
          ],
        };
      },
    },
    {
      id: "reverse",
      name: "MB/min to kbps",
      description: "Convert MB/min to kbps",
      fields: [
        {
          name: "value",
          label: "Value in MB/min",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "MB/min",
          min: 0,
          step: 0.01,
        }
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        if (!value && value !== 0) return null;
        const result = value / 0.00732;
        return {
          primary: { label: "kbps", value: formatNumber(result) + " kbps" },
          details: [
            { label: "Input", value: formatNumber(value) + " MB/min" },
            { label: "Conversion factor", value: "1 MB/min = " + formatNumber(1/0.00732) + " kbps" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["unit-converter", "percentage-calculator"],
  faq: [
    {
      question: "How do I convert kbps to MB/min?",
      answer: "Multiply the kbps value by 0.00732 to get MB/min. For example, 10 kbps = 0.0732 MB/min.",
    },
    {
      question: "What is the conversion factor?",
      answer: "1 kbps equals 0.00732 MB/min.",
    }
  ],
  formula: "MB/min = kbps x 0.00732",
};
