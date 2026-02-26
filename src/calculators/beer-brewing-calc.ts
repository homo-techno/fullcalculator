import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beerBrewingCalculator: CalculatorDefinition = {
  slug: "beer-brewing-calc",
  title: "Beer Brewing ABV & IBU Calculator",
  description: "Free online beer brewing calculator. Calculate ABV, IBU, and other key metrics for your homebrew recipe.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["beer brewing calculator", "ABV calculator", "IBU calculator", "homebrew", "original gravity", "beer recipe"],
  variants: [
    {
      id: "abv",
      name: "ABV Calculator",
      description: "Calculate alcohol by volume from gravity readings",
      fields: [
        { name: "og", label: "Original Gravity (OG)", type: "number", placeholder: "e.g. 1.050", step: 0.001 },
        { name: "fg", label: "Final Gravity (FG)", type: "number", placeholder: "e.g. 1.010", step: 0.001 },
      ],
      calculate: (inputs) => {
        const og = parseFloat(inputs.og as string) || 0;
        const fg = parseFloat(inputs.fg as string) || 0;

        const abv = (og - fg) * 131.25;
        const abw = abv * 0.8;
        const attenuation = og > 1 ? ((og - fg) / (og - 1)) * 100 : 0;
        const caloriesPer12oz = (((6.9 * abw) + 4.0 * (fg - 1.0) * 1000) * fg * 3.55);

        return {
          primary: { label: "ABV", value: `${formatNumber(abv)}%` },
          details: [
            { label: "ABW (Alcohol by Weight)", value: `${formatNumber(abw)}%` },
            { label: "Apparent Attenuation", value: `${formatNumber(attenuation)}%` },
            { label: "Original Gravity", value: formatNumber(og) },
            { label: "Final Gravity", value: formatNumber(fg) },
            { label: "Est. Calories (12 oz)", value: formatNumber(caloriesPer12oz) },
          ],
        };
      },
    },
    {
      id: "ibu",
      name: "IBU Calculator (Tinseth)",
      description: "Calculate bitterness from hop additions",
      fields: [
        { name: "hopOz", label: "Hop Amount (oz)", type: "number", placeholder: "e.g. 1.5", step: 0.25 },
        { name: "alphaAcid", label: "Alpha Acid (%)", type: "number", placeholder: "e.g. 6.5", step: 0.1 },
        { name: "boilTime", label: "Boil Time (minutes)", type: "number", placeholder: "e.g. 60" },
        { name: "batchSize", label: "Batch Size (gallons)", type: "number", placeholder: "e.g. 5" },
        { name: "wortGravity", label: "Wort Gravity", type: "number", placeholder: "e.g. 1.050", step: 0.001 },
      ],
      calculate: (inputs) => {
        const hopOz = parseFloat(inputs.hopOz as string) || 0;
        const alphaAcid = parseFloat(inputs.alphaAcid as string) || 0;
        const boilTime = parseFloat(inputs.boilTime as string) || 0;
        const batchSize = parseFloat(inputs.batchSize as string) || 5;
        const wortGravity = parseFloat(inputs.wortGravity as string) || 1.050;

        // Tinseth formula
        const bignessFactor = 1.65 * Math.pow(0.000125, wortGravity - 1);
        const boilTimeFactor = (1 - Math.exp(-0.04 * boilTime)) / 4.15;
        const utilization = bignessFactor * boilTimeFactor;
        const ibu = (hopOz * alphaAcid * utilization * 7490) / batchSize;

        return {
          primary: { label: "IBU", value: formatNumber(ibu) },
          details: [
            { label: "Hop Utilization", value: `${formatNumber(utilization * 100)}%` },
            { label: "Hop Amount", value: `${formatNumber(hopOz)} oz` },
            { label: "Alpha Acid", value: `${formatNumber(alphaAcid)}%` },
            { label: "Boil Time", value: `${formatNumber(boilTime)} min` },
            { label: "Batch Size", value: `${formatNumber(batchSize)} gal` },
          ],
        };
      },
    },
    {
      id: "srm",
      name: "Beer Color (SRM)",
      description: "Estimate beer color from grain bill",
      fields: [
        { name: "grainLbs", label: "Grain Weight (lbs)", type: "number", placeholder: "e.g. 10" },
        { name: "grainLovibond", label: "Grain Color (°Lovibond)", type: "number", placeholder: "e.g. 3.5" },
        { name: "batchSize", label: "Batch Size (gallons)", type: "number", placeholder: "e.g. 5" },
      ],
      calculate: (inputs) => {
        const grainLbs = parseFloat(inputs.grainLbs as string) || 0;
        const lovibond = parseFloat(inputs.grainLovibond as string) || 0;
        const batchSize = parseFloat(inputs.batchSize as string) || 5;

        // Morey equation
        const mcu = (grainLbs * lovibond) / batchSize;
        const srm = 1.4922 * Math.pow(mcu, 0.6859);

        let colorName = "Straw";
        if (srm > 30) colorName = "Black";
        else if (srm > 20) colorName = "Dark Brown";
        else if (srm > 14) colorName = "Brown";
        else if (srm > 10) colorName = "Amber";
        else if (srm > 6) colorName = "Gold";
        else if (srm > 3) colorName = "Pale";

        return {
          primary: { label: "SRM", value: formatNumber(srm) },
          details: [
            { label: "Color Description", value: colorName },
            { label: "MCU", value: formatNumber(mcu) },
            { label: "Grain Weight", value: `${formatNumber(grainLbs)} lbs` },
            { label: "Lovibond", value: formatNumber(lovibond) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cold-brew-ratio", "party-drink-calc", "sourdough-calc"],
  faq: [
    {
      question: "How do I calculate ABV of my homebrew?",
      answer: "Use the formula: ABV = (Original Gravity - Final Gravity) × 131.25. Take a gravity reading before and after fermentation using a hydrometer or refractometer.",
    },
    {
      question: "What is IBU in beer?",
      answer: "IBU stands for International Bitterness Units. It measures the bitterness from hops. Light lagers have 5-15 IBU, pale ales 30-50 IBU, and IPAs can be 40-100+ IBU.",
    },
    {
      question: "What is a good OG for a standard beer?",
      answer: "A standard beer typically has an original gravity between 1.040 and 1.060. This usually results in an ABV of 4-6%. Stronger beers can have an OG of 1.080 or higher.",
    },
  ],
  formula: "ABV = (OG - FG) × 131.25; IBU = (oz × AA% × utilization × 7490) / batch_gallons",
};
