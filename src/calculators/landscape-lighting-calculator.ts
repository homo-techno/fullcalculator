import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landscapeLightingCalculator: CalculatorDefinition = {
  slug: "landscape-lighting-calculator",
  title: "Landscape Lighting Calculator",
  description: "Calculate landscape lighting fixtures and total wattage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["landscape","lighting","outdoor","wattage"],
  variants: [{
    id: "standard",
    name: "Landscape Lighting",
    description: "Calculate landscape lighting fixtures and total wattage.",
    fields: [
      { name: "pathLength", label: "Path Length (ft)", type: "number", min: 5, max: 500, defaultValue: 60 },
      { name: "spacing", label: "Fixture Spacing (ft)", type: "number", min: 4, max: 20, defaultValue: 8 },
      { name: "wattsPerFixture", label: "Watts per Fixture", type: "number", min: 1, max: 50, defaultValue: 5 },
      { name: "accentLights", label: "Accent Lights", type: "number", min: 0, max: 30, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const pathLength = inputs.pathLength as number;
    const spacing = inputs.spacing as number;
    const wattsPerFixture = inputs.wattsPerFixture as number;
    const accentLights = inputs.accentLights as number;
    const pathLights = Math.ceil(pathLength / spacing) + 1;
    const totalFixtures = pathLights + accentLights;
    const totalWatts = totalFixtures * wattsPerFixture;
    return {
      primary: { label: "Total Fixtures", value: formatNumber(totalFixtures) },
      details: [
        { label: "Path Lights", value: formatNumber(pathLights) },
        { label: "Accent Lights", value: formatNumber(accentLights) },
        { label: "Total Wattage", value: formatNumber(totalWatts) + " W" }
      ]
    };
  },
  }],
  relatedSlugs: ["recessed-lighting-calculator","lighting-lumen-calculator"],
  faq: [
    { question: "How far apart should path lights be?", answer: "Space path lights 6 to 8 feet apart for even illumination." },
    { question: "What wattage for landscape lights?", answer: "Low voltage LED landscape lights use 3 to 8 watts each." },
  ],
  formula: "Path Lights = (Path Length / Spacing) + 1; Total Watts = Total Fixtures x Watts",
};
