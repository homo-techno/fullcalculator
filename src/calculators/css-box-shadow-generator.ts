import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cssBoxShadowGeneratorCalculator: CalculatorDefinition = {
  slug: "css-box-shadow-generator",
  title: "CSS Box Shadow Generator",
  description: "Free CSS box shadow and neumorphism generator. Visually design shadows and copy production-ready CSS code.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["css box shadow generator", "css shadow generator", "neumorphism generator css"],
  variants: [{
    id: "standard",
    name: "CSS Box Shadow",
    description: "Free CSS box shadow and neumorphism generator",
    fields: [
      { name: "hOffset", label: "Horizontal Offset", type: "number", suffix: "px", defaultValue: 5, min: -50, max: 50 },
      { name: "vOffset", label: "Vertical Offset", type: "number", suffix: "px", defaultValue: 5, min: -50, max: 50 },
      { name: "blur", label: "Blur Radius", type: "number", suffix: "px", defaultValue: 10, min: 0, max: 100 },
      { name: "spread", label: "Spread Radius", type: "number", suffix: "px", defaultValue: 0, min: -50, max: 50 },
    ],
    calculate: (inputs) => {
      const h = inputs.hOffset as number;
      const v = inputs.vOffset as number;
      const blur = inputs.blur as number;
      const spread = inputs.spread as number;
      if (h === undefined || v === undefined) return null;
      const shadow = h + "px " + v + "px " + blur + "px " + spread + "px rgba(0, 0, 0, 0.2)";
      const inset = "inset " + (-h) + "px " + (-v) + "px " + blur + "px " + spread + "px rgba(0, 0, 0, 0.1)";
      return {
        primary: { label: "CSS", value: "box-shadow: " + shadow },
        details: [
          { label: "Standard shadow", value: shadow },
          { label: "Inset shadow", value: inset },
          { label: "Neumorphism", value: shadow + ", " + inset },
        ],
        note: "Copy the CSS value and paste into your stylesheet. Adjust color by changing rgba values.",
      };
    },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How does CSS box-shadow work?", answer: "box-shadow: h-offset v-offset blur spread color. Positive h-offset moves right, positive v-offset moves down. Blur softens edges, spread expands/contracts." },
    { question: "What is neumorphism?", answer: "A design style using dual box-shadows (light and dark) to create soft, extruded shapes. Combines an outer shadow with an inset shadow on a matching background." },
  ],
  formula: "box-shadow: h-offset v-offset blur spread color",
};
