import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skateboardTruckWidthCalculator: CalculatorDefinition = {
  slug: "skateboard-truck-width-calculator",
  title: "Skateboard Truck Width Calculator",
  description: "Match skateboard truck width to your deck size for optimal performance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["skateboard truck width","truck size","skateboard setup","truck axle width"],
  variants: [{
    id: "standard",
    name: "Skateboard Truck Width",
    description: "Match skateboard truck width to your deck size for optimal performance.",
    fields: [
      { name: "deckWidth", label: "Deck Width (inches)", type: "number", min: 7, max: 10, defaultValue: 8 },
      { name: "style", label: "Skating Style", type: "select", options: [{ value: "1", label: "Street" }, { value: "2", label: "Park / Transition" }, { value: "3", label: "Cruising / Commute" }], defaultValue: "1" },
      { name: "wheelSize", label: "Wheel Diameter (mm)", type: "number", min: 48, max: 70, defaultValue: 54 },
    ],
    calculate: (inputs) => {
    const deckWidth = inputs.deckWidth as number;
    const style = parseInt(inputs.style as string);
    const wheelSize = inputs.wheelSize as number;
    var truckWidth = Math.round(deckWidth * 25.4);
    const truckInch = deckWidth;
    var risers = "None needed";
    if (wheelSize >= 56) risers = '1/8" riser pads';
    if (wheelSize >= 60) risers = '1/4" riser pads';
    const hardness = style === 1 ? "Medium (90-94a)" : style === 2 ? "Medium-Hard (94-97a)" : "Soft (78-87a)";
    const bushings = style === 1 ? "Medium (90a)" : style === 2 ? "Medium-Hard (94a)" : "Soft (85a)";
    return {
      primary: { label: "Truck Axle Width", value: formatNumber(truckWidth) + " mm (" + formatNumber(Math.round(truckInch * 10) / 10) + '"' + ")" },
      details: [
        { label: "Risers", value: risers },
        { label: "Recommended Wheel Hardness", value: hardness },
        { label: "Bushing Hardness", value: bushings }
      ]
    };
  },
  }],
  relatedSlugs: ["snowboard-size-calculator","bicycle-gear-ratio-calculator"],
  faq: [
    { question: "How wide should skateboard trucks be?", answer: "Truck axle width should match your deck width within about a quarter inch. An 8 inch deck needs trucks around 8 inches wide." },
    { question: "Do I need riser pads?", answer: "Riser pads prevent wheel bite. Use them with wheels larger than 56mm or if you ride loose trucks." },
    { question: "What size wheels for street skating?", answer: "Street skating typically uses 50 to 54mm wheels. Larger wheels are better for cruising and rough terrain." },
  ],
  formula: "Truck Width = Deck Width (matched); Risers determined by wheel size",
};
