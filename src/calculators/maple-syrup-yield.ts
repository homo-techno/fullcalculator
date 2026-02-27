import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mapleSyrupYieldCalculator: CalculatorDefinition = {
  slug: "maple-syrup-yield-calculator",
  title: "Maple Syrup Yield Calculator",
  description:
    "Free maple syrup production yield estimator. Calculate expected syrup yield based on number of taps, sap sugar content, and boiling ratios.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "maple syrup calculator",
    "sap to syrup ratio",
    "maple syrup yield",
    "sugar bush calculator",
    "tapping maple trees",
  ],
  variants: [
    {
      id: "tap-yield",
      name: "Yield by Taps",
      description: "Estimate syrup production based on number of taps",
      fields: [
        {
          name: "numTaps",
          label: "Number of Taps",
          type: "number",
          placeholder: "e.g. 25",
          min: 1,
          max: 5000,
        },
        {
          name: "sugarContent",
          label: "Average Sap Sugar Content (%)",
          type: "select",
          options: [
            { label: "1.5% (low - red maple)", value: "1.5" },
            { label: "2.0% (average)", value: "2.0" },
            { label: "2.5% (good - sugar maple)", value: "2.5" },
            { label: "3.0% (excellent)", value: "3.0" },
            { label: "3.5% (exceptional)", value: "3.5" },
          ],
          defaultValue: "2.0",
        },
        {
          name: "seasonQuality",
          label: "Expected Season Quality",
          type: "select",
          options: [
            { label: "Poor (6-8 gal sap/tap)", value: "poor" },
            { label: "Average (10-12 gal sap/tap)", value: "average" },
            { label: "Good (14-16 gal sap/tap)", value: "good" },
            { label: "Excellent (18-20 gal sap/tap)", value: "excellent" },
          ],
          defaultValue: "average",
        },
        {
          name: "equipment",
          label: "Collection Method",
          type: "select",
          options: [
            { label: "Buckets/Bags", value: "bucket" },
            { label: "Tubing (gravity)", value: "gravity" },
            { label: "Tubing + Vacuum", value: "vacuum" },
          ],
          defaultValue: "bucket",
        },
      ],
      calculate: (inputs) => {
        const taps = parseFloat(inputs.numTaps as string);
        const sugar = parseFloat(inputs.sugarContent as string);
        const season = inputs.seasonQuality as string;
        const equipment = inputs.equipment as string;
        if (!taps || !sugar) return null;

        // Sap gallons per tap per season
        const sapPerTap: Record<string, number> = {
          poor: 7,
          average: 11,
          good: 15,
          excellent: 19,
        };

        // Equipment efficiency multiplier
        const equipMultiplier: Record<string, number> = {
          bucket: 1.0,
          gravity: 1.15,
          vacuum: 1.5,
        };

        const baseSap = sapPerTap[season] || 11;
        const effMult = equipMultiplier[equipment] || 1.0;
        const totalSapGallons = taps * baseSap * effMult;

        // Rule of 86: gallons of sap needed = 86 / sugar%
        const sapToSyrupRatio = 86 / sugar;
        const syrupGallons = totalSapGallons / sapToSyrupRatio;
        const syrupQuarts = syrupGallons * 4;
        const syrupLiters = syrupGallons * 3.785;
        const syrupPints = syrupGallons * 8;

        // Fuel estimates (approximately 1 cord of wood per 25 gallons of syrup for wood-fired)
        const cordWood = syrupGallons / 25;

        // Boiling time estimate (roughly 1 gallon syrup per hour for a good setup)
        const boilHours = syrupGallons * 1.2;

        return {
          primary: {
            label: "Estimated Syrup Yield",
            value: formatNumber(syrupGallons, 1) + " gallons",
          },
          details: [
            { label: "Syrup (quarts)", value: formatNumber(syrupQuarts, 0) },
            { label: "Syrup (liters)", value: formatNumber(syrupLiters, 1) },
            { label: "Syrup (pints)", value: formatNumber(syrupPints, 0) },
            { label: "Total Sap Collected", value: formatNumber(totalSapGallons, 0) + " gallons" },
            { label: "Sap-to-Syrup Ratio", value: formatNumber(sapToSyrupRatio, 0) + ":1" },
            { label: "Sap Per Tap", value: formatNumber(baseSap * effMult, 1) + " gallons" },
            { label: "Est. Boiling Time", value: formatNumber(boilHours, 0) + " hours" },
            { label: "Est. Firewood", value: formatNumber(cordWood, 1) + " cords" },
          ],
          note: "Syrup must reach 66-67 Brix (219F / 104C) to be properly finished. Always filter hot syrup before bottling.",
        };
      },
    },
    {
      id: "sap-ratio",
      name: "Sap-to-Syrup Ratio",
      description: "Calculate exact sap needed using the Rule of 86",
      fields: [
        {
          name: "sapSugar",
          label: "Sap Sugar Content (%Brix)",
          type: "number",
          placeholder: "e.g. 2.0",
          min: 0.5,
          max: 10,
          step: 0.1,
        },
        {
          name: "sapGallons",
          label: "Sap Collected (gallons)",
          type: "number",
          placeholder: "e.g. 100",
          min: 1,
        },
      ],
      calculate: (inputs) => {
        const sugar = parseFloat(inputs.sapSugar as string);
        const sapGallons = parseFloat(inputs.sapGallons as string);
        if (!sugar || !sapGallons) return null;

        const ratio = 86 / sugar;
        const syrupGallons = sapGallons / ratio;
        const syrupQuarts = syrupGallons * 4;
        const syrupOz = syrupGallons * 128;
        const syrupLbs = syrupGallons * 11.03; // maple syrup weighs 11.03 lbs/gal

        return {
          primary: {
            label: "Syrup Yield",
            value: formatNumber(syrupGallons, 2) + " gallons",
          },
          details: [
            { label: "Sap-to-Syrup Ratio", value: formatNumber(ratio, 1) + ":1" },
            { label: "Syrup (quarts)", value: formatNumber(syrupQuarts, 1) },
            { label: "Syrup (fl oz)", value: formatNumber(syrupOz, 0) },
            { label: "Syrup Weight", value: formatNumber(syrupLbs, 1) + " lbs" },
            { label: "Water to Evaporate", value: formatNumber(sapGallons - syrupGallons, 0) + " gallons" },
          ],
          note: "The Rule of 86: divide 86 by the sugar percentage to find how many gallons of sap make one gallon of syrup.",
        };
      },
    },
  ],
  relatedSlugs: ["cooking-converter", "unit-converter"],
  faq: [
    {
      question: "How much sap does it take to make maple syrup?",
      answer:
        "On average, it takes about 40-43 gallons of sap to make one gallon of maple syrup (at 2% sugar content). This ratio varies with sugar content - higher sugar sap requires less boiling. The Rule of 86 says: gallons of sap needed = 86 / sugar percentage.",
    },
    {
      question: "How much syrup does one tap produce?",
      answer:
        "A single tap typically produces 10-12 gallons of sap per season (about 1 quart of syrup) with buckets. With vacuum tubing, yields can increase to 15-20+ gallons of sap per tap. Season length and weather patterns significantly affect production.",
    },
    {
      question: "When is maple syrup season?",
      answer:
        "Maple syrup season runs from late January to early April, depending on location. Sap flows when daytime temperatures are above freezing (40F+) and nighttime temperatures drop below freezing. A typical season lasts 4-6 weeks.",
    },
  ],
  formula:
    "Rule of 86: Sap-to-Syrup Ratio = 86 / Sugar % | Syrup Yield = Total Sap / Ratio | Sap per Tap ≈ 10-20 gallons/season",
};
