import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beehiveCalculator: CalculatorDefinition = {
  slug: "beehive-calculator",
  title: "Beehive & Honey Yield Calculator",
  description: "Free beehive calculator. Estimate honey production, hive capacity, equipment needs, and costs for backyard beekeeping and small apiaries.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["beehive calculator", "honey yield calculator", "how much honey per hive", "beekeeping calculator", "apiary calculator"],
  variants: [
    {
      id: "honey-yield",
      name: "Honey Yield Estimate",
      description: "Estimate annual honey production from your hives",
      fields: [
        { name: "numHives", label: "Number of Hives", type: "number", placeholder: "e.g. 2", min: 1, max: 100 },
        { name: "hiveType", label: "Hive Type", type: "select", options: [
          { label: "Langstroth (Standard)", value: "langstroth" },
          { label: "Top Bar Hive", value: "topbar" },
          { label: "Warre Hive", value: "warre" },
          { label: "Flow Hive", value: "flow" },
        ], defaultValue: "langstroth" },
        { name: "region", label: "Region/Climate", type: "select", options: [
          { label: "Northern US / Cool Climate", value: "north" },
          { label: "Central US / Moderate Climate", value: "central" },
          { label: "Southern US / Warm Climate", value: "south" },
          { label: "Pacific Northwest (Rainy)", value: "pnw" },
          { label: "Southwest / Arid", value: "sw" },
        ], defaultValue: "central" },
        { name: "experience", label: "Beekeeper Experience", type: "select", options: [
          { label: "First Year (Leave all honey for bees)", value: "first" },
          { label: "Beginner (1-2 years)", value: "beginner" },
          { label: "Intermediate (3-5 years)", value: "intermediate" },
          { label: "Experienced (5+ years)", value: "experienced" },
        ], defaultValue: "beginner" },
      ],
      calculate: (inputs) => {
        const hives = inputs.numHives as number;
        const hiveType = inputs.hiveType as string;
        const region = inputs.region as string;
        const experience = inputs.experience as string;
        if (!hives) return null;

        const baseYield: Record<string, number> = {
          langstroth: 60, topbar: 25, warre: 30, flow: 55,
        };
        const regionFactor: Record<string, number> = {
          north: 0.7, central: 1.0, south: 1.3, pnw: 0.6, sw: 0.8,
        };
        const expFactor: Record<string, number> = {
          first: 0, beginner: 0.5, intermediate: 0.85, experienced: 1.1,
        };

        const yieldPerHive = (baseYield[hiveType] || 60) * (regionFactor[region] || 1.0) * (expFactor[experience] || 0.5);
        const totalYield = yieldPerHive * hives;
        const jars12oz = Math.floor(totalYield * 16 / 12);
        const jarsPint = Math.floor(totalYield * 16 / 24);
        const valueRetail = totalYield * 12;
        const valueFarmers = totalYield * 15;
        const waxYield = totalYield * 0.02;

        return {
          primary: { label: "Estimated Honey Harvest", value: experience === "first" ? "0 lbs (first year)" : `${formatNumber(totalYield, 0)} lbs/year` },
          details: [
            { label: "Honey per hive", value: experience === "first" ? "Leave all for bees" : `${formatNumber(yieldPerHive, 0)} lbs` },
            { label: "12-oz jars", value: experience === "first" ? "0" : `${jars12oz}` },
            { label: "Pint jars (1.5 lbs)", value: experience === "first" ? "0" : `${jarsPint}` },
            { label: "Beeswax produced", value: `${formatNumber(waxYield, 1)} lbs` },
            { label: "Retail value ($12/lb)", value: experience === "first" ? "$0 (invest in colony health)" : `$${formatNumber(valueRetail, 0)}` },
            { label: "Farmers market value ($15/lb)", value: experience === "first" ? "$0" : `$${formatNumber(valueFarmers, 0)}` },
          ],
          note: experience === "first" ? "First-year colonies need all their honey to survive winter. Do NOT harvest honey the first year. Focus on building a strong, healthy colony." : "Always leave 60-80 lbs of honey for the bees to survive winter (more in cold climates). Only harvest surplus above this amount.",
        };
      },
    },
    {
      id: "startup-cost",
      name: "Beekeeping Startup Cost",
      description: "Calculate initial investment for starting beekeeping",
      fields: [
        { name: "numHives", label: "Number of Hives to Start", type: "select", options: [
          { label: "1 Hive (Minimum)", value: "1" },
          { label: "2 Hives (Recommended)", value: "2" },
          { label: "3 Hives", value: "3" },
          { label: "4 Hives", value: "4" },
          { label: "5 Hives", value: "5" },
        ], defaultValue: "2" },
        { name: "hiveType", label: "Hive Type", type: "select", options: [
          { label: "Langstroth (Most Common)", value: "langstroth" },
          { label: "Top Bar Hive", value: "topbar" },
          { label: "Flow Hive (Easy Harvest)", value: "flow" },
        ], defaultValue: "langstroth" },
        { name: "beeSource", label: "Bee Source", type: "select", options: [
          { label: "Package Bees (3 lb)", value: "package" },
          { label: "Nucleus Colony (Nuc)", value: "nuc" },
          { label: "Established Colony", value: "established" },
        ], defaultValue: "nuc" },
        { name: "equipLevel", label: "Equipment Level", type: "select", options: [
          { label: "Basic (Essential only)", value: "basic" },
          { label: "Standard (Recommended)", value: "standard" },
          { label: "Premium (Full setup)", value: "premium" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        const hives = parseInt(inputs.numHives as string);
        const hiveType = inputs.hiveType as string;
        const beeSource = inputs.beeSource as string;
        const equipLevel = inputs.equipLevel as string;
        if (!hives) return null;

        const hiveCost: Record<string, number> = {
          langstroth: 200, topbar: 250, flow: 600,
        };
        const beeCost: Record<string, number> = {
          package: 150, nuc: 200, established: 350,
        };
        const suitCost: Record<string, number> = { basic: 50, standard: 100, premium: 180 };
        const toolCost: Record<string, number> = { basic: 40, standard: 80, premium: 150 };
        const feederCost = 15;
        const medicationCost = 40;

        const totalHiveCost = hives * (hiveCost[hiveType] || 200);
        const totalBeeCost = hives * (beeCost[beeSource] || 200);
        const suitTotal = suitCost[equipLevel] || 100;
        const toolTotal = toolCost[equipLevel] || 80;
        const feedersTotal = hives * feederCost;
        const medicationsTotal = hives * medicationCost;
        const extractorCost = equipLevel === "premium" ? 300 : equipLevel === "standard" ? 0 : 0;
        const totalCost = totalHiveCost + totalBeeCost + suitTotal + toolTotal + feedersTotal + medicationsTotal + extractorCost;

        const annualOngoing = hives * (50 + medicationCost);
        const yearToBreakEven = totalCost / (hives * 30 * 12);

        return {
          primary: { label: "Total Startup Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Hive equipment", value: `$${formatNumber(totalHiveCost, 0)} (${hives} × $${hiveCost[hiveType] || 200})` },
            { label: "Bees", value: `$${formatNumber(totalBeeCost, 0)} (${hives} × $${beeCost[beeSource] || 200})` },
            { label: "Bee suit/veil", value: `$${formatNumber(suitTotal, 0)}` },
            { label: "Tools (smoker, hive tool, etc.)", value: `$${formatNumber(toolTotal, 0)}` },
            { label: "Feeders", value: `$${formatNumber(feedersTotal, 0)}` },
            { label: "Medications/treatments", value: `$${formatNumber(medicationsTotal, 0)}` },
            { label: extractorCost > 0 ? "Honey extractor" : "Extractor (not included)", value: extractorCost > 0 ? `$${formatNumber(extractorCost, 0)}` : "Borrow or rent for first years" },
            { label: "Annual ongoing costs", value: `~$${formatNumber(annualOngoing, 0)}/year` },
          ],
          note: "Start with 2 hives - if one fails, you can combine or transfer resources. Join a local beekeeping club for mentorship. Many clubs offer extractor rentals. Budget for replacement queens and possible colony losses.",
        };
      },
    },
  ],
  relatedSlugs: ["garden-yield-calculator", "fruit-tree-yield-calculator", "flower-bulb-calculator"],
  faq: [
    { question: "How much honey does one beehive produce?", answer: "A healthy Langstroth hive produces 30-80 lbs of surplus honey per year, with 60 lbs being average for an experienced beekeeper. First-year hives typically produce no surplus as the colony is building up. Top bar hives produce 15-35 lbs. Climate, forage, and management greatly affect yield." },
    { question: "How much does it cost to start beekeeping?", answer: "Starting with 2 Langstroth hives costs $700-1,200 including hive equipment ($400-600), bees ($300-500), protective gear ($100-200), and tools ($50-100). Flow hives cost more initially ($600+ per hive) but simplify harvesting." },
    { question: "How many beehives should a beginner start with?", answer: "Start with 2 hives. This allows you to compare colony health, share resources between hives if one is struggling, and provides insurance if one colony fails. Starting with just 1 hive leaves no backup, and starting with more than 3 is overwhelming for a beginner." },
  ],
  formula: "Honey Yield = Base Yield × Region Factor × Experience Factor | First Year = 0 (leave for bees) | Leave 60-80 lbs for winter stores",
};
