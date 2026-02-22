import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const expansionTankCalculator: CalculatorDefinition = {
  slug: "expansion-tank-calculator",
  title: "Expansion Tank Size Calculator",
  description: "Free expansion tank sizing calculator. Calculate the required expansion tank volume for hydronic heating or chilled water systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["expansion tank calculator", "hydronic expansion tank", "boiler tank size", "thermal expansion tank", "water expansion"],
  variants: [
    {
      id: "hydronic",
      name: "Hydronic System Expansion Tank",
      description: "Size expansion tank for hot water heating system",
      fields: [
        { name: "systemVolume", label: "Total System Volume (gallons)", type: "number", placeholder: "e.g. 50" },
        { name: "minTemp", label: "Fill Temperature (F)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "maxTemp", label: "Max Operating Temperature (F)", type: "number", placeholder: "e.g. 200", defaultValue: 200 },
        { name: "fillPressure", label: "Fill Pressure (PSI)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "reliefPressure", label: "Relief Valve Pressure (PSI)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const systemVolume = inputs.systemVolume as number;
        const minTemp = inputs.minTemp as number;
        const maxTemp = inputs.maxTemp as number;
        const fillPressure = inputs.fillPressure as number;
        const reliefPressure = inputs.reliefPressure as number;
        if (!systemVolume || !minTemp || !maxTemp || !fillPressure || !reliefPressure) return null;
        const expansionFactor = 0.00041 * (maxTemp - minTemp);
        const expandedVolume = systemVolume * expansionFactor;
        const pAbs1 = fillPressure + 14.7;
        const pAbs2 = reliefPressure + 14.7;
        const acceptanceFactor = 1 - (pAbs1 / pAbs2);
        const tankSize = expandedVolume / acceptanceFactor;
        const standardSizes = [2, 4.4, 7.6, 10, 14, 20, 30, 40, 60, 80, 100];
        const recommended = standardSizes.find(s => s >= tankSize) || Math.ceil(tankSize);
        return {
          primary: { label: "Required Tank Size", value: `${formatNumber(recommended, 1)}` + " gallons" },
          details: [
            { label: "Exact Calculated Size", value: `${formatNumber(tankSize, 2)}` + " gal" },
            { label: "Expansion Volume", value: `${formatNumber(expandedVolume, 2)}` + " gal" },
            { label: "Expansion Factor", value: `${formatNumber(expansionFactor * 100, 2)}` + "%" },
            { label: "Acceptance Factor", value: `${formatNumber(acceptanceFactor * 100, 1)}` + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["boiler-size-calculator", "pressure-relief-valve-calculator", "glycol-mixture-calculator"],
  faq: [
    { question: "Why do I need an expansion tank?", answer: "Water expands when heated. Without an expansion tank, pressure would build up dangerously in a closed system. The tank absorbs the expanded volume and maintains safe operating pressure." },
    { question: "How is expansion tank size determined?", answer: "Tank size depends on total system water volume, temperature range, fill pressure, and relief valve setting. The tank must absorb all expanded water while keeping pressure below the relief valve setting." },
  ],
  formula: "Tank Size = Expanded Volume / Acceptance Factor | Expansion = Volume x 0.00041 x DeltaT",
};