import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const steamRoomGeneratorCalculator: CalculatorDefinition = {
  slug: "steam-room-generator-calculator",
  title: "Steam Room Generator Calculator",
  description: "Calculate steam generator size for your steam room.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["steam","room","generator","spa"],
  variants: [{
    id: "standard",
    name: "Steam Room Generator",
    description: "Calculate steam generator size for your steam room.",
    fields: [
      { name: "length", label: "Room Length (ft)", type: "number", min: 3, max: 20, defaultValue: 6 },
      { name: "width", label: "Room Width (ft)", type: "number", min: 3, max: 20, defaultValue: 5 },
      { name: "height", label: "Ceiling Height (ft)", type: "number", min: 6, max: 10, defaultValue: 8 },
      { name: "wallType", label: "Wall Material", type: "select", options: [{ value: "1", label: "Tile / Stone" }, { value: "2", label: "Acrylic" }, { value: "3", label: "Natural Stone" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const length = inputs.length as number;
    const width = inputs.width as number;
    const height = inputs.height as number;
    const wallType = inputs.wallType as number;
    const volumeCuFt = length * width * height;
    let factor = 1.0;
    if (wallType === 2) factor = 0.8;
    if (wallType === 3) factor = 1.5;
    const adjustedVolume = volumeCuFt * factor;
    const kw = adjustedVolume / 30;
    return {
      primary: { label: "Generator Size", value: formatNumber(kw) + " kW" },
      details: [
        { label: "Room Volume", value: formatNumber(volumeCuFt) + " cu ft" },
        { label: "Adjusted Volume", value: formatNumber(adjustedVolume) + " cu ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["sauna-heater-calculator","home-gym-space-calculator"],
  faq: [
    { question: "How is steam generator size determined?", answer: "Generator size is based on room volume and wall material type." },
    { question: "What wall material is best for steam rooms?", answer: "Ceramic tile and porcelain are the most popular choices." },
  ],
  formula: "kW = (Volume x Material Factor) / 30",
};
