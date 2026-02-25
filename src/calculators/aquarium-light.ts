import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const aquariumLightCalculator: CalculatorDefinition = {
  slug: "aquarium-light-calculator",
  title: "Aquarium Light Calculator",
  description:
    "Free aquarium light calculator. Determine the ideal lighting intensity, spectrum, and photoperiod for your fish tank based on tank dimensions and inhabitants.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "aquarium light calculator",
    "fish tank lighting",
    "aquarium LED watts",
    "planted tank light",
    "aquarium PAR calculator",
  ],
  variants: [
    {
      id: "light-requirements",
      name: "Aquarium Lighting",
      description: "Calculate the lighting needs for your aquarium",
      fields: [
        {
          name: "tankLength",
          label: "Tank Length",
          type: "number",
          placeholder: "e.g. 36",
          suffix: "inches",
          min: 6,
          max: 96,
        },
        {
          name: "tankWidth",
          label: "Tank Width",
          type: "number",
          placeholder: "e.g. 18",
          suffix: "inches",
          min: 6,
          max: 36,
        },
        {
          name: "tankDepth",
          label: "Tank Water Depth",
          type: "number",
          placeholder: "e.g. 16",
          suffix: "inches",
          min: 6,
          max: 30,
        },
        {
          name: "tankPurpose",
          label: "Tank Purpose",
          type: "select",
          options: [
            { label: "Fish Only (no live plants)", value: "fish_only" },
            { label: "Low-Light Plants (anubias, java fern)", value: "low_plant" },
            { label: "Medium-Light Plants (crypts, swords)", value: "med_plant" },
            { label: "High-Light Plants (carpet plants, red plants)", value: "high_plant" },
            { label: "Reef / Coral", value: "reef" },
          ],
          defaultValue: "low_plant",
        },
        {
          name: "lightType",
          label: "Light Technology",
          type: "select",
          options: [
            { label: "LED (recommended)", value: "led" },
            { label: "T5 Fluorescent", value: "t5" },
            { label: "T8 Fluorescent", value: "t8" },
          ],
          defaultValue: "led",
        },
      ],
      calculate: (inputs) => {
        const tankLength = inputs.tankLength as number;
        const tankWidth = inputs.tankWidth as number;
        const tankDepth = inputs.tankDepth as number;
        const tankPurpose = inputs.tankPurpose as string;
        const lightType = inputs.lightType as string;
        if (!tankLength || !tankWidth || !tankDepth) return null;

        const surfaceArea = (tankLength * tankWidth) / 144; // sq ft
        const volumeGallons = Math.round((tankLength * tankWidth * tankDepth) / 231);

        // PAR (Photosynthetically Active Radiation) target at substrate
        let targetPAR: number;
        let photoperiod: string;
        let spectrum: string;

        switch (tankPurpose) {
          case "fish_only":
            targetPAR = 20;
            photoperiod = "6-8 hours";
            spectrum = "6500-10000K (aesthetic preference)";
            break;
          case "low_plant":
            targetPAR = 40;
            photoperiod = "8-10 hours";
            spectrum = "6500-7000K";
            break;
          case "med_plant":
            targetPAR = 80;
            photoperiod = "8-10 hours";
            spectrum = "6500-7000K full spectrum";
            break;
          case "high_plant":
            targetPAR = 120;
            photoperiod = "8-10 hours (with CO2)";
            spectrum = "6500-7000K full spectrum + red/blue";
            break;
          case "reef":
            targetPAR = 200;
            photoperiod = "10-12 hours (with ramp)";
            spectrum = "10000-20000K + actinic blue";
            break;
          default:
            targetPAR = 40;
            photoperiod = "8 hours";
            spectrum = "6500K";
        }

        // Estimate wattage needed (LED efficiency)
        let wattsPerGallon: number;
        if (lightType === "led") {
          if (tankPurpose === "fish_only") wattsPerGallon = 0.5;
          else if (tankPurpose === "low_plant") wattsPerGallon = 1.0;
          else if (tankPurpose === "med_plant") wattsPerGallon = 1.5;
          else if (tankPurpose === "high_plant") wattsPerGallon = 2.5;
          else wattsPerGallon = 3.0;
        } else if (lightType === "t5") {
          wattsPerGallon = tankPurpose === "fish_only" ? 1.0 : tankPurpose === "low_plant" ? 2.0 : 3.0;
        } else {
          wattsPerGallon = tankPurpose === "fish_only" ? 1.5 : tankPurpose === "low_plant" ? 2.5 : 4.0;
        }

        const totalWatts = Math.round(volumeGallons * wattsPerGallon);
        const lightLength = Math.round(tankLength * 0.85);

        const co2Needed = tankPurpose === "high_plant" || tankPurpose === "reef" ? "Recommended" : "Not required";

        return {
          primary: {
            label: "Recommended Light Wattage",
            value: `${formatNumber(totalWatts)} watts (${lightType.toUpperCase()})`,
          },
          details: [
            { label: "Target PAR at Substrate", value: `${targetPAR} umol` },
            { label: "Photoperiod", value: photoperiod },
            { label: "Color Spectrum", value: spectrum },
            { label: "Light Fixture Length", value: `${lightLength} inches` },
            { label: "Tank Volume", value: `${formatNumber(volumeGallons)} gallons` },
            { label: "CO2 Injection", value: co2Needed },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["aquarium-heater-calculator", "aquarium-filter-calculator"],
  faq: [
    {
      question: "How much light does a planted aquarium need?",
      answer:
        "Low-light plants need about 20-40 PAR at the substrate (1 watt LED per gallon). Medium plants need 40-80 PAR (1.5W/gal), and high-light plants need 80-120+ PAR (2.5W/gal). PAR measures actual plant-usable light and is more accurate than watts alone.",
    },
    {
      question: "How long should aquarium lights be on?",
      answer:
        "Fish-only tanks: 6-8 hours. Planted tanks: 8-10 hours. Reef tanks: 10-12 hours with gradual ramp-up and ramp-down. Too much light causes algae problems, while too little prevents plant growth. Use a timer for consistency.",
    },
    {
      question: "What color temperature is best for aquariums?",
      answer:
        "Freshwater planted tanks do best with 6500-7000K (daylight) spectrum. Fish-only freshwater tanks can use any color for aesthetics. Saltwater reef tanks need 10,000-20,000K with actinic blue (420-460nm) supplementation for coral growth.",
    },
  ],
  formula:
    "Wattage = Tank Volume (gal) x Watts per Gallon (varies by light type and purpose) | Light Length = Tank Length x 0.85",
};
