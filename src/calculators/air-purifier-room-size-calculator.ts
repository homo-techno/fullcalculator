import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airPurifierRoomSizeCalculator: CalculatorDefinition = {
  slug: "air-purifier-room-size-calculator",
  title: "Air Purifier Room Size Calculator",
  description: "Find the CADR rating needed for your room.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["air purifier cadr","air purifier size"],
  variants: [{
    id: "standard",
    name: "Air Purifier Room Size",
    description: "Find the CADR rating needed for your room.",
    fields: [
      { name: "length", label: "Room Length (ft)", type: "number", min: 4, max: 100, defaultValue: 15 },
      { name: "width", label: "Room Width (ft)", type: "number", min: 4, max: 100, defaultValue: 12 },
      { name: "ceilingHeight", label: "Ceiling Height (ft)", type: "number", min: 7, max: 20, defaultValue: 8 },
      { name: "changes", label: "Air Changes Per Hour", type: "number", min: 2, max: 8, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const l = inputs.length as number;
      const w = inputs.width as number;
      const h = inputs.ceilingHeight as number;
      const ach = inputs.changes as number;
      const volume = l * w * h;
      const cadr = Math.ceil(volume * ach / 60);
      return {
        primary: { label: "Minimum CADR", value: formatNumber(cadr) + " CFM" },
        details: [
          { label: "Room Volume", value: formatNumber(volume) + " cu ft" },
          { label: "Room Area", value: formatNumber(l * w) + " sq ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What CADR rating do I need?", answer: "Choose a CADR at least two-thirds of the room area in sq ft." },
    { question: "How many air changes per hour are ideal?", answer: "Four to six air changes per hour is recommended for allergy relief." },
  ],
  formula: "CADR = Length x Width x Height x ACH / 60",
};
