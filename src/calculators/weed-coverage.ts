import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weedCoverageCalculator: CalculatorDefinition = {
  slug: "weed-coverage-calculator",
  title: "Weed Killer Coverage Calculator",
  description: "Free weed killer coverage calculator. Calculate how much herbicide you need based on area, product concentration, and application method for lawns and gardens.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["weed killer calculator", "herbicide coverage calculator", "weed spray calculator", "how much weed killer", "roundup coverage calculator"],
  variants: [
    {
      id: "spray-coverage",
      name: "Spray Coverage",
      description: "Calculate weed killer for spray application",
      fields: [
        { name: "area", label: "Area to Treat (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "productType", label: "Product Type", type: "select", options: [
          { label: "Ready-to-Use (RTU) Spray", value: "rtu" },
          { label: "Concentrate (Mix with Water)", value: "concentrate" },
          { label: "Granular Weed & Feed", value: "granular" },
        ], defaultValue: "concentrate" },
        { name: "applicationRate", label: "Application Rate", type: "select", options: [
          { label: "Light (spot treatment)", value: "light" },
          { label: "Standard (broadcast)", value: "standard" },
          { label: "Heavy (thick weed coverage)", value: "heavy" },
        ], defaultValue: "standard" },
        { name: "weedDensity", label: "Weed Coverage", type: "select", options: [
          { label: "Light (less than 25%)", value: "light" },
          { label: "Moderate (25-50%)", value: "moderate" },
          { label: "Heavy (50-75%)", value: "heavy" },
          { label: "Very Heavy (75%+)", value: "very_heavy" },
        ], defaultValue: "moderate" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const product = inputs.productType as string;
        const rate = inputs.applicationRate as string;
        const density = inputs.weedDensity as string;
        if (!area) return null;

        const densityFactor: Record<string, number> = {
          light: 0.5, moderate: 0.75, heavy: 1.0, very_heavy: 1.25,
        };
        const effectiveArea = area * (densityFactor[density] || 1);

        if (product === "rtu") {
          const ozPerSqFt = rate === "light" ? 0.5 : rate === "standard" ? 1 : 1.5;
          const totalOz = effectiveArea * (ozPerSqFt / 100);
          const gallons = totalOz / 128;
          return {
            primary: { label: "RTU Spray Needed", value: `${formatNumber(totalOz, 0)} oz (${formatNumber(gallons, 1)} gallons)` },
            details: [
              { label: "Treatment area", value: `${formatNumber(area, 0)} sq ft` },
              { label: "Effective spray area", value: `${formatNumber(effectiveArea, 0)} sq ft (${density} weed density)` },
              { label: "24-oz bottles needed", value: `${Math.ceil(totalOz / 24)}` },
              { label: "1-gallon bottles needed", value: `${Math.ceil(gallons)}` },
            ],
            note: "Ready-to-use sprays are best for spot treatment of small areas. For large areas, concentrate is more economical.",
          };
        } else if (product === "granular") {
          const lbsPer1000 = rate === "light" ? 2.5 : rate === "standard" ? 3.5 : 4.5;
          const totalLbs = (area / 1000) * lbsPer1000;
          const bags = Math.ceil(totalLbs / 15);
          return {
            primary: { label: "Granular Product Needed", value: `${formatNumber(totalLbs, 1)} lbs` },
            details: [
              { label: "Application rate", value: `${lbsPer1000} lbs per 1000 sq ft` },
              { label: "Treatment area", value: `${formatNumber(area, 0)} sq ft` },
              { label: "15-lb bags needed", value: `${bags}` },
              { label: "Estimated cost", value: `$${formatNumber(bags * 25, 0)}` },
            ],
            note: "Apply granular herbicide to damp grass so granules stick to weed leaves. Do not mow for 2-3 days after application.",
          };
        } else {
          const ozPer1000 = rate === "light" ? 1 : rate === "standard" ? 2 : 3;
          const concentrateOz = (effectiveArea / 1000) * ozPer1000;
          const waterGallons = effectiveArea / 1000;
          return {
            primary: { label: "Concentrate Needed", value: `${formatNumber(concentrateOz, 1)} oz` },
            details: [
              { label: "Mixing rate", value: `${ozPer1000} oz per 1000 sq ft` },
              { label: "Water needed for mixing", value: `${formatNumber(waterGallons, 1)} gallons` },
              { label: "Treatment area", value: `${formatNumber(area, 0)} sq ft (${density} density)` },
              { label: "32-oz bottles needed", value: `${Math.ceil(concentrateOz / 32)}` },
              { label: "Sprayer tank loads (2 gal)", value: `${Math.ceil(waterGallons / 2)}` },
            ],
            note: "Mix concentrate according to label directions. Apply when temperatures are 60-85°F and no rain expected for 24 hours. Use a surfactant for better leaf adhesion.",
          };
        }
      },
    },
    {
      id: "weed-prevention",
      name: "Pre-Emergent Coverage",
      description: "Calculate pre-emergent herbicide for weed prevention",
      fields: [
        { name: "area", label: "Area to Treat (sq ft)", type: "number", placeholder: "e.g. 5000" },
        { name: "product", label: "Pre-Emergent Type", type: "select", options: [
          { label: "Granular Pre-Emergent", value: "granular" },
          { label: "Liquid Pre-Emergent", value: "liquid" },
          { label: "Corn Gluten Meal (Organic)", value: "corngluten" },
        ], defaultValue: "granular" },
        { name: "season", label: "Application Timing", type: "select", options: [
          { label: "Spring (before crabgrass)", value: "spring" },
          { label: "Fall (before winter annuals)", value: "fall" },
          { label: "Split Application (spring + fall)", value: "split" },
        ], defaultValue: "spring" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const product = inputs.product as string;
        const season = inputs.season as string;
        if (!area) return null;

        const rates: Record<string, number> = {
          granular: 3.5, liquid: 1.5, corngluten: 20,
        };
        const lbsPer1000 = rates[product] || 3.5;
        const totalLbs = (area / 1000) * lbsPer1000;
        const splitMultiplier = season === "split" ? 2 : 1;
        const annualTotal = totalLbs * splitMultiplier;
        const bagSize = product === "corngluten" ? 40 : 15;
        const bags = Math.ceil(annualTotal / bagSize);

        return {
          primary: { label: "Product Needed", value: `${formatNumber(totalLbs, 1)} lbs per application` },
          details: [
            { label: "Rate", value: `${lbsPer1000} lbs per 1000 sq ft` },
            { label: "Applications per year", value: `${splitMultiplier}` },
            { label: "Annual total", value: `${formatNumber(annualTotal, 1)} lbs` },
            { label: `${bagSize}-lb bags needed`, value: `${bags}` },
            { label: "Timing", value: season === "spring" ? "Apply when soil temp reaches 55°F" : season === "fall" ? "Apply in late August/September" : "Spring + Fall applications" },
          ],
          note: "Pre-emergent herbicides must be applied BEFORE weed seeds germinate. Water in within 48 hours. Do not aerate or disturb soil after application.",
        };
      },
    },
  ],
  relatedSlugs: ["lawn-fertilizer-calculator", "lawn-calculator", "sprinkler-coverage-calculator"],
  faq: [
    { question: "How much weed killer do I need per 1000 square feet?", answer: "It depends on the product: Ready-to-use sprays need about 1 gallon per 1000 sq ft, concentrate typically needs 1-3 oz per 1000 sq ft mixed with water, and granular products need 2.5-4.5 lbs per 1000 sq ft. Always follow product label rates." },
    { question: "When is the best time to apply weed killer?", answer: "Apply post-emergent herbicides when weeds are actively growing, typically spring and fall when temperatures are 60-85°F. Apply pre-emergent in early spring (soil temp 55°F) before crabgrass germinates and in fall before winter annuals." },
    { question: "How long after spraying weed killer can I mow?", answer: "Wait 2-3 days after applying herbicide before mowing to allow the product to be absorbed by weed leaves. Also avoid mowing 2-3 days before application so weeds have enough leaf surface to absorb the herbicide." },
  ],
  formula: "Concentrate (oz) = (Area / 1000) × Rate per 1000 sq ft | Granular (lbs) = (Area / 1000) × Rate per 1000 sq ft",
};
