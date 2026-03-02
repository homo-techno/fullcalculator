import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flightCarbonOffsetCalculator: CalculatorDefinition = {
  slug: "flight-carbon-offset-calculator",
  title: "Flight Carbon Offset Calculator",
  description: "Calculate the carbon emissions from your flight and the cost to offset them through carbon credits.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["flight carbon offset","aviation emissions","CO2 flight calculator","carbon credit flight"],
  variants: [{
    id: "standard",
    name: "Flight Carbon Offset",
    description: "Calculate the carbon emissions from your flight and the cost to offset them through carbon credits.",
    fields: [
      { name: "distance", label: "Flight Distance (miles)", type: "number", min: 50, max: 12000, defaultValue: 2500 },
      { name: "cabinClass", label: "Cabin Class", type: "select", options: [{ value: "1", label: "Economy" }, { value: "2", label: "Premium Economy" }, { value: "3", label: "Business" }, { value: "4", label: "First Class" }], defaultValue: "1" },
      { name: "roundTrip", label: "Round Trip?", type: "select", options: [{ value: "1", label: "One Way" }, { value: "2", label: "Round Trip" }], defaultValue: "2" },
      { name: "offsetPrice", label: "Carbon Offset Price ($/ton CO2)", type: "number", min: 5, max: 100, defaultValue: 15 },
    ],
    calculate: (inputs) => {
    const distance = inputs.distance as number;
    const cabinClass = parseInt(inputs.cabinClass as string);
    const roundTrip = inputs.roundTrip as string;
    const offsetPrice = inputs.offsetPrice as number;
    const distKm = distance * 1.60934;
    const multiplier = roundTrip === "2" ? 2 : 1;
    const classFactor = [1, 1.6, 2.9, 4.0][cabinClass - 1] || 1;
    const emissionFactor = distKm < 1500 ? 0.000255 : distKm < 4000 ? 0.000195 : 0.000170;
    const co2Tons = (distKm * emissionFactor * classFactor * multiplier);
    const offsetCost = co2Tons * offsetPrice;
    const treesEquivalent = Math.round(co2Tons / 0.022);
    return {
      primary: { label: "CO2 Emissions", value: formatNumber(Math.round(co2Tons * 100) / 100) + " metric tons" },
      details: [
        { label: "Offset Cost", value: "$" + formatNumber(Math.round(offsetCost * 100) / 100) },
        { label: "Distance", value: formatNumber(Math.round(distKm)) + " km (" + formatNumber(distance) + " mi)" },
        { label: "Class Multiplier", value: formatNumber(classFactor) + "x" },
        { label: "Equivalent Trees for 1 Year", value: formatNumber(treesEquivalent) + " trees" }
      ]
    };
  },
  }],
  relatedSlugs: ["carbon-footprint-calculator","tree-planting-offset-calculator","travel-budget-calculator"],
  faq: [
    { question: "How much CO2 does a flight produce?", answer: "A round-trip economy flight from New York to London produces about 1 to 1.5 metric tons of CO2 per passenger, roughly equal to driving 3,000 to 4,000 miles." },
    { question: "Why does business class have higher emissions?", answer: "Premium cabins take up more floor space per passenger, meaning fewer people per flight. Business class produces about 3 times more emissions per passenger than economy." },
    { question: "Do carbon offsets actually help?", answer: "Quality carbon offsets fund projects like reforestation and renewable energy. Look for Gold Standard or Verified Carbon Standard certifications for credible offsets." },
  ],
  formula: "CO2 (tons) = Distance (km) x Emission Factor x Class Factor x Trip Multiplier
Offset Cost = CO2 Tons x Price Per Ton",
};
