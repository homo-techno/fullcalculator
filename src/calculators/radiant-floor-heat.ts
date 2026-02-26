import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const radiantFloorHeatCalculator: CalculatorDefinition = {
  slug: "radiant-floor-heat-calculator",
  title: "Radiant Floor Heating Calculator",
  description:
    "Calculate radiant floor heating requirements including BTU output, tubing length, and system sizing. Covers hydronic and electric radiant floor systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "radiant floor heating",
    "in-floor heating calculator",
    "hydronic floor heating",
    "radiant heat BTU",
    "heated floor cost",
  ],
  variants: [
    {
      id: "hydronic",
      name: "Hydronic Radiant Floor",
      description: "Calculate tubing and BTU for a hot-water radiant floor system",
      fields: [
        {
          name: "sqFt",
          label: "Heated Floor Area (sq ft)",
          type: "number",
          placeholder: "e.g. 1000",
        },
        {
          name: "tubeSpacing",
          label: "Tube Spacing (inches)",
          type: "select",
          options: [
            { label: '6" (high output)', value: "6" },
            { label: '9" (standard)', value: "9" },
            { label: '12" (low output)', value: "12" },
          ],
          defaultValue: "9",
        },
        {
          name: "heatLoss",
          label: "Heat Loss (BTU/sq ft/hr)",
          type: "select",
          options: [
            { label: "15 BTU (well insulated)", value: "15" },
            { label: "20 BTU (average)", value: "20" },
            { label: "25 BTU (older/poor insulation)", value: "25" },
            { label: "30 BTU (high heat loss)", value: "30" },
          ],
          defaultValue: "20",
        },
        {
          name: "floorType",
          label: "Floor Covering",
          type: "select",
          options: [
            { label: "Tile/Stone (best)", value: "1.0" },
            { label: "Concrete (good)", value: "1.0" },
            { label: "Hardwood (moderate)", value: "1.15" },
            { label: "Laminate (moderate)", value: "1.15" },
            { label: "Carpet (poor conductor)", value: "1.4" },
          ],
          defaultValue: "1.0",
        },
      ],
      calculate: (inputs) => {
        const sqFt = parseFloat(inputs.sqFt as string);
        const tubeSpacing = parseFloat(inputs.tubeSpacing as string);
        const heatLoss = parseFloat(inputs.heatLoss as string);
        const floorFactor = parseFloat(inputs.floorType as string);
        if (!sqFt || !tubeSpacing || !heatLoss) return null;

        // Tubing length: area / spacing (converted to feet) + 10% for headers and waste
        const tubingLength = (sqFt * 12 / tubeSpacing) * 1.1;

        // BTU output needed
        const totalBTU = sqFt * heatLoss * floorFactor;

        // Water flow rate: GPM = BTU / (500 x delta-T), assume 20F delta-T
        const gpm = totalBTU / (500 * 20);

        // Boiler size (input BTU at 85% efficiency)
        const boilerBTU = totalBTU / 0.85;

        // Circuit loops (max 300ft per loop)
        const numLoops = Math.ceil(tubingLength / 300);

        // Cost estimate: $6-12 per sq ft materials
        const materialCost = sqFt * 8;
        const installCost = sqFt * 10;

        return {
          primary: {
            label: "Total BTU Required",
            value: `${formatNumber(totalBTU)} BTU/hr`,
          },
          details: [
            { label: "Heated area", value: `${formatNumber(sqFt)} sq ft` },
            { label: "PEX tubing needed", value: `${formatNumber(tubingLength, 0)} linear ft` },
            { label: "Number of loops (max 300ft/loop)", value: formatNumber(numLoops) },
            { label: "Water flow rate", value: `${formatNumber(gpm, 1)} GPM` },
            { label: "Boiler input (85% eff)", value: `${formatNumber(boilerBTU)} BTU/hr` },
            { label: "Material cost estimate", value: `$${formatNumber(materialCost)}` },
            { label: "Installation estimate", value: `$${formatNumber(installCost)}` },
            { label: "Total estimate", value: `$${formatNumber(materialCost + installCost)}` },
          ],
          note: "Hydronic systems use 1/2\" PEX tubing. Keep loop lengths under 300ft for balanced flow. Tile and stone floors provide the best heat transfer. Carpet significantly reduces efficiency.",
        };
      },
    },
    {
      id: "electric",
      name: "Electric Radiant Floor",
      description: "Calculate electric radiant floor mat/cable sizing and cost",
      fields: [
        {
          name: "sqFt",
          label: "Heated Floor Area (sq ft)",
          type: "number",
          placeholder: "e.g. 100",
        },
        {
          name: "wattsPerSqFt",
          label: "Watts per Sq Ft",
          type: "select",
          options: [
            { label: "12 W/sqft (supplemental heat)", value: "12" },
            { label: "15 W/sqft (primary heat)", value: "15" },
          ],
          defaultValue: "12",
        },
        {
          name: "electricRate",
          label: "Electricity Rate ($/kWh)",
          type: "number",
          placeholder: "e.g. 0.12",
          defaultValue: 0.12,
        },
      ],
      calculate: (inputs) => {
        const sqFt = parseFloat(inputs.sqFt as string);
        const wattsPerSqFt = parseFloat(inputs.wattsPerSqFt as string);
        const electricRate = parseFloat(inputs.electricRate as string) || 0.12;
        if (!sqFt || !wattsPerSqFt) return null;

        const totalWatts = sqFt * wattsPerSqFt;
        const amps240 = totalWatts / 240;
        const amps120 = totalWatts / 120;
        const btuPerHour = totalWatts * 3.412;

        // Operating cost: assume 8 hours/day during heating season (6 months)
        const dailyCost = (totalWatts / 1000) * 8 * electricRate;
        const monthlyCost = dailyCost * 30;
        const seasonCost = dailyCost * 180;

        // Material cost: $8-15 per sq ft for electric mats
        const matCost = sqFt * 10;

        return {
          primary: {
            label: "Total Wattage",
            value: `${formatNumber(totalWatts)} watts`,
          },
          details: [
            { label: "Heated area", value: `${formatNumber(sqFt)} sq ft` },
            { label: "Total wattage", value: `${formatNumber(totalWatts)} W` },
            { label: "BTU output", value: `${formatNumber(btuPerHour)} BTU/hr` },
            { label: "Amps (240V circuit)", value: formatNumber(amps240, 1) },
            { label: "Amps (120V circuit)", value: formatNumber(amps120, 1) },
            { label: "Monthly operating cost", value: `$${formatNumber(monthlyCost, 2)}` },
            { label: "Heating season cost (6 mo)", value: `$${formatNumber(seasonCost)}` },
            { label: "Mat/cable material cost", value: `$${formatNumber(matCost)}` },
          ],
          note: "Electric radiant floor is ideal for bathrooms and small areas. Use a 240V circuit for areas over 50 sq ft. A dedicated thermostat with floor sensor is required. Operating cost assumes 8 hours/day.",
        };
      },
    },
  ],
  relatedSlugs: ["furnace-size-calculator", "r-value-calculator", "electricity-calculator"],
  faq: [
    {
      question: "How much does radiant floor heating cost to run?",
      answer:
        "Electric radiant floor heating costs about $0.10-0.20 per square foot per month to operate (at $0.12/kWh, 8 hours/day). A 100 sq ft bathroom costs roughly $15-25/month. Hydronic systems are cheaper to operate (using gas) but more expensive to install.",
    },
    {
      question: "Can I put radiant heat under any flooring?",
      answer:
        "Tile and stone work best with radiant heat due to their high thermal conductivity. Engineered hardwood works well if rated for radiant heat. Laminate is acceptable. Thick carpet and pad significantly insulate against the heat and are not recommended.",
    },
  ],
  formula:
    "Tubing Length = (Area x 12 / Spacing) x 1.1 | BTU = Area x Heat Loss x Floor Factor | GPM = BTU / (500 x Delta-T)",
};
