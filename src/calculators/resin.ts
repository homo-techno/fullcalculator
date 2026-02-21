import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const resinCalculator: CalculatorDefinition = {
  slug: "resin-calculator",
  title: "Resin Calculator",
  description: "Free resin calculator. Calculate how many gallons or ounces of epoxy resin you need for casting, coating, and art projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["resin calculator", "epoxy resin calculator", "how much resin do I need", "resin casting calculator", "resin pour calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Resin Needed",
      description: "Calculate resin volume for your project",
      fields: [
        { name: "length", label: "Length (inches)", type: "number", placeholder: "e.g. 24" },
        { name: "width", label: "Width (inches)", type: "number", placeholder: "e.g. 12" },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 0.125", step: 0.0625 },
        { name: "mixRatio", label: "Mix Ratio", type: "select", options: [
          { label: "1:1 (resin to hardener)", value: "1:1" },
          { label: "2:1 (resin to hardener)", value: "2:1" },
        ], defaultValue: "1:1" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const depth = inputs.depth as number;
        const mixRatio = inputs.mixRatio as string;
        if (!length || !width || !depth) return null;

        const cubicInches = length * width * depth;
        const gallons = cubicInches / 231;
        const ounces = gallons * 128;
        const liters = gallons * 3.785;
        const ml = liters * 1000;

        let resinPart: number, hardenerPart: number;
        if (mixRatio === "2:1") {
          resinPart = ounces * (2 / 3);
          hardenerPart = ounces * (1 / 3);
        } else {
          resinPart = ounces / 2;
          hardenerPart = ounces / 2;
        }

        // Add 10% for waste
        const totalWithWaste = ounces * 1.10;

        return {
          primary: { label: "Total Resin Needed", value: `${formatNumber(totalWithWaste, 1)} fl oz` },
          details: [
            { label: "Volume (cubic inches)", value: formatNumber(cubicInches, 2) },
            { label: "Total mixed resin", value: `${formatNumber(ounces, 1)} fl oz` },
            { label: "With 10% waste", value: `${formatNumber(totalWithWaste, 1)} fl oz` },
            { label: "Gallons", value: formatNumber(gallons, 3) },
            { label: "Milliliters", value: `${formatNumber(ml, 0)} mL` },
            { label: `Resin part (${mixRatio})`, value: `${formatNumber(resinPart, 1)} fl oz` },
            { label: `Hardener part (${mixRatio})`, value: `${formatNumber(hardenerPart, 1)} fl oz` },
            { label: "Dimensions", value: `${length}" x ${width}" x ${depth}"` },
          ],
          note: "Includes 10% extra for waste, mixing cup residue, and surface tension. For river tables and deep pours, pour in layers of 1/4 inch or less to prevent overheating.",
        };
      },
    },
  ],
  relatedSlugs: ["epoxy-calculator", "volume-calculator", "unit-converter"],
  faq: [
    { question: "How do I calculate how much resin I need?", answer: "Multiply length x width x depth in inches to get cubic inches. Divide by 231 to get gallons, or multiply gallons by 128 for fluid ounces. Add 10% for waste." },
    { question: "What is the difference between 1:1 and 2:1 resin?", answer: "A 1:1 mix ratio means equal parts resin and hardener by volume. A 2:1 ratio means 2 parts resin to 1 part hardener. Always follow the manufacturer's recommended ratio for proper curing." },
    { question: "How thick can I pour resin at once?", answer: "Most table-top epoxy resins can be poured up to 1/8 inch (3mm) per layer. Deep pour casting resins can handle 1-2 inches per pour. Pouring too thick causes excessive heat and can crack or yellow." },
  ],
  formula: "Volume = L x W x D (in cubic inches) | Gallons = Volume / 231 | Ounces = Gallons x 128",
};
