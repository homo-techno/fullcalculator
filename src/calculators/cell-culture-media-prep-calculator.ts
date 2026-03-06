import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cellCultureMediaPrepCalculator: CalculatorDefinition = {
  slug: "cell-culture-media-prep-calculator",
  title: "Cell Culture Media Preparation Calculator",
  description: "Calculate volumes of base media, serum, and supplements needed to prepare cell culture media for a given total volume with correct percentages.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["cell culture media","media preparation","fbs volume","culture medium recipe","cell culture supplements"],
  variants: [{
    id: "standard",
    name: "Cell Culture Media Preparation",
    description: "Calculate volumes of base media, serum, and supplements needed to prepare cell culture media for a given total volume with correct percentages.",
    fields: [
      { name: "totalVolume", label: "Total Volume to Prepare (mL)", type: "number", min: 10, max: 10000, defaultValue: 500 },
      { name: "serumPercent", label: "Serum Percentage (%)", type: "number", min: 0, max: 30, defaultValue: 10 },
      { name: "antibioticPercent", label: "Antibiotic Percentage (%)", type: "number", min: 0, max: 5, defaultValue: 1 },
      { name: "glutaminePercent", label: "L-Glutamine Percentage (%)", type: "number", min: 0, max: 5, defaultValue: 1 },
      { name: "otherPercent", label: "Other Supplements (%)", type: "number", min: 0, max: 10, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const totalVolume = inputs.totalVolume as number;
    const serumPercent = inputs.serumPercent as number;
    const antibioticPercent = inputs.antibioticPercent as number;
    const glutaminePercent = inputs.glutaminePercent as number;
    const otherPercent = inputs.otherPercent as number;
    const totalSupplementPercent = serumPercent + antibioticPercent + glutaminePercent + otherPercent;
    const baseMediaPercent = 100 - totalSupplementPercent;
    const baseMediaVol = totalVolume * baseMediaPercent / 100;
    const serumVol = totalVolume * serumPercent / 100;
    const antibioticVol = totalVolume * antibioticPercent / 100;
    const glutamineVol = totalVolume * glutaminePercent / 100;
    const otherVol = totalVolume * otherPercent / 100;
    return {
      primary: { label: "Base Media Volume", value: formatNumber(Math.round(baseMediaVol * 10) / 10) + " mL" },
      details: [
        { label: "Serum Volume", value: formatNumber(Math.round(serumVol * 10) / 10) + " mL" },
        { label: "Antibiotic Volume", value: formatNumber(Math.round(antibioticVol * 10) / 10) + " mL" },
        { label: "L-Glutamine Volume", value: formatNumber(Math.round(glutamineVol * 10) / 10) + " mL" },
        { label: "Other Supplements", value: formatNumber(Math.round(otherVol * 10) / 10) + " mL" }
      ]
    };
  },
  }],
  relatedSlugs: ["solution-preparation-calculator","dilution-calculator","molarity-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Base Media = Total Volume x (100 - Sum of Supplement %) / 100; Supplement Volume = Total Volume x Supplement % / 100",
};
