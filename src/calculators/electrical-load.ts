import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricalLoadCalculator: CalculatorDefinition = {
  slug: "electrical-load-calculator",
  title: "Electrical Load Calculator",
  description:
    "Free electrical load calculator. Estimate total electrical load for homes and buildings. Calculate service size, panel capacity, and demand load.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "electrical load calculator",
    "load calculation",
    "service size calculator",
    "panel sizing",
    "electrical demand",
    "home electrical load",
  ],
  variants: [
    {
      id: "residential-load",
      name: "Residential Load Calculation",
      description: "Simplified NEC residential load calculation",
      fields: [
        {
          name: "squareFootage",
          label: "Living Area (sq ft)",
          type: "number",
          placeholder: "e.g. 2000",
        },
        {
          name: "smallAppliances",
          label: "Small Appliance Circuits (20A each)",
          type: "number",
          placeholder: "e.g. 2",
          defaultValue: 2,
        },
        {
          name: "laundryCircuits",
          label: "Laundry Circuits (20A each)",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 1,
        },
        {
          name: "acHeating",
          label: "A/C or Heating Load (W)",
          type: "number",
          placeholder: "e.g. 5000",
        },
        {
          name: "dryer",
          label: "Electric Dryer (W)",
          type: "number",
          placeholder: "e.g. 5000",
          defaultValue: 5000,
        },
        {
          name: "range",
          label: "Electric Range (W)",
          type: "number",
          placeholder: "e.g. 8000",
          defaultValue: 8000,
        },
        {
          name: "voltage",
          label: "Service Voltage",
          type: "select",
          options: [
            { label: "120/240V Single Phase", value: "240" },
            { label: "120/208V Three Phase", value: "208" },
          ],
          defaultValue: "240",
        },
      ],
      calculate: (inputs) => {
        const sqft = inputs.squareFootage as number;
        const smallAppl = inputs.smallAppliances as number;
        const laundry = inputs.laundryCircuits as number;
        const acHeat = inputs.acHeating as number;
        const dryer = inputs.dryer as number;
        const range = inputs.range as number;
        const voltage = Number(inputs.voltage);
        if (!sqft) return null;

        // NEC Standard Method
        // General lighting: 3 VA/sq ft
        const lightingLoad = sqft * 3;

        // Small appliance and laundry circuits: 1500W each
        const smallApplianceLoad = (smallAppl || 2) * 1500;
        const laundryLoad = (laundry || 1) * 1500;

        // Subtotal for demand factor
        const subtotal = lightingLoad + smallApplianceLoad + laundryLoad;

        // Apply demand factor: first 3000W at 100%, remainder at 35%
        let demandGeneral: number;
        if (subtotal <= 3000) {
          demandGeneral = subtotal;
        } else {
          demandGeneral = 3000 + (subtotal - 3000) * 0.35;
        }

        // Fixed appliances at 100%
        const dryerLoad = dryer || 0;
        const rangeLoad = range || 0;
        const acHeatLoad = acHeat || 0;

        // Range demand (NEC Table 220.55, Column C for single range ≤12kW)
        const rangeDemand = rangeLoad <= 12000 ? 8000 : rangeLoad;

        const totalDemand = demandGeneral + dryerLoad + rangeDemand + acHeatLoad;
        const serviceAmps = totalDemand / voltage;

        // Determine recommended service size
        let recommendedService: number;
        if (serviceAmps <= 100) recommendedService = 100;
        else if (serviceAmps <= 150) recommendedService = 150;
        else if (serviceAmps <= 200) recommendedService = 200;
        else if (serviceAmps <= 300) recommendedService = 300;
        else recommendedService = 400;

        return {
          primary: {
            label: "Service Size Required",
            value: `${recommendedService} A`,
          },
          details: [
            { label: "Total Demand Load", value: `${formatNumber(totalDemand, 0)} W` },
            { label: "Calculated Service Amps", value: `${formatNumber(serviceAmps, 2)} A` },
            { label: "Recommended Service", value: `${recommendedService} A` },
            { label: "General Lighting Load", value: `${formatNumber(lightingLoad, 0)} W` },
            { label: "General Demand (after factor)", value: `${formatNumber(demandGeneral, 0)} W` },
            { label: "Range Demand", value: `${formatNumber(rangeDemand, 0)} W` },
            { label: "A/C + Heating", value: `${formatNumber(acHeatLoad, 0)} W` },
            { label: "Dryer", value: `${formatNumber(dryerLoad, 0)} W` },
          ],
          note: "Simplified calculation per NEC Article 220. Consult a licensed electrician for actual service sizing.",
        };
      },
    },
    {
      id: "appliance-total",
      name: "Total Appliance Load",
      description: "Add up total connected load from appliances",
      fields: [
        {
          name: "lighting",
          label: "Lighting (W)",
          type: "number",
          placeholder: "e.g. 2000",
          defaultValue: 0,
        },
        {
          name: "kitchen",
          label: "Kitchen Appliances (W)",
          type: "number",
          placeholder: "e.g. 3000",
          defaultValue: 0,
        },
        {
          name: "hvac",
          label: "HVAC / Heating (W)",
          type: "number",
          placeholder: "e.g. 5000",
          defaultValue: 0,
        },
        {
          name: "waterHeater",
          label: "Water Heater (W)",
          type: "number",
          placeholder: "e.g. 4500",
          defaultValue: 0,
        },
        {
          name: "other",
          label: "Other Loads (W)",
          type: "number",
          placeholder: "e.g. 2000",
          defaultValue: 0,
        },
        {
          name: "demandFactor",
          label: "Demand Factor (%)",
          type: "number",
          placeholder: "e.g. 70",
          defaultValue: 70,
        },
      ],
      calculate: (inputs) => {
        const lighting = (inputs.lighting as number) || 0;
        const kitchen = (inputs.kitchen as number) || 0;
        const hvac = (inputs.hvac as number) || 0;
        const waterHeater = (inputs.waterHeater as number) || 0;
        const other = (inputs.other as number) || 0;
        const df = (inputs.demandFactor as number) || 70;

        const totalConnected = lighting + kitchen + hvac + waterHeater + other;
        if (totalConnected === 0) return null;

        const demandLoad = totalConnected * (df / 100);
        const amps240 = demandLoad / 240;
        const amps208 = demandLoad / 208;

        return {
          primary: {
            label: "Demand Load",
            value: `${formatNumber(demandLoad, 0)} W`,
          },
          details: [
            { label: "Total Connected Load", value: `${formatNumber(totalConnected, 0)} W` },
            { label: "Demand Load", value: `${formatNumber(demandLoad, 0)} W (${df}% factor)` },
            { label: "Current at 240V", value: `${formatNumber(amps240, 2)} A` },
            { label: "Current at 208V", value: `${formatNumber(amps208, 2)} A` },
            { label: "Demand (kW)", value: `${formatNumber(demandLoad / 1000, 2)} kW` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electrical-power-calculator", "wire-ampacity-calculator", "fuse-sizing-calculator"],
  faq: [
    {
      question: "What is an electrical load calculation?",
      answer:
        "An electrical load calculation determines the total power demand of a building to size the electrical service (main panel), feeders, and branch circuits. It follows NEC Article 220 methods, applying demand factors to account for the fact that not all loads operate simultaneously.",
    },
    {
      question: "What size service do I need for my home?",
      answer:
        "Most modern homes need 200A service. Smaller homes under 1,500 sq ft may use 100-150A. Larger homes with electric heating, EV chargers, or pools may need 300-400A. A load calculation per NEC Article 220 determines the exact requirement.",
    },
    {
      question: "What is a demand factor?",
      answer:
        "A demand factor accounts for the fact that not all electrical loads operate at the same time. NEC provides specific demand factors: general lighting uses 100% for the first 3,000W and 35% for the remainder. Ranges, dryers, and HVAC have their own demand factors.",
    },
  ],
  formula:
    "General Load: 3 VA/sq ft | Demand: First 3000W at 100% + remainder at 35% | Service Amps = Total Demand / Voltage",
};
