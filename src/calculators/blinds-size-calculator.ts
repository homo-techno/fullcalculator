import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const blindsSizeCalculator: CalculatorDefinition = {
  slug: "blinds-size-calculator",
  title: "Blinds Size Calculator",
  description: "Calculate window blinds dimensions for inside or outside mount.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["blinds size","window blinds dimensions"],
  variants: [{
    id: "standard",
    name: "Blinds Size",
    description: "Calculate window blinds dimensions for inside or outside mount.",
    fields: [
      { name: "windowWidth", label: "Window Opening Width (in)", type: "number", min: 8, max: 200, defaultValue: 36 },
      { name: "windowHeight", label: "Window Opening Height (in)", type: "number", min: 8, max: 120, defaultValue: 48 },
      { name: "mountType", label: "Mount Type", type: "select", options: [{ value: "1", label: "Inside Mount" }, { value: "2", label: "Outside Mount" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
      const ww = inputs.windowWidth as number;
      const wh = inputs.windowHeight as number;
      const mount = inputs.mountType as number;
      if (!ww || !wh || !mount) return null;
      let blindWidth, blindHeight;
      if (mount === 1) {
        blindWidth = Math.round((ww - 0.25) * 100) / 100;
        blindHeight = Math.round(wh * 100) / 100;
      } else {
        blindWidth = Math.round((ww + 3) * 100) / 100;
        blindHeight = Math.round((wh + 3) * 100) / 100;
      }
      const area = Math.round(blindWidth * blindHeight * 100) / 100;
      return {
        primary: { label: "Blind Width", value: formatNumber(blindWidth) + " in" },
        details: [
          { label: "Blind Height", value: formatNumber(blindHeight) + " in" },
          { label: "Blind Area", value: formatNumber(Math.round(area / 144 * 100) / 100) + " sq ft" },
          { label: "Mount Type", value: mount === 1 ? "Inside Mount" : "Outside Mount" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is inside mount vs outside mount?", answer: "Inside mount fits within the window frame. Outside mount covers it." },
    { question: "How much smaller should inside mount blinds be?", answer: "Deduct about 1/4 inch from the width for inside mount blinds." },
  ],
  formula: "Inside: Width = Opening - 0.25 in; Outside: Width = Opening + 3 in",
};
