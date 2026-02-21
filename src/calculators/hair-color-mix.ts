import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hairColorMixCalculator: CalculatorDefinition = {
  slug: "hair-color-mix-calculator",
  title: "Hair Color Mixing Calculator",
  description: "Free hair color mixing calculator. Calculate the correct ratios for mixing hair dye, developer, and multiple shades.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hair color mixing calculator", "hair dye mixing ratio", "hair color formula", "mix hair dye shades", "hair color ratio"],
  variants: [
    {
      id: "two-shade-mix",
      name: "Two-Shade Mix",
      description: "Calculate the resulting level when mixing two hair color shades",
      fields: [
        { name: "level1", label: "First Color Level", type: "select", options: [
          { label: "1 - Black", value: "1" },
          { label: "2 - Darkest Brown", value: "2" },
          { label: "3 - Dark Brown", value: "3" },
          { label: "4 - Medium Brown", value: "4" },
          { label: "5 - Light Brown", value: "5" },
          { label: "6 - Dark Blonde", value: "6" },
          { label: "7 - Medium Blonde", value: "7" },
          { label: "8 - Light Blonde", value: "8" },
          { label: "9 - Very Light Blonde", value: "9" },
          { label: "10 - Lightest Blonde", value: "10" },
        ], defaultValue: "6" },
        { name: "parts1", label: "Parts of First Color", type: "number", placeholder: "e.g. 1", min: 1, max: 10, step: 0.5, defaultValue: 1 },
        { name: "level2", label: "Second Color Level", type: "select", options: [
          { label: "1 - Black", value: "1" },
          { label: "2 - Darkest Brown", value: "2" },
          { label: "3 - Dark Brown", value: "3" },
          { label: "4 - Medium Brown", value: "4" },
          { label: "5 - Light Brown", value: "5" },
          { label: "6 - Dark Blonde", value: "6" },
          { label: "7 - Medium Blonde", value: "7" },
          { label: "8 - Light Blonde", value: "8" },
          { label: "9 - Very Light Blonde", value: "9" },
          { label: "10 - Lightest Blonde", value: "10" },
        ], defaultValue: "8" },
        { name: "parts2", label: "Parts of Second Color", type: "number", placeholder: "e.g. 1", min: 1, max: 10, step: 0.5, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const level1 = parseInt(inputs.level1 as string);
        const parts1 = inputs.parts1 as number;
        const level2 = parseInt(inputs.level2 as string);
        const parts2 = inputs.parts2 as number;
        if (!parts1 || !parts2) return null;

        const totalParts = parts1 + parts2;
        const resultLevel = (level1 * parts1 + level2 * parts2) / totalParts;
        const roundedLevel = Math.round(resultLevel * 2) / 2;

        const levelNames: Record<number, string> = {
          1: "Black", 2: "Darkest Brown", 3: "Dark Brown", 4: "Medium Brown",
          5: "Light Brown", 6: "Dark Blonde", 7: "Medium Blonde",
          8: "Light Blonde", 9: "Very Light Blonde", 10: "Lightest Blonde",
        };
        const closestLevel = Math.round(resultLevel);
        const levelName = levelNames[closestLevel] || "Custom";

        return {
          primary: { label: "Resulting Level", value: formatNumber(roundedLevel, 1) },
          details: [
            { label: "Closest Named Level", value: `${closestLevel} - ${levelName}` },
            { label: "Mix Ratio", value: `${parts1} : ${parts2}` },
            { label: "First Color", value: `Level ${level1} (${parts1} parts)` },
            { label: "Second Color", value: `Level ${level2} (${parts2} parts)` },
          ],
          note: "This calculates the resulting depth level only. Tone (warm/cool/neutral) depends on the specific shades and underlying pigment.",
        };
      },
    },
    {
      id: "developer-ratio",
      name: "Developer Mix Ratio",
      description: "Calculate the amount of developer needed for your hair color",
      fields: [
        { name: "colorAmount", label: "Hair Color Amount", type: "number", placeholder: "e.g. 60", suffix: "ml", min: 10 },
        { name: "mixRatio", label: "Mixing Ratio (Color:Developer)", type: "select", options: [
          { label: "1:1 (permanent color)", value: "1" },
          { label: "1:1.5 (high-lift tints)", value: "1.5" },
          { label: "1:2 (demi-permanent / toners)", value: "2" },
          { label: "1:3 (lighteners / bleach)", value: "3" },
        ], defaultValue: "1" },
        { name: "developerVol", label: "Developer Volume", type: "select", options: [
          { label: "10 Vol (3%) - Deposit only", value: "10" },
          { label: "20 Vol (6%) - 1-2 levels lift", value: "20" },
          { label: "30 Vol (9%) - 2-3 levels lift", value: "30" },
          { label: "40 Vol (12%) - 3-4 levels lift", value: "40" },
        ], defaultValue: "20" },
      ],
      calculate: (inputs) => {
        const colorAmount = inputs.colorAmount as number;
        const mixRatio = parseFloat(inputs.mixRatio as string);
        const developerVol = parseInt(inputs.developerVol as string);
        if (!colorAmount) return null;

        const developerAmount = colorAmount * mixRatio;
        const totalMix = colorAmount + developerAmount;
        const peroxidePercent = developerVol === 10 ? 3 : developerVol === 20 ? 6 : developerVol === 30 ? 9 : 12;

        let liftCapability: string;
        if (developerVol === 10) liftCapability = "Deposit only (no lift)";
        else if (developerVol === 20) liftCapability = "1-2 levels of lift";
        else if (developerVol === 30) liftCapability = "2-3 levels of lift";
        else liftCapability = "3-4 levels of lift";

        return {
          primary: { label: "Developer Needed", value: formatNumber(developerAmount, 0), suffix: "ml" },
          details: [
            { label: "Hair Color", value: `${formatNumber(colorAmount, 0)} ml` },
            { label: "Total Mixture", value: `${formatNumber(totalMix, 0)} ml` },
            { label: "Mix Ratio", value: `1:${mixRatio}` },
            { label: "Developer", value: `${developerVol} Vol (${peroxidePercent}%)` },
            { label: "Lift Capability", value: liftCapability },
          ],
          note: "Always follow the manufacturer's instructions. Processing time is typically 30-45 minutes for permanent color.",
        };
      },
    },
  ],
  relatedSlugs: ["hair-growth-calculator", "skin-type-calculator"],
  faq: [
    { question: "How do you calculate mixed hair color levels?", answer: "To find the resulting level when mixing two shades, multiply each level by its proportion, then add. For example: equal parts Level 6 and Level 8 = (6+8)/2 = Level 7. For unequal parts, weight accordingly." },
    { question: "What developer volume should I use?", answer: "10 Vol (3%): deposit only, darken or tone. 20 Vol (6%): standard, 1-2 levels lift. 30 Vol (9%): 2-3 levels lift. 40 Vol (12%): 3-4 levels lift, for resistant hair. Higher volumes cause more damage." },
    { question: "What is the standard hair color to developer ratio?", answer: "Permanent color: 1:1. High-lift tints: 1:1.5. Demi-permanent/toners: 1:2. Lighteners/bleach: 1:2 or 1:3. Always follow the specific product instructions." },
  ],
  formula: "Resulting Level = (Level₁ × Parts₁ + Level₂ × Parts₂) / (Parts₁ + Parts₂) | Developer Amount = Color Amount × Mix Ratio",
};
