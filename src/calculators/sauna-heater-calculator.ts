import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const saunaHeaterCalculator: CalculatorDefinition = {
  slug: "sauna-heater-calculator",
  title: "Sauna Heater Calculator",
  description: "Calculate the heater kW needed for your sauna room.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["sauna","heater","kW","room"],
  variants: [{
    id: "standard",
    name: "Sauna Heater",
    description: "Calculate the heater kW needed for your sauna room.",
    fields: [
      { name: "length", label: "Room Length (ft)", type: "number", min: 3, max: 20, defaultValue: 7 },
      { name: "width", label: "Room Width (ft)", type: "number", min: 3, max: 20, defaultValue: 6 },
      { name: "height", label: "Ceiling Height (ft)", type: "number", min: 6, max: 10, defaultValue: 7 },
      { name: "insulation", label: "Insulation Quality", type: "select", options: [{ value: "1", label: "Good" }, { value: "2", label: "Average" }, { value: "3", label: "Poor" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const insulation = inputs.insulation as number;
    const volumeCuFt = length * width * height;
    const volumeCuM = volumeCuFt * 0.0283168;
    let kw = volumeCuM * 1.0;
    if (insulation === 2) kw = volumeCuM * 1.3;
    if (insulation === 3) kw = volumeCuM * 1.6;
    return {
      primary: { label: "Heater Size Needed", value: formatNumber(kw) + " kW" },
      details: [
        { label: "Room Volume", value: formatNumber(volumeCuFt) + " cu ft" },
        { label: "Volume in Cubic Meters", value: formatNumber(volumeCuM) + " cu m" }
      ]
    };
  },
  }],
  relatedSlugs: ["steam-room-generator-calculator","home-gym-space-calculator"],
  faq: [
    { question: "How many kW per cubic meter for a sauna?", answer: "Use about 1 kW per cubic meter for a well insulated sauna." },
    { question: "What temperature should a sauna be?", answer: "A traditional sauna should be between 150 and 195 degrees F." },
  ],
  formula: "kW = Volume in Cubic Meters x Insulation Factor (1.0 to 1.6)",
};
