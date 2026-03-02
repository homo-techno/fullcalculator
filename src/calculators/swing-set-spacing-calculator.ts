import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const swingSetSpacingCalculator: CalculatorDefinition = {
  slug: "swing-set-spacing-calculator",
  title: "Swing Set Spacing Calculator",
  description: "Calculate proper spacing for swing set layout.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["swing","set","spacing","playground"],
  variants: [{
    id: "standard",
    name: "Swing Set Spacing",
    description: "Calculate proper spacing for swing set layout.",
    fields: [
      { name: "swings", label: "Number of Swings", type: "number", min: 1, max: 8, defaultValue: 3 },
      { name: "swingWidth", label: "Swing Seat Width (in)", type: "number", min: 12, max: 30, defaultValue: 18 },
      { name: "beamHeight", label: "Beam Height (ft)", type: "number", min: 6, max: 14, defaultValue: 8 },
    ],
    calculate: (inputs) => {
    const swings = inputs.swings as number;
    const swingWidth = inputs.swingWidth as number;
    const beamHeight = inputs.beamHeight as number;
    const spacingInches = swingWidth + 6;
    const edgeClearance = 24;
    const totalWidthInches = swings * spacingInches + 2 * edgeClearance;
    const totalWidthFeet = totalWidthInches / 12;
    const safetyZone = beamHeight * 2;
    return {
      primary: { label: "Total Beam Length", value: formatNumber(totalWidthFeet) + " ft" },
      details: [
        { label: "Spacing Between Swings", value: formatNumber(spacingInches) + " in" },
        { label: "Front/Back Safety Zone", value: formatNumber(safetyZone) + " ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["trampoline-weight-limit-calculator","sandbox-sand-calculator"],
  faq: [
    { question: "How far apart should swings be?", answer: "Swings should be at least 24 inches apart center to center." },
    { question: "What is a safe fall zone for swings?", answer: "The fall zone should extend twice the beam height in all directions." },
  ],
  formula: "Total Width = (Swings x (Seat Width + 6)) + 48 inches edge clearance",
};
