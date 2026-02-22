import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rainwaterHarvestCalculator: CalculatorDefinition = {
  slug: "rainwater-harvest-calculator",
  title: "Rainwater Harvesting Calculator",
  description:
    "Free rainwater harvesting calculator. Estimate how much rainwater you can collect from your roof based on area, rainfall, and efficiency.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "rainwater harvesting",
    "rain collection",
    "rainwater calculator",
    "roof runoff",
    "rain barrel",
    "water collection",
  ],
  variants: [
    {
      id: "harvest",
      name: "Rainwater Collection Estimate",
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
          label: "Roof Material",
          type: "select",
          options: [
            { label: "Metal (95% efficient)", value: "0.95" },
            { label: "Asphalt Shingle (90%)", value: "0.90" },
            { label: "Tile/Slate (85%)", value: "0.85" },
            { label: "Flat/Gravel (75%)", value: "0.75" },
            { label: "Green Roof (50%)", value: "0.50" },
          ],
        },
        {
          name: "waterRate",
          label: "Water Rate ($/1000 gallons)",
          type: "number",
          placeholder: "e.g. 5",
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const roofArea = inputs.roofArea as number;
        const annualRainfall = inputs.annualRainfall as number;
        const efficiency = parseFloat((inputs.roofType as string) || "0.90");
        const waterRate = (inputs.waterRate as number) || 5;
        if (!roofArea || !annualRainfall) return null;

        // 1 inch of rain on 1 sq ft = 0.623 gallons
        const totalGallons = roofArea * annualRainfall * 0.623 * efficiency;
        const monthlyGallons = totalGallons / 12;
        const totalLiters = totalGallons * 3.785;
        const annualSavings = (totalGallons / 1000) * waterRate;

        // Tank sizing recommendation (1 month of avg collection)
        const tankSizeGal = Math.ceil(monthlyGallons / 50) * 50;

        // Outdoor water use offset (average US outdoor water use ~9000 gal/yr)
        const outdoorOffset = Math.min((totalGallons / 9000) * 100, 100);

        return {
          primary: {
            label: "Annual Rainwater Collected",
            value: formatNumber(totalGallons, 0) + " gallons",
          },
          details: [
            { label: "Monthly Average", value: formatNumber(monthlyGallons, 0) + " gallons" },
            { label: "Annual (liters)", value: formatNumber(totalLiters, 0) + " L" },
            { label: "Collection Efficiency", value: formatNumber(efficiency * 100, 0) + "%" },
            { label: "Annual Water Bill Savings", value: "$" + formatNumber(annualSavings, 2) },
            { label: "Recommended Tank Size", value: formatNumber(tankSizeGal, 0) + " gallons" },
            { label: "Outdoor Water Use Offset", value: formatNumber(outdoorOffset, 0) + "%" },
          ],
          note: "Collected rainwater is excellent for irrigation, car washing, and toilet flushing. Check local regulations -- some areas require permits or restrict rainwater collection.",
        };
      },
    },
  ],
  relatedSlugs: ["water-footprint-calculator", "greywater-reuse-calculator"],
  faq: [
    {
      question: "How much rain can I collect from my roof?",
      answer:
        "For every 1 inch of rainfall on 1,000 sq ft of roof, you can collect approximately 623 gallons of water (minus losses from evaporation and inefficiency). A 1,500 sq ft roof in an area with 40 inches of rain could collect over 33,000 gallons annually.",
    },
    {
      question: "Is it legal to collect rainwater?",
      answer:
        "Rainwater harvesting is legal in most US states, but regulations vary. Some states actively encourage it with tax credits, while a few require permits for large systems. Check your local regulations before installing.",
    },
  ],
  formula:
    "Annual Gallons = Roof Area (sq ft) x Annual Rainfall (in) x 0.623 x Roof Efficiency. Savings = (Gallons / 1000) x Water Rate.",
};
