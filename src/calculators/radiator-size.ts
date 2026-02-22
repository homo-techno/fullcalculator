import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const radiatorSizeCalculator: CalculatorDefinition = {
  slug: "radiator-size-calculator",
  title: "Radiator Sizing Calculator",
  description: "Free radiator sizing calculator. Calculate BTU output needed for room heating and determine the right radiator size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["radiator size calculator", "BTU radiator", "radiator output", "heating radiator", "room radiator sizing"],
  variants: [
    {
      id: "room-radiator",
      name: "Radiator for Room",
      description: "Calculate BTU output needed for a room",
      fields: [
        { name: "length", label: "Room Length (ft)", type: "number", placeholder: "e.g. 15" },
        { name: "width", label: "Room Width (ft)", type: "number", placeholder: "e.g. 12" },
        { name: "height", label: "Ceiling Height (ft)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "exposure", label: "Exterior Walls", type: "select", options: [
          { label: "0 (interior room)", value: "0" },
          { label: "1 exterior wall", value: "1" },
          { label: "2 exterior walls", value: "2" },
          { label: "3 exterior walls", value: "3" },
        ], defaultValue: "1" },
        { name: "insulation", label: "Insulation Quality", type: "select", options: [
          { label: "Poor", value: "poor" },
          { label: "Average", value: "average" },
          { label: "Good", value: "good" },
        ], defaultValue: "average" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        const exposure = parseInt(inputs.exposure as string);
        const insulation = inputs.insulation as string;
        if (!length || !width || !height) return null;
        const volume = length * width * height;
        const baseBtu = volume * 5;
        const exposureMult = 1 + (exposure * 0.1);
        const insulMult: Record<string, number> = { poor: 1.3, average: 1.0, good: 0.8 };
        const totalBtu = baseBtu * exposureMult * (insulMult[insulation] || 1.0);
        const watts = totalBtu / 3.412;
        const sections = Math.ceil(totalBtu / 250);
        return {
          primary: { label: "Required BTU Output", value: `${formatNumber(totalBtu, 0)}` + " BTU/hr" },
          details: [
            { label: "Room Volume", value: `${formatNumber(volume, 0)}` + " cu ft" },
            { label: "Watts Equivalent", value: `${formatNumber(watts, 0)}` + " W" },
            { label: "Approx Radiator Sections", value: `${formatNumber(sections, 0)}` + " sections" },
            { label: "Exterior Walls", value: `${formatNumber(exposure, 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["boiler-size-calculator", "heat-loss-calculator", "thermal-resistance-calculator"],
  faq: [
    { question: "How many BTU per square foot for radiators?", answer: "A general guideline is 20-30 BTU per square foot for well-insulated rooms, and up to 40 BTU per square foot for poorly insulated rooms or rooms with many exterior walls." },
    { question: "How do I calculate radiator sections?", answer: "Divide the total BTU needed by the output per section (typically 200-300 BTU per section for standard cast iron radiators). The exact output varies by radiator model and water temperature." },
  ],
  formula: "BTU = Volume x 5 x Exposure Factor x Insulation Factor | Sections = BTU / 250",
};