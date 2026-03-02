import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dartBoardHeightCalculator: CalculatorDefinition = {
  slug: "dart-board-height-calculator",
  title: "Dart Board Height Calculator",
  description: "Get official dart board mounting dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dart","board","height","mounting"],
  variants: [{
    id: "standard",
    name: "Dart Board Height",
    description: "Get official dart board mounting dimensions.",
    fields: [
      { name: "gameType", label: "Game Type", type: "select", options: [{ value: "1", label: "Steel Tip" }, { value: "2", label: "Soft Tip" }], defaultValue: "1" },
      { name: "wallWidth", label: "Available Wall Width (ft)", type: "number", min: 2, max: 20, defaultValue: 6 },
    ],
    calculate: (inputs) => {
    const gameType = inputs.gameType as number;
    const wallWidth = inputs.wallWidth as number;
    const bullseyeHeight = 68;
    const throwDistance = gameType === 1 ? 93.25 : 96;
    const boardDiameter = 18;
    const minWidth = 3;
    const fits = wallWidth >= minWidth;
    return {
      primary: { label: "Bullseye Height", value: bullseyeHeight + " inches from floor" },
      details: [
        { label: "Throw Distance", value: throwDistance + " inches" },
        { label: "Board Diameter", value: boardDiameter + " inches" },
        { label: "Wall Width OK", value: fits ? "Yes" : "No" }
      ]
    };
  },
  }],
  relatedSlugs: ["billiard-room-size-calculator","archery-range-calculator"],
  faq: [
    { question: "How high should a dart board be?", answer: "The bullseye should be 5 feet 8 inches from the floor." },
    { question: "How far do you stand from a dart board?", answer: "The steel tip throwing distance is 7 feet 9.25 inches." },
  ],
  formula: "Bullseye Height = 68 inches; Throw Distance = 93.25 (steel) or 96 (soft) inches",
};
