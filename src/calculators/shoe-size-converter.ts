import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shoeSizeConverterCalculator: CalculatorDefinition = {
  slug: "shoe-size-converter",
  title: "Shoe Size Converter",
  description: "Free online shoe size converter. Convert between US, UK, EU, and CM shoe sizes for men, women, and children.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["shoe size converter", "US to EU shoe size", "UK to US shoe size", "shoe size chart", "shoe size calculator"],
  variants: [
    {
      id: "shoe-us-to-all",
      name: "US Size to Other Systems",
      fields: [
        { name: "usSize", label: "US Shoe Size", type: "number", placeholder: "e.g. 10", step: 0.5 },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
            { label: "Children", value: "children" },
          ],
        },
      ],
      calculate: (inputs) => {
        const usSize = parseFloat(inputs.usSize as string) || 0;
        const gender = inputs.gender as string;

        let euSize: number;
        let ukSize: number;
        let cm: number;

        if (gender === "men") {
          euSize = usSize + 33;
          ukSize = usSize - 0.5;
          cm = (usSize + 18) * 0.847;
        } else if (gender === "women") {
          euSize = usSize + 31;
          ukSize = usSize - 2;
          cm = (usSize + 17) * 0.847;
        } else {
          // children
          euSize = usSize + 16.5;
          ukSize = usSize - 0.5;
          cm = (usSize + 11.67) * 0.847;
        }

        return {
          primary: { label: "EU Size", value: formatNumber(euSize) },
          details: [
            { label: "US Size", value: formatNumber(usSize) },
            { label: "UK Size", value: formatNumber(ukSize) },
            { label: "CM (foot length)", value: formatNumber(cm) },
            { label: "Category", value: gender.charAt(0).toUpperCase() + gender.slice(1) },
          ],
        };
      },
    },
    {
      id: "shoe-eu-to-all",
      name: "EU Size to Other Systems",
      fields: [
        { name: "euSize", label: "EU Shoe Size", type: "number", placeholder: "e.g. 43", step: 0.5 },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
            { label: "Children", value: "children" },
          ],
        },
      ],
      calculate: (inputs) => {
        const euSize = parseFloat(inputs.euSize as string) || 0;
        const gender = inputs.gender as string;

        let usSize: number;
        let ukSize: number;
        let cm: number;

        if (gender === "men") {
          usSize = euSize - 33;
          ukSize = usSize - 0.5;
          cm = euSize / 1.5 * 0.667 + 2;
        } else if (gender === "women") {
          usSize = euSize - 31;
          ukSize = usSize - 2;
          cm = euSize / 1.5 * 0.667 + 1.5;
        } else {
          usSize = euSize - 16.5;
          ukSize = usSize - 0.5;
          cm = euSize / 1.5 * 0.667;
        }

        return {
          primary: { label: "US Size", value: formatNumber(usSize) },
          details: [
            { label: "EU Size", value: formatNumber(euSize) },
            { label: "UK Size", value: formatNumber(ukSize) },
            { label: "CM (foot length)", value: formatNumber(cm) },
            { label: "Category", value: gender.charAt(0).toUpperCase() + gender.slice(1) },
          ],
        };
      },
    },
    {
      id: "shoe-cm-to-all",
      name: "CM (Foot Length) to Sizes",
      fields: [
        { name: "cm", label: "Foot Length (cm)", type: "number", placeholder: "e.g. 27", step: 0.5 },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
          ],
        },
      ],
      calculate: (inputs) => {
        const cm = parseFloat(inputs.cm as string) || 0;
        const gender = inputs.gender as string;

        let usSize: number;
        let euSize: number;
        let ukSize: number;

        if (gender === "men") {
          usSize = cm / 0.847 - 18;
          euSize = usSize + 33;
          ukSize = usSize - 0.5;
        } else {
          usSize = cm / 0.847 - 17;
          euSize = usSize + 31;
          ukSize = usSize - 2;
        }

        return {
          primary: { label: "US Size", value: formatNumber(usSize) },
          details: [
            { label: "EU Size", value: formatNumber(euSize) },
            { label: "UK Size", value: formatNumber(ukSize) },
            { label: "Foot Length", value: `${formatNumber(cm)} cm` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["clothing-size-convert"],
  faq: [
    {
      question: "How do I convert US shoe size to EU?",
      answer: "For men, add 33 to the US size (US 10 = EU 43). For women, add 31 to the US size (US 8 = EU 39). These are approximate conversions and may vary slightly by brand.",
    },
    {
      question: "What is my shoe size in CM?",
      answer: "Measure your foot length from heel to longest toe in centimeters. A US men's size 10 is approximately 28 cm, and a US women's size 8 is approximately 25 cm.",
    },
    {
      question: "Is UK shoe size the same as US?",
      answer: "No. UK men's sizes are typically 0.5 sizes smaller than US (US 10 = UK 9.5). UK women's sizes are typically 2 sizes smaller than US (US 8 = UK 6).",
    },
  ],
  formula: "EU = US + 33 (men) or US + 31 (women); UK = US - 0.5 (men) or US - 2 (women)",
};
