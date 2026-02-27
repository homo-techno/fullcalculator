import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pixelsToInchesCalculator: CalculatorDefinition = {
  slug: "pixels-to-inches-calculator",
  title: "Pixels to Inches Calculator",
  description: "Free pixels to inches calculator. Convert between px and inches instantly with precise calculations.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["pixels to inches calculator", "px to inches", "converter"],
  variants: [
    {
      id: "forward",
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
        const result = value * 0.010417;
        return {
          primary: { label: "inches", value: formatNumber(result) + " inches" },
          details: [
            { label: "Input", value: formatNumber(value) + " px" },
            { label: "Conversion factor", value: "1 px = 0.010417 inches" },
          ],
        };
      },
    },
    {
      id: "reverse",
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
        const result = value / 0.010417;
        return {
          primary: { label: "px", value: formatNumber(result) + " px" },
          details: [
            { label: "Input", value: formatNumber(value) + " inches" },
            { label: "Conversion factor", value: "1 inches = " + formatNumber(1/0.010417) + " px" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["unit-converter", "percentage-calculator"],
  faq: [
    {
      question: "How do I convert px to inches?",
      answer: "Multiply the px value by 0.010417 to get inches. For example, 10 px = 0.10416999999999998 inches.",
    },
    {
      question: "What is the conversion factor?",
      answer: "1 px equals 0.010417 inches.",
    }
  ],
  formula: "inches = px x 0.010417",
};
