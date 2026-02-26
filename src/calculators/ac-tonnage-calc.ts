import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const acTonnageCalculator: CalculatorDefinition = {
  slug: "ac-tonnage-calculator",
  title: "AC Unit Tonnage / Sizing Calculator",
  description:
    "Calculate the correct air conditioner size in tons or BTU for your home. Factor in square footage, climate zone, insulation, and sun exposure.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "AC tonnage calculator",
    "air conditioner size",
    "AC BTU calculator",
    "HVAC sizing",
    "what size AC do I need",
  ],
  variants: [
    {
      id: "by-sqft",
      name: "AC Size by Square Footage",
      description: "Estimate AC tonnage based on home size and conditions",
      fields: [
        {
          name: "sqFt",
          label: "Cooled Area (sq ft)",
          type: "number",
          placeholder: "e.g. 2000",
        },
        {
          name: "climate",
          label: "Climate Zone",
          type: "select",
          options: [
            { label: "Cool (Northern US)", value: "0.9" },
            { label: "Moderate (Mid-Atlantic)", value: "1.0" },
            { label: "Warm (Southern US)", value: "1.1" },
            { label: "Hot/Humid (Gulf/Desert)", value: "1.2" },
          ],
          defaultValue: "1.0",
        },
        {
          name: "insulation",
          label: "Insulation Quality",
          type: "select",
          options: [
            { label: "Poor (older home, little insulation)", value: "1.15" },
            { label: "Average", value: "1.0" },
            { label: "Good (well-insulated, new home)", value: "0.9" },
          ],
          defaultValue: "1.0",
        },
        {
          name: "sunExposure",
          label: "Sun Exposure",
          type: "select",
          options: [
            { label: "Heavily shaded", value: "0.9" },
            { label: "Average", value: "1.0" },
            { label: "Very sunny", value: "1.1" },
          ],
          defaultValue: "1.0",
        },
      ],
      calculate: (inputs) => {
        const sqFt = parseFloat(inputs.sqFt as string);
        const climate = parseFloat(inputs.climate as string);
        const insulation = parseFloat(inputs.insulation as string);
        const sunExposure = parseFloat(inputs.sunExposure as string);
        if (!sqFt) return null;

        // Base: 1 ton per 500-600 sq ft, using 20 BTU per sq ft as baseline
        const baseBTU = sqFt * 20;
        const adjustedBTU = baseBTU * climate * insulation * sunExposure;
        const tons = adjustedBTU / 12000;
        // Round to nearest 0.5 ton (standard AC sizes)
        const roundedTons = Math.ceil(tons * 2) / 2;
        const seerSavings13 = adjustedBTU / 13 / 1000; // kW at SEER 13
        const seerSavings16 = adjustedBTU / 16 / 1000; // kW at SEER 16

        return {
          primary: {
            label: "Recommended AC Size",
            value: `${formatNumber(roundedTons, 1)} tons`,
          },
          details: [
            { label: "Calculated BTU", value: `${formatNumber(adjustedBTU)} BTU/hr` },
            { label: "Exact tonnage", value: `${formatNumber(tons, 2)} tons` },
            { label: "Recommended size", value: `${formatNumber(roundedTons, 1)} tons (${formatNumber(roundedTons * 12000)} BTU)` },
            { label: "Power draw (SEER 13)", value: `${formatNumber(seerSavings13, 1)} kW` },
            { label: "Power draw (SEER 16)", value: `${formatNumber(seerSavings16, 1)} kW` },
          ],
          note: "This is an estimate. A proper Manual J calculation by an HVAC professional is recommended for accurate sizing. Oversizing causes short-cycling and poor humidity control.",
        };
      },
    },
    {
      id: "room-ac",
      name: "Room / Window AC Size",
      description: "Size a window or portable AC unit for a single room",
      fields: [
        {
          name: "roomSqFt",
          label: "Room Size (sq ft)",
          type: "number",
          placeholder: "e.g. 300",
        },
        {
          name: "ceilingHeight",
          label: "Ceiling Height (feet)",
          type: "select",
          options: [
            { label: "8 ft (standard)", value: "8" },
            { label: "9 ft", value: "9" },
            { label: "10 ft", value: "10" },
            { label: "12 ft (high ceiling)", value: "12" },
          ],
          defaultValue: "8",
        },
        {
          name: "occupants",
          label: "Number of Occupants",
          type: "number",
          placeholder: "e.g. 2",
          defaultValue: 2,
        },
      ],
      calculate: (inputs) => {
        const roomSqFt = parseFloat(inputs.roomSqFt as string);
        const ceilingHeight = parseFloat(inputs.ceilingHeight as string);
        const occupants = parseFloat(inputs.occupants as string) || 2;
        if (!roomSqFt) return null;

        // Energy Star recommendations
        let baseBTU = 0;
        if (roomSqFt <= 150) baseBTU = 5000;
        else if (roomSqFt <= 250) baseBTU = 6000;
        else if (roomSqFt <= 350) baseBTU = 8000;
        else if (roomSqFt <= 450) baseBTU = 10000;
        else if (roomSqFt <= 550) baseBTU = 12000;
        else if (roomSqFt <= 700) baseBTU = 14000;
        else baseBTU = Math.ceil((roomSqFt * 20) / 1000) * 1000;

        // Adjust for ceiling height
        const ceilingFactor = ceilingHeight / 8;
        // Add 600 BTU per person over 2
        const occupantAdj = Math.max(0, occupants - 2) * 600;
        const totalBTU = Math.ceil((baseBTU * ceilingFactor + occupantAdj) / 1000) * 1000;

        return {
          primary: {
            label: "Recommended BTU",
            value: `${formatNumber(totalBTU)} BTU`,
          },
          details: [
            { label: "Room size", value: `${formatNumber(roomSqFt)} sq ft` },
            { label: "Base BTU", value: formatNumber(baseBTU) },
            { label: "Ceiling adjustment", value: `x${formatNumber(ceilingFactor, 2)}` },
            { label: "Occupant adjustment", value: `+${formatNumber(occupantAdj)} BTU` },
            { label: "Final recommendation", value: `${formatNumber(totalBTU)} BTU` },
          ],
          note: "Based on Energy Star guidelines. Add 10% for kitchens. Sunny rooms may need 10% more. Well-shaded rooms need 10% less.",
        };
      },
    },
  ],
  relatedSlugs: ["furnace-size-calculator", "r-value-calculator", "electricity-calculator"],
  faq: [
    {
      question: "How many tons of AC do I need per square foot?",
      answer:
        "The general rule is 1 ton of cooling per 500-600 square feet of living space. A 2,000 sq ft home typically needs a 3.5-4 ton unit. However, climate, insulation, sun exposure, and ceiling height all affect the actual requirement.",
    },
    {
      question: "What happens if my AC unit is too big?",
      answer:
        "An oversized AC will short-cycle (turn on and off frequently), leading to poor humidity control, uneven temperatures, higher energy bills, and increased wear on the compressor. Proper sizing is essential for comfort and efficiency.",
    },
  ],
  formula:
    "BTU = Sq Ft x 20 x Climate Factor x Insulation Factor x Sun Factor | Tons = BTU / 12,000",
};
