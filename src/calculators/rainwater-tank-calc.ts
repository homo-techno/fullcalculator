import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rainwaterTankCalculator: CalculatorDefinition = {
  slug: "rainwater-tank-calc",
  title: "Rainwater Collection Tank Calculator",
  description:
    "Free rainwater collection and tank sizing calculator. Calculate potential rainwater harvest from roof area and local rainfall. Determine the right tank size for your needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "rainwater tank calculator",
    "rainwater harvesting",
    "rain barrel sizing",
    "cistern calculator",
    "rainwater collection",
    "roof runoff calculator",
    "water tank size",
  ],
  variants: [
    {
      id: "collection-potential",
      name: "Rainwater Collection Potential",
      description: "Calculate how much rainwater you can collect",
      fields: [
        {
          name: "roofArea",
          label: "Roof Collection Area (sq ft)",
          type: "number",
          placeholder: "e.g. 1500",
        },
        {
          name: "annualRainfall",
          label: "Annual Rainfall (inches)",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "roofType",
          label: "Roof Type (runoff coefficient)",
          type: "select",
          options: [
            { label: "Metal roof (0.95)", value: "0.95" },
            { label: "Asphalt shingle (0.85)", value: "0.85" },
            { label: "Tile/Slate (0.80)", value: "0.80" },
            { label: "Flat/Rubber (0.75)", value: "0.75" },
            { label: "Green/Living roof (0.40)", value: "0.40" },
          ],
          defaultValue: "0.85",
        },
      ],
      calculate: (inputs) => {
        const roofArea = parseFloat(inputs.roofArea as string);
        const rainfall = parseFloat(inputs.annualRainfall as string);
        const coefficient = parseFloat(inputs.roofType as string);
        if (isNaN(roofArea) || isNaN(rainfall) || isNaN(coefficient)) return null;
        if (roofArea <= 0 || rainfall <= 0) return null;

        // 1 inch of rain on 1 sq ft = 0.623 gallons
        const grossGallons = roofArea * (rainfall / 12) * 7.48; // cu ft to gallons
        const netGallons = grossGallons * coefficient;
        const monthlyAvg = netGallons / 12;
        const perInchOfRain = roofArea * 0.623 * coefficient;

        return {
          primary: {
            label: "Annual Collection Potential",
            value: formatNumber(netGallons, 0),
            suffix: "gallons/year",
          },
          details: [
            { label: "Gross (before losses)", value: formatNumber(grossGallons, 0) + " gallons" },
            { label: "Monthly Average", value: formatNumber(monthlyAvg, 0) + " gallons" },
            { label: "Per Inch of Rain", value: formatNumber(perInchOfRain, 0) + " gallons" },
            { label: "Roof Area", value: formatNumber(roofArea) + " sq ft" },
            { label: "Runoff Coefficient", value: formatNumber(coefficient * 100) + "%" },
          ],
        };
      },
    },
    {
      id: "tank-sizing",
      name: "Tank Size Calculator",
      description: "Determine the right tank size for your water needs",
      fields: [
        {
          name: "dailyUsage",
          label: "Daily Water Usage (gallons)",
          type: "number",
          placeholder: "e.g. 50",
        },
        {
          name: "usageType",
          label: "Primary Use",
          type: "select",
          options: [
            { label: "Garden irrigation only", value: "garden" },
            { label: "Landscape + garden", value: "landscape" },
            { label: "Household non-potable", value: "nonpotable" },
            { label: "Full household (with treatment)", value: "full" },
          ],
          defaultValue: "garden",
        },
        {
          name: "drySpellDays",
          label: "Longest Dry Spell (days)",
          type: "number",
          placeholder: "e.g. 30",
          defaultValue: 30,
        },
        {
          name: "roofArea",
          label: "Roof Area (sq ft)",
          type: "number",
          placeholder: "e.g. 1500",
        },
        {
          name: "monthlyRain",
          label: "Avg Monthly Rainfall (inches)",
          type: "number",
          placeholder: "e.g. 3.5",
        },
      ],
      calculate: (inputs) => {
        const dailyUsage = parseFloat(inputs.dailyUsage as string);
        const drySpell = parseFloat(inputs.drySpellDays as string);
        const roofArea = parseFloat(inputs.roofArea as string);
        const monthlyRain = parseFloat(inputs.monthlyRain as string);
        if ([dailyUsage, drySpell, roofArea, monthlyRain].some((v) => isNaN(v) || v <= 0)) return null;

        const storageNeeded = dailyUsage * drySpell;
        const monthlyCollection = roofArea * 0.623 * monthlyRain * 0.85; // 0.85 avg coefficient
        const monthlyUsage = dailyUsage * 30;
        const surplus = monthlyCollection - monthlyUsage;

        // Recommend tank with 20% buffer
        const recommendedTank = storageNeeded * 1.2;

        // Common tank sizes
        const commonSizes = [55, 100, 200, 500, 1000, 1500, 2500, 5000, 10000];
        const nearestTank = commonSizes.find((s) => s >= recommendedTank) || recommendedTank;

        const daysOfSupply = nearestTank / dailyUsage;

        return {
          primary: {
            label: "Recommended Tank Size",
            value: formatNumber(nearestTank),
            suffix: "gallons",
          },
          details: [
            { label: "Storage Needed (dry spell)", value: formatNumber(storageNeeded) + " gallons" },
            { label: "Monthly Collection (est.)", value: formatNumber(monthlyCollection, 0) + " gallons" },
            { label: "Monthly Usage", value: formatNumber(monthlyUsage, 0) + " gallons" },
            { label: "Monthly Surplus/Deficit", value: (surplus >= 0 ? "+" : "") + formatNumber(surplus, 0) + " gallons" },
            { label: "Days of Supply (full tank)", value: formatNumber(daysOfSupply, 0) + " days" },
          ],
          note: surplus < 0
            ? "Monthly usage exceeds collection. Consider supplemental water or reducing usage."
            : "Collection exceeds usage - rainwater can meet your needs during typical months.",
        };
      },
    },
    {
      id: "savings",
      name: "Water Bill Savings",
      description: "Calculate potential water bill savings",
      fields: [
        {
          name: "monthlyCollection",
          label: "Monthly Rainwater Collection (gallons)",
          type: "number",
          placeholder: "e.g. 2000",
        },
        {
          name: "waterRate",
          label: "Water Utility Rate ($/1000 gal)",
          type: "number",
          placeholder: "e.g. 8",
          defaultValue: 8,
        },
        {
          name: "sewerRate",
          label: "Sewer Rate ($/1000 gal)",
          type: "number",
          placeholder: "e.g. 6",
          defaultValue: 6,
        },
        {
          name: "tankCost",
          label: "Total System Cost ($)",
          type: "number",
          placeholder: "e.g. 500",
        },
      ],
      calculate: (inputs) => {
        const monthlyGal = parseFloat(inputs.monthlyCollection as string);
        const waterRate = parseFloat(inputs.waterRate as string);
        const sewerRate = parseFloat(inputs.sewerRate as string);
        const tankCost = parseFloat(inputs.tankCost as string);
        if ([monthlyGal, waterRate, sewerRate, tankCost].some((v) => isNaN(v) || v <= 0)) return null;

        const monthlySavings = (monthlyGal / 1000) * (waterRate + sewerRate);
        const annualSavings = monthlySavings * 12;
        const paybackMonths = tankCost / monthlySavings;
        const savingsOver10Years = annualSavings * 10 - tankCost;

        return {
          primary: {
            label: "Annual Water Bill Savings",
            value: formatNumber(annualSavings, 2),
            suffix: "$/year",
          },
          details: [
            { label: "Monthly Savings", value: "$" + formatNumber(monthlySavings, 2) },
            { label: "Payback Period", value: formatNumber(paybackMonths, 1) + " months" },
            { label: "10-Year Net Savings", value: "$" + formatNumber(savingsOver10Years, 2) },
            { label: "Water Offset", value: formatNumber(monthlyGal * 12) + " gal/year" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rain-garden-calc", "pool-volume-calculator", "solar-battery-calc"],
  faq: [
    {
      question: "How much rainwater can I collect from my roof?",
      answer:
        "For every 1 inch of rain on 1,000 sq ft of roof, you can collect about 600 gallons (accounting for losses). A 1,500 sq ft roof in an area with 40 inches of annual rainfall can collect roughly 30,000-35,000 gallons per year.",
    },
    {
      question: "What size rainwater tank do I need?",
      answer:
        "For garden irrigation only, a 500-1,000 gallon tank is typical. For landscape use, 1,000-2,500 gallons. For whole-house non-potable use, 5,000-10,000 gallons. Size depends on your dry season length and daily usage.",
    },
    {
      question: "Is collected rainwater safe to drink?",
      answer:
        "Raw rooftop rainwater is not safe to drink without treatment. It can contain bacteria, chemicals from roofing materials, and debris. With proper filtration (sediment + carbon), UV treatment, and possibly reverse osmosis, it can be made potable. Always test water quality.",
    },
  ],
  formula:
    "Gallons = Roof Area x Rainfall (in) x 0.623 x Coefficient | Tank Size = Daily Usage x Dry Spell Days x 1.2",
};
