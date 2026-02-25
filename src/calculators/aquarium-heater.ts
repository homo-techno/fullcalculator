import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquariumHeaterCalculator: CalculatorDefinition = {
  slug: "aquarium-heater-calculator",
  title: "Aquarium Heater Size Calculator",
  description:
    "Free aquarium heater size calculator. Determine the correct heater wattage for your fish tank based on tank volume, room temperature, and desired water temperature.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "aquarium heater size",
    "fish tank heater wattage",
    "aquarium heater calculator",
    "tank heater watts",
    "aquarium temperature",
  ],
  variants: [
    {
      id: "heater-size",
      name: "Aquarium Heater Size",
      description: "Calculate the heater wattage for your aquarium",
      fields: [
        {
          name: "tankVolume",
          label: "Tank Volume",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "gallons",
          min: 1,
          max: 500,
        },
        {
          name: "roomTemp",
          label: "Average Room Temperature",
          type: "number",
          placeholder: "e.g. 68",
          suffix: "F",
          min: 40,
          max: 90,
        },
        {
          name: "targetTemp",
          label: "Target Water Temperature",
          type: "number",
          placeholder: "e.g. 78",
          suffix: "F",
          min: 60,
          max: 90,
        },
        {
          name: "tankLocation",
          label: "Tank Location",
          type: "select",
          options: [
            { label: "Climate-controlled room", value: "stable" },
            { label: "Room with temp fluctuations", value: "variable" },
            { label: "Garage / unheated space", value: "cold" },
          ],
          defaultValue: "stable",
        },
      ],
      calculate: (inputs) => {
        const tankVolume = inputs.tankVolume as number;
        const roomTemp = inputs.roomTemp as number;
        const targetTemp = inputs.targetTemp as number;
        const tankLocation = inputs.tankLocation as string;
        if (!tankVolume || !roomTemp || !targetTemp) return null;

        const tempDifference = targetTemp - roomTemp;

        if (tempDifference <= 0) {
          return {
            primary: {
              label: "Heater Wattage",
              value: "No heater needed",
            },
            details: [
              { label: "Room Temperature", value: `${roomTemp}F` },
              { label: "Target Temperature", value: `${targetTemp}F` },
              { label: "Note", value: "Room temp is already at or above target. Consider a chiller if room is too warm." },
            ],
          };
        }

        // General rule: 2.5-5 watts per gallon depending on temp difference
        let wattsPerGallon: number;
        if (tempDifference <= 5) wattsPerGallon = 2.5;
        else if (tempDifference <= 10) wattsPerGallon = 3.5;
        else if (tempDifference <= 15) wattsPerGallon = 5;
        else wattsPerGallon = 6;

        // Location adjustment
        let locationMultiplier = 1.0;
        if (tankLocation === "variable") locationMultiplier = 1.15;
        else if (tankLocation === "cold") locationMultiplier = 1.3;

        const totalWatts = Math.round(tankVolume * wattsPerGallon * locationMultiplier);

        // Recommend standard heater sizes
        const standardSizes = [25, 50, 75, 100, 150, 200, 250, 300, 400, 500];
        let recommendedSize = standardSizes.find((s) => s >= totalWatts) || totalWatts;

        // For large tanks, recommend dual heaters
        const useDualHeaters = tankVolume > 75 || totalWatts > 300;
        let heaterConfig: string;
        if (useDualHeaters) {
          const eachHeater = Math.round(totalWatts / 2);
          const eachRecommended = standardSizes.find((s) => s >= eachHeater) || eachHeater;
          heaterConfig = `2 x ${eachRecommended}W heaters`;
        } else {
          heaterConfig = `1 x ${recommendedSize}W heater`;
        }

        return {
          primary: {
            label: "Required Wattage",
            value: `${formatNumber(totalWatts)} watts`,
          },
          details: [
            { label: "Recommended Configuration", value: heaterConfig },
            { label: "Temperature Difference", value: `${tempDifference}F to raise` },
            { label: "Watts per Gallon", value: `${formatNumber(wattsPerGallon, 1)} W/gal` },
            { label: "Dual Heaters Recommended", value: useDualHeaters ? "Yes (for redundancy)" : "No" },
            { label: "Heater Type", value: tankVolume > 50 ? "Submersible or inline" : "Submersible" },
          ],
          note: useDualHeaters ? "Using two heaters provides redundancy: if one fails, the other prevents a sudden temperature crash." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["aquarium-filter-calculator", "fish-tank-stocking-calculator"],
  faq: [
    {
      question: "How many watts per gallon do I need?",
      answer:
        "The general rule is 2.5-5 watts per gallon, depending on the temperature difference between your room and target water temperature. For a small difference (under 5F), 2.5W/gal is sufficient. For larger differences (10-15F), use 5W/gal or more.",
    },
    {
      question: "Should I use one heater or two?",
      answer:
        "For tanks over 75 gallons, using two smaller heaters is recommended over one large heater. This provides redundancy (if one fails, the other prevents catastrophe), more even heat distribution, and reduces the risk of overheating from a stuck-on heater.",
    },
    {
      question: "Where should I place the aquarium heater?",
      answer:
        "Place the heater near a filter intake or area of good water flow for even heat distribution. Submersible heaters should be positioned horizontally or at a 45-degree angle near the bottom. Always use a separate thermometer to verify temperature.",
    },
  ],
  formula:
    "Wattage = Tank Volume (gallons) x Watts per Gallon (2.5-6 based on temp difference) x Location Factor",
};
