import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beekeepingCostCalculator: CalculatorDefinition = {
  slug: "beekeeping-cost-calculator",
  title: "Beekeeping Startup Cost Calculator",
  description:
    "Free beekeeping startup cost estimator. Calculate the total investment needed to start beekeeping including hives, bees, equipment, and protective gear.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "beekeeping cost calculator",
    "start beekeeping cost",
    "bee hive cost",
    "beekeeping budget",
    "beekeeping equipment cost",
  ],
  variants: [
    {
      id: "starter-setup",
      name: "Starter Setup",
      description: "Calculate costs for a new beekeeper",
      fields: [
        {
          name: "numHives",
          label: "Number of Hives",
          type: "number",
          placeholder: "e.g. 2",
          min: 1,
          max: 50,
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
          name: "beeSource",
          label: "Bee Source",
          type: "select",
          options: [
            { label: "Package Bees (3 lb)", value: "package" },
            { label: "Nucleus Colony (nuc)", value: "nuc" },
            { label: "Full Colony (established)", value: "full" },
          ],
          defaultValue: "nuc",
        },
        {
          name: "gearQuality",
          label: "Equipment Quality",
          type: "select",
          options: [
            { label: "Budget (basic)", value: "budget" },
            { label: "Mid-Range", value: "midrange" },
            { label: "Premium", value: "premium" },
          ],
          defaultValue: "midrange",
        },
      ],
      calculate: (inputs) => {
        const numHives = parseFloat(inputs.numHives as string);
        const hiveType = inputs.hiveType as string;
        const beeSource = inputs.beeSource as string;
        const quality = inputs.gearQuality as string;
        if (!numHives) return null;

        // Hive costs
        const hiveCosts: Record<string, number> = {
          langstroth: 200,
          topbar: 250,
          warre: 225,
          flow: 600,
        };
        const hiveCost = (hiveCosts[hiveType] || 200) * numHives;

        // Bee costs
        const beeCosts: Record<string, number> = {
          package: 150,
          nuc: 200,
          full: 350,
        };
        const beeCost = (beeCosts[beeSource] || 200) * numHives;

        // Protective gear (one set regardless of hives)
        const gearCosts: Record<string, { suit: number; gloves: number; smoker: number; tool: number }> = {
          budget: { suit: 50, gloves: 15, smoker: 25, tool: 10 },
          midrange: { suit: 110, gloves: 25, smoker: 40, tool: 15 },
          premium: { suit: 200, gloves: 45, smoker: 65, tool: 25 },
        };
        const gear = gearCosts[quality] || gearCosts.midrange;
        const gearTotal = gear.suit + gear.gloves + gear.smoker + gear.tool;

        // Additional equipment
        const feeder = 15 * numHives;
        const frames = 30 * numHives; // additional frames
        const foundation = 20 * numHives;
        const medications = 40 * numHives; // mite treatments, etc.

        // Harvesting equipment (shared across hives)
        const qualityMult = quality === "budget" ? 0.7 : quality === "premium" ? 1.5 : 1.0;
        const extractor = numHives >= 3 ? 200 * qualityMult : 0; // only worth buying with 3+ hives
        const harvestingKit = 60 * qualityMult; // uncapping knife, bucket, strainer

        const totalEquipment = hiveCost + feeder + frames + foundation;
        const totalStartup = totalEquipment + beeCost + gearTotal + medications + extractor + harvestingKit;

        // Annual recurring costs estimate
        const annualCosts = (medications + 25) * numHives + 50; // meds + sugar + misc

        return {
          primary: {
            label: "Total Startup Cost",
            value: "$" + formatNumber(totalStartup, 0),
          },
          details: [
            { label: "Hives & Equipment", value: "$" + formatNumber(totalEquipment, 0) },
            { label: "Bees", value: "$" + formatNumber(beeCost, 0) },
            { label: "Protective Gear", value: "$" + formatNumber(gearTotal, 0) },
            { label: "Medications & Treatments", value: "$" + formatNumber(medications, 0) },
            { label: "Harvesting Equipment", value: "$" + formatNumber(extractor + harvestingKit, 0) },
            { label: "Cost Per Hive", value: "$" + formatNumber(totalStartup / numHives, 0) },
            { label: "Est. Annual Recurring", value: "$" + formatNumber(annualCosts, 0) + "/year" },
          ],
          note: "Start with 2 hives - if one fails, you can combine resources. First-year honey harvest is often minimal as bees establish their colony.",
        };
      },
    },
    {
      id: "honey-revenue",
      name: "Honey Revenue Estimator",
      description: "Estimate honey production and revenue",
      fields: [
        {
          name: "numHives",
          label: "Number of Producing Hives",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 100,
        },
        {
          name: "yieldPerHive",
          label: "Expected Yield (lbs per hive)",
          type: "select",
          options: [
            { label: "Low (20 lbs - poor season)", value: "20" },
            { label: "Average (40 lbs)", value: "40" },
            { label: "Good (60 lbs)", value: "60" },
            { label: "Excellent (80+ lbs)", value: "80" },
          ],
          defaultValue: "40",
        },
        {
          name: "pricePerLb",
          label: "Price Per Pound ($)",
          type: "number",
          placeholder: "e.g. 12",
          min: 3,
          max: 30,
          step: 0.5,
        },
        {
          name: "annualCosts",
          label: "Annual Costs Per Hive ($)",
          type: "number",
          placeholder: "e.g. 75",
          min: 20,
          max: 300,
        },
      ],
      calculate: (inputs) => {
        const hives = parseFloat(inputs.numHives as string);
        const yieldLbs = parseFloat(inputs.yieldPerHive as string);
        const price = parseFloat(inputs.pricePerLb as string);
        const annualCost = parseFloat(inputs.annualCosts as string);
        if (!hives || !yieldLbs || !price || !annualCost) return null;

        const totalHoney = hives * yieldLbs;
        const grossRevenue = totalHoney * price;
        const totalCosts = hives * annualCost;
        const netRevenue = grossRevenue - totalCosts;
        const totalHoneyKg = totalHoney * 0.4536;

        // Additional products estimate (beeswax ~10% of honey value)
        const beeswaxRevenue = grossRevenue * 0.1;

        return {
          primary: {
            label: "Net Annual Revenue",
            value: "$" + formatNumber(netRevenue + beeswaxRevenue, 0),
          },
          details: [
            { label: "Total Honey", value: formatNumber(totalHoney, 0) + " lbs (" + formatNumber(totalHoneyKg, 0) + " kg)" },
            { label: "Honey Revenue", value: "$" + formatNumber(grossRevenue, 0) },
            { label: "Beeswax Revenue (est.)", value: "$" + formatNumber(beeswaxRevenue, 0) },
            { label: "Annual Costs", value: "$" + formatNumber(totalCosts, 0) },
            { label: "Revenue Per Hive", value: "$" + formatNumber(netRevenue / hives, 0) },
            { label: "Price Per Pound", value: "$" + formatNumber(price, 2) },
          ],
          note: "Revenue varies greatly by region, season, and floral sources. Local raw honey often commands premium prices at farmers markets.",
        };
      },
    },
  ],
  relatedSlugs: ["break-even-calculator", "roi-calculator", "homestead-garden-size-calculator"],
  faq: [
    {
      question: "How much does it cost to start beekeeping?",
      answer:
        "A basic setup with 2 hives costs $600-$1,200 depending on equipment quality and bee source. This includes hive boxes, frames, bees, protective gear, smoker, and tools. Budget options exist, but investing in quality equipment upfront saves money long-term.",
    },
    {
      question: "How much honey does one hive produce?",
      answer:
        "A healthy hive in a good location produces 20-60 pounds of harvestable honey per year in most of the US. Some productive hives in excellent conditions can yield 80-100+ pounds. First-year hives may produce little to no surplus honey as bees build up their colony.",
    },
    {
      question: "Is beekeeping profitable?",
      answer:
        "Small-scale beekeeping (1-10 hives) is usually a break-even hobby when selling honey locally at $8-15/lb. Profitability increases with scale, value-added products (beeswax candles, lip balm), and pollination services. Most hobbyist beekeepers break even within 2-3 years.",
    },
  ],
  formula:
    "Startup Cost = (Hive Cost × Hives) + (Bee Cost × Hives) + Gear + Treatments + Harvesting Equipment | Revenue = Hives × Yield × Price - Annual Costs",
};
