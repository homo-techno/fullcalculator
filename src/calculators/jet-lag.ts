import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jetLagCalculator: CalculatorDefinition = {
  slug: "jet-lag-calculator",
  title: "Jet Lag Calculator",
  description:
    "Free jet lag calculator. Estimate recovery time based on time zones crossed and travel direction. Eastward travel takes longer to adjust.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "jet lag",
    "time zone",
    "jet lag recovery",
    "travel fatigue",
    "circadian rhythm",
  ],
  variants: [
    {
      id: "calc",
      name: "Estimate Jet Lag Recovery",
      fields: [
        {
          name: "timeZonesCrossed",
          label: "Time Zones Crossed",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "direction",
          label: "Travel Direction",
          type: "select",
          options: [{ label: "Eastward", value: "Eastward" }, { label: "Westward", value: "Westward" }],
        },
      ],
      calculate: (inputs) => {
        const zones = inputs.timeZonesCrossed as number;
        const direction = inputs.direction as string;

        if (!zones || zones <= 0) return null;
        if (!direction) return null;

        // Recovery estimates:
        // Eastward: ~1 day per 1.5 time zones
        // Westward: ~1 day per 2 time zones
        let recoveryDays: number;
        let adjustmentRate: string;

        if (direction === "Eastward") {
          recoveryDays = zones / 1.5;
          adjustmentRate = "~1 day per 1.5 time zones";
        } else {
          recoveryDays = zones / 2;
          adjustmentRate = "~1 day per 2 time zones";
        }

        const recoveryDaysCeil = Math.ceil(recoveryDays);

        // Severity assessment
        let severity = "";
        if (zones <= 2) severity = "Minimal - little to no jet lag expected";
        else if (zones <= 4) severity = "Mild - minor fatigue and sleep disruption";
        else if (zones <= 7) severity = "Moderate - noticeable fatigue and sleep issues";
        else if (zones <= 10) severity = "Severe - significant adjustment needed";
        else severity = "Very Severe - extended recovery period required";

        // Tips
        let tip = "";
        if (direction === "Eastward") {
          tip =
            "Start going to bed earlier several days before departure. Seek morning light at your destination.";
        } else {
          tip =
            "Stay up later in the days before departure. Seek afternoon/evening light at your destination.";
        }

        return {
          primary: {
            label: "Estimated Recovery",
            value: `${formatNumber(recoveryDaysCeil, 0)} days`,
          },
          details: [
            {
              label: "Time Zones Crossed",
              value: formatNumber(zones, 0),
            },
            {
              label: "Direction",
              value: direction,
            },
            {
              label: "Adjustment Rate",
              value: adjustmentRate,
            },
            {
              label: "Estimated Recovery (exact)",
              value: `${formatNumber(recoveryDays, 1)} days`,
            },
            {
              label: "Estimated Recovery (rounded up)",
              value: `${formatNumber(recoveryDaysCeil, 0)} days`,
            },
            { label: "Severity", value: severity },
            { label: "Tip", value: tip },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["flight-distance-calculator", "travel-budget-calculator"],
  faq: [
    {
      question: "Why is eastward travel harder?",
      answer:
        "Eastward travel requires advancing your body clock (going to sleep earlier), which is harder for most people than delaying it. Recovery rate is approximately 1 day per 1.5 zones eastward vs. 1 day per 2 zones westward.",
    },
    {
      question: "How can I minimize jet lag?",
      answer:
        "Gradually shift your sleep schedule before travel, stay hydrated, get sunlight at appropriate times at your destination, avoid alcohol and caffeine on the flight, and consider melatonin supplements.",
    },
  ],
  formula:
    "Eastward: Recovery days = zones / 1.5. Westward: Recovery days = zones / 2.",
};
