import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const glycolMixtureCalculator: CalculatorDefinition = {
  slug: "glycol-mixture-calculator",
  title: "Glycol Mixture Calculator",
  description: "Free glycol mixture calculator. Determine the right glycol concentration for freeze protection and calculate mixture properties.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["glycol mixture calculator", "propylene glycol", "ethylene glycol", "antifreeze calculator", "freeze protection"],
  variants: [
    {
      id: "freeze-protection",
      name: "Freeze Protection",
      description: "Calculate glycol concentration for desired freeze point",
      fields: [
        { name: "glycolType", label: "Glycol Type", type: "select", options: [
          { label: "Propylene Glycol (food safe)", value: "propylene" },
          { label: "Ethylene Glycol", value: "ethylene" },
        ], defaultValue: "propylene" },
        { name: "freezePoint", label: "Required Freeze Point (F)", type: "number", placeholder: "e.g. -20" },
        { name: "systemVolume", label: "System Volume (gallons)", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const glycolType = inputs.glycolType as string;
        const freezePoint = inputs.freezePoint as number;
        const systemVolume = inputs.systemVolume as number;
        if (freezePoint === undefined || !systemVolume) return null;
        let concentration = 0;
        if (glycolType === "propylene") {
          if (freezePoint >= 25) concentration = 15;
          else if (freezePoint >= 15) concentration = 25;
          else if (freezePoint >= 0) concentration = 35;
          else if (freezePoint >= -15) concentration = 40;
          else if (freezePoint >= -30) concentration = 45;
          else concentration = 50;
        } else {
          if (freezePoint >= 25) concentration = 10;
          else if (freezePoint >= 15) concentration = 20;
          else if (freezePoint >= 0) concentration = 30;
          else if (freezePoint >= -20) concentration = 35;
          else if (freezePoint >= -40) concentration = 40;
          else concentration = 50;
        }
        const glycolGallons = systemVolume * (concentration / 100);
        const waterGallons = systemVolume - glycolGallons;
        const heatCapacityPenalty = 1 - (concentration / 100) * 0.2;
        return {
          primary: { label: "Glycol Concentration", value: `${formatNumber(concentration, 0)}` + "%" },
          details: [
            { label: "Glycol Needed", value: `${formatNumber(glycolGallons, 1)}` + " gallons" },
            { label: "Water Needed", value: `${formatNumber(waterGallons, 1)}` + " gallons" },
            { label: "Heat Capacity Factor", value: `${formatNumber(heatCapacityPenalty * 100, 1)}` + "% of water" },
            { label: "Glycol Type", value: glycolType === "propylene" ? "Propylene (food safe)" : "Ethylene" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["expansion-tank-calculator", "boiler-size-calculator", "heat-loss-calculator"],
  faq: [
    { question: "Propylene vs ethylene glycol?", answer: "Propylene glycol is non-toxic and food-safe, used in potable water systems. Ethylene glycol is more efficient but toxic. Use propylene for any system connected to potable water." },
    { question: "How does glycol affect system performance?", answer: "Glycol reduces heat transfer capacity by 10-20% depending on concentration. It also increases viscosity, requiring larger pumps. Size the system accordingly." },
  ],
  formula: "Glycol Volume = System Volume x Concentration% | Heat Capacity decreases ~0.2% per 1% glycol",
};