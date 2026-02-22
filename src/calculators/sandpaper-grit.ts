import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sandpaperGritCalculator: CalculatorDefinition = {
  slug: "sandpaper-grit-calculator",
  title: "Sandpaper Grit Progression Calculator",
  description: "Free sandpaper grit progression calculator. Determine the optimal sanding sequence from starting grit to final finish for any project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sandpaper grit calculator", "sanding progression", "grit sequence calculator", "wood sanding guide", "sandpaper selection"],
  variants: [
    {
      id: "grit-progression",
      name: "Grit Progression",
      description: "Calculate optimal sanding grit sequence",
      fields: [
        {
          name: "startGrit",
          label: "Starting Grit",
          type: "select",
          options: [
            { label: "60 grit (heavy stock removal)", value: "60" },
            { label: "80 grit (moderate removal)", value: "80" },
            { label: "100 grit (light shaping)", value: "100" },
            { label: "120 grit (minor cleanup)", value: "120" },
            { label: "150 grit (pre-finished surface)", value: "150" },
          ],
        },
        {
          name: "finishType",
          label: "Finish Type",
          type: "select",
          options: [
            { label: "Paint (150 grit final)", value: "150" },
            { label: "Stain (180 grit final)", value: "180" },
            { label: "Oil Finish (220 grit final)", value: "220" },
            { label: "Lacquer/Varnish (220 grit final)", value: "220" },
            { label: "Water-based Finish (320 grit final)", value: "320" },
            { label: "High Gloss (400 grit final)", value: "400" },
          ],
        },
        {
          name: "woodType",
          label: "Wood Type",
          type: "select",
          options: [
            { label: "Softwood (pine, cedar)", value: "soft" },
            { label: "Hardwood (oak, maple)", value: "hard" },
            { label: "Exotic Hardwood", value: "exotic" },
          ],
        },
      ],
      calculate: (inputs) => {
        const startGrit = parseInt(inputs.startGrit as string);
        const finalGrit = parseInt(inputs.finishType as string);
        const woodType = inputs.woodType as string;
        if (!startGrit || !finalGrit) return null;
        const allGrits = [60, 80, 100, 120, 150, 180, 220, 240, 280, 320, 360, 400];
        const sequence = allGrits.filter(g => g >= startGrit && g <= finalGrit);
        const numSteps = sequence.length;
        const timePerStep = woodType === "soft" ? 5 : woodType === "hard" ? 8 : 10;
        const totalTime = numSteps * timePerStep;
        const scratchDepth = 1 / startGrit * 1000;
        const finalScratchDepth = 1 / finalGrit * 1000;
        return {
          primary: { label: "Sanding Steps", value: formatNumber(numSteps, 0) },
          details: [
            { label: "Grit Sequence", value: sequence.join(" > ") },
            { label: "Starting Grit", value: formatNumber(startGrit, 0) },
            { label: "Final Grit", value: formatNumber(finalGrit, 0) },
            { label: "Est. Time per Step", value: `${formatNumber(timePerStep, 0)} min/sq ft` },
            { label: "Est. Total Time", value: `${formatNumber(totalTime, 0)} min/sq ft` },
            { label: "Initial Scratch Depth", value: `${formatNumber(scratchDepth, 1)} microns` },
            { label: "Final Scratch Depth", value: `${formatNumber(finalScratchDepth, 1)} microns` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wood-stain-coverage-calculator", "veneer-coverage-calculator", "wood-density-calculator"],
  faq: [
    { question: "Can I skip grits when sanding?", answer: "Avoid skipping more than one grit level. Each grit removes the scratches from the previous one. Skipping grits means more work at finer grits and visible scratches in the finish." },
    { question: "What grit should I use before staining?", answer: "For most stains, sand to 180 grit. Sanding finer than 180 can close the wood pores and cause uneven stain absorption, especially with softwoods." },
  ],
  formula: "Progression follows standard grit increments: 60, 80, 100, 120, 150, 180, 220, 320, 400",
};
