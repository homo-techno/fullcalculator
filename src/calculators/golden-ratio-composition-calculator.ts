import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const goldenRatioCompositionCalculator: CalculatorDefinition = {
  slug: "golden-ratio-composition-calculator",
  title: "Golden Ratio Composition Calculator",
  description: "Calculate golden ratio guide points, phi grid lines, and golden spiral placement for photographic and artistic composition.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["golden ratio composition","phi grid photography","golden spiral","rule of thirds alternative"],
  variants: [{
    id: "standard",
    name: "Golden Ratio Composition",
    description: "Calculate golden ratio guide points, phi grid lines, and golden spiral placement for photographic and artistic composition.",
    fields: [
      { name: "imageWidth", label: "Image Width (px)", type: "number", min: 100, max: 20000, defaultValue: 1920 },
      { name: "imageHeight", label: "Image Height (px)", type: "number", min: 100, max: 20000, defaultValue: 1080 },
      { name: "orientation", label: "Orientation", type: "select", options: [{ value: "1", label: "Landscape" }, { value: "2", label: "Portrait" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const w = inputs.imageWidth as number;
    const h = inputs.imageHeight as number;
    const orientation = parseInt(inputs.orientation as string);
    const phi = 1.618;
    const effW = orientation === 1 ? w : h;
    const effH = orientation === 1 ? h : w;
    const vLine1 = Math.round(effW / phi);
    const vLine2 = Math.round(effW - effW / phi);
    const hLine1 = Math.round(effH / phi);
    const hLine2 = Math.round(effH - effH / phi);
    const powerPoint1X = vLine2;
    const powerPoint1Y = hLine2;
    const powerPoint2X = vLine1;
    const powerPoint2Y = hLine1;
    return {
      primary: { label: "Primary Power Point", value: formatNumber(powerPoint1X) + ", " + formatNumber(powerPoint1Y) + " px" },
      details: [
        { label: "Secondary Power Point", value: formatNumber(powerPoint2X) + ", " + formatNumber(powerPoint2Y) + " px" },
        { label: "Vertical Phi Lines", value: formatNumber(vLine2) + " px & " + formatNumber(vLine1) + " px" },
        { label: "Horizontal Phi Lines", value: formatNumber(hLine2) + " px & " + formatNumber(hLine1) + " px" },
        { label: "Image Dimensions", value: formatNumber(effW) + " x " + formatNumber(effH) + " px" }
      ]
    };
  },
  }],
  relatedSlugs: ["golden-ratio-crop-calculator","print-resolution-calculator"],
  faq: [
    { question: "What is the golden ratio in photography?", answer: "The golden ratio (1.618) creates a compositional grid similar to the rule of thirds but with more mathematically harmonious proportions. It places key elements at natural focal points." },
    { question: "How is the phi grid different from rule of thirds?", answer: "The phi grid places lines at approximately 38% and 62% rather than at 33% and 66%. This subtle shift creates compositions that many find more naturally balanced." },
    { question: "Where should I place my subject?", answer: "Place your primary subject at one of the power points — the intersections of the phi grid lines. These points naturally attract the viewer's eye." },
  ],
  formula: "Phi Grid Vertical Lines: W / 1.618 and W - W / 1.618; Phi Grid Horizontal Lines: H / 1.618 and H - H / 1.618; Power Points: intersections of phi grid lines",
};
