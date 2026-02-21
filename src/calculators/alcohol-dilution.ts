import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const alcoholDilutionCalculator: CalculatorDefinition = {
  slug: "alcohol-dilution-calculator",
  title: "Alcohol Dilution Calculator",
  description:
    "Free alcohol dilution calculator. Calculate how much water to add to dilute spirits to a desired ABV for cocktails, proofing down, or liqueur making.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "alcohol dilution calculator",
    "dilute spirits",
    "proof down alcohol",
    "water to add to spirits",
    "abv dilution",
    "cocktail dilution",
  ],
  variants: [
    {
      id: "dilute",
      name: "Dilute to Target ABV",
      description: "Calculate water needed to dilute spirits to a target ABV",
      fields: [
        {
          name: "volume",
          label: "Current Volume (mL)",
          type: "number",
          placeholder: "e.g. 750",
        },
        {
          name: "currentAbv",
          label: "Current ABV (%)",
          type: "number",
          placeholder: "e.g. 60",
        },
        {
          name: "targetAbv",
          label: "Target ABV (%)",
          type: "number",
          placeholder: "e.g. 40",
        },
      ],
      calculate: (inputs) => {
        const volume = inputs.volume as number;
        const currentAbv = inputs.currentAbv as number;
        const targetAbv = inputs.targetAbv as number;
        if (!volume || !currentAbv || !targetAbv) return null;
        if (targetAbv >= currentAbv) {
          return {
            primary: { label: "Error", value: "Target ABV must be lower than current ABV" },
          };
        }

        // V1 x C1 = V2 x C2 => V2 = (V1 x C1) / C2
        const finalVolume = (volume * currentAbv) / targetAbv;
        const waterToAdd = finalVolume - volume;
        const waterOz = waterToAdd / 29.5735;
        const finalVolumeOz = finalVolume / 29.5735;

        return {
          primary: {
            label: "Water to Add",
            value: formatNumber(waterToAdd, 1) + " mL",
          },
          details: [
            { label: "Current Volume", value: formatNumber(volume, 0) + " mL" },
            { label: "Current ABV", value: currentAbv + "%" },
            { label: "Target ABV", value: targetAbv + "%" },
            { label: "Water to Add", value: formatNumber(waterToAdd, 1) + " mL (" + formatNumber(waterOz, 1) + " oz)" },
            { label: "Final Volume", value: formatNumber(finalVolume, 1) + " mL (" + formatNumber(finalVolumeOz, 1) + " oz)" },
            { label: "Current Proof", value: formatNumber(currentAbv * 2, 0) + " proof" },
            { label: "Target Proof", value: formatNumber(targetAbv * 2, 0) + " proof" },
          ],
          note: "This calculation assumes ideal mixing. In practice, mixing alcohol and water produces a slight volume contraction (~3-5%).",
        };
      },
    },
    {
      id: "cocktail-dilution",
      name: "Cocktail Dilution Estimate",
      description: "Estimate ABV of a cocktail after dilution from ice",
      fields: [
        {
          name: "spiritVolume",
          label: "Spirit Volume (oz)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "spiritAbv",
          label: "Spirit ABV (%)",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "mixerVolume",
          label: "Mixer Volume (oz)",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "dilutionMethod",
          label: "Mixing Method",
          type: "select",
          options: [
            { label: "Stirred (20% dilution)", value: "20" },
            { label: "Shaken (25% dilution)", value: "25" },
            { label: "Built on Ice (15% dilution)", value: "15" },
            { label: "No Ice (0% dilution)", value: "0" },
          ],
        },
      ],
      calculate: (inputs) => {
        const spiritVol = inputs.spiritVolume as number;
        const spiritAbv = inputs.spiritAbv as number;
        const mixerVol = inputs.mixerVolume as number;
        const dilutionPct = parseFloat(inputs.dilutionMethod as string) || 0;
        if (!spiritVol || !spiritAbv) return null;

        const mixer = mixerVol || 0;
        const totalLiquid = spiritVol + mixer;
        const waterFromDilution = totalLiquid * (dilutionPct / 100);
        const totalWithDilution = totalLiquid + waterFromDilution;
        const pureAlcohol = spiritVol * (spiritAbv / 100);
        const finalAbv = (pureAlcohol / totalWithDilution) * 100;

        return {
          primary: {
            label: "Estimated Cocktail ABV",
            value: formatNumber(finalAbv, 1) + "%",
          },
          details: [
            { label: "Spirit Volume", value: spiritVol + " oz" },
            { label: "Spirit ABV", value: spiritAbv + "%" },
            { label: "Mixer Volume", value: mixer + " oz" },
            { label: "Water from Dilution", value: formatNumber(waterFromDilution, 1) + " oz" },
            { label: "Total Drink Volume", value: formatNumber(totalWithDilution, 1) + " oz" },
            { label: "Pure Alcohol", value: formatNumber(pureAlcohol, 2) + " oz" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["beer-abv-calculator", "wine-serving-calculator", "bac-calculator"],
  faq: [
    {
      question: "How do I dilute spirits to a lower proof?",
      answer:
        "Use the formula: Water to Add = Current Volume x (Current ABV / Target ABV - 1). For example, to dilute 750mL of 60% ABV spirit to 40% ABV: 750 x (60/40 - 1) = 375mL of water.",
    },
    {
      question: "What is the difference between ABV and proof?",
      answer:
        "In the US, proof is simply double the ABV. So 40% ABV = 80 proof. In the UK, proof was historically calculated differently (100 UK proof = 57.1% ABV), but ABV is now the international standard.",
    },
    {
      question: "How much does ice dilute a cocktail?",
      answer:
        "Stirring a cocktail adds about 20% water by volume, shaking about 25%, and building over ice about 15%. This dilution is an important part of cocktail balance, mellowing the alcohol and integrating flavors.",
    },
  ],
  formula:
    "Dilution: Water to Add = Volume x (Current ABV / Target ABV - 1). Cocktail ABV = (Spirit Volume x Spirit ABV) / (Total Volume + Water from Dilution). US Proof = ABV x 2.",
};
