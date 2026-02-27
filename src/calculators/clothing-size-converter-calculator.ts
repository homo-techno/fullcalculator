import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const clothingSizeConverterCalculator: CalculatorDefinition = {
  slug: "clothing-size-converter-calculator",
  title: "Clothing Size Converter Calculator",
  description: "Free clothing size converter calculator. Convert and calculate clothing size converter values instantly.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["clothing size converter calculator", "converter", "conversion calculator"],
  variants: [
    {
      id: "standard",
      name: "Clothing Size Converter",
      description: "Free clothing size converter calculator. Convert and calculate clothing size con",
      fields: [
        {
          name: "inputValue",
          label: "Input Value",
          type: "number",
          placeholder: "Enter value",
          min: 0,
          step: 0.01,
        },
        {
          name: "unit",
          label: "Unit Type",
          type: "select",
          defaultValue: "1",
          options: [{ label: "Standard", value: "1" }, { label: "Large", value: "1.5" }, { label: "Extra Large", value: "2" }],
        }
      ],
      calculate: (inputs) => {
        const value = inputs.inputValue as number;
        const factor = parseFloat(inputs.unit as string) || 1;
        if (!value && value !== 0) return null;
        const result = value * factor;
        return {
          primary: { label: "Converted Value", value: formatNumber(result) },
          details: [
            { label: "Original value", value: formatNumber(value) },
            { label: "Factor", value: "x" + formatNumber(factor) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["unit-converter", "percentage-calculator"],
  faq: [
    {
      question: "How does clothing size converter conversion work?",
      answer: "Enter your value and select the appropriate options. The calculator instantly shows the converted result.",
    },
    {
      question: "How accurate is this conversion?",
      answer: "This calculator uses standard conversion factors for accurate results.",
    }
  ],
  formula: "Converted = Input x Conversion Factor",
};
