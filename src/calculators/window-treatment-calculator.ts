import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windowTreatmentCalculator: CalculatorDefinition = {
  slug: "window-treatment-calculator",
  title: "Window Treatment Calculator",
  description: "Calculate curtain width and rod length for windows.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["curtain size","window treatment sizing"],
  variants: [{
    id: "standard",
    name: "Window Treatment",
    description: "Calculate curtain width and rod length for windows.",
    fields: [
      { name: "windowWidth", label: "Window Width (in)", type: "number", min: 12, max: 200, defaultValue: 48 },
      { name: "windowHeight", label: "Window Height (in)", type: "number", min: 12, max: 120, defaultValue: 60 },
      { name: "fullness", label: "Fullness Multiplier", type: "select", options: [{ value: "1.5", label: "1.5x (Casual)" }, { value: "2", label: "2x (Standard)" }, { value: "2.5", label: "2.5x (Luxurious)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
      const ww = inputs.windowWidth as number;
      const wh = inputs.windowHeight as number;
      const full = inputs.fullness as number;
      if (!ww || !wh || !full) return null;
      const rodLength = Math.round(ww + 12);
      const curtainWidth = Math.round(ww * full);
      const curtainLength = Math.round(wh + 4);
      const panels = Math.ceil(curtainWidth / 54);
      return {
        primary: { label: "Total Curtain Width", value: formatNumber(curtainWidth) + " in" },
        details: [
          { label: "Rod Length", value: formatNumber(rodLength) + " in" },
          { label: "Curtain Length", value: formatNumber(curtainLength) + " in" },
          { label: "Number of Panels (54 in wide)", value: String(panels) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How wide should curtains be?", answer: "Curtains should be 1.5 to 2.5 times the window width for fullness." },
    { question: "How far above the window should a rod go?", answer: "Mount the rod 4 to 6 inches above the window frame." },
  ],
  formula: "Curtain Width = Window Width x Fullness Multiplier",
};
