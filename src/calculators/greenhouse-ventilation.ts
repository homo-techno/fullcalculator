import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const greenhouseVentilationCalculator: CalculatorDefinition = {
  slug: "greenhouse-ventilation",
  title: "Greenhouse Ventilation Calculator",
  description:
    "Free greenhouse ventilation calculator. Calculate required fan CFM, vent area, and air exchanges per hour based on greenhouse size and climate zone.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "greenhouse ventilation",
    "greenhouse fan size",
    "CFM calculator greenhouse",
    "greenhouse cooling",
    "vent area calculator",
    "air exchange greenhouse",
    "greenhouse climate control",
  ],
  variants: [
    {
      id: "fan-sizing",
      name: "Exhaust Fan Sizing",
      description: "Calculate required fan CFM for greenhouse ventilation",
      fields: [
        {
          name: "length",
          label: "Greenhouse Length (feet)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "width",
          label: "Greenhouse Width (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "height",
          label: "Average Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
          defaultValue: 8,
        },
        {
          name: "climate",
          label: "Climate Zone",
          type: "select",
          options: [
            { label: "Cool (northern, mild summers)", value: "cool" },
            { label: "Temperate (moderate)", value: "temperate" },
            { label: "Warm (southern, hot summers)", value: "warm" },
            { label: "Hot/Arid (desert regions)", value: "hot" },
          ],
          defaultValue: "temperate",
        },
        {
          name: "ventType",
          label: "Ventilation Type",
          type: "select",
          options: [
            { label: "Exhaust fan only", value: "exhaust" },
            { label: "Exhaust fan + evaporative pad", value: "evap" },
          ],
          defaultValue: "exhaust",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const height = parseFloat(inputs.height as string);
        const climate = inputs.climate as string;
        const ventType = inputs.ventType as string;
        if (isNaN(length) || isNaN(width) || isNaN(height)) return null;
        if (length <= 0 || width <= 0 || height <= 0) return null;

        const volume = length * width * height;
        const floorArea = length * width;

        // Air exchanges per minute needed
        // Standard: 1 air exchange per minute for summer cooling
        const climateFactors: Record<string, number> = {
          "cool": 0.75,
          "temperate": 1.0,
          "warm": 1.25,
          "hot": 1.5,
        };

        const factor = climateFactors[climate] || 1.0;
        const cfmRequired = volume * factor;

        // With evaporative cooling, air speed through pads is 250-400 fpm
        // Pad area = CFM / 250
        const padArea = ventType === "evap" ? cfmRequired / 250 : 0;

        // Intake vent area (sq ft) = CFM / 300 fpm velocity
        const intakeVentArea = cfmRequired / 300;

        // Number of fans (typical greenhouse fan is 1000-2000 CFM each)
        const fanSize = cfmRequired > 5000 ? 2000 : 1000;
        const numFans = Math.ceil(cfmRequired / fanSize);

        const exchangesPerHour = (cfmRequired * 60) / volume;

        return {
          primary: {
            label: "Required CFM",
            value: formatNumber(cfmRequired, 0),
            suffix: "CFM",
          },
          details: [
            { label: "Greenhouse Volume", value: formatNumber(volume) + " cu ft" },
            { label: "Floor Area", value: formatNumber(floorArea) + " sq ft" },
            { label: "Air Exchanges/Hour", value: formatNumber(exchangesPerHour, 0) },
            { label: "Suggested Fans", value: formatNumber(numFans) + " x " + formatNumber(fanSize) + " CFM" },
            { label: "Intake Vent Area", value: formatNumber(intakeVentArea, 1) + " sq ft" },
            { label: "Evap Pad Area", value: ventType === "evap" ? formatNumber(padArea, 1) + " sq ft" : "N/A" },
          ],
          note: "Fan should be mounted on the leeward end. Intake vents should be on the opposite end at low level.",
        };
      },
    },
    {
      id: "natural-vent",
      name: "Natural Ventilation Sizing",
      description: "Calculate ridge and side vent areas for passive ventilation",
      fields: [
        {
          name: "floorArea",
          label: "Greenhouse Floor Area (sq ft)",
          type: "number",
          placeholder: "e.g. 300",
        },
        {
          name: "ventType",
          label: "Vent Configuration",
          type: "select",
          options: [
            { label: "Ridge vent + side vents", value: "both" },
            { label: "Ridge vent only", value: "ridge" },
            { label: "Side vents only", value: "side" },
          ],
          defaultValue: "both",
        },
      ],
      calculate: (inputs) => {
        const floorArea = parseFloat(inputs.floorArea as string);
        const ventType = inputs.ventType as string;
        if (isNaN(floorArea) || floorArea <= 0) return null;

        // Rule of thumb: total vent area should be 15-20% of floor area
        // Ridge + side combined: 15-20% of floor area
        // Ridge only: needs more, ~20-25%
        // Side only: ~20-25%
        let totalVentPercent: number;
        let ridgeVent: number;
        let sideVent: number;

        switch (ventType) {
          case "both":
            totalVentPercent = 0.17;
            ridgeVent = floorArea * 0.08;
            sideVent = floorArea * 0.09;
            break;
          case "ridge":
            totalVentPercent = 0.22;
            ridgeVent = floorArea * 0.22;
            sideVent = 0;
            break;
          case "side":
            totalVentPercent = 0.22;
            ridgeVent = 0;
            sideVent = floorArea * 0.22;
            break;
          default:
            return null;
        }

        const totalVentArea = floorArea * totalVentPercent;

        return {
          primary: {
            label: "Total Vent Area Needed",
            value: formatNumber(totalVentArea, 1),
            suffix: "sq ft",
          },
          details: [
            { label: "Floor Area", value: formatNumber(floorArea) + " sq ft" },
            { label: "Vent-to-Floor Ratio", value: formatNumber(totalVentPercent * 100) + "%" },
            { label: "Ridge Vent Area", value: ridgeVent > 0 ? formatNumber(ridgeVent, 1) + " sq ft" : "N/A" },
            { label: "Side Vent Area", value: sideVent > 0 ? formatNumber(sideVent, 1) + " sq ft" : "N/A" },
          ],
          note: "Natural ventilation works best with temperature differentials. Combine with shade cloth (30-50%) for hot climates.",
        };
      },
    },
  ],
  relatedSlugs: ["rain-garden-calc", "rainwater-tank-calc", "solar-battery-calc"],
  faq: [
    {
      question: "How many air exchanges per hour does a greenhouse need?",
      answer:
        "In summer, greenhouses need 40-60 air exchanges per hour (roughly 1 per minute) to maintain temperatures. In winter, 2-4 exchanges per hour is sufficient to control humidity and CO2 levels. The required CFM equals greenhouse volume times exchanges per minute.",
    },
    {
      question: "How do I size a greenhouse exhaust fan?",
      answer:
        "Calculate your greenhouse volume (L x W x H), then multiply by 1.0-1.5 depending on climate. A 12x30x8 ft greenhouse is 2,880 cu ft, requiring about 2,880-4,320 CFM. In hot climates, increase by 25-50%. Place the fan on the leeward end.",
    },
    {
      question: "Is natural ventilation sufficient for a greenhouse?",
      answer:
        "Natural ventilation (ridge and side vents) works for mild climates and smaller greenhouses. Vent area should be 15-25% of floor area. For hot climates or commercial operations, powered exhaust fans with evaporative cooling pads are more effective.",
    },
  ],
  formula:
    "CFM = Volume x Climate Factor | Intake Vent Area = CFM / 300 | Natural Vent Area = Floor Area x 15-22%",
};
