import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trainingZoneCalculator: CalculatorDefinition = {
  slug: "training-zone-calculator",
  title: "Training Zone Calculator",
  description:
    "Free heart rate training zone calculator. Calculate five HR training zones based on your estimated max heart rate.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["training zones", "heart rate zones", "HR zones", "max heart rate"],
  variants: [
    {
      id: "hrZones",
      name: "HR Training Zones by Age",
      fields: [
        {
          name: "age",
          label: "Age (years)",
          type: "number",
          placeholder: "e.g. 30",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        if (!age) return null;

        const hrMax = 220 - age;

        const zones = [
          { name: "Zone 1 \u2013 Very Light", minPct: 50, maxPct: 60 },
          { name: "Zone 2 \u2013 Light", minPct: 60, maxPct: 70 },
          { name: "Zone 3 \u2013 Moderate", minPct: 70, maxPct: 80 },
          { name: "Zone 4 \u2013 Hard", minPct: 80, maxPct: 90 },
          { name: "Zone 5 \u2013 Maximum", minPct: 90, maxPct: 100 },
        ];

        const details = zones.map((z) => ({
          label: `${z.name} (${z.minPct}\u2013${z.maxPct}%)`,
          value: `${formatNumber(hrMax * (z.minPct / 100), 0)}\u2013${formatNumber(hrMax * (z.maxPct / 100), 0)} bpm`,
        }));

        return {
          primary: {
            label: "Estimated Max Heart Rate",
            value: `${formatNumber(hrMax, 0)} bpm`,
          },
          details: [
            { label: "Age", value: `${formatNumber(age, 0)} years` },
            ...details,
          ],
        };
      },
    },
  ],
  relatedSlugs: ["heart-rate-reserve-calculator", "exercise-calorie-calculator"],
  faq: [
    {
      question: "What are heart rate training zones?",
      answer:
        "Heart rate training zones divide exercise intensity into five ranges based on max heart rate: Zone 1 (50\u201360%) for recovery, Zone 2 (60\u201370%) for endurance, Zone 3 (70\u201380%) for aerobic fitness, Zone 4 (80\u201390%) for threshold training, and Zone 5 (90\u2013100%) for maximum effort.",
    },
    {
      question: "How is max heart rate estimated?",
      answer:
        "The most common estimate is HRmax = 220 \u2212 age. This is an approximation and individual max heart rates can vary significantly.",
    },
  ],
  formula:
    "HRmax = 220 \u2212 age. Zone 1: 50\u201360%, Zone 2: 60\u201370%, Zone 3: 70\u201380%, Zone 4: 80\u201390%, Zone 5: 90\u2013100% of HRmax.",
};
