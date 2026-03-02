import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const candleMakingWaxCalculator: CalculatorDefinition = {
  slug: "candle-making-wax-calculator",
  title: "Candle Making Wax Calculator",
  description: "Calculate the amount of wax, fragrance oil, and dye needed for candle making based on container volume and wax type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["candle wax calculator","candle making","wax weight","fragrance load"],
  variants: [{
    id: "standard",
    name: "Candle Making Wax",
    description: "Calculate the amount of wax, fragrance oil, and dye needed for candle making based on container volume and wax type.",
    fields: [
      { name: "containerVolume", label: "Container Volume (oz)", type: "number", min: 1, max: 64, defaultValue: 8 },
      { name: "numCandles", label: "Number of Candles", type: "number", min: 1, max: 100, defaultValue: 6 },
      { name: "waxType", label: "Wax Type", type: "select", options: [{ value: "1", label: "Soy Wax" }, { value: "2", label: "Paraffin" }, { value: "3", label: "Coconut Wax" }, { value: "4", label: "Beeswax" }], defaultValue: "1" },
      { name: "fragrancePercent", label: "Fragrance Load (%)", type: "number", min: 0, max: 15, defaultValue: 8 },
    ],
    calculate: (inputs) => {
    const containerVol = inputs.containerVolume as number;
    const numCandles = inputs.numCandles as number;
    const waxType = parseInt(inputs.waxType as string);
    const fragPercent = inputs.fragrancePercent as number;
    const densityFactor = { 1: 0.86, 2: 0.9, 3: 0.84, 4: 0.96 };
    const density = densityFactor[waxType] || 0.86;
    const waxPerCandle = containerVol * density;
    const totalWaxOz = waxPerCandle * numCandles;
    const totalWaxLbs = totalWaxOz / 16;
    const fragranceOz = totalWaxOz * (fragPercent / 100);
    const dyeOz = totalWaxOz * 0.002;
    return {
      primary: { label: "Total Wax Needed", value: formatNumber(Math.round(totalWaxLbs * 100) / 100) + " lbs" },
      details: [
        { label: "Wax Per Candle", value: formatNumber(Math.round(waxPerCandle * 100) / 100) + " oz" },
        { label: "Total Wax (oz)", value: formatNumber(Math.round(totalWaxOz * 10) / 10) + " oz" },
        { label: "Fragrance Oil Needed", value: formatNumber(Math.round(fragranceOz * 100) / 100) + " oz" },
        { label: "Dye Needed", value: formatNumber(Math.round(dyeOz * 100) / 100) + " oz" }
      ]
    };
  },
  }],
  relatedSlugs: ["soap-making-lye-calculator","resin-art-volume-calculator"],
  faq: [
    { question: "How much wax do I need for a candle?", answer: "Multiply your container volume in ounces by the wax density factor. Soy wax weighs about 0.86 oz per fluid oz, so an 8 oz container needs roughly 6.9 oz of wax by weight." },
    { question: "What is a good fragrance load for candles?", answer: "Most waxes handle 6 to 10 percent fragrance load. Soy wax typically maxes out around 10 to 12 percent. Going too high can cause sweating or poor burn quality." },
    { question: "What is the difference between soy and paraffin wax?", answer: "Soy wax is natural and burns cleaner but has a lower scent throw. Paraffin is petroleum-based with stronger scent throw but produces more soot." },
  ],
  formula: "Wax Per Candle (oz) = Container Volume x Wax Density Factor
Total Wax = Wax Per Candle x Number of Candles
Fragrance Oil = Total Wax x (Fragrance Load % / 100)",
};
