import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bicycleGearRatioCalculator: CalculatorDefinition = {
  slug: "bicycle-gear-ratio-calculator",
  title: "Bicycle Gear Ratio Calculator",
  description: "Calculate gear ratios, development, and speed for any chainring and cassette combination.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bicycle gear ratio","bike gearing","chainring cassette","gear inches"],
  variants: [{
    id: "standard",
    name: "Bicycle Gear Ratio",
    description: "Calculate gear ratios, development, and speed for any chainring and cassette combination.",
    fields: [
      { name: "chainring", label: "Chainring Teeth", type: "number", min: 20, max: 60, defaultValue: 50 },
      { name: "cog", label: "Rear Cog Teeth", type: "number", min: 10, max: 42, defaultValue: 17 },
      { name: "wheelSize", label: "Wheel Size", type: "select", options: [{ value: "2100", label: "700c (2100mm)" }, { value: "2070", label: "650b (2070mm)" }, { value: "2030", label: "26 inch (2030mm)" }, { value: "2290", label: "29 inch (2290mm)" }], defaultValue: "2100" },
      { name: "cadence", label: "Pedaling Cadence (RPM)", type: "number", min: 50, max: 130, defaultValue: 85 },
    ],
    calculate: (inputs) => {
    const chainring = inputs.chainring as number;
    const cog = inputs.cog as number;
    const wheelSize = parseInt(inputs.wheelSize as string);
    const cadence = inputs.cadence as number;
    const gearRatio = chainring / cog;
    const development = gearRatio * (wheelSize / 1000) * Math.PI;
    const speedKmh = development * cadence * 60 / 1000;
    const speedMph = speedKmh * 0.621371;
    const gearInches = gearRatio * (wheelSize / 25.4 / Math.PI) * Math.PI;
    return {
      primary: { label: "Gear Ratio", value: formatNumber(Math.round(gearRatio * 100) / 100) },
      details: [
        { label: "Development", value: formatNumber(Math.round(development * 100) / 100) + " m per pedal rev" },
        { label: "Speed at Cadence", value: formatNumber(Math.round(speedMph * 10) / 10) + " mph" },
        { label: "Gear Inches", value: formatNumber(Math.round(gearInches * 10) / 10) }
      ]
    };
  },
  }],
  relatedSlugs: ["tennis-racket-string-tension-calculator","swim-pace-calculator"],
  faq: [
    { question: "What is a good gear ratio for cycling?", answer: "It depends on terrain. A ratio of 2.5 to 3.0 is common for flat riding, while 1.0 to 1.5 is typical for climbing steep hills." },
    { question: "What are gear inches?", answer: "Gear inches represent the effective diameter of the wheel as if it were a penny-farthing. Higher gear inches mean a harder gear." },
    { question: "What cadence should I ride at?", answer: "Most efficient cycling occurs between 80 and 100 RPM. Beginners often pedal at 60 to 80 RPM." },
  ],
  formula: "Gear Ratio = Chainring Teeth / Cog Teeth; Development = Ratio x Wheel Circumference",
};
