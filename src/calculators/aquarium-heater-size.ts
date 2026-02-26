import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquariumHeaterSizeCalculator: CalculatorDefinition = {
  slug: "aquarium-heater-size-calculator",
  title: "Aquarium Heater Size Calculator",
  description:
    "Free aquarium heater wattage calculator. Determine the right heater size for your fish tank based on tank volume, room temperature, and desired water temperature.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "aquarium heater calculator",
    "fish tank heater size",
    "aquarium heater wattage",
    "tank heater calculator",
    "fish tank temperature",
  ],
  variants: [
    {
      id: "by-volume",
      name: "By Tank Volume",
      description: "Calculate heater wattage from tank volume",
      fields: [
        {
          name: "tankVolume",
          label: "Tank Volume",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "gallons",
          min: 1,
          max: 500,
          step: 1,
        },
        {
          name: "roomTemp",
          label: "Room Temperature",
          type: "number",
          placeholder: "e.g. 68",
          suffix: "°F",
          min: 40,
          max: 90,
          step: 1,
          defaultValue: 68,
        },
        {
          name: "targetTemp",
          label: "Target Water Temperature",
          type: "number",
          placeholder: "e.g. 78",
          suffix: "°F",
          min: 60,
          max: 95,
          step: 1,
          defaultValue: 78,
        },
      ],
      calculate: (inputs) => {
        const volume = parseFloat(inputs.tankVolume as string);
        const roomTemp = parseFloat(inputs.roomTemp as string);
        const targetTemp = parseFloat(inputs.targetTemp as string);
        if (!volume || !roomTemp || !targetTemp) return null;

        const tempDiff = targetTemp - roomTemp;
        if (tempDiff <= 0) {
          return {
            primary: { label: "Heater Needed", value: "No heater needed" },
            details: [
              { label: "Temperature Difference", value: `${formatNumber(tempDiff, 1)}°F` },
            ],
            note: "Room temperature is already at or above the target water temperature.",
          };
        }

        // Rule of thumb: 3-5 watts per gallon for moderate temp difference
        // More precise: watts = volume * tempDiff * 0.5 (approx)
        const wattsNeeded = volume * tempDiff * 0.5;
        const recommendedWatts = Math.ceil(wattsNeeded / 25) * 25; // Round up to nearest 25W

        // For large tanks, suggest two heaters
        const useTwoHeaters = recommendedWatts > 300;
        const perHeater = useTwoHeaters ? Math.ceil(recommendedWatts / 2 / 25) * 25 : recommendedWatts;

        const wattsPerGallon = recommendedWatts / volume;

        return {
          primary: { label: "Recommended Wattage", value: `${formatNumber(recommendedWatts, 0)} watts` },
          details: [
            { label: "Watts per Gallon", value: formatNumber(wattsPerGallon, 1) },
            { label: "Temperature Difference", value: `${formatNumber(tempDiff, 0)}°F` },
            { label: "Heater Setup", value: useTwoHeaters ? `2 x ${formatNumber(perHeater, 0)}W heaters` : `1 x ${formatNumber(recommendedWatts, 0)}W heater` },
            { label: "Tank Volume", value: `${formatNumber(volume, 0)} gallons` },
          ],
          note: useTwoHeaters
            ? "For tanks over 60 gallons or needing over 300W, using two heaters provides redundancy and more even heating."
            : "Place heater near water flow for even heat distribution.",
        };
      },
    },
    {
      id: "by-dimensions",
      name: "By Tank Dimensions",
      description: "Calculate from tank dimensions in inches",
      fields: [
        {
          name: "length",
          label: "Tank Length",
          type: "number",
          placeholder: "e.g. 36",
          suffix: "inches",
          min: 6,
          max: 120,
          step: 1,
        },
        {
          name: "width",
          label: "Tank Width",
          type: "number",
          placeholder: "e.g. 18",
          suffix: "inches",
          min: 6,
          max: 60,
          step: 1,
        },
        {
          name: "height",
          label: "Tank Height",
          type: "number",
          placeholder: "e.g. 16",
          suffix: "inches",
          min: 6,
          max: 48,
          step: 1,
        },
        {
          name: "roomTemp",
          label: "Room Temperature",
          type: "number",
          placeholder: "e.g. 68",
          suffix: "°F",
          min: 40,
          max: 90,
          step: 1,
          defaultValue: 68,
        },
        {
          name: "targetTemp",
          label: "Target Water Temperature",
          type: "number",
          placeholder: "e.g. 78",
          suffix: "°F",
          min: 60,
          max: 95,
          step: 1,
          defaultValue: 78,
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const height = parseFloat(inputs.height as string);
        const roomTemp = parseFloat(inputs.roomTemp as string);
        const targetTemp = parseFloat(inputs.targetTemp as string);
        if (!length || !width || !height || !roomTemp || !targetTemp) return null;

        const volumeCubicInches = length * width * height;
        const volumeGallons = volumeCubicInches / 231;
        const tempDiff = targetTemp - roomTemp;

        if (tempDiff <= 0) {
          return {
            primary: { label: "Heater Needed", value: "No heater needed" },
            details: [
              { label: "Tank Volume", value: `${formatNumber(volumeGallons, 1)} gallons` },
            ],
            note: "Room temperature is already at or above the target water temperature.",
          };
        }

        const wattsNeeded = volumeGallons * tempDiff * 0.5;
        const recommendedWatts = Math.ceil(wattsNeeded / 25) * 25;

        return {
          primary: { label: "Recommended Wattage", value: `${formatNumber(recommendedWatts, 0)} watts` },
          details: [
            { label: "Tank Volume", value: `${formatNumber(volumeGallons, 1)} gallons` },
            { label: "Temperature Difference", value: `${formatNumber(tempDiff, 0)}°F` },
            { label: "Watts per Gallon", value: formatNumber(recommendedWatts / volumeGallons, 1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pool-volume-calculator", "electricity-calculator"],
  faq: [
    {
      question: "How many watts per gallon do I need for an aquarium heater?",
      answer:
        "A general guideline is 3-5 watts per gallon for a 10°F temperature difference. If the room is much cooler than your target water temperature, you may need more. Use this calculator for a precise recommendation.",
    },
    {
      question: "Should I use two heaters instead of one?",
      answer:
        "For tanks over 60 gallons, using two smaller heaters is recommended. This provides more even heat distribution and backup heating if one heater fails, protecting your fish from dangerous temperature drops.",
    },
  ],
  formula:
    "Watts Needed ≈ Tank Volume (gallons) x Temperature Difference (°F) x 0.5",
};
