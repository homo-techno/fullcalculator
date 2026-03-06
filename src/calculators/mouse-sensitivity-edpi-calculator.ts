import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mouseSensitivityEdpiCalculator: CalculatorDefinition = {
  slug: "mouse-sensitivity-edpi-calculator",
  title: "Mouse Sensitivity eDPI Calculator",
  description: "Convert mouse sensitivity between games using effective DPI (eDPI) to maintain consistent aim across different titles with varying sensitivity scales.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["eDPI calculator","mouse sensitivity converter","DPI sensitivity","gaming mouse calculator"],
  variants: [{
    id: "standard",
    name: "Mouse Sensitivity eDPI",
    description: "Convert mouse sensitivity between games using effective DPI (eDPI) to maintain consistent aim across different titles with varying sensitivity scales.",
    fields: [
      { name: "mouseDPI", label: "Mouse DPI", type: "number", min: 100, max: 25600, defaultValue: 800 },
      { name: "inGameSens", label: "In-Game Sensitivity", type: "number", min: 0.01, max: 100, defaultValue: 1.5 },
      { name: "targetGame", label: "Convert To Game", type: "select", options: [{ value: "1", label: "CS2 (Scale: 1x)" }, { value: "2", label: "Valorant (Scale: 3.18x)" }, { value: "3", label: "Overwatch 2 (Scale: 10.6x)" }, { value: "4", label: "Apex Legends (Scale: 5.0x)" }, { value: "5", label: "Fortnite (Scale: 5.6x)" }], defaultValue: "2" },
      { name: "mousepadWidth", label: "Mousepad Width (inches)", type: "number", min: 5, max: 48, defaultValue: 18 },
    ],
    calculate: (inputs) => {
    const dpi = inputs.mouseDPI as number;
    const sens = inputs.inGameSens as number;
    const targetGame = parseInt(inputs.targetGame as string);
    const mousepadWidth = inputs.mousepadWidth as number;
    const edpi = dpi * sens;
    const gameScales = { 1: 1, 2: 3.18, 3: 10.6, 4: 5.0, 5: 5.6 };
    const targetScale = gameScales[targetGame] || 1;
    const convertedSens = Math.round((edpi / dpi / targetScale) * 10000) / 10000;
    const cmPer360 = (360 / (edpi * 0.022)) * 2.54;
    const inPer360 = cmPer360 / 2.54;
    const full360sPossible = Math.round((mousepadWidth / inPer360) * 10) / 10;
    return {
      primary: { label: "eDPI", value: formatNumber(Math.round(edpi * 100) / 100) },
      details: [
        { label: "Converted Sensitivity", value: formatNumber(convertedSens) },
        { label: "cm per 360-degree Turn", value: formatNumber(Math.round(cmPer360 * 10) / 10) + " cm" },
        { label: "Inches per 360-degree Turn", value: formatNumber(Math.round(inPer360 * 10) / 10) + " in" },
        { label: "Full 360s on Mousepad", value: formatNumber(full360sPossible) }
      ]
    };
  },
  }],
  relatedSlugs: ["gaming-monitor-input-lag-calculator","gaming-fps-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "eDPI = Mouse DPI x In-Game Sensitivity; Converted Sensitivity = eDPI / DPI / Target Game Scale; cm per 360 = (360 / (eDPI x 0.022)) x 2.54",
};
