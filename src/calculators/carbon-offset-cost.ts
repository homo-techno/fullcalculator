import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const offsetTypeOptions = [
  { label: "Flight (per hour)", value: "flight" },
  { label: "Car (per 1,000 miles)", value: "car" },
  { label: "Home Energy (per month)", value: "home" },
  { label: "Diet (per year, avg omnivore)", value: "diet" },
  { label: "Custom (enter CO2 kg)", value: "custom" },
];

const emissionFactors: Record<string, number> = {
  flight: 250,
  car: 400,
  home: 900,
  diet: 2500,
  custom: 0,
};

export const carbonOffsetCostCalculator: CalculatorDefinition = {
  slug: "carbon-offset-cost-calculator",
  title: "Carbon Offset Cost Calculator",
  description:
    "Free carbon offset cost calculator. Estimate how much it costs to offset your carbon emissions from flights, driving, home energy, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "carbon offset",
    "carbon credit",
    "offset cost",
    "carbon neutral",
    "emissions offset",
    "flight carbon offset",
  ],
  variants: [
    {
      id: "offset-cost",
      name: "Offset Cost",
      description: "Estimate the cost to offset your carbon emissions",
      fields: [
        {
          name: "offsetType",
          label: "Emission Source",
          type: "select",
          options: offsetTypeOptions,
        },
        {
          name: "quantity",
          label: "Quantity (units depend on source)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0.1,
          step: 0.1,
        },
        {
          name: "customCO2",
          label: "Custom CO2 (kg) — only if Custom selected",
          type: "number",
          placeholder: "e.g. 1000",
          min: 0,
        },
        {
          name: "pricePerTon",
          label: "Price per Ton of CO2 ($)",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
          max: 200,
          defaultValue: 15,
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const offsetType = (inputs.offsetType as string) || "flight";
        const quantity = inputs.quantity as number;
        const customCO2 = (inputs.customCO2 as number) || 0;
        const pricePerTon = (inputs.pricePerTon as number) || 15;

        if (!quantity && offsetType !== "custom") return null;
        if (offsetType === "custom" && !customCO2) return null;

        let totalCO2Kg: number;
        if (offsetType === "custom") {
          totalCO2Kg = customCO2;
        } else {
          totalCO2Kg = (emissionFactors[offsetType] || 0) * (quantity || 0);
        }

        const totalCO2Tons = totalCO2Kg / 1000;
        const offsetCost = totalCO2Tons * pricePerTon;
        const treesEquivalent = totalCO2Kg / 22;

        const sourceLabel =
          offsetTypeOptions.find((o) => o.value === offsetType)?.label ?? offsetType;

        return {
          primary: {
            label: "Offset Cost",
            value: `$${formatNumber(offsetCost, 2)}`,
          },
          details: [
            { label: "Emission source", value: sourceLabel },
            { label: "Total CO2", value: `${formatNumber(totalCO2Kg, 1)} kg (${formatNumber(totalCO2Tons, 2)} tons)` },
            { label: "Price per ton", value: `$${formatNumber(pricePerTon, 2)}` },
            { label: "Trees equivalent (1 year)", value: `${formatNumber(treesEquivalent, 1)} trees` },
            { label: "Cost per kg CO2", value: `$${formatNumber(pricePerTon / 1000, 4)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "carbon-footprint-calculator",
    "carbon-tree-calculator",
    "flight-carbon-calculator",
  ],
  faq: [
    {
      question: "How much does it cost to offset 1 ton of CO2?",
      answer:
        "Carbon offset prices vary widely, from $3 to $50+ per ton depending on the project type. The average is around $10-15 per ton.",
    },
    {
      question: "How much CO2 does a flight produce?",
      answer:
        "A typical economy flight produces about 250 kg of CO2 per hour of flying. A round-trip transatlantic flight produces roughly 1.5-2 tons of CO2 per passenger.",
    },
  ],
  formula:
    "Offset Cost = (Total CO2 kg / 1000) x Price per Ton. Trees Equivalent = CO2 kg / 22 kg per tree per year.",
};
