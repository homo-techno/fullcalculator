import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mushroomGrowingCalculator: CalculatorDefinition = {
  slug: "mushroom-growing-calculator",
  title: "Mushroom Cultivation Calculator",
  description:
    "Free mushroom growing calculator. Estimate substrate needs, spawn rates, and expected yields for home mushroom cultivation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "mushroom growing calculator",
    "mushroom cultivation",
    "spawn rate calculator",
    "substrate calculator",
    "mushroom yield",
  ],
  variants: [
    {
      id: "substrate-calc",
      name: "Substrate & Spawn Calculator",
      description: "Calculate substrate and spawn needs by container",
      fields: [
        {
          name: "mushroomType",
          label: "Mushroom Species",
          type: "select",
          options: [
            { label: "Oyster (Pleurotus)", value: "oyster" },
            { label: "Shiitake", value: "shiitake" },
            { label: "Lion's Mane", value: "lionsmane" },
            { label: "King Oyster", value: "kingoyster" },
            { label: "Wine Cap (Stropharia)", value: "winecap" },
          ],
          defaultValue: "oyster",
        },
        {
          name: "substrateType",
          label: "Substrate Type",
          type: "select",
          options: [
            { label: "Straw (pasteurized)", value: "straw" },
            { label: "Hardwood Sawdust", value: "sawdust" },
            { label: "Hardwood Logs", value: "logs" },
            { label: "Coffee Grounds + Straw", value: "coffee" },
            { label: "Wood Chips (outdoor)", value: "woodchips" },
          ],
          defaultValue: "straw",
        },
        {
          name: "numBags",
          label: "Number of Grow Bags/Containers",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 100,
        },
        {
          name: "bagSize",
          label: "Bag Size",
          type: "select",
          options: [
            { label: "Small (5 lb substrate)", value: "5" },
            { label: "Medium (10 lb substrate)", value: "10" },
            { label: "Large (20 lb substrate)", value: "20" },
          ],
          defaultValue: "10",
        },
      ],
      calculate: (inputs) => {
        const mushType = inputs.mushroomType as string;
        const subType = inputs.substrateType as string;
        const numBags = parseFloat(inputs.numBags as string);
        const bagLbs = parseFloat(inputs.bagSize as string);
        if (!numBags || !bagLbs) return null;

        const totalSubstrateLbs = numBags * bagLbs;

        // Spawn rate: typically 5-15% of wet substrate weight
        const spawnRates: Record<string, number> = {
          oyster: 0.10,
          shiitake: 0.10,
          lionsmane: 0.12,
          kingoyster: 0.10,
          winecap: 0.15,
        };
        const spawnRate = spawnRates[mushType] || 0.10;
        const spawnLbs = totalSubstrateLbs * spawnRate;

        // Biological efficiency (yield as % of dry substrate weight)
        // Dry substrate is roughly 25-35% of wet weight
        const drySubstrateLbs = totalSubstrateLbs * 0.3;
        const efficiencies: Record<string, number> = {
          oyster: 1.0,
          shiitake: 0.75,
          lionsmane: 0.6,
          kingoyster: 0.7,
          winecap: 0.5,
        };
        const be = efficiencies[mushType] || 0.75;
        const yieldLbs = drySubstrateLbs * be;
        const yieldKg = yieldLbs * 0.4536;

        // Colonization and fruiting time
        const colonDays: Record<string, number> = {
          oyster: 14,
          shiitake: 60,
          lionsmane: 21,
          kingoyster: 28,
          winecap: 30,
        };
        const fruitDays: Record<string, number> = {
          oyster: 7,
          shiitake: 10,
          lionsmane: 10,
          kingoyster: 14,
          winecap: 14,
        };
        const flushes: Record<string, number> = {
          oyster: 3,
          shiitake: 4,
          lionsmane: 2,
          kingoyster: 2,
          winecap: 3,
        };

        return {
          primary: {
            label: "Expected Total Yield",
            value: formatNumber(yieldLbs, 1) + " lbs",
          },
          details: [
            { label: "Yield (kg)", value: formatNumber(yieldKg, 1) },
            { label: "Total Substrate (wet)", value: formatNumber(totalSubstrateLbs, 0) + " lbs" },
            { label: "Spawn Needed", value: formatNumber(spawnLbs, 1) + " lbs" },
            { label: "Spawn Rate", value: formatNumber(spawnRate * 100, 0) + "%" },
            { label: "Biological Efficiency", value: formatNumber(be * 100, 0) + "%" },
            { label: "Colonization Time", value: formatNumber(colonDays[mushType] || 21, 0) + " days" },
            { label: "Days to First Harvest", value: formatNumber((colonDays[mushType] || 21) + (fruitDays[mushType] || 10), 0) },
            { label: "Expected Flushes", value: formatNumber(flushes[mushType] || 3, 0) },
          ],
          note: "Biological efficiency can vary greatly based on substrate quality, environmental conditions, and genetics. First flush typically produces 40-50% of total yield.",
        };
      },
    },
    {
      id: "log-calc",
      name: "Log Inoculation",
      description: "Calculate plug spawn for log cultivation",
      fields: [
        {
          name: "numLogs",
          label: "Number of Logs",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          max: 200,
        },
        {
          name: "logDiameter",
          label: "Average Log Diameter (inches)",
          type: "number",
          placeholder: "e.g. 6",
          min: 3,
          max: 14,
        },
        {
          name: "logLength",
          label: "Average Log Length (inches)",
          type: "number",
          placeholder: "e.g. 40",
          min: 24,
          max: 60,
        },
      ],
      calculate: (inputs) => {
        const numLogs = parseFloat(inputs.numLogs as string);
        const diameter = parseFloat(inputs.logDiameter as string);
        const length = parseFloat(inputs.logLength as string);
        if (!numLogs || !diameter || !length) return null;

        // Plug spacing: holes every 4-6 inches along rows, rows 2-3 inches apart around circumference
        const circumference = Math.PI * diameter;
        const rowsAround = Math.floor(circumference / 2.5);
        const holesPerRow = Math.floor(length / 5);
        const plugsPerLog = rowsAround * holesPerRow;
        const totalPlugs = plugsPerLog * numLogs;

        // Yield: shiitake logs typically produce 0.5-1 lb per log per year for 3-6 years
        const annualYieldLbs = numLogs * 0.75;
        const lifetimeYieldLbs = annualYieldLbs * 4;

        // Wax needed for sealing (approximately 1 oz per 10 plugs)
        const waxOz = totalPlugs / 10;

        return {
          primary: {
            label: "Total Plug Spawn Needed",
            value: formatNumber(totalPlugs, 0) + " plugs",
          },
          details: [
            { label: "Plugs Per Log", value: formatNumber(plugsPerLog, 0) },
            { label: "Rows Per Log", value: formatNumber(rowsAround, 0) },
            { label: "Holes Per Row", value: formatNumber(holesPerRow, 0) },
            { label: "Cheese Wax Needed", value: formatNumber(waxOz, 0) + " oz" },
            { label: "Annual Yield (est.)", value: formatNumber(annualYieldLbs, 1) + " lbs/year" },
            { label: "Lifetime Yield (4 yr)", value: formatNumber(lifetimeYieldLbs, 0) + " lbs" },
            { label: "First Harvest", value: "6-18 months after inoculation" },
          ],
          note: "Use freshly cut hardwood logs (oak, maple, beech). Cut logs in late winter before buds open. Inoculate within 2-6 weeks of cutting.",
        };
      },
    },
  ],
  relatedSlugs: ["homestead-garden-size-calculator", "cooking-converter"],
  faq: [
    {
      question: "What is biological efficiency in mushroom growing?",
      answer:
        "Biological efficiency (BE) is the fresh weight of mushrooms harvested divided by the dry weight of substrate, expressed as a percentage. Oyster mushrooms can achieve 100%+ BE, meaning 1 lb of dry substrate produces 1+ lb of fresh mushrooms. Shiitake typically achieves 75-100% BE.",
    },
    {
      question: "How much spawn do I need?",
      answer:
        "The standard spawn rate is 5-15% of the wet substrate weight. For grain spawn, use 10% by weight (1 lb of spawn per 10 lbs of substrate). Higher spawn rates lead to faster colonization and reduced contamination risk, but increase cost.",
    },
    {
      question: "How long does it take to grow mushrooms?",
      answer:
        "From inoculation to first harvest: Oyster mushrooms take 3-4 weeks, Lion's Mane 4-5 weeks, and Shiitake on sawdust blocks 8-12 weeks. Shiitake on logs take 6-18 months for first fruiting. Most species produce 2-4 flushes over several weeks.",
    },
  ],
  formula:
    "Spawn Needed = Substrate Weight × Spawn Rate (5-15%) | Yield = Dry Substrate × Biological Efficiency | Plugs per Log = (Circumference / 2.5\") × (Length / 5\")",
};
