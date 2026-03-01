import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stretchingRoutineCalculator: CalculatorDefinition = {
  slug: "stretching-routine-calculator",
  title: "Stretching Routine Calculator",
  description: "Build a personalized stretching routine with recommended duration and stretch count.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["stretching routine", "stretch timer", "flexibility calculator"],
  variants: [{
    id: "standard",
    name: "Stretching Routine",
    description: "Build a personalized stretching routine with recommended duration and stretch count",
    fields: [
      { name: "focusArea", label: "Focus Area", type: "select", options: [{value:"full",label:"Full Body"},{value:"upper",label:"Upper Body"},{value:"lower",label:"Lower Body"},{value:"back",label:"Back and Core"}], defaultValue: "full" },
      { name: "intensity", label: "Intensity Level", type: "select", options: [{value:"gentle",label:"Gentle (Recovery)"},{value:"moderate",label:"Moderate (Maintenance)"},{value:"deep",label:"Deep (Flexibility Gains)"}], defaultValue: "moderate" },
      { name: "availableTime", label: "Available Time", type: "number", suffix: "minutes", min: 5, max: 60, defaultValue: 15 },
    ],
    calculate: (inputs) => {
      const area = inputs.focusArea as string;
      const intensity = inputs.intensity as string;
      const time = inputs.availableTime as number;
      if (!time || time <= 0) return null;
      const holdTime: Record<string, number> = { gentle: 15, moderate: 30, deep: 45 };
      const hold = holdTime[intensity] || 30;
      const transitionTime = 10;
      const timePerStretch = hold + transitionTime;
      const stretchCount = Math.floor((time * 60) / timePerStretch);
      const actualDuration = Math.round((stretchCount * timePerStretch) / 60);
      const areaStretches: Record<string, number> = { full: 12, upper: 8, lower: 8, back: 6 };
      const setsNeeded = Math.ceil(stretchCount / (areaStretches[area] || 10));
      return {
        primary: { label: "Stretches in Your Routine", value: formatNumber(stretchCount) + " stretches" },
        details: [
          { label: "Hold Time per Stretch", value: formatNumber(hold) + " seconds" },
          { label: "Actual Routine Duration", value: formatNumber(actualDuration) + " minutes" },
          { label: "Sets per Stretch", value: formatNumber(setsNeeded) },
        ],
      };
    },
  }],
  relatedSlugs: ["meditation-timer-calculator", "standing-desk-timer-calculator"],
  faq: [
    { question: "How long should I hold a stretch?", answer: "Hold static stretches for 15 to 30 seconds for maintenance and 30 to 60 seconds for flexibility improvement. Never bounce or force a stretch." },
    { question: "Should I stretch before or after exercise?", answer: "Dynamic stretching is best before exercise to warm up muscles. Static stretching is more effective after exercise when muscles are warm and pliable." },
  ],
  formula: "Stretch Count = Available Time x 60 / (Hold Time + Transition Time)",
};
