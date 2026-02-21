import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gutterCalculator: CalculatorDefinition = {
  slug: "gutter-calculator",
  title: "Gutter Calculator",
  description:
    "Free gutter calculator. Estimate gutter length, downspouts, and sections needed for your roof.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gutter", "downspout", "rain", "drainage", "roof edge"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "edgeLength",
          label: "Roof Edge Length (feet)",
          type: "number",
          placeholder: "e.g. 80",
        },
        {
          name: "roofArea",
          label: "Roof Area (sq ft)",
          type: "number",
          placeholder: "e.g. 1500",
        },
      ],
      calculate: (inputs) => {
        const edgeLength = inputs.edgeLength as number;
        const roofArea = inputs.roofArea as number;
        if (!edgeLength || !roofArea) return null;

        const gutterLength = edgeLength;
        const sectionLength = 10; // standard 10 ft gutter sections
        const sections = Math.ceil(gutterLength / sectionLength);
        const downspouts = Math.max(2, Math.ceil(edgeLength / 25));
        const elbows = downspouts * 3; // typically 3 elbows per downspout

        return {
          primary: {
            label: "Total Gutter Length",
            value: formatNumber(gutterLength, 0) + " ft",
          },
          details: [
            { label: "10-ft Sections Needed", value: String(sections) },
            { label: "Downspouts Needed (1 per ~25 ft)", value: String(downspouts) },
            { label: "Elbows (~3 per downspout)", value: String(elbows) },
            { label: "Roof Area Served", value: formatNumber(roofArea, 0) + " sq ft" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roofing-calculator", "square-footage-calculator"],
  faq: [
    {
      question: "How many downspouts do I need?",
      answer:
        "A general rule is one downspout for every 20-30 linear feet of gutter, with a minimum of two.",
    },
    {
      question: "What size gutters should I use?",
      answer:
        "5-inch K-style gutters are the most common for residential homes. Larger roofs may need 6-inch gutters.",
    },
  ],
  formula:
    "Gutter Length = Roof Edge Length. Sections = Length ÷ 10. Downspouts = Length ÷ 25 (min 2).",
};
