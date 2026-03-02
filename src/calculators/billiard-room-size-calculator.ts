import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const billiardRoomSizeCalculator: CalculatorDefinition = {
  slug: "billiard-room-size-calculator",
  title: "Billiard Room Size Calculator",
  description: "Calculate the room size needed for a pool table.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["billiard","pool","table","room","size"],
  variants: [{
    id: "standard",
    name: "Billiard Room Size",
    description: "Calculate the room size needed for a pool table.",
    fields: [
      { name: "tableSize", label: "Table Size", type: "select", options: [{ value: "7", label: "7 ft Bar" }, { value: "8", label: "8 ft Standard" }, { value: "9", label: "9 ft Tournament" }], defaultValue: "8" },
      { name: "cueLength", label: "Cue Length (inches)", type: "number", min: 36, max: 62, defaultValue: 58 },
    ],
    calculate: (inputs) => {
    const tableSize = inputs.tableSize as number;
    const cueLength = inputs.cueLength as number;
    const tableWidths: Record<number, number> = { 7: 40, 8: 44, 9: 50 };
    const tableLengths: Record<number, number> = { 7: 80, 8: 88, 9: 100 };
    const tw = tableWidths[tableSize] || 44;
    const tl = tableLengths[tableSize] || 88;
    const roomWidth = (tw + 2 * cueLength) / 12;
    const roomLength = (tl + 2 * cueLength) / 12;
    const roomArea = roomWidth * roomLength;
    return {
      primary: { label: "Minimum Room Size", value: formatNumber(roomLength) + " x " + formatNumber(roomWidth) + " ft" },
      details: [
        { label: "Table Playing Surface", value: tl + " x " + tw + " in" },
        { label: "Room Area Needed", value: formatNumber(roomArea) + " sq ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["dart-board-height-calculator","home-gym-space-calculator"],
  faq: [
    { question: "How big a room for a pool table?", answer: "An 8 foot table needs at least a 13 by 17 foot room." },
    { question: "What is the standard pool cue length?", answer: "A standard pool cue is 58 inches long." },
  ],
  formula: "Room Dimension = (Table Dimension + 2 x Cue Length) / 12",
};
