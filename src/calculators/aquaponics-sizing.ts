import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquaponicsSizingCalculator: CalculatorDefinition = {
  slug: "aquaponics-sizing-calculator",
  title: "Aquaponics System Sizing Calculator",
  description:
    "Free aquaponics system sizing calculator. Calculate fish tank size, grow bed area, pump flow rate, and stocking density for a balanced aquaponics system.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "aquaponics calculator",
    "aquaponics sizing",
    "fish tank grow bed ratio",
    "aquaponics system design",
    "fish stocking density",
  ],
  variants: [
    {
      id: "by-grow-beds",
      name: "Size by Grow Beds",
      description: "Calculate system components from desired grow bed area",
      fields: [
        {
          name: "growBedSqFt",
          label: "Total Grow Bed Area (sq ft)",
          type: "number",
          placeholder: "e.g. 32",
          min: 4,
          max: 500,
        },
        {
          name: "growBedDepth",
          label: "Grow Bed Depth (inches)",
          type: "number",
          placeholder: "e.g. 12",
          min: 6,
          max: 18,
        },
        {
          name: "systemType",
          label: "System Type",
          type: "select",
          options: [
            { label: "Media Bed (flood & drain)", value: "media" },
            { label: "Deep Water Culture (DWC/raft)", value: "dwc" },
            { label: "NFT (Nutrient Film)", value: "nft" },
          ],
          defaultValue: "media",
        },
        {
          name: "fishSpecies",
          label: "Fish Species",
          type: "select",
          options: [
            { label: "Tilapia", value: "tilapia" },
            { label: "Catfish", value: "catfish" },
            { label: "Trout (cold water)", value: "trout" },
            { label: "Goldfish/Koi (ornamental)", value: "goldfish" },
            { label: "Bluegill/Perch", value: "bluegill" },
          ],
          defaultValue: "tilapia",
        },
      ],
      calculate: (inputs) => {
        const growBedSqFt = parseFloat(inputs.growBedSqFt as string);
        const growBedDepth = parseFloat(inputs.growBedDepth as string);
        const systemType = inputs.systemType as string;
        const fish = inputs.fishSpecies as string;
        if (!growBedSqFt || !growBedDepth) return null;

        // Standard ratio: 1:1 grow bed to fish tank volume for media beds
        // DWC needs more water volume (2:1 or 3:1)
        const growBedVolumeGal = growBedSqFt * (growBedDepth / 12) * 7.481;

        const tankRatio: Record<string, number> = {
          media: 1.0,
          dwc: 0.5,
          nft: 0.3,
        };

        const fishTankGal = growBedVolumeGal * (tankRatio[systemType] || 1.0);
        const sumpGal = fishTankGal * 0.25; // 25% sump

        // Fish stocking density (lbs per gallon of fish tank)
        const stockingRate: Record<string, number> = {
          tilapia: 0.05,     // 1 lb per 20 gal
          catfish: 0.04,     // 1 lb per 25 gal
          trout: 0.03,       // 1 lb per 33 gal
          goldfish: 0.02,    // 1 lb per 50 gal
          bluegill: 0.04,    // 1 lb per 25 gal
        };

        const totalFishLbs = fishTankGal * (stockingRate[fish] || 0.05);
        const fishCount = totalFishLbs * 2; // roughly 2 fish per lb at harvest

        // Pump rate: turn over fish tank volume once per hour minimum
        const pumpGPH = fishTankGal * 1.5; // 1.5x for head loss

        // Feed rate: roughly 1.5% of fish body weight per day
        const dailyFeedOz = totalFishLbs * 0.015 * 16;

        // Plant capacity
        const plantSites = systemType === "nft" ? growBedSqFt * 4 : growBedSqFt * 2;

        const totalSystemGal = fishTankGal + growBedVolumeGal * 0.6 + sumpGal; // 60% of grow bed is water in media

        return {
          primary: {
            label: "Fish Tank Size",
            value: formatNumber(fishTankGal, 0) + " gallons",
          },
          details: [
            { label: "Grow Bed Volume", value: formatNumber(growBedVolumeGal, 0) + " gallons" },
            { label: "Sump Tank", value: formatNumber(sumpGal, 0) + " gallons" },
            { label: "Total System Water", value: formatNumber(totalSystemGal, 0) + " gallons" },
            { label: "Max Fish (at harvest)", value: formatNumber(totalFishLbs, 1) + " lbs (" + formatNumber(fishCount, 0) + " fish)" },
            { label: "Pump Flow Rate", value: formatNumber(pumpGPH, 0) + " GPH" },
            { label: "Daily Feed", value: formatNumber(dailyFeedOz, 1) + " oz" },
            { label: "Plant Sites (est.)", value: formatNumber(plantSites, 0) },
          ],
          note: "Start with 50% of max fish capacity and scale up. Always cycle the system for 4-6 weeks before adding fish. Monitor ammonia, nitrite, and pH regularly.",
        };
      },
    },
    {
      id: "by-fish",
      name: "Size by Fish Count",
      description: "Calculate system size from desired fish production",
      fields: [
        {
          name: "targetFishLbs",
          label: "Target Fish Harvest (lbs/year)",
          type: "number",
          placeholder: "e.g. 50",
          min: 5,
          max: 500,
        },
        {
          name: "fishSpecies",
          label: "Fish Species",
          type: "select",
          options: [
            { label: "Tilapia (fast growing)", value: "tilapia" },
            { label: "Catfish", value: "catfish" },
            { label: "Trout (cold water)", value: "trout" },
          ],
          defaultValue: "tilapia",
        },
      ],
      calculate: (inputs) => {
        const targetLbs = parseFloat(inputs.targetFishLbs as string);
        const fish = inputs.fishSpecies as string;
        if (!targetLbs) return null;

        // Growth cycles per year and stocking density
        const cyclesPerYear: Record<string, number> = {
          tilapia: 1.5,
          catfish: 1.2,
          trout: 1.0,
        };

        const stockingRate: Record<string, number> = {
          tilapia: 20,
          catfish: 25,
          trout: 33,
        };

        const cycles = cyclesPerYear[fish] || 1.5;
        const galPerLb = stockingRate[fish] || 20;
        const lbsPerCycle = targetLbs / cycles;
        const fishTankGal = lbsPerCycle * galPerLb;
        const growBedGal = fishTankGal; // 1:1 ratio
        const growBedSqFt = growBedGal / 7.481; // 12" deep media beds
        const pumpGPH = fishTankGal * 1.5;
        const dailyFeed = lbsPerCycle * 0.015 * 16;

        return {
          primary: {
            label: "Required Fish Tank",
            value: formatNumber(fishTankGal, 0) + " gallons",
          },
          details: [
            { label: "Grow Bed Area (12\" deep)", value: formatNumber(growBedSqFt, 0) + " sq ft" },
            { label: "Fish at Stocking", value: formatNumber(lbsPerCycle, 0) + " lbs" },
            { label: "Harvest Cycles/Year", value: formatNumber(cycles, 1) },
            { label: "Pump Flow Rate", value: formatNumber(pumpGPH, 0) + " GPH" },
            { label: "Daily Feed (full stock)", value: formatNumber(dailyFeed, 1) + " oz" },
            { label: "Annual Harvest Target", value: formatNumber(targetLbs, 0) + " lbs" },
          ],
          note: "Larger systems are more stable and easier to manage. Allow 20% extra capacity for fluctuations and growth.",
        };
      },
    },
  ],
  relatedSlugs: ["pool-volume-calculator", "homestead-garden-size-calculator", "volume-calculator"],
  faq: [
    {
      question: "What is the ideal fish tank to grow bed ratio?",
      answer:
        "For media-based systems, a 1:1 ratio of fish tank volume to grow bed volume is standard. For deep water culture (DWC), the grow bed water volume is typically 2-3 times the fish tank volume. NFT systems need less grow bed volume but more frequent water cycling.",
    },
    {
      question: "How many fish can I put in my aquaponics system?",
      answer:
        "The general rule is 1 pound of fish per 5-10 gallons of fish tank for tilapia, or 1 pound per 20-30 gallons for less hardy species. Start with 50% capacity and increase gradually. Overstocking leads to poor water quality and fish stress.",
    },
    {
      question: "What plants grow best in aquaponics?",
      answer:
        "Leafy greens (lettuce, kale, chard, herbs) grow excellently and are the easiest to start with. Fruiting plants (tomatoes, peppers, cucumbers) need a mature system with high fish density. Avoid root vegetables in media beds as they compete with beneficial bacteria.",
    },
  ],
  formula:
    "Fish Tank = Grow Bed Volume × Tank Ratio | Max Fish (lbs) = Tank Gallons × Stocking Rate | Pump GPH = Fish Tank Gallons × 1.5",
};
