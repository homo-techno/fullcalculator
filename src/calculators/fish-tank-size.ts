import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fishTankSizeCalculator: CalculatorDefinition = {
  slug: "fish-tank-size-calculator",
  title: "Fish Tank Size Calculator",
  description:
    "Free fish tank size calculator. Determine the right aquarium size based on fish type, number, and adult size. Gallons per fish guide.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "fish tank size calculator",
    "aquarium size calculator",
    "gallons per fish",
    "how many fish in my tank",
    "fish tank stocking calculator",
  ],
  variants: [
    {
      id: "byFish",
      name: "Tank Size by Fish",
      description: "Calculate minimum tank size based on fish count and type",
      fields: [
        {
          name: "fishType",
          label: "Fish Type",
          type: "select",
          options: [
            { label: "Small Tropical (neon tetra, guppy)", value: "small" },
            { label: "Medium Tropical (molly, platy)", value: "medium" },
            { label: "Large Tropical (angel, gourami)", value: "large" },
            { label: "Goldfish (fancy)", value: "goldfish_fancy" },
            { label: "Goldfish (common/comet)", value: "goldfish_common" },
            { label: "Betta (single)", value: "betta" },
            { label: "Cichlid (African)", value: "cichlid" },
            { label: "Pleco / Large Catfish", value: "pleco" },
          ],
        },
        {
          name: "fishCount",
          label: "Number of Fish",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const fishType = (inputs.fishType as string) || "small";
        const fishCount = inputs.fishCount as number;
        if (!fishCount || fishCount <= 0) return null;

        // Gallons per fish based on adult size
        const gallonsPerFish: Record<string, { gallons: number; minTank: number; adultSize: string }> = {
          small: { gallons: 2, minTank: 10, adultSize: "1-2 inches" },
          medium: { gallons: 3, minTank: 20, adultSize: "2-4 inches" },
          large: { gallons: 5, minTank: 30, adultSize: "4-6 inches" },
          goldfish_fancy: { gallons: 10, minTank: 20, adultSize: "6-8 inches" },
          goldfish_common: { gallons: 20, minTank: 40, adultSize: "10-12 inches" },
          betta: { gallons: 5, minTank: 5, adultSize: "2-3 inches" },
          cichlid: { gallons: 5, minTank: 55, adultSize: "3-6 inches" },
          pleco: { gallons: 15, minTank: 55, adultSize: "12-24 inches" },
        };

        const info = gallonsPerFish[fishType] || gallonsPerFish.small;
        const calculatedGallons = fishCount * info.gallons;
        const recommendedGallons = Math.max(calculatedGallons, info.minTank);
        const filterGPH = recommendedGallons * 4; // 4x turnover per hour

        return {
          primary: {
            label: "Recommended Tank Size",
            value: formatNumber(recommendedGallons, 0) + " gallons",
          },
          details: [
            { label: "Gallons Per Fish", value: info.gallons + " gallons" },
            { label: "Calculated Minimum", value: formatNumber(calculatedGallons, 0) + " gallons" },
            { label: "Minimum Tank Size", value: info.minTank + " gallons (species minimum)" },
            { label: "Adult Fish Size", value: info.adultSize },
            { label: "Filter Rate Needed", value: formatNumber(filterGPH, 0) + " GPH (4x turnover)" },
            { label: "Heater Watts", value: formatNumber(recommendedGallons * 5, 0) + " watts (5W/gal)" },
          ],
        };
      },
    },
    {
      id: "stockingLevel",
      name: "Current Tank Stocking",
      description: "Check if your existing tank is overstocked",
      fields: [
        {
          name: "tankGallons",
          label: "Tank Size (gallons)",
          type: "number",
          placeholder: "e.g. 29",
          min: 1,
          max: 1000,
        },
        {
          name: "totalFishInches",
          label: "Total Fish Length (all fish, inches)",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
          max: 500,
        },
      ],
      calculate: (inputs) => {
        const tankGallons = inputs.tankGallons as number;
        const totalFishInches = inputs.totalFishInches as number;
        if (!tankGallons || !totalFishInches || tankGallons <= 0 || totalFishInches <= 0) return null;

        // General rule: 1 inch of fish per gallon (conservative)
        const stockingRatio = totalFishInches / tankGallons;
        let stockingLevel = "";
        if (stockingRatio <= 0.5) stockingLevel = "Lightly Stocked (great for beginners)";
        else if (stockingRatio <= 0.8) stockingLevel = "Moderately Stocked (ideal)";
        else if (stockingRatio <= 1.0) stockingLevel = "Fully Stocked";
        else stockingLevel = "Overstocked (reduce fish or upgrade tank)";

        const roomForMore = Math.max(0, tankGallons - totalFishInches);
        const waterChangeFreq = stockingRatio > 1 ? "2x per week" : stockingRatio > 0.8 ? "Weekly" : "Every 1-2 weeks";

        return {
          primary: {
            label: "Stocking Level",
            value: formatNumber(stockingRatio * 100, 0) + "%",
          },
          details: [
            { label: "Status", value: stockingLevel },
            { label: "Inches Per Gallon", value: formatNumber(stockingRatio, 2) },
            { label: "Room for More (inches)", value: formatNumber(roomForMore, 0) + " inches of fish" },
            { label: "Water Change", value: waterChangeFreq },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["aquarium-calculator", "pond-volume-calculator", "pet-food-calculator"],
  faq: [
    {
      question: "How many gallons per fish do I need?",
      answer:
        "The general rule is 1 gallon per inch of adult fish, but this varies by species. Small tropical fish (tetras, guppies) need about 2 gallons each, while goldfish need 10-20 gallons each. Always research your specific species and consider their adult size, not purchase size.",
    },
    {
      question: "What is the minimum tank size for a betta fish?",
      answer:
        "Despite being sold in tiny cups, bettas need a minimum of 5 gallons with a heater and gentle filter. In smaller tanks, ammonia builds up quickly and temperatures fluctuate, leading to stress and disease. A 5-10 gallon tank allows proper heating, filtration, and swimming space.",
    },
    {
      question: "Why is my fish tank cloudy?",
      answer:
        "Cloudy water is usually caused by a bacterial bloom during the nitrogen cycle (common in new tanks), overfeeding, or overstocking. Ensure your tank is properly cycled before adding fish, avoid overfeeding, maintain proper stocking levels, and perform regular water changes.",
    },
  ],
  formula:
    "Minimum gallons = number of fish x gallons per fish (based on adult size). Stocking level = total fish inches / tank gallons. Filter GPH = tank gallons x 4. Heater watts = gallons x 5.",
};
