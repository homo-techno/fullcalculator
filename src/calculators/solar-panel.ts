import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const solarPanelCalculator: CalculatorDefinition = {
  slug: "solar-panel-calculator",
  title: "Solar Panel Calculator",
  description:
    "Free solar panel output calculator. Estimate daily and monthly energy production from panel wattage, sun hours, and system efficiency.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "solar panel",
    "solar energy",
    "photovoltaic",
    "kWh",
    "sun hours",
    "renewable",
  ],
  variants: [
    {
      id: "calc",
      name: "Estimate Solar Output",
      fields: [
        {
          name: "panelWatts",
          label: "Panel Wattage (W)",
          type: "number",
          placeholder: "e.g. 400",
        },
        {
          name: "numPanels",
          label: "Number of Panels",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "sunHours",
          label: "Peak Sun Hours per Day",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "efficiency",
          label: "System Efficiency (0 to 1) — default 0.8",
          type: "number",
          placeholder: "0.8",
        },
      ],
      calculate: (inputs) => {
        const panelWatts = inputs.panelWatts as number;
        const numPanels = inputs.numPanels as number;
        const sunHours = inputs.sunHours as number;
        const efficiency = (inputs.efficiency as number) || 0.8;
        if (!panelWatts || !numPanels || !sunHours) return null;
        if (efficiency <= 0 || efficiency > 1) return null;

        const totalWatts = panelWatts * numPanels;
        const dailyWh = totalWatts * sunHours * efficiency;
        const dailyKwh = dailyWh / 1000;
        const monthlyKwh = dailyKwh * 30;
        const yearlyKwh = dailyKwh * 365;

        return {
          primary: {
            label: "Daily Energy Output",
            value: formatNumber(dailyKwh, 2) + " kWh",
          },
          details: [
            {
              label: "Total System Capacity",
              value: formatNumber(totalWatts, 0) + " W",
            },
            {
              label: "Daily Output (Wh)",
              value: formatNumber(dailyWh, 2) + " Wh",
            },
            {
              label: "Monthly Output",
              value: formatNumber(monthlyKwh, 2) + " kWh",
            },
            {
              label: "Yearly Output",
              value: formatNumber(yearlyKwh, 2) + " kWh",
            },
            {
              label: "System Efficiency",
              value: formatNumber(efficiency * 100, 1) + "%",
            },
            {
              label: "Peak Sun Hours",
              value: formatNumber(sunHours, 1) + " hr/day",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wind-energy-calculator", "battery-life-calculator"],
  faq: [
    {
      question: "What are peak sun hours?",
      answer:
        "Peak sun hours represent the number of hours per day when solar irradiance averages 1000 W/m². Most locations see 3-7 peak sun hours depending on latitude and climate.",
    },
    {
      question: "Why include system efficiency?",
      answer:
        "Real solar systems lose energy in inverters, wiring, dust, and temperature effects. A typical system efficiency of 75-85% accounts for these real-world losses.",
    },
  ],
  formula:
    "Daily Output = Panel Wattage × Number of Panels × Sun Hours × Efficiency.",
};
