import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const resinArtVolumeCalculator: CalculatorDefinition = {
  slug: "resin-art-volume-calculator",
  title: "Resin Art Volume Calculator",
  description: "Calculate the amount of epoxy resin and hardener needed for art projects based on mold dimensions and resin type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["resin volume","epoxy calculator","resin art","casting resin amount"],
  variants: [{
    id: "standard",
    name: "Resin Art Volume",
    description: "Calculate the amount of epoxy resin and hardener needed for art projects based on mold dimensions and resin type.",
    fields: [
      { name: "shape", label: "Mold Shape", type: "select", options: [{ value: "1", label: "Rectangle" }, { value: "2", label: "Circle" }, { value: "3", label: "Irregular (approx)" }], defaultValue: "1" },
      { name: "length", label: "Length/Diameter (inches)", type: "number", min: 1, max: 60, defaultValue: 12 },
      { name: "width", label: "Width (inches, for rectangle)", type: "number", min: 1, max: 60, defaultValue: 8 },
      { name: "depth", label: "Depth (inches)", type: "number", min: 0.1, max: 6, defaultValue: 0.5 },
      { name: "mixRatio", label: "Resin Mix Ratio", type: "select", options: [{ value: "1", label: "1:1 by Volume" }, { value: "2", label: "2:1 by Volume" }, { value: "3", label: "3:1 by Volume" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const shape = parseInt(inputs.shape as string);
    const length = inputs.length as number;
    const width = inputs.width as number;
    const depth = inputs.depth as number;
    const mixRatio = parseInt(inputs.mixRatio as string);
    let volumeCuIn = 0;
    if (shape === 1) {
      volumeCuIn = length * width * depth;
    } else if (shape === 2) {
      volumeCuIn = Math.PI * Math.pow(length / 2, 2) * depth;
    } else {
      volumeCuIn = length * width * depth * 0.75;
    }
    const volumeFlOz = volumeCuIn * 0.554;
    const extraFactor = 1.1;
    const totalFlOz = volumeFlOz * extraFactor;
    const ratioTotal = mixRatio === 1 ? 2 : mixRatio === 2 ? 3 : 4;
    const resinPart = totalFlOz * (mixRatio === 1 ? 1 : mixRatio) / ratioTotal;
    const hardenerPart = totalFlOz / ratioTotal;
    return {
      primary: { label: "Total Mixed Resin", value: formatNumber(Math.round(totalFlOz * 10) / 10) + " fl oz" },
      details: [
        { label: "Resin Part", value: formatNumber(Math.round(resinPart * 10) / 10) + " fl oz" },
        { label: "Hardener Part", value: formatNumber(Math.round(hardenerPart * 10) / 10) + " fl oz" },
        { label: "Mold Volume", value: formatNumber(Math.round(volumeCuIn * 10) / 10) + " cu in" },
        { label: "Includes 10% Extra", value: "Yes" }
      ]
    };
  },
  }],
  relatedSlugs: ["candle-making-wax-calculator","soap-making-lye-calculator"],
  faq: [
    { question: "How do I measure resin for a project?", answer: "Calculate the volume of your mold in cubic inches, convert to fluid ounces, then add 10 percent extra for mixing losses and surface tension." },
    { question: "What is the difference between 1:1 and 2:1 resin?", answer: "A 1:1 ratio means equal parts resin and hardener. A 2:1 ratio means twice as much resin as hardener. The ratio is set by the manufacturer and must be followed exactly." },
    { question: "Can I pour thick layers of resin?", answer: "Most table-top resins should be poured in layers of one quarter inch or less. Deep pour resins can handle 1 to 2 inches at a time. Pouring too thick causes excessive heat and cracking." },
  ],
  formula: "Volume (cu in) = Length x Width x Depth (rectangle) or Pi x r^2 x Depth (circle); Volume (fl oz) = Volume (cu in) x 0.554; Total = Volume (fl oz) x 1.10 (10% extra)",
};
