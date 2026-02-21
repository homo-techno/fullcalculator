import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const livestockWaterCalculator: CalculatorDefinition = {
  slug: "livestock-water-calculator",
  title: "Livestock Water Needs Calculator",
  description:
    "Free livestock water calculator. Calculate daily water requirements for cattle, horses, sheep, goats, pigs, and poultry based on species and conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "livestock water calculator",
    "cattle water needs",
    "farm animal water requirements",
    "livestock water consumption",
    "how much water does a cow need",
  ],
  variants: [
    {
      id: "waterNeeds",
      name: "Daily Water Requirements",
      fields: [
        {
          name: "species",
          label: "Animal Species",
          type: "select",
          options: [
            { label: "Cattle (beef)", value: "cattle_beef" },
            { label: "Cattle (dairy, lactating)", value: "cattle_dairy" },
            { label: "Horse", value: "horse" },
            { label: "Sheep", value: "sheep" },
            { label: "Goat", value: "goat" },
            { label: "Pig (finishing)", value: "pig" },
            { label: "Chicken (layer)", value: "chicken" },
            { label: "Turkey", value: "turkey" },
          ],
        },
        {
          name: "animalCount",
          label: "Number of Animals",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          max: 10000,
        },
        {
          name: "temperature",
          label: "Average Temperature",
          type: "select",
          options: [
            { label: "Cool (below 50°F / 10°C)", value: "cool" },
            { label: "Mild (50-70°F / 10-21°C)", value: "mild" },
            { label: "Warm (70-90°F / 21-32°C)", value: "warm" },
            { label: "Hot (above 90°F / 32°C)", value: "hot" },
          ],
        },
      ],
      calculate: (inputs) => {
        const species = (inputs.species as string) || "cattle_beef";
        const animalCount = inputs.animalCount as number;
        const temperature = (inputs.temperature as string) || "mild";
        if (!animalCount || animalCount <= 0) return null;

        // Base gallons per day per animal (at mild temps)
        const baseGallons: Record<string, { gallons: number; weight: string }> = {
          cattle_beef: { gallons: 12, weight: "1,000-1,400 lbs" },
          cattle_dairy: { gallons: 30, weight: "1,200-1,500 lbs" },
          horse: { gallons: 8, weight: "900-1,200 lbs" },
          sheep: { gallons: 2, weight: "100-250 lbs" },
          goat: { gallons: 2.5, weight: "100-200 lbs" },
          pig: { gallons: 5, weight: "200-280 lbs" },
          chicken: { gallons: 0.06, weight: "4-8 lbs" }, // ~1 pint per chicken
          turkey: { gallons: 0.1, weight: "15-30 lbs" },
        };

        const tempFactors: Record<string, number> = {
          cool: 0.8,
          mild: 1.0,
          warm: 1.5,
          hot: 2.0,
        };

        const info = baseGallons[species] || baseGallons.cattle_beef;
        const tempFactor = tempFactors[temperature] || 1.0;
        const gallonsPerAnimal = info.gallons * tempFactor;
        const totalDaily = gallonsPerAnimal * animalCount;
        const totalWeekly = totalDaily * 7;
        const totalMonthly = totalDaily * 30;

        // Tank sizing (should hold at least 1-2 days supply)
        const tankSizeMin = totalDaily * 1.5;

        return {
          primary: {
            label: "Daily Water Total",
            value: formatNumber(totalDaily, 1) + " gallons",
          },
          details: [
            { label: "Per Animal/Day", value: formatNumber(gallonsPerAnimal, 1) + " gallons" },
            { label: "Number of Animals", value: formatNumber(animalCount, 0) },
            { label: "Animal Weight Range", value: info.weight },
            { label: "Weekly Total", value: formatNumber(totalWeekly, 0) + " gallons" },
            { label: "Monthly Total", value: formatNumber(totalMonthly, 0) + " gallons" },
            { label: "Min. Tank/Trough Size", value: formatNumber(tankSizeMin, 0) + " gallons (1.5-day reserve)" },
            {
              label: "Temperature Adjustment",
              value: temperature === "hot"
                ? "2x base (provide shade and multiple water sources)"
                : temperature === "warm"
                ? "1.5x base"
                : temperature === "cool"
                ? "0.8x base"
                : "Base rate",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["horse-feed-calculator", "horse-weight-calculator", "chicken-coop-size-calculator"],
  faq: [
    {
      question: "How much water does a cow need per day?",
      answer:
        "A beef cow needs approximately 7-12 gallons per day in mild weather, increasing to 18-24 gallons in hot weather. Lactating dairy cows need significantly more, around 25-40 gallons per day, as they require about 4-5 lbs of water for every pound of milk produced.",
    },
    {
      question: "Does water intake change in hot weather?",
      answer:
        "Yes, significantly. Water consumption can double in temperatures above 90°F (32°C). In extreme heat, cattle may drink 50% more than their normal intake. Always ensure adequate water supply during hot weather, and provide shade near water sources.",
    },
    {
      question: "How do I ensure adequate water supply for livestock?",
      answer:
        "Maintain water tanks/troughs that hold at least 1.5-2 days worth of water. Clean troughs regularly, as livestock will reduce intake from dirty water. In winter, use tank heaters to prevent freezing. Provide at least one watering point per 20-30 cattle.",
    },
  ],
  formula:
    "Daily water (gal) = base gallons per animal x temperature factor x number of animals. Temperature factors: cool 0.8x, mild 1.0x, warm 1.5x, hot 2.0x. Minimum tank size = 1.5 days supply.",
};
