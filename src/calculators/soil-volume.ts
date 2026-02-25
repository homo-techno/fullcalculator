import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soilVolumeCalculator: CalculatorDefinition = {
  slug: "soil-volume-calculator",
  title: "Soil Volume Calculator",
  description: "Free soil volume calculator for raised beds. Calculate how much soil, potting mix, or compost you need in cubic feet, cubic yards, and bags.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["soil volume calculator", "raised bed soil calculator", "how much soil for raised bed", "garden soil calculator", "potting soil calculator"],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Raised Bed",
      description: "Calculate soil volume for a rectangular raised bed",
      fields: [
        { name: "length", label: "Bed Length (feet)", type: "number", placeholder: "e.g. 8" },
        { name: "width", label: "Bed Width (feet)", type: "number", placeholder: "e.g. 4" },
        { name: "depth", label: "Bed Depth (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "soilMix", label: "Soil Mix", type: "select", options: [
          { label: "Topsoil only", value: "topsoil" },
          { label: "60/40 topsoil/compost (recommended)", value: "mixed" },
          { label: "Mel's Mix (1/3 each: compost, peat, vermiculite)", value: "mels" },
        ], defaultValue: "mixed" },
        { name: "pricePerYard", label: "Price per Cu Yd (optional)", type: "number", placeholder: "e.g. 40", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = (inputs.depth as number) || 12;
        const mix = inputs.soilMix as string;
        const price = inputs.pricePerYard as number;
        if (!length || !width) return null;

        const cubicFeet = length * width * (depth / 12);
        const cubicYards = cubicFeet / 27;
        const bags1cuft = Math.ceil(cubicFeet);
        const bags2cuft = Math.ceil(cubicFeet / 2);

        const details = [
          { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
          { label: "Cubic yards", value: formatNumber(cubicYards, 2) },
          { label: "1 cu ft bags needed", value: `${bags1cuft}` },
          { label: "2 cu ft bags needed", value: `${bags2cuft}` },
        ];

        if (mix === "mixed") {
          details.push({ label: "Topsoil needed (60%)", value: `${formatNumber(cubicFeet * 0.6, 1)} cu ft` });
          details.push({ label: "Compost needed (40%)", value: `${formatNumber(cubicFeet * 0.4, 1)} cu ft` });
        } else if (mix === "mels") {
          const third = cubicFeet / 3;
          details.push({ label: "Compost (1/3)", value: `${formatNumber(third, 1)} cu ft` });
          details.push({ label: "Peat moss (1/3)", value: `${formatNumber(third, 1)} cu ft` });
          details.push({ label: "Vermiculite (1/3)", value: `${formatNumber(third, 1)} cu ft` });
        }

        if (price) {
          details.push({ label: "Estimated cost (bulk)", value: `$${formatNumber(cubicYards * price)}` });
        }

        return {
          primary: { label: "Soil Needed", value: `${formatNumber(cubicYards, 2)} cu yd` },
          details,
          note: "Soil will settle 10-20% over the first season. Consider filling beds slightly higher than needed.",
        };
      },
    },
    {
      id: "circular",
      name: "Circular / Round Bed",
      description: "Calculate soil volume for a round raised bed",
      fields: [
        { name: "diameter", label: "Bed Diameter (feet)", type: "number", placeholder: "e.g. 6" },
        { name: "depth", label: "Bed Depth (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "pricePerYard", label: "Price per Cu Yd (optional)", type: "number", placeholder: "e.g. 40", prefix: "$" },
      ],
      calculate: (inputs) => {
        const diameter = inputs.diameter as number;
        const depth = (inputs.depth as number) || 12;
        const price = inputs.pricePerYard as number;
        if (!diameter) return null;

        const radius = diameter / 2;
        const cubicFeet = Math.PI * radius * radius * (depth / 12);
        const cubicYards = cubicFeet / 27;

        const details = [
          { label: "Cubic feet", value: formatNumber(cubicFeet, 1) },
          { label: "Cubic yards", value: formatNumber(cubicYards, 2) },
          { label: "2 cu ft bags needed", value: `${Math.ceil(cubicFeet / 2)}` },
          { label: "Bed area", value: `${formatNumber(Math.PI * radius * radius, 1)} sq ft` },
        ];
        if (price) {
          details.push({ label: "Estimated cost", value: `$${formatNumber(cubicYards * price)}` });
        }

        return {
          primary: { label: "Soil Needed", value: `${formatNumber(cubicYards, 2)} cu yd` },
          details,
          note: "Round beds work great for herb spirals and focal point plantings.",
        };
      },
    },
  ],
  relatedSlugs: ["gravel-calculator", "concrete-calculator", "vegetable-garden-size-calculator"],
  faq: [
    { question: "How much soil do I need for a 4x8 raised bed?", answer: "A 4\u00D78 ft bed at 12 inches deep needs about 32 cu ft (1.2 cu yd) of soil. At 6 inches deep, you need about 16 cu ft (0.6 cu yd). Bulk delivery is cheapest for large orders." },
    { question: "What is the best soil mix for raised beds?", answer: "A 60/40 mix of topsoil and compost works well for most vegetables. Mel's Mix (equal parts compost, peat moss, and vermiculite) is popular for square foot gardening but more expensive." },
  ],
  formula: "Volume (cu yd) = L \u00D7 W \u00D7 (Depth/12) / 27 | Round: \u03C0 \u00D7 r\u00B2 \u00D7 (Depth/12) / 27",
};
