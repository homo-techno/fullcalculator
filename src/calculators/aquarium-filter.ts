import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquariumFilterCalculator: CalculatorDefinition = {
  slug: "aquarium-filter-calculator",
  title: "Aquarium Filter Size Calculator",
  description:
    "Free aquarium filter size calculator. Determine the correct filter flow rate and type for your fish tank based on tank volume, fish load, and tank type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "aquarium filter size",
    "fish tank filter calculator",
    "filter flow rate",
    "aquarium filtration",
    "GPH filter calculator",
  ],
  variants: [
    {
      id: "filter-size",
      name: "Aquarium Filter Size",
      description: "Calculate the right filter for your aquarium",
      fields: [
        {
          name: "tankVolume",
          label: "Tank Volume",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "gallons",
          min: 1,
          max: 500,
        },
        {
          name: "stockingLevel",
          label: "Fish Stocking Level",
          type: "select",
          options: [
            { label: "Lightly Stocked", value: "light" },
            { label: "Moderately Stocked", value: "moderate" },
            { label: "Heavily Stocked", value: "heavy" },
            { label: "Overstocked (messy fish)", value: "over" },
          ],
          defaultValue: "moderate",
        },
        {
          name: "tankType",
          label: "Tank Type",
          type: "select",
          options: [
            { label: "Freshwater Community", value: "fresh_community" },
            { label: "Freshwater Cichlid", value: "fresh_cichlid" },
            { label: "Planted Tank", value: "planted" },
            { label: "Saltwater / Reef", value: "saltwater" },
            { label: "Turtle Tank", value: "turtle" },
          ],
          defaultValue: "fresh_community",
        },
        {
          name: "filterType",
          label: "Preferred Filter Type",
          type: "select",
          options: [
            { label: "Hang-on-Back (HOB)", value: "hob" },
            { label: "Canister Filter", value: "canister" },
            { label: "Sponge Filter", value: "sponge" },
            { label: "Internal Filter", value: "internal" },
            { label: "No Preference", value: "any" },
          ],
          defaultValue: "any",
        },
      ],
      calculate: (inputs) => {
        const tankVolume = inputs.tankVolume as number;
        const stockingLevel = inputs.stockingLevel as string;
        const tankType = inputs.tankType as string;
        const filterType = inputs.filterType as string;
        if (!tankVolume) return null;

        // Base turnover rate: tank should cycle 4-6x per hour
        let turnoverRate: number;
        switch (stockingLevel) {
          case "light": turnoverRate = 4; break;
          case "moderate": turnoverRate = 5; break;
          case "heavy": turnoverRate = 6; break;
          case "over": turnoverRate = 8; break;
          default: turnoverRate = 5;
        }

        // Tank type adjustments
        if (tankType === "turtle") turnoverRate = Math.max(turnoverRate, 8); // Turtles are messy
        else if (tankType === "fresh_cichlid") turnoverRate = Math.max(turnoverRate, 6);
        else if (tankType === "saltwater") turnoverRate = Math.max(turnoverRate, 6);
        else if (tankType === "planted") turnoverRate = Math.min(turnoverRate, 5); // Too much flow disturbs plants

        const requiredGPH = Math.round(tankVolume * turnoverRate);

        // Recommend filter type based on tank size
        let recommendedType: string;
        if (filterType !== "any") {
          recommendedType = filterType === "hob" ? "Hang-on-Back" : filterType === "canister" ? "Canister" : filterType === "sponge" ? "Sponge" : "Internal";
        } else if (tankVolume > 75) {
          recommendedType = "Canister";
        } else if (tankVolume > 30) {
          recommendedType = "Hang-on-Back or Canister";
        } else if (tankVolume > 10) {
          recommendedType = "Hang-on-Back";
        } else {
          recommendedType = "Sponge or Internal";
        }

        // Media suggestions
        let mediaSuggestion: string;
        if (tankType === "planted") {
          mediaSuggestion = "Mechanical + biological (skip carbon to preserve nutrients)";
        } else if (tankType === "saltwater") {
          mediaSuggestion = "Mechanical + biological + protein skimmer recommended";
        } else {
          mediaSuggestion = "Mechanical + chemical (carbon) + biological";
        }

        return {
          primary: {
            label: "Required Flow Rate",
            value: `${formatNumber(requiredGPH)} GPH`,
          },
          details: [
            { label: "Tank Turnover Rate", value: `${turnoverRate}x per hour` },
            { label: "Recommended Filter Type", value: recommendedType },
            { label: "Filter Media", value: mediaSuggestion },
            { label: "Tank Volume", value: `${formatNumber(tankVolume)} gallons` },
            { label: "Filter Rated For", value: `Look for filters rated ${formatNumber(Math.round(requiredGPH * 1.2))}+ GPH` },
          ],
          note: "Always buy a filter rated higher than your minimum GPH, as actual flow decreases as media gets dirty. Oversizing your filter is better than undersizing.",
        };
      },
    },
  ],
  relatedSlugs: ["aquarium-heater-calculator", "fish-tank-stocking-calculator"],
  faq: [
    {
      question: "How do I calculate filter flow rate?",
      answer:
        "Multiply your tank volume by the desired turnover rate. For most freshwater tanks, you want the entire water volume to pass through the filter 4-6 times per hour. A 30-gallon tank needs 120-180 GPH (gallons per hour) of filtration.",
    },
    {
      question: "Which is better: HOB or canister filter?",
      answer:
        "Hang-on-Back (HOB) filters are easier to maintain and more affordable, ideal for tanks under 55 gallons. Canister filters offer more media capacity, higher flow rates, and quieter operation, making them better for larger tanks or heavily stocked setups.",
    },
    {
      question: "How often should I clean my aquarium filter?",
      answer:
        "Rinse mechanical filter media every 2-4 weeks in old tank water (never tap water, which kills beneficial bacteria). Replace chemical media (carbon) monthly. Biological media should rarely be replaced - only rinse gently if flow is severely reduced.",
    },
  ],
  formula:
    "Required GPH = Tank Volume (gallons) x Turnover Rate (4-8x per hour)",
};
