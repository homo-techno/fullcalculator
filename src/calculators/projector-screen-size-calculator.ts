import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const projectorScreenSizeCalculator: CalculatorDefinition = {
  slug: "projector-screen-size-calculator",
  title: "Projector Screen Size Calculator",
  description: "Calculate projector screen size from throw distance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["projector screen size","throw distance calculator"],
  variants: [{
    id: "standard",
    name: "Projector Screen Size",
    description: "Calculate projector screen size from throw distance.",
    fields: [
      { name: "throwDist", label: "Throw Distance (ft)", type: "number", min: 3, max: 50, defaultValue: 12 },
      { name: "throwRatio", label: "Throw Ratio", type: "number", min: 0.3, max: 4, defaultValue: 1.5 },
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [{ value: "1.78", label: "16:9" }, { value: "2.35", label: "2.35:1" }, { value: "1.33", label: "4:3" }], defaultValue: "1.78" },
    ],
    calculate: (inputs) => {
      const dist = inputs.throwDist as number;
      const ratio = inputs.throwRatio as number;
      const ar = inputs.aspectRatio as number;
      if (!dist || !ratio || !ar) return null;
      const screenWidthFt = dist / ratio;
      const screenWidthIn = Math.round(screenWidthFt * 12 * 10) / 10;
      const screenHeightIn = Math.round(screenWidthIn / ar * 10) / 10;
      const diagonal = Math.round(Math.sqrt(screenWidthIn * screenWidthIn + screenHeightIn * screenHeightIn) * 10) / 10;
      return {
        primary: { label: "Screen Diagonal", value: formatNumber(diagonal) + " in" },
        details: [
          { label: "Screen Width", value: formatNumber(screenWidthIn) + " in" },
          { label: "Screen Height", value: formatNumber(screenHeightIn) + " in" },
          { label: "Throw Distance", value: formatNumber(dist) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is throw ratio?", answer: "Throw ratio is the distance to the screen divided by the screen width." },
    { question: "What throw ratio is best for home theater?", answer: "A throw ratio of 1.3 to 1.6 works well for most home setups." },
  ],
  formula: "Screen Width = Throw Distance / Throw Ratio",
};
