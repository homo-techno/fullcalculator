import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const curtainRodCalculator: CalculatorDefinition = {
  slug: "curtain-rod-size-calculator",
  title: "Curtain Rod Size Calculator",
  description: "Free curtain rod size calculator. Determine the ideal curtain rod length, diameter, and bracket placement for your windows.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["curtain rod calculator", "curtain rod size", "window curtain rod length", "curtain rod bracket placement", "curtain hardware"],
  variants: [
    {
      id: "standard",
      name: "Standard Window",
      fields: [
        { name: "windowWidth", label: "Window Width (inches)", type: "number", placeholder: "e.g. 48" },
        { name: "windowHeight", label: "Window Height (inches)", type: "number", placeholder: "e.g. 60" },
        { name: "overlap", label: "Side Overlap", type: "select", options: [
          { label: "3 inches each side (standard)", value: "3" },
          { label: "6 inches each side (full coverage)", value: "6" },
          { label: "8 inches each side (dramatic)", value: "8" },
          { label: "12 inches each side (wide look)", value: "12" },
        ], defaultValue: "3" },
        { name: "mountHeight", label: "Mount Above Window", type: "select", options: [
          { label: "4 inches above (standard)", value: "4" },
          { label: "6 inches above (taller look)", value: "6" },
          { label: "At ceiling", value: "0" },
        ], defaultValue: "4" },
        { name: "curtainWeight", label: "Curtain Weight", type: "select", options: [
          { label: "Lightweight (sheers)", value: "light" },
          { label: "Medium (cotton, linen)", value: "medium" },
          { label: "Heavy (velvet, blackout)", value: "heavy" },
        ], defaultValue: "medium" },
      ],
      calculate: (inputs) => {
        const windowWidth = inputs.windowWidth as number;
        const windowHeight = inputs.windowHeight as number;
        const overlap = parseInt(inputs.overlap as string) || 3;
        const mountAbove = parseInt(inputs.mountHeight as string);
        const weight = inputs.curtainWeight as string;
        if (!windowWidth || !windowHeight) return null;
        const rodLength = windowWidth + overlap * 2;
        const mountPosition = mountAbove === 0 ? "ceiling" : `${mountAbove}" above window`;
        const curtainLength = windowHeight + (mountAbove === 0 ? 12 : mountAbove) + 0.5;
        let rodDiameter: string;
        if (weight === "light") rodDiameter = "1/2\" to 3/4\"";
        else if (weight === "heavy") rodDiameter = "1\" to 1-3/8\"";
        else rodDiameter = "3/4\" to 1\"";
        const bracketCount = rodLength <= 48 ? 2 : rodLength <= 96 ? 3 : Math.ceil(rodLength / 48) + 1;
        return {
          primary: { label: "Rod Length Needed", value: `${formatNumber(rodLength, 0)} inches` },
          details: [
            { label: "Rod length (feet)", value: `${formatNumber(rodLength / 12, 1)} ft` },
            { label: "Recommended diameter", value: rodDiameter },
            { label: "Number of brackets", value: `${bracketCount}` },
            { label: "Mount position", value: mountPosition },
            { label: "Curtain panel length", value: `${formatNumber(curtainLength, 1)} inches` },
            { label: "Side extension", value: `${overlap}" each side` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "window-replacement-cost-calculator"],
  faq: [
    { question: "How far should a curtain rod extend past the window?", answer: "Standard practice is 3-6 inches on each side. For a wider, more dramatic look, extend 8-12 inches. This makes windows appear larger and allows maximum light when curtains are open." },
  ],
  formula: "Rod Length = Window Width + (2 × Side Overlap)",
};
