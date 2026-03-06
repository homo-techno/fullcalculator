import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const livestockWaterNeedsCalculator: CalculatorDefinition = {
  slug: "livestock-water-needs-calculator",
  title: "Livestock Water Needs Calculator",
  description: "Calculate daily and seasonal water requirements for different livestock types based on animal weight, temperature, and production stage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["livestock water needs","cattle water calculator","animal water requirements"],
  variants: [{
    id: "standard",
    name: "Livestock Water Needs",
    description: "Calculate daily and seasonal water requirements for different livestock types based on animal weight, temperature, and production stage.",
    fields: [
      { name: "animalType", label: "Animal Type", type: "select", options: [{ value: "1", label: "Beef Cattle" }, { value: "2", label: "Dairy Cow" }, { value: "3", label: "Horse" }, { value: "4", label: "Sheep/Goat" }, { value: "5", label: "Swine" }], defaultValue: "1" },
      { name: "numAnimals", label: "Number of Animals", type: "number", min: 1, max: 10000, defaultValue: 100 },
      { name: "avgTemp", label: "Average Temperature (F)", type: "number", min: 0, max: 120, defaultValue: 80 },
      { name: "days", label: "Period (days)", type: "number", min: 1, max: 365, defaultValue: 90 },
    ],
    calculate: (inputs) => {
      const at = inputs.animalType as number;
      const na = inputs.numAnimals as number;
      const temp = inputs.avgTemp as number;
      const days = inputs.days as number;
      if (!na || !days) return null;
      var baseGal = 12;
      if (at == 1) baseGal = 12;
      else if (at == 2) baseGal = 30;
      else if (at == 3) baseGal = 10;
      else if (at == 4) baseGal = 2;
      else baseGal = 5;
      var tempFactor = 1;
      if (temp > 90) tempFactor = 1.5;
      else if (temp > 80) tempFactor = 1.2;
      else if (temp < 32) tempFactor = 0.85;
      const dailyPerHead = Math.round(baseGal * tempFactor * 10) / 10;
      const dailyTotal = Math.round(dailyPerHead * na);
      const totalGallons = dailyTotal * days;
      return {
        primary: { label: "Daily Per Head", value: formatNumber(dailyPerHead) + " gal" },
        details: [
          { label: "Daily Herd Total", value: formatNumber(dailyTotal) + " gal" },
          { label: "Period Total", value: formatNumber(totalGallons) + " gal" },
          { label: "Temperature Factor", value: formatNumber(tempFactor) + "x" },
        ],
      };
  },
  }],
  relatedSlugs: ["livestock-feed-calculator","cattle-weight-gain-calculator"],
  faq: [
    { question: "How much water does a cow drink per day?", answer: "A beef cow drinks 7 to 20 gallons per day depending on size, temperature, and lactation. Dairy cows drink 25 to 50 gallons per day due to milk production demands." },
    { question: "Does temperature affect water consumption?", answer: "Yes significantly. Cattle water intake can increase 50% or more when temperatures exceed 90 degrees F. Adequate water supply is critical for preventing heat stress." },
  ],
  formula: "Daily Water = Base Requirement x Temperature Factor; Total Water = Daily Per Head x Number of Animals x Days",
};
