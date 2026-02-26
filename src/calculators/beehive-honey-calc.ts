import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beehiveHoneyCalculator: CalculatorDefinition = {
  slug: "beehive-honey-calc",
  title: "Beehive Honey Yield Calculator",
  description:
    "Free beehive honey yield calculator. Estimate honey production per hive based on region, hive type, and forage quality. Includes revenue projections.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "beehive honey calculator",
    "honey yield calculator",
    "beekeeping calculator",
    "honey production estimate",
    "apiary calculator",
    "hive honey harvest",
    "bee honey output",
  ],
  variants: [
    {
      id: "honey-yield",
      name: "Honey Yield Estimator",
      description: "Estimate honey harvest per hive",
      fields: [
        {
          name: "hives",
          label: "Number of Hives",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "hiveType",
          label: "Hive Type",
          type: "select",
          options: [
            { label: "Langstroth (standard)", value: "langstroth" },
            { label: "Top Bar", value: "topbar" },
            { label: "Warre", value: "warre" },
            { label: "Flow Hive", value: "flow" },
          ],
          defaultValue: "langstroth",
        },
        {
          name: "region",
          label: "Region / Climate",
          type: "select",
          options: [
            { label: "Excellent forage (rural wildflower)", value: "excellent" },
            { label: "Good forage (suburban, gardens)", value: "good" },
            { label: "Average forage (mixed area)", value: "average" },
            { label: "Poor forage (urban, limited)", value: "poor" },
          ],
          defaultValue: "good",
        },
        {
          name: "experience",
          label: "Beekeeper Experience",
          type: "select",
          options: [
            { label: "Beginner (1st-2nd year)", value: "0.6" },
            { label: "Intermediate (3-5 years)", value: "0.85" },
            { label: "Experienced (5+ years)", value: "1.0" },
          ],
          defaultValue: "0.85",
        },
      ],
      calculate: (inputs) => {
        const hives = parseFloat(inputs.hives as string);
        const hiveType = inputs.hiveType as string;
        const region = inputs.region as string;
        const expFactor = parseFloat(inputs.experience as string);
        if (isNaN(hives) || isNaN(expFactor) || hives <= 0) return null;

        // Base yield per hive in lbs
        const hiveYields: Record<string, number> = {
          "langstroth": 60,
          "topbar": 25,
          "warre": 35,
          "flow": 55,
        };

        const regionFactors: Record<string, number> = {
          "excellent": 1.5,
          "good": 1.0,
          "average": 0.7,
          "poor": 0.4,
        };

        const baseYield = hiveYields[hiveType] || 60;
        const regionFactor = regionFactors[region] || 1.0;

        const yieldPerHive = baseYield * regionFactor * expFactor;
        const totalYield = yieldPerHive * hives;
        const jarsPerHive = yieldPerHive / 0.75; // ~12 oz per jar
        const totalJars = totalYield / 0.75;

        // Revenue estimate ($10-15/lb for local honey)
        const revenuePerLb = 12;
        const totalRevenue = totalYield * revenuePerLb;

        // Bees need about 60 lbs for winter; subtract from gross
        const winterReserve = 60 * hives;

        return {
          primary: {
            label: "Estimated Honey Harvest",
            value: formatNumber(totalYield, 1),
            suffix: "lbs/year",
          },
          details: [
            { label: "Per Hive", value: formatNumber(yieldPerHive, 1) + " lbs" },
            { label: "12oz Jars (total)", value: formatNumber(Math.floor(totalJars)) },
            { label: "Potential Revenue", value: "$" + formatNumber(totalRevenue, 2) + " (@ $" + formatNumber(revenuePerLb) + "/lb)" },
            { label: "Winter Reserve Needed", value: formatNumber(winterReserve) + " lbs (leave in hive)" },
            { label: "Hive Type", value: hiveType.charAt(0).toUpperCase() + hiveType.slice(1) },
            { label: "Forage Quality", value: region.charAt(0).toUpperCase() + region.slice(1) },
          ],
          note: "First-year hives may produce little to no surplus honey as the colony establishes itself. Always leave enough honey for bees to overwinter (60+ lbs).",
        };
      },
    },
    {
      id: "hive-economics",
      name: "Beekeeping Economics",
      description: "Calculate beekeeping costs and break-even analysis",
      fields: [
        {
          name: "hives",
          label: "Number of Hives",
          type: "number",
          placeholder: "e.g. 3",
        },
        {
          name: "setupCostPerHive",
          label: "Setup Cost per Hive ($)",
          type: "number",
          placeholder: "e.g. 400",
          defaultValue: 400,
        },
        {
          name: "annualCostPerHive",
          label: "Annual Maintenance per Hive ($)",
          type: "number",
          placeholder: "e.g. 100",
          defaultValue: 100,
        },
        {
          name: "honeyPerHive",
          label: "Expected Honey per Hive (lbs)",
          type: "number",
          placeholder: "e.g. 50",
          defaultValue: 50,
        },
        {
          name: "honeyPricePerLb",
          label: "Honey Price per lb ($)",
          type: "number",
          placeholder: "e.g. 12",
          step: 0.5,
          defaultValue: 12,
        },
      ],
      calculate: (inputs) => {
        const hives = parseFloat(inputs.hives as string);
        const setupCost = parseFloat(inputs.setupCostPerHive as string);
        const annualCost = parseFloat(inputs.annualCostPerHive as string);
        const honeyLbs = parseFloat(inputs.honeyPerHive as string);
        const pricePerLb = parseFloat(inputs.honeyPricePerLb as string);
        if ([hives, setupCost, annualCost, honeyLbs, pricePerLb].some((v) => isNaN(v) || v <= 0)) return null;

        const totalSetup = setupCost * hives;
        const totalAnnualCost = annualCost * hives;
        const annualRevenue = honeyLbs * hives * pricePerLb;
        const annualProfit = annualRevenue - totalAnnualCost;
        const breakEvenYears = annualProfit > 0 ? totalSetup / annualProfit : Infinity;
        const waxRevenue = honeyLbs * hives * 0.02 * 15; // ~2% wax by weight at $15/lb

        return {
          primary: {
            label: "Break-even Time",
            value: breakEvenYears === Infinity ? "N/A" : formatNumber(breakEvenYears, 1),
            suffix: breakEvenYears === Infinity ? "" : "years",
          },
          details: [
            { label: "Total Setup Cost", value: "$" + formatNumber(totalSetup, 2) },
            { label: "Annual Operating Cost", value: "$" + formatNumber(totalAnnualCost, 2) },
            { label: "Annual Honey Revenue", value: "$" + formatNumber(annualRevenue, 2) },
            { label: "Annual Wax Revenue (est.)", value: "$" + formatNumber(waxRevenue, 2) },
            { label: "Annual Net Profit", value: "$" + formatNumber(annualProfit, 2) },
          ],
          note: "Does not include pollination services revenue, nuc/bee sales, or the value of your time.",
        };
      },
    },
  ],
  relatedSlugs: ["chicken-egg-calc", "greenhouse-ventilation", "rain-garden-calc"],
  faq: [
    {
      question: "How much honey does one beehive produce?",
      answer:
        "A healthy Langstroth hive in a good forage area produces 30-100 lbs of surplus honey per year, with 50-60 lbs being typical. First-year hives may produce no surplus. Top bar hives produce less (15-35 lbs). Production depends heavily on local flora, weather, and colony health.",
    },
    {
      question: "How much does it cost to start beekeeping?",
      answer:
        "Starting costs range from $300-600 per hive including the hive box, frames, bees (a nucleus colony costs $150-250), and protective gear. Annual maintenance costs about $50-150 per hive for feeding, treatments, and replacement parts.",
    },
    {
      question: "When is the best time to harvest honey?",
      answer:
        "Typically late summer to early fall (August-September in the Northern Hemisphere) after the main nectar flow. Never harvest in spring when bees are building up, and always leave at least 60 lbs of honey for the colony to survive winter.",
    },
  ],
  formula:
    "Honey Yield = Base Yield x Region Factor x Experience Factor x Hives | Break-even = Setup Cost / (Annual Revenue - Annual Cost)",
};
