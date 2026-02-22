import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const humidifierSizeCalculator: CalculatorDefinition = {
  slug: "humidifier-size-calculator",
  title: "Humidifier Sizing Calculator",
  description: "Free humidifier sizing calculator. Calculate the humidification capacity needed based on home size, construction, and desired humidity.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["humidifier size calculator", "humidifier capacity", "whole house humidifier", "humidification calculator", "gallons per day humidifier"],
  variants: [
    {
      id: "whole-house",
      name: "Whole House Humidifier",
      description: "Calculate humidifier capacity for your home",
      fields: [
        { name: "area", label: "Home Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "construction", label: "Construction Type", type: "select", options: [
          { label: "Tight (new, well-sealed)", value: "tight" },
          { label: "Average", value: "average" },
          { label: "Loose (older home)", value: "loose" },
        ], defaultValue: "average" },
        { name: "outdoorTemp", label: "Coldest Outdoor Temp (F)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "targetHumidity", label: "Target Humidity (%)", type: "number", placeholder: "e.g. 35", defaultValue: 35 },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const construction = inputs.construction as string;
        const outdoorTemp = inputs.outdoorTemp as number;
        const targetHumidity = inputs.targetHumidity as number;
        if (!area) return null;
        const airChanges: Record<string, number> = { tight: 0.5, average: 1.0, loose: 1.5 };
        const ach = airChanges[construction] || 1.0;
        const volume = area * 8;
        const cfm = (volume * ach) / 60;
        const moistureNeeded = cfm * 4.5 * ((targetHumidity || 35) / 100) * (70 - (outdoorTemp || 0)) / 1000;
        const gallonsPerDay = moistureNeeded * 24 / 8.34;
        return {
          primary: { label: "Required Capacity", value: `${formatNumber(gallonsPerDay, 1)}` + " gallons/day" },
          details: [
            { label: "Home Volume", value: `${formatNumber(volume, 0)}` + " cu ft" },
            { label: "Air Changes/Hour", value: `${formatNumber(ach, 1)}` },
            { label: "Target Humidity", value: `${formatNumber(targetHumidity || 35, 0)}` + "%" },
            { label: "Ventilation Rate", value: `${formatNumber(cfm, 0)}` + " CFM" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dehumidifier-size-calculator", "cooling-load-calculator", "airflow-cfm-calculator"],
  faq: [
    { question: "What size humidifier do I need?", answer: "Home size and construction determine capacity. A 2,000 sq ft average home typically needs 12-17 gallons per day. Loose construction or very cold climates need more." },
    { question: "What humidity level should I maintain?", answer: "Aim for 30-50% relative humidity indoors. In very cold weather, lower the target to 25-30% to prevent condensation on windows." },
  ],
  formula: "Capacity (gal/day) based on home volume, air changes, target humidity, and temperature differential",
};