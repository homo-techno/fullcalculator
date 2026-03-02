import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const subwooferBoxVolumeCalculator: CalculatorDefinition = {
  slug: "subwoofer-box-volume-calculator",
  title: "Subwoofer Box Volume Calculator",
  description: "Calculate the optimal sealed or ported enclosure volume for your subwoofer driver.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["subwoofer","box volume","enclosure","speaker box","car audio"],
  variants: [{
    id: "standard",
    name: "Subwoofer Box Volume",
    description: "Calculate the optimal sealed or ported enclosure volume for your subwoofer driver.",
    fields: [
      { name: "driverSize", label: "Driver Size (inches)", type: "select", options: [{ value: "8", label: "8 inch" }, { value: "10", label: "10 inch" }, { value: "12", label: "12 inch" }, { value: "15", label: "15 inch" }, { value: "18", label: "18 inch" }], defaultValue: "12" },
      { name: "enclosureType", label: "Enclosure Type", type: "select", options: [{ value: "1", label: "Sealed (Tight Bass)" }, { value: "2", label: "Ported (Louder Bass)" }], defaultValue: "1" },
      { name: "numDrivers", label: "Number of Drivers", type: "number", min: 1, max: 4, defaultValue: 1 },
      { name: "vas", label: "Vas (Equivalent Volume, liters)", type: "number", min: 5, max: 300, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const driverSize = inputs.driverSize as number;
    const enclosureType = inputs.enclosureType as number;
    const numDrivers = inputs.numDrivers as number;
    const vas = inputs.vas as number;
    const sealedMultiplier = 0.7;
    const portedMultiplier = 1.5;
    const multiplier = enclosureType === 1 ? sealedMultiplier : portedMultiplier;
    const volumePerDriver = vas * multiplier;
    const totalVolumeLiters = volumePerDriver * numDrivers;
    const totalVolumeCuFt = totalVolumeLiters * 0.0353147;
    const encLabel = enclosureType === 1 ? "Sealed" : "Ported";
    const portDiameter = enclosureType === 2 ? driverSize * 0.4 : 0;
    const portLength = enclosureType === 2 ? Math.round(driverSize * 1.5) : 0;
    return {
      primary: { label: "Total Enclosure Volume", value: formatNumber(totalVolumeCuFt) + " cu ft" },
      details: [
        { label: "Volume in Liters", value: formatNumber(totalVolumeLiters) + " L" },
        { label: "Volume Per Driver", value: formatNumber(volumePerDriver * 0.0353147) + " cu ft" },
        { label: "Enclosure Type", value: encLabel },
        { label: enclosureType === 2 ? "Port Diameter" : "Box Type", value: enclosureType === 2 ? formatNumber(portDiameter) + " inches" : "Sealed - No Port" }
      ]
    };
  },
  }],
  relatedSlugs: ["speaker-wattage-calculator","speaker-room-size-calculator","microphone-sensitivity-calculator"],
  faq: [
    { question: "Is a sealed or ported subwoofer box better?", answer: "Sealed boxes produce tighter, more accurate bass while ported boxes are louder and more efficient but less precise." },
    { question: "Does box volume affect bass quality?", answer: "Yes, too small a box makes bass sound thin and boomy, while too large a box reduces output and control." },
    { question: "What size box do I need for a 12-inch sub?", answer: "A 12-inch subwoofer typically needs 1.0-1.5 cubic feet sealed or 2.0-3.0 cubic feet ported." },
  ],
  formula: "Sealed Volume = Vas x 0.7 per driver
Ported Volume = Vas x 1.5 per driver",
};
