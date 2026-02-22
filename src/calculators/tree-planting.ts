import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const treePlantingCalculator: CalculatorDefinition = {
  slug: "tree-planting-calculator",
  title: "Tree Planting Offset Calculator",
  description:
    "Free tree planting offset calculator. Determine how many trees you need to plant to offset your carbon emissions over time.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "tree planting",
    "carbon offset",
    "tree carbon sequestration",
    "reforestation",
    "tree co2 absorption",
    "plant trees",
  ],
  variants: [
    {
      id: "offset",
      name: "Carbon Offset by Trees",
      fields: [
        {
          name: "co2Tons",
          label: "CO2 to Offset (metric tons/year)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "treeType",
          label: "Tree Type",
          type: "select",
          options: [
            { label: "Deciduous (oak, maple)", value: "deciduous" },
            { label: "Coniferous (pine, spruce)", value: "coniferous" },
            { label: "Tropical (teak, mahogany)", value: "tropical" },
            { label: "Fast-growing (bamboo, willow)", value: "fast" },
          ],
        },
        {
          name: "years",
          label: "Time Horizon (years)",
          type: "number",
          placeholder: "e.g. 10",
          defaultValue: 10,
        },
      ],
      calculate: (inputs) => {
        const co2Tons = inputs.co2Tons as number;
        const treeType = (inputs.treeType as string) || "deciduous";
        const years = (inputs.years as number) || 10;
        if (!co2Tons) return null;

        // kg CO2 absorbed per tree per year (mature average)
        const absorptionRates: Record<string, number> = {
          deciduous: 21,
          coniferous: 16,
          tropical: 25,
          fast: 35,
        };

        const ratePerTree = absorptionRates[treeType] || 21;
        const totalCO2Kg = co2Tons * 1000;
        const annualTarget = totalCO2Kg;
        const treesForAnnual = Math.ceil(annualTarget / ratePerTree);
        const totalOffsetOverYears = treesForAnnual * ratePerTree * years;
        const costEstimate = treesForAnnual * 3; // avg $3 per tree planted
        const landAcres = (treesForAnnual / 400) * 1; // ~400 trees per acre

        return {
          primary: {
            label: "Trees Needed",
            value: formatNumber(treesForAnnual, 0) + " trees",
          },
          details: [
            { label: "CO2 Absorbed per Tree/Year", value: formatNumber(ratePerTree, 1) + " kg" },
            { label: "Annual Offset", value: formatNumber(treesForAnnual * ratePerTree / 1000, 2) + " metric tons" },
            { label: "Total Offset over " + years + " years", value: formatNumber(totalOffsetOverYears / 1000, 1) + " metric tons" },
            { label: "Estimated Planting Cost", value: "$" + formatNumber(costEstimate, 0) },
            { label: "Land Required (approx)", value: formatNumber(landAcres, 2) + " acres" },
          ],
          note: "Young trees absorb less CO2 than mature ones. These estimates use average mature tree absorption rates. It takes 10-20 years for most trees to reach full sequestration potential.",
        };
      },
    },
  ],
  relatedSlugs: ["carbon-footprint-calculator", "ecological-footprint-calculator"],
  faq: [
    {
      question: "How much CO2 does one tree absorb?",
      answer:
        "A mature tree absorbs approximately 21 kg (48 lbs) of CO2 per year on average. This varies widely by species, climate, and age. Fast-growing species like bamboo can absorb significantly more.",
    },
    {
      question: "Is tree planting enough to offset emissions?",
      answer:
        "Tree planting alone cannot solve climate change. It takes decades for trees to reach maturity, and land availability is limited. Reducing emissions at the source is far more effective, with tree planting as a complementary strategy.",
    },
  ],
  formula:
    "Trees Needed = (CO2 tons x 1000) / Absorption Rate per tree. Rates: Deciduous 21 kg/yr, Coniferous 16 kg/yr, Tropical 25 kg/yr, Fast-growing 35 kg/yr.",
};
