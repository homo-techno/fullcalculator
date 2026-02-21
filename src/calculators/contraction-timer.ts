import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const contractionTimerCalculator: CalculatorDefinition = {
  slug: "contraction-timer-calculator",
  title: "Contraction Timer Calculator",
  description:
    "Free contraction timer calculator. Analyze contraction patterns by entering duration and frequency to help determine labor progress.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "contraction timer",
    "contraction calculator",
    "labor contraction timer",
    "when to go to hospital",
    "contraction frequency",
  ],
  variants: [
    {
      id: "contraction-analysis",
      name: "Contraction Pattern Analysis",
      description: "Analyze your contraction pattern",
      fields: [
        {
          name: "avgDuration",
          label: "Average Contraction Duration (seconds)",
          type: "number",
          placeholder: "e.g. 45",
          min: 10,
          max: 120,
        },
        {
          name: "avgFrequency",
          label: "Average Time Between Contractions (minutes)",
          type: "number",
          placeholder: "e.g. 8",
          min: 1,
          max: 30,
        },
        {
          name: "numContractions",
          label: "Number of Contractions Timed",
          type: "number",
          placeholder: "e.g. 6",
          min: 3,
          max: 50,
          defaultValue: 6,
        },
        {
          name: "intensity",
          label: "Contraction Intensity",
          type: "select",
          options: [
            { label: "Mild (can talk through)", value: "mild" },
            { label: "Moderate (need to pause talking)", value: "moderate" },
            { label: "Strong (cannot talk, need to focus)", value: "strong" },
            { label: "Very strong (need to breathe/moan)", value: "verystrong" },
          ],
          defaultValue: "moderate",
        },
      ],
      calculate: (inputs) => {
        const duration = inputs.avgDuration as number;
        const frequency = inputs.avgFrequency as number;
        const numContractions = (inputs.numContractions as number) || 6;
        const intensity = inputs.intensity as string;
        if (!duration || !frequency) return null;

        const durationMin = duration / 60;
        const totalTimingMinutes = frequency * (numContractions - 1);

        // Determine labor phase
        let phase: string;
        let action: string;
        let phaseDescription: string;

        if (frequency > 15) {
          phase = "Pre-labor / Braxton Hicks";
          action = "Stay home. Rest, hydrate, and continue timing.";
          phaseDescription = "Irregular contractions that may not indicate true labor. Can stop with rest or hydration.";
        } else if (frequency > 7 && duration < 45) {
          phase = "Early Labor";
          action = "Stay home. Rest, eat light snacks, stay hydrated. Time contractions periodically.";
          phaseDescription = "Contractions becoming more regular but still mild. Cervix dilating 0-3 cm. Can last 6-12 hours.";
        } else if (frequency >= 4 && frequency <= 7 && duration >= 40) {
          phase = "Active Labor";
          action = "Prepare to go to the hospital/birth center. Call your provider.";
          phaseDescription = "Regular, strong contractions. Cervix dilating 4-7 cm. Usually lasts 3-5 hours.";
        } else if (frequency < 4 && duration >= 50) {
          phase = "Transition / Advanced Labor";
          action = "Go to the hospital NOW if not already there. Call your provider immediately.";
          phaseDescription = "Intense, close contractions. Cervix dilating 7-10 cm. Hardest but shortest phase (30 min - 2 hrs).";
        } else if (frequency >= 3 && frequency <= 5 && duration >= 45) {
          phase = "Active Labor (5-1-1 Rule)";
          action = "Time to go! Contractions are 5 min apart, lasting 1 min, for 1+ hour.";
          phaseDescription = "Meeting the 5-1-1 guideline. Regular pattern suggests active labor is progressing.";
        } else {
          phase = "Early to Active Labor";
          action = "Continue timing. Consider calling your provider for guidance.";
          phaseDescription = "Transitioning from early to active labor. Pattern may become more regular soon.";
        }

        // Check 5-1-1 rule
        const meets511 = frequency <= 5 && duration >= 60 && totalTimingMinutes >= 60;
        const meets411 = frequency <= 4 && duration >= 60 && totalTimingMinutes >= 60;

        const intensityLabel = intensity === "mild" ? "Mild" : intensity === "moderate" ? "Moderate" : intensity === "strong" ? "Strong" : "Very Strong";

        return {
          primary: {
            label: "Likely Labor Phase",
            value: phase,
          },
          details: [
            { label: "Recommended Action", value: action },
            { label: "Phase Description", value: phaseDescription },
            { label: "Duration", value: `${duration} seconds (${formatNumber(durationMin, 1)} min)` },
            { label: "Frequency", value: `Every ${formatNumber(frequency, 1)} minutes` },
            { label: "Intensity", value: intensityLabel },
            { label: "5-1-1 Rule Met", value: meets511 ? "YES - Consider heading to hospital" : "Not yet" },
            { label: "4-1-1 Rule Met", value: meets411 ? "YES - Go to hospital" : "Not yet" },
            { label: "Timing Period", value: `${numContractions} contractions over ~${formatNumber(totalTimingMinutes, 0)} minutes` },
          ],
          note: "The 5-1-1 rule: go to the hospital when contractions are 5 minutes apart, lasting 1 minute each, for at least 1 hour. Some providers use 4-1-1 or 3-1-1. Call your provider if your water breaks, you have bleeding, or baby's movement decreases significantly.",
        };
      },
    },
  ],
  relatedSlugs: ["pregnancy-calculator", "kick-count-calculator", "fertility-window-calculator"],
  faq: [
    {
      question: "What is the 5-1-1 rule for contractions?",
      answer:
        "The 5-1-1 rule means you should head to the hospital when contractions are: 5 minutes apart (measured from start of one to start of the next), lasting 1 minute each, and this pattern has continued for at least 1 hour. Some providers recommend 4-1-1 or 3-1-1 instead.",
    },
    {
      question: "How do I tell real contractions from Braxton Hicks?",
      answer:
        "Real contractions: come at regular intervals, get closer together over time, increase in intensity, do not stop with rest or hydration, and radiate from back to front. Braxton Hicks: irregular, do not get closer together, mild and do not intensify, often stop with rest, position change, or water.",
    },
    {
      question: "When should I go to the hospital?",
      answer:
        "Go to the hospital when: contractions meet the 5-1-1 (or your provider's) rule, your water breaks, you have vaginal bleeding, you notice decreased fetal movement, you have severe headache or vision changes, or you feel something is wrong. Always follow your provider's specific instructions.",
    },
  ],
  formula:
    "Labor phase determined by contraction duration and frequency patterns. 5-1-1 Rule: 5 min apart + 1 min long + 1 hour duration. Early labor: >7 min apart, <45 sec. Active labor: 4-7 min apart, 40-60 sec. Transition: <4 min apart, 60-90 sec.",
};
