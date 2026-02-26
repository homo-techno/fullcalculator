import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const breadProofingCalculator: CalculatorDefinition = {
  slug: "bread-proofing-calculator",
  title: "Bread Proofing Time Calculator",
  description:
    "Free bread proofing time calculator. Estimate dough rising times based on temperature, yeast type, and hydration for perfect bread every time.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "bread proofing time",
    "dough rising calculator",
    "bread fermentation",
    "proofing temperature",
    "yeast rising time",
    "bread dough calculator",
  ],
  variants: [
    {
      id: "by-temperature",
      name: "By Temperature",
      description:
        "Estimate proofing time based on ambient temperature and yeast type",
      fields: [
        {
          name: "temperature",
          label: "Room Temperature (\u00b0F)",
          type: "number",
          placeholder: "e.g. 72",
          min: 35,
          max: 110,
          step: 1,
        },
        {
          name: "yeastType",
          label: "Yeast Type",
          type: "select",
          options: [
            { label: "Active Dry Yeast", value: "active_dry" },
            { label: "Instant / Rapid Rise Yeast", value: "instant" },
            { label: "Fresh / Cake Yeast", value: "fresh" },
            { label: "Sourdough Starter", value: "sourdough" },
          ],
          defaultValue: "active_dry",
        },
        {
          name: "enrichment",
          label: "Dough Type",
          type: "select",
          options: [
            { label: "Lean dough (flour, water, salt, yeast)", value: "lean" },
            { label: "Slightly enriched (some butter/eggs)", value: "slight" },
            { label: "Rich dough (brioche, challah)", value: "rich" },
          ],
          defaultValue: "lean",
        },
      ],
      calculate: (inputs) => {
        const tempF = parseFloat(inputs.temperature as string);
        const yeastType = inputs.yeastType as string;
        const enrichment = inputs.enrichment as string;
        if (!tempF) return null;

        // Base proofing time at 75F for lean dough with active dry yeast: ~90 min
        const baseTime = 90; // minutes at 75F
        const baseTemp = 75;

        // Temperature factor: roughly doubles every 15F decrease
        // Using Arrhenius-inspired approximation
        const tempFactor = Math.pow(2, (baseTemp - tempF) / 15);

        // Yeast type multiplier
        let yeastMult = 1.0;
        if (yeastType === "instant") yeastMult = 0.75;
        if (yeastType === "fresh") yeastMult = 0.9;
        if (yeastType === "sourdough") yeastMult = 2.5;

        // Enrichment multiplier (fat and sugar slow fermentation)
        let enrichMult = 1.0;
        if (enrichment === "slight") enrichMult = 1.3;
        if (enrichment === "rich") enrichMult = 1.8;

        const firstRiseMin = baseTime * tempFactor * yeastMult * enrichMult;
        const secondRiseMin = firstRiseMin * 0.6; // Second rise is typically 50-70% of first

        const firstRiseHrs = firstRiseMin / 60;
        const secondRiseHrs = secondRiseMin / 60;

        // Cold retard in fridge (38-40F)
        const coldRetardHrs = firstRiseMin * Math.pow(2, (baseTemp - 38) / 15) / 60;

        return {
          primary: {
            label: `Proofing at ${formatNumber(tempF)}\u00b0F`,
            value: `~${formatNumber(firstRiseMin, 0)} min first rise`,
          },
          details: [
            { label: "First Rise (bulk fermentation)", value: firstRiseHrs >= 2 ? `${formatNumber(firstRiseHrs, 1)} hours` : `${formatNumber(firstRiseMin, 0)} minutes` },
            { label: "Second Rise (after shaping)", value: secondRiseHrs >= 2 ? `${formatNumber(secondRiseHrs, 1)} hours` : `${formatNumber(secondRiseMin, 0)} minutes` },
            { label: "Total Proofing Time", value: `${formatNumber((firstRiseMin + secondRiseMin) / 60, 1)} hours` },
            { label: "Cold Retard Option (fridge)", value: `${formatNumber(coldRetardHrs, 0)} hours` },
          ],
          note: tempF < 50
            ? "At very low temperatures, fermentation slows dramatically. Consider a cold retard approach (8-18 hours in the fridge) for more flavor development."
            : tempF > 95
              ? "Warning: Temperatures above 95\u00b0F can kill yeast. Keep dough below 90\u00b0F for best results."
              : "The dough is ready when it has roughly doubled in size. Poke test: press a floured finger into the dough; if the indentation slowly fills back, it is ready.",
        };
      },
    },
    {
      id: "cold-retard",
      name: "Cold Retard (Fridge)",
      description:
        "Calculate overnight cold retard times for better flavor",
      fields: [
        {
          name: "fridgeTemp",
          label: "Fridge Temperature (\u00b0F)",
          type: "number",
          placeholder: "e.g. 38",
          min: 33,
          max: 45,
          step: 1,
          defaultValue: 38,
        },
        {
          name: "yeastType",
          label: "Yeast Type",
          type: "select",
          options: [
            { label: "Active Dry Yeast", value: "active_dry" },
            { label: "Instant Yeast", value: "instant" },
            { label: "Sourdough Starter", value: "sourdough" },
          ],
          defaultValue: "active_dry",
        },
      ],
      calculate: (inputs) => {
        const fridgeTemp = parseFloat(inputs.fridgeTemp as string);
        const yeastType = inputs.yeastType as string;
        if (!fridgeTemp) return null;

        let baseFridgeHrs = 12; // base at 38F for active dry
        if (yeastType === "instant") baseFridgeHrs = 10;
        if (yeastType === "sourdough") baseFridgeHrs = 16;

        // Adjust for temp: colder = slower
        const tempAdj = Math.pow(2, (38 - fridgeTemp) / 15);
        const minHrs = baseFridgeHrs * tempAdj * 0.75;
        const maxHrs = baseFridgeHrs * tempAdj * 1.5;

        return {
          primary: {
            label: `Cold retard at ${formatNumber(fridgeTemp)}\u00b0F`,
            value: `${formatNumber(minHrs, 0)}-${formatNumber(maxHrs, 0)} hours`,
          },
          details: [
            { label: "Minimum Time", value: `${formatNumber(minHrs, 0)} hours` },
            { label: "Optimal Range", value: `${formatNumber(minHrs * 1.2, 0)}-${formatNumber(maxHrs * 0.85, 0)} hours` },
            { label: "Maximum Time", value: `${formatNumber(maxHrs, 0)} hours` },
          ],
          note: "Cold retarding develops complex flavors through slow fermentation. After removing from the fridge, let the dough warm at room temperature for 1-2 hours before baking.",
        };
      },
    },
  ],
  relatedSlugs: [
    "cooking-converter",
    "fermentation-time-calculator",
    "kombucha-brew-calculator",
  ],
  faq: [
    {
      question: "What is the ideal temperature for proofing bread?",
      answer:
        "The ideal proofing temperature for most bread is 75-80\u00b0F (24-27\u00b0C). At this range, yeast is most active without producing off-flavors. You can proof in a turned-off oven with the light on, or near a warm appliance.",
    },
    {
      question: "Why does cold retarding improve bread flavor?",
      answer:
        "Cold retarding (proofing in the fridge at 38-40\u00b0F) slows yeast activity while allowing enzymes and beneficial bacteria to work. This extended fermentation breaks down starches into sugars and develops complex, slightly tangy flavors.",
    },
    {
      question: "How do I know when my dough has proofed enough?",
      answer:
        "The dough should roughly double in size. Use the poke test: press a floured finger about 1/2 inch into the dough. If the indent slowly springs back but does not fully fill in, the dough is properly proofed. If it springs back quickly, it needs more time.",
    },
  ],
  formula:
    "Proofing Time = Base Time x Temperature Factor x Yeast Multiplier x Enrichment Multiplier | Temp Factor = 2^((75 - Temp) / 15)",
};
