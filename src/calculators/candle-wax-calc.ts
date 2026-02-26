import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const candleWaxCalcCalculator: CalculatorDefinition = {
  slug: "candle-wax-calculator",
  title: "Candle Wax Calculator",
  description: "Free online candle wax calculator. Calculate wax volume and weight needed for candle making based on container size and wax type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["candle wax calculator", "candle making calculator", "wax weight calculator", "candle volume calculator", "how much wax for candle"],
  variants: [
    {
      id: "cylinder",
      name: "Cylindrical Container",
      description: "Calculate wax needed for a cylindrical candle container",
      fields: [
        { name: "diameter", label: "Container Diameter (inches)", type: "number", placeholder: "e.g. 3" },
        { name: "height", label: "Fill Height (inches)", type: "number", placeholder: "e.g. 4" },
        { name: "waxType", label: "Wax Type", type: "select", options: [
          { label: "Soy Wax (0.86 oz/in³)", value: "0.86" },
          { label: "Paraffin Wax (0.90 oz/in³)", value: "0.90" },
          { label: "Beeswax (0.96 oz/in³)", value: "0.96" },
          { label: "Coconut Wax (0.84 oz/in³)", value: "0.84" },
        ], defaultValue: "0.86" },
        { name: "numCandles", label: "Number of Candles", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "fragranceLoad", label: "Fragrance Load (%)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
      ],
      calculate: (inputs) => {
        const diameter = parseFloat(inputs.diameter as string) || 0;
        const height = parseFloat(inputs.height as string) || 0;
        const waxDensity = parseFloat(inputs.waxType as string) || 0.86;
        const numCandles = parseFloat(inputs.numCandles as string) || 1;
        const fragranceLoad = parseFloat(inputs.fragranceLoad as string) || 8;
        if (!diameter || !height) return null;

        const radius = diameter / 2;
        const volumePerCandle = Math.PI * radius * radius * height;
        const totalVolume = volumePerCandle * numCandles;
        const waxWeightOz = totalVolume * waxDensity;
        const fragranceOz = waxWeightOz * (fragranceLoad / 100);
        const totalWeightOz = waxWeightOz + fragranceOz;
        const totalWeightLbs = totalWeightOz / 16;

        return {
          primary: { label: "Total Wax Needed", value: `${formatNumber(waxWeightOz, 1)} oz` },
          details: [
            { label: "Volume per candle", value: `${formatNumber(volumePerCandle, 1)} in³` },
            { label: "Total volume", value: `${formatNumber(totalVolume, 1)} in³` },
            { label: "Wax weight", value: `${formatNumber(waxWeightOz, 1)} oz (${formatNumber(totalWeightLbs, 2)} lbs)` },
            { label: "Fragrance oil needed", value: `${formatNumber(fragranceOz, 1)} oz (${fragranceLoad}% load)` },
            { label: "Total weight (wax + fragrance)", value: `${formatNumber(totalWeightOz, 1)} oz` },
            { label: "Number of candles", value: formatNumber(numCandles, 0) },
          ],
          note: "Wax weight estimates are approximate. Allow 10% extra for waste and testing.",
        };
      },
    },
    {
      id: "rectangular",
      name: "Rectangular Container",
      description: "Calculate wax needed for a rectangular candle mold or container",
      fields: [
        { name: "length", label: "Length (inches)", type: "number", placeholder: "e.g. 4" },
        { name: "width", label: "Width (inches)", type: "number", placeholder: "e.g. 3" },
        { name: "height", label: "Fill Height (inches)", type: "number", placeholder: "e.g. 3" },
        { name: "waxType", label: "Wax Type", type: "select", options: [
          { label: "Soy Wax (0.86 oz/in³)", value: "0.86" },
          { label: "Paraffin Wax (0.90 oz/in³)", value: "0.90" },
          { label: "Beeswax (0.96 oz/in³)", value: "0.96" },
          { label: "Coconut Wax (0.84 oz/in³)", value: "0.84" },
        ], defaultValue: "0.86" },
        { name: "numCandles", label: "Number of Candles", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string) || 0;
        const width = parseFloat(inputs.width as string) || 0;
        const height = parseFloat(inputs.height as string) || 0;
        const waxDensity = parseFloat(inputs.waxType as string) || 0.86;
        const numCandles = parseFloat(inputs.numCandles as string) || 1;
        if (!length || !width || !height) return null;

        const volumePerCandle = length * width * height;
        const totalVolume = volumePerCandle * numCandles;
        const waxWeightOz = totalVolume * waxDensity;
        const waxWeightLbs = waxWeightOz / 16;

        return {
          primary: { label: "Total Wax Needed", value: `${formatNumber(waxWeightOz, 1)} oz` },
          details: [
            { label: "Volume per candle", value: `${formatNumber(volumePerCandle, 1)} in³` },
            { label: "Total volume", value: `${formatNumber(totalVolume, 1)} in³` },
            { label: "Weight in pounds", value: `${formatNumber(waxWeightLbs, 2)} lbs` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["volume-calculator", "unit-converter"],
  faq: [
    { question: "How much wax do I need per candle?", answer: "It depends on container size and wax type. For a standard 8 oz candle jar (about 3\" diameter × 3.5\" tall), you need approximately 6-7 oz of wax. This calculator helps determine the exact amount." },
    { question: "What is fragrance load?", answer: "Fragrance load is the percentage of fragrance oil added to the wax by weight. Most waxes support 6-12% fragrance load. Soy wax typically works best at 6-10%, while paraffin can handle up to 12%." },
    { question: "Why do I need extra wax?", answer: "Always prepare 10-15% more wax than calculated. This accounts for wax left in the melting pot, testing pours, and slight measurement variations." },
  ],
  formula: "Wax Weight (oz) = Container Volume (in³) × Wax Density (oz/in³)",
};
