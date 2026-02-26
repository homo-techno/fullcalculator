import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const surfboardSizeCalculator: CalculatorDefinition = {
  slug: "surfboard-size-calculator",
  title: "Surfboard Size Calculator",
  description: "Free surfboard size calculator. Find the ideal surfboard length, width, thickness, and volume based on your weight, height, and skill level.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["surfboard size calculator", "surfboard volume", "surfboard length", "board size guide", "surf calculator"],
  variants: [
    {
      id: "standard",
      name: "Surfboard Size Finder",
      description: "Get recommended board dimensions based on your profile",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 170", min: 60, max: 350 },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 70", min: 48, max: 84 },
        { name: "skillLevel", label: "Skill Level", type: "select", options: [
          { label: "Beginner (< 1 year)", value: "beginner" },
          { label: "Intermediate (1-3 years)", value: "intermediate" },
          { label: "Advanced (3+ years)", value: "advanced" },
          { label: "Expert/Pro", value: "expert" },
        ] },
        { name: "waveType", label: "Wave Type", type: "select", options: [
          { label: "Small / Mushy (1-3 ft)", value: "small" },
          { label: "Medium (3-5 ft)", value: "medium" },
          { label: "Large (5-8 ft)", value: "large" },
          { label: "Overhead+ (8+ ft)", value: "overhead" },
        ], defaultValue: "medium" },
        { name: "fitnessLevel", label: "Fitness Level", type: "select", options: [
          { label: "Low", value: "low" },
          { label: "Average", value: "average" },
          { label: "Athletic", value: "athletic" },
        ], defaultValue: "average" },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const height = parseFloat(inputs.height as string);
        const skill = inputs.skillLevel as string;
        const wave = inputs.waveType as string;
        const fitness = inputs.fitnessLevel as string;
        if (isNaN(weight) || isNaN(height)) return null;

        const weightKg = weight * 0.4536;
        const volumeMultiplier: Record<string, number> = { beginner: 0.65, intermediate: 0.45, advanced: 0.36, expert: 0.32 };
        const waveMult: Record<string, number> = { small: 1.1, medium: 1.0, large: 0.92, overhead: 0.85 };
        const fitnessMult: Record<string, number> = { low: 1.1, average: 1.0, athletic: 0.92 };

        const volume = weightKg * (volumeMultiplier[skill] || 0.45) * (waveMult[wave] || 1) * (fitnessMult[fitness] || 1);

        let lengthFeet = 6.0;
        if (skill === "beginner") lengthFeet = Math.max(8.0, height / 12 + 1.5);
        else if (skill === "intermediate") lengthFeet = Math.max(6.5, height / 12 + 0.5);
        else if (skill === "advanced") lengthFeet = Math.max(5.8, height / 12 - 0.2);
        else lengthFeet = Math.max(5.5, height / 12 - 0.5);

        if (wave === "small") lengthFeet += 0.3;
        else if (wave === "large") lengthFeet -= 0.2;
        else if (wave === "overhead") lengthFeet -= 0.3;

        const widthInches = skill === "beginner" ? 22 : skill === "intermediate" ? 20.5 : skill === "advanced" ? 19.5 : 18.75;
        const thickness = skill === "beginner" ? 3.0 : skill === "intermediate" ? 2.75 : skill === "advanced" ? 2.5 : 2.375;

        const lengthStr = `${Math.floor(lengthFeet)}'${Math.round((lengthFeet % 1) * 12)}"`;
        const boardType = skill === "beginner" ? "Longboard / Foamie" : skill === "intermediate" ? "Funboard / Mini-Mal" : "Shortboard / Fish";

        return {
          primary: { label: "Recommended Volume", value: `${formatNumber(volume, 1)} L` },
          details: [
            { label: "Board Length", value: lengthStr },
            { label: "Width", value: `${formatNumber(widthInches, 1)}"` },
            { label: "Thickness", value: `${formatNumber(thickness, 2)}"` },
            { label: "Board Type", value: boardType },
            { label: "Volume Range", value: `${formatNumber(volume * 0.92, 1)} - ${formatNumber(volume * 1.08, 1)} L` },
            { label: "Weight (kg)", value: formatNumber(weightKg, 1) },
          ],
        };
      },
    },
    {
      id: "volume-only",
      name: "Quick Volume Calculator",
      description: "Calculate just the ideal surfboard volume",
      fields: [
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 170" },
        { name: "skillLevel", label: "Skill Level", type: "select", options: [
          { label: "Beginner", value: "beginner" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Advanced", value: "advanced" },
          { label: "Expert", value: "expert" },
        ] },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const skill = inputs.skillLevel as string;
        if (isNaN(weight)) return null;
        const weightKg = weight * 0.4536;
        const mult: Record<string, number> = { beginner: 0.65, intermediate: 0.45, advanced: 0.36, expert: 0.32 };
        const vol = weightKg * (mult[skill] || 0.45);
        return {
          primary: { label: "Ideal Volume", value: `${formatNumber(vol, 1)} L` },
          details: [
            { label: "Min Volume", value: `${formatNumber(vol * 0.9, 1)} L` },
            { label: "Max Volume", value: `${formatNumber(vol * 1.1, 1)} L` },
            { label: "Body Weight (kg)", value: formatNumber(weightKg, 1) },
            { label: "Liters per kg", value: formatNumber(mult[skill] || 0.45, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["kayak-size-calculator", "bmi-calculator", "skateboard-size-calculator"],
  faq: [
    { question: "How is surfboard volume calculated?", answer: "Volume in liters = Body Weight (kg) x Skill Multiplier. Beginners need about 0.60-0.70 L/kg for easy paddling and stability, while experts ride 0.30-0.35 L/kg for maximum performance." },
    { question: "What surfboard should a beginner get?", answer: "Beginners should start with a large-volume foamie or longboard (8-9 feet, 22\"+ wide, 60+ liters). The extra volume provides stability and paddle power, making it much easier to catch waves and stand up." },
  ],
  formula: "Volume (L) = Weight (kg) x Skill Multiplier x Wave Factor x Fitness Factor | Length = f(Height, Skill, Wave)",
};
