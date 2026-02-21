import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarPanelSizingCalculator: CalculatorDefinition = {
  slug: "solar-panel-sizing-calculator",
  title: "Solar Panel Sizing Calculator",
  description:
    "Free solar panel sizing calculator. Calculate the number of solar panels, battery capacity, and inverter size needed for your energy requirements.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "solar panel calculator",
    "solar panel sizing",
    "solar system calculator",
    "solar power calculator",
    "off grid solar",
    "solar energy calculator",
  ],
  variants: [
    {
      id: "panel-sizing",
      name: "Solar Panel System Sizing",
      description: "Calculate panels needed based on daily energy consumption",
      fields: [
        {
          name: "dailyUsage",
          label: "Daily Energy Usage (kWh)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "sunHours",
          label: "Peak Sun Hours per Day",
          type: "number",
          placeholder: "e.g. 5",
          defaultValue: 5,
        },
        {
          name: "panelWattage",
          label: "Panel Wattage (W)",
          type: "select",
          options: [
            { label: "250 W", value: "250" },
            { label: "300 W", value: "300" },
            { label: "350 W", value: "350" },
            { label: "400 W", value: "400" },
            { label: "450 W", value: "450" },
            { label: "500 W", value: "500" },
            { label: "550 W", value: "550" },
          ],
          defaultValue: "400",
        },
        {
          name: "systemLoss",
          label: "System Loss (%)",
          type: "number",
          placeholder: "e.g. 20",
          defaultValue: 20,
        },
      ],
      calculate: (inputs) => {
        const dailyKwh = inputs.dailyUsage as number;
        const sunHours = inputs.sunHours as number;
        const panelW = Number(inputs.panelWattage);
        const loss = inputs.systemLoss as number;
        if (!dailyKwh || !sunHours || !panelW) return null;

        const lossFactor = 1 - (loss || 20) / 100;
        const requiredKw = dailyKwh / (sunHours * lossFactor);
        const numPanels = Math.ceil((requiredKw * 1000) / panelW);
        const totalCapacity = numPanels * panelW;
        const dailyProduction = totalCapacity * sunHours * lossFactor / 1000;
        const annualProduction = dailyProduction * 365;

        return {
          primary: {
            label: "Number of Panels",
            value: `${numPanels} panels`,
          },
          details: [
            { label: "Panels Required", value: `${numPanels} × ${panelW}W panels` },
            { label: "Total Array Capacity", value: `${formatNumber(totalCapacity / 1000, 2)} kW` },
            { label: "Daily Production", value: `${formatNumber(dailyProduction, 2)} kWh` },
            { label: "Annual Production", value: `${formatNumber(annualProduction, 0)} kWh` },
            { label: "Required System Size", value: `${formatNumber(requiredKw, 2)} kW` },
            { label: "System Loss Factor", value: `${100 - (loss || 20)}%` },
          ],
        };
      },
    },
    {
      id: "battery-sizing",
      name: "Battery Bank Sizing",
      description: "Calculate battery bank size for off-grid solar",
      fields: [
        {
          name: "dailyUsage",
          label: "Daily Energy Usage (kWh)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "autonomyDays",
          label: "Days of Autonomy",
          type: "number",
          placeholder: "e.g. 2",
          defaultValue: 2,
        },
        {
          name: "batteryVoltage",
          label: "Battery System Voltage (V)",
          type: "select",
          options: [
            { label: "12 V", value: "12" },
            { label: "24 V", value: "24" },
            { label: "48 V", value: "48" },
          ],
          defaultValue: "48",
        },
        {
          name: "depthOfDischarge",
          label: "Depth of Discharge (%)",
          type: "select",
          options: [
            { label: "50% (Lead-Acid)", value: "50" },
            { label: "80% (Lithium-Ion)", value: "80" },
            { label: "90% (LiFePO4)", value: "90" },
          ],
          defaultValue: "80",
        },
      ],
      calculate: (inputs) => {
        const dailyKwh = inputs.dailyUsage as number;
        const days = inputs.autonomyDays as number;
        const voltage = Number(inputs.batteryVoltage);
        const dod = Number(inputs.depthOfDischarge);
        if (!dailyKwh || !days || !voltage || !dod) return null;

        const totalEnergy = dailyKwh * days;
        const requiredCapacityKwh = totalEnergy / (dod / 100);
        const requiredAh = (requiredCapacityKwh * 1000) / voltage;
        const inverterSize = dailyKwh / 24 * 3; // rough estimate: 3x average load

        return {
          primary: {
            label: "Battery Capacity Required",
            value: `${formatNumber(requiredCapacityKwh, 2)} kWh`,
          },
          details: [
            { label: "Battery Capacity (kWh)", value: `${formatNumber(requiredCapacityKwh, 2)} kWh` },
            { label: "Battery Capacity (Ah)", value: `${formatNumber(requiredAh, 0)} Ah @ ${voltage}V` },
            { label: "Total Energy Storage", value: `${formatNumber(totalEnergy, 2)} kWh` },
            { label: "Days of Autonomy", value: `${days} days` },
            { label: "Depth of Discharge", value: `${dod}%` },
            { label: "Suggested Inverter Size", value: `${formatNumber(inverterSize, 2)} kW` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["battery-capacity-calculator", "electricity-cost-appliance-calculator", "power-consumption-calculator"],
  faq: [
    {
      question: "How many solar panels do I need for my home?",
      answer:
        "Divide your daily kWh usage by the peak sun hours in your location, then account for system losses (typically 20%). Divide the required wattage by the panel wattage to get the number of panels. An average US home using 30 kWh/day with 5 peak sun hours needs about 7.5 kW, or 19 panels at 400W each.",
    },
    {
      question: "What are peak sun hours?",
      answer:
        "Peak sun hours represent the equivalent number of hours per day when solar irradiance averages 1,000 W/m². This varies by location: 3-4 hours in northern states, 5-6 in the sunbelt, and 6-7 in desert areas. Check the NREL solar resource map for your location.",
    },
    {
      question: "What system losses should I account for?",
      answer:
        "Typical system losses of 15-25% include: inverter efficiency (3-5%), wiring losses (2-3%), soiling/dirt (2-5%), temperature derating (5-10%), shading (0-10%), and panel degradation (0.5%/year). A 20% loss factor is a reasonable default.",
    },
  ],
  formula:
    "Panels = Daily kWh / (Sun Hours × Panel W × Loss Factor) | Battery Ah = (Daily kWh × Days) / (DoD × Voltage)",
};
