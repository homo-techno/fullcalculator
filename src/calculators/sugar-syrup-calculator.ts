import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sugarSyrupCalculator: CalculatorDefinition = {
  slug: "sugar-syrup-calculator",
  title: "Sugar Syrup Calculator",
  description: "Calculate the correct sugar-to-water ratio for making simple syrup at various concentrations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["simple syrup ratio", "sugar syrup calculator", "bar syrup recipe"],
  variants: [{
    id: "standard",
    name: "Sugar Syrup",
    description: "Calculate the correct sugar-to-water ratio for making simple syrup at various concentrations",
    fields: [
      { name: "targetVolume", label: "Target Volume", type: "number", suffix: "oz", min: 1, max: 200, defaultValue: 16 },
      { name: "ratio", label: "Sugar to Water Ratio", type: "select", options: [{value:"1:1",label:"1:1 (Standard)"},{value:"2:1",label:"2:1 (Rich)"},{value:"1:2",label:"1:2 (Light)"}], defaultValue: "1:1" },
      { name: "sugarType", label: "Sugar Type", type: "select", options: [{value:"white",label:"White Sugar"},{value:"demerara",label:"Demerara"},{value:"honey",label:"Honey"}], defaultValue: "white" },
    ],
    calculate: (inputs) => {
      const target = inputs.targetVolume as number;
      const ratioStr = inputs.ratio as string;
      const sugarType = inputs.sugarType as string;
      if (!target || target <= 0) return null;
      const ratios: Record<string, [number, number]> = { "1:1": [1, 1], "2:1": [2, 1], "1:2": [1, 2] };
      const r = ratios[ratioStr] || [1, 1];
      const totalParts = r[0] + r[1];
      const sugarOz = (target / totalParts) * r[0];
      const waterOz = (target / totalParts) * r[1];
      const sugarGrams = sugarOz * 28.35;
      const sugarCups = sugarGrams / 200;
      return {
        primary: { label: "Sugar Needed", value: formatNumber(Math.round(sugarGrams)) + " g" },
        details: [
          { label: "Sugar (cups)", value: sugarCups.toFixed(2) + " cups" },
          { label: "Water", value: waterOz.toFixed(1) + " oz" },
          { label: "Ratio", value: ratioStr + " (sugar:water)" },
        ],
      };
    },
  }],
  relatedSlugs: ["homebrew-abv-calculator", "spice-blend-calculator"],
  faq: [
    { question: "What is the ratio for simple syrup?", answer: "Standard simple syrup uses a 1:1 ratio of sugar to water by volume. Rich simple syrup uses a 2:1 ratio." },
    { question: "How long does simple syrup last?", answer: "Standard 1:1 syrup lasts about 2-4 weeks refrigerated. Rich 2:1 syrup can last up to 6 months due to higher sugar concentration." },
  ],
  formula: "Sugar = (Target Volume / Total Parts) x Sugar Parts; Water = (Target Volume / Total Parts) x Water Parts",
};
