import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fermentationTemperatureCalculator: CalculatorDefinition = {
  slug: "fermentation-temperature-calculator",
  title: "Fermentation Temperature Calculator",
  description: "Determine optimal fermentation temperature ranges based on yeast type, desired flavor profile, and ferment stage.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["fermentation temperature", "yeast temperature range", "ferment temp calculator"],
  variants: [{
    id: "standard",
    name: "Fermentation Temperature",
    description: "Determine optimal fermentation temperature ranges based on yeast type, desired flavor profile, and ferment stage",
    fields: [
      { name: "yeastType", label: "Yeast Type", type: "select", options: [{value:"ale",label:"Ale Yeast"},{value:"lager",label:"Lager Yeast"},{value:"wine",label:"Wine Yeast"},{value:"wild",label:"Wild/Brett"}], defaultValue: "ale" },
      { name: "currentTemp", label: "Current Temperature", type: "number", suffix: "F", min: 30, max: 120, defaultValue: 68 },
      { name: "profile", label: "Flavor Profile", type: "select", options: [{value:"clean",label:"Clean/Neutral"},{value:"fruity",label:"Fruity/Estery"},{value:"spicy",label:"Spicy/Phenolic"}], defaultValue: "clean" },
    ],
    calculate: (inputs) => {
      const yeast = inputs.yeastType as string;
      const currentTemp = inputs.currentTemp as number;
      const profile = inputs.profile as string;
      if (!currentTemp) return null;
      const ranges: Record<string, [number, number]> = {
        ale: [60, 75], lager: [45, 58], wine: [55, 75], wild: [60, 85]
      };
      const profileAdj: Record<string, number> = { clean: -2, fruity: 2, spicy: 0 };
      const range = ranges[yeast] || [60, 75];
      const adj = profileAdj[profile] || 0;
      const idealLow = range[0] + adj;
      const idealHigh = range[1] + adj;
      const inRange = currentTemp >= idealLow && currentTemp <= idealHigh;
      const diff = inRange ? 0 : (currentTemp < idealLow ? idealLow - currentTemp : currentTemp - idealHigh);
      return {
        primary: { label: "Status", value: inRange ? "Temperature is in range" : "Adjust by " + diff + " degrees F" },
        details: [
          { label: "Ideal Range", value: idealLow + " - " + idealHigh + " F" },
          { label: "Current Temperature", value: currentTemp + " F" },
          { label: "In Range", value: inRange ? "Yes" : "No" },
        ],
      };
    },
  }],
  relatedSlugs: ["homebrew-abv-calculator", "sugar-syrup-calculator"],
  faq: [
    { question: "What temperature should I ferment beer at?", answer: "Ale yeast works best at 60-75 F, while lager yeast prefers 45-58 F. Temperature affects flavor significantly." },
    { question: "Does fermentation temperature affect flavor?", answer: "Yes. Higher temperatures produce more fruity esters and fusel alcohols, while lower temperatures create cleaner, crisper flavors." },
  ],
  formula: "Ideal Range = Base Range for Yeast Type + Flavor Profile Adjustment",
};
