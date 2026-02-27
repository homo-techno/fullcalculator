import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const surfboardVolumeCalculator: CalculatorDefinition = {
  slug: "surfboard-volume-calculator",
  title: "Surfboard Volume Calculator",
  description:
    "Free surfboard volume calculator in liters. Find the ideal surfboard volume based on your weight, fitness, ability level, and wave conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "surfboard volume calculator",
    "surfboard liters",
    "surfboard size calculator",
    "board volume",
    "surfboard selection",
  ],
  variants: [
    {
      id: "recommended-volume",
      name: "Recommended Volume",
      description: "Find ideal board volume for your profile",
      fields: [
        {
          name: "weight",
          label: "Body Weight (lbs)",
          type: "number",
          placeholder: "e.g. 170",
          min: 60,
          max: 350,
        },
        {
          name: "ability",
          label: "Surfing Ability",
          type: "select",
          options: [
            { label: "Beginner (learning to stand)", value: "beginner" },
            { label: "Intermediate (riding green waves)", value: "intermediate" },
            { label: "Advanced (generating speed, cutbacks)", value: "advanced" },
            { label: "Expert (airs, barrels, competition)", value: "expert" },
          ],
          defaultValue: "intermediate",
        },
        {
          name: "fitness",
          label: "Fitness / Paddle Strength",
          type: "select",
          options: [
            { label: "Low (occasional surfer)", value: "low" },
            { label: "Average (surfs weekly)", value: "average" },
            { label: "High (surfs 3+ times/week)", value: "high" },
          ],
          defaultValue: "average",
        },
        {
          name: "waveType",
          label: "Typical Wave Conditions",
          type: "select",
          options: [
            { label: "Small/Mushy (1-3 ft)", value: "small" },
            { label: "Medium (3-5 ft)", value: "medium" },
            { label: "Large/Powerful (5+ ft)", value: "large" },
          ],
          defaultValue: "medium",
        },
      ],
      calculate: (inputs) => {
        const weightLbs = parseFloat(inputs.weight as string);
        const ability = inputs.ability as string;
        const fitness = inputs.fitness as string;
        const waveType = inputs.waveType as string;
        if (!weightLbs) return null;

        const weightKg = weightLbs * 0.4536;

        // Volume-to-weight ratio based on ability
        const abilityRatios: Record<string, number> = {
          beginner: 0.65,
          intermediate: 0.45,
          advanced: 0.37,
          expert: 0.32,
        };
        let ratio = abilityRatios[ability] || 0.45;

        // Fitness adjustment
        if (fitness === "low") ratio += 0.05;
        else if (fitness === "high") ratio -= 0.03;

        // Wave condition adjustment
        if (waveType === "small") ratio += 0.04;
        else if (waveType === "large") ratio -= 0.03;

        const volume = weightKg * ratio;

        // Board type recommendation
        let boardType = "Shortboard";
        if (volume > 50) boardType = "Longboard (9'+)";
        else if (volume > 40) boardType = "Funboard / Mid-Length (7'-8')";
        else if (volume > 32) boardType = "Fish / Hybrid (5'6\" - 6'6\")";
        else boardType = "Performance Shortboard (5'6\" - 6'2\")";

        // Range
        const volumeLow = volume * 0.9;
        const volumeHigh = volume * 1.1;

        return {
          primary: {
            label: "Recommended Volume",
            value: formatNumber(volume, 1) + " L",
          },
          details: [
            { label: "Volume Range", value: formatNumber(volumeLow, 1) + " - " + formatNumber(volumeHigh, 1) + " L" },
            { label: "Volume/Weight Ratio", value: formatNumber(ratio, 2) },
            { label: "Board Type", value: boardType },
            { label: "Body Weight", value: formatNumber(weightKg, 1) + " kg (" + formatNumber(weightLbs, 0) + " lbs)" },
          ],
          note: "Volume is one factor in board selection. Rocker, outline, and fin setup also significantly affect performance. When in doubt, go slightly bigger.",
        };
      },
    },
    {
      id: "board-dimensions",
      name: "Board Volume from Dimensions",
      description: "Estimate volume from board length, width, and thickness",
      fields: [
        {
          name: "lengthFt",
          label: "Length (feet)",
          type: "number",
          placeholder: "e.g. 6",
          min: 4,
          max: 12,
        },
        {
          name: "lengthIn",
          label: "Length (inches)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 11,
        },
        {
          name: "width",
          label: "Width (inches)",
          type: "number",
          placeholder: "e.g. 20.5",
          step: 0.25,
          min: 15,
          max: 25,
        },
        {
          name: "thickness",
          label: "Thickness (inches)",
          type: "number",
          placeholder: "e.g. 2.5",
          step: 0.125,
          min: 1.5,
          max: 4,
        },
      ],
      calculate: (inputs) => {
        const ft = parseFloat(inputs.lengthFt as string) || 0;
        const inches = parseFloat(inputs.lengthIn as string) || 0;
        const width = parseFloat(inputs.width as string);
        const thickness = parseFloat(inputs.thickness as string);
        if (!ft || !width || !thickness) return null;

        const lengthIn = ft * 12 + inches;
        const lengthCm = lengthIn * 2.54;
        const widthCm = width * 2.54;
        const thicknessCm = thickness * 2.54;

        // Surfboard volume formula (approximately 55% of the bounding box)
        const volumeCC = lengthCm * widthCm * thicknessCm * 0.55;
        const volumeL = volumeCC / 1000;

        // Weight range this board suits
        const minWeightKg = volumeL / 0.65;
        const maxWeightKg = volumeL / 0.32;

        return {
          primary: {
            label: "Estimated Volume",
            value: formatNumber(volumeL, 1) + " L",
          },
          details: [
            { label: "Dimensions", value: `${ft}'${formatNumber(inches, 0)}" × ${formatNumber(width, 2)}" × ${formatNumber(thickness, 3)}"` },
            { label: "Length (cm)", value: formatNumber(lengthCm, 1) },
            { label: "Width (cm)", value: formatNumber(widthCm, 1) },
            { label: "Thickness (cm)", value: formatNumber(thicknessCm, 1) },
            { label: "Suits Weight Range", value: formatNumber(minWeightKg, 0) + " - " + formatNumber(maxWeightKg, 0) + " kg" },
          ],
          note: "This is an approximation. Actual volume depends on rocker, concave, and rail profile. Check manufacturer specs for precise volume.",
        };
      },
    },
  ],
  relatedSlugs: ["volume-calculator", "unit-converter", "bmi-calculator"],
  faq: [
    {
      question: "How many liters should my surfboard be?",
      answer:
        "As a general guide, multiply your weight in kg by 0.32-0.65 depending on ability: beginners need ~0.6-0.65 × body weight in kg, intermediates ~0.42-0.48, advanced ~0.35-0.40, and experts ~0.30-0.35. A 75 kg intermediate surfer should look for a board around 33-36 liters.",
    },
    {
      question: "Does surfboard volume really matter?",
      answer:
        "Yes, volume determines how well the board floats and paddles. More volume = easier paddling and wave catching, less volume = more maneuverability. Getting the right volume for your size and ability is the most important factor in board selection.",
    },
  ],
  formula:
    "Recommended Volume (L) = Body Weight (kg) × Ability Ratio | Estimated Volume = Length × Width × Thickness × 0.55 / 1000",
};
