import type { CalculatorDefinition } from "./types";

export const contractionCounterCalculator: CalculatorDefinition = {
  slug: "contraction-counter-calculator",
  title: "Contraction Counter/Timer",
  description:
    "Free contraction counter and timer calculator. Track contraction duration, frequency, and determine when to head to the hospital based on the 5-1-1 rule.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "contraction counter",
    "contraction timer",
    "labor contractions",
    "5-1-1 rule",
    "when to go to hospital",
  ],
  variants: [
    {
      id: "pattern",
      name: "Contraction Pattern Analysis",
      description:
        "Enter your last few contractions to analyze the pattern and determine labor stage",
      fields: [
        {
          name: "numContractions",
          label: "Number of Contractions (last hour)",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 30,
        },
        {
          name: "avgDurationSec",
          label: "Average Duration (seconds)",
          type: "number",
          placeholder: "e.g. 60",
          min: 10,
          max: 180,
        },
        {
          name: "avgIntervalMin",
          label: "Average Interval (minutes apart)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 30,
        },
        {
          name: "painLevel",
          label: "Pain Intensity",
          type: "select",
          options: [
            { label: "Mild (can talk through)", value: "mild" },
            { label: "Moderate (need to pause)", value: "moderate" },
            { label: "Strong (can't talk through)", value: "strong" },
            { label: "Very strong (need to focus)", value: "very_strong" },
          ],
        },
      ],
      calculate: (inputs) => {
        const numContractions = inputs.numContractions as number;
        const avgDuration = inputs.avgDurationSec as number;
        const avgInterval = inputs.avgIntervalMin as number;
        const painLevel = inputs.painLevel as string;
        if (!numContractions || !avgDuration || !avgInterval || !painLevel) return null;

        const durationMin = avgDuration / 60;

        // 5-1-1 Rule: contractions every 5 min, lasting 1 min, for 1 hour
        const meets511 =
          avgInterval <= 5 && durationMin >= 1 && numContractions >= 6;

        let stage = "Early Labor";
        let recommendation = "Stay home, rest, and stay hydrated.";

        if (meets511 && (painLevel === "strong" || painLevel === "very_strong")) {
          stage = "Active Labor";
          recommendation =
            "Consider heading to the hospital. You meet the 5-1-1 rule with strong contractions.";
        } else if (avgInterval <= 3 && durationMin >= 1) {
          stage = "Transition / Advanced Labor";
          recommendation =
            "Go to the hospital now. Contractions are very close together.";
        } else if (avgInterval <= 5 && durationMin >= 0.75) {
          stage = "Active Labor (early)";
          recommendation =
            "Call your healthcare provider. Contractions are getting closer and longer.";
        } else if (avgInterval <= 10) {
          stage = "Early Labor";
          recommendation =
            "Continue timing. Stay hydrated and rest when possible.";
        } else {
          stage = "Pre-labor / Braxton Hicks";
          recommendation =
            "These may be practice contractions. Continue monitoring.";
        }

        const painLabels: Record<string, string> = {
          mild: "Mild",
          moderate: "Moderate",
          strong: "Strong",
          very_strong: "Very Strong",
        };

        return {
          primary: { label: "Likely Stage", value: stage },
          details: [
            { label: "Recommendation", value: recommendation },
            {
              label: "5-1-1 Rule Met",
              value: meets511 ? "Yes" : "Not yet",
            },
            {
              label: "Frequency",
              value: `Every ${avgInterval} minutes`,
            },
            {
              label: "Duration",
              value: `${avgDuration} seconds (${durationMin.toFixed(1)} min)`,
            },
            {
              label: "Contractions in last hour",
              value: String(numContractions),
            },
            { label: "Pain intensity", value: painLabels[painLevel] || painLevel },
          ],
          note: "The 5-1-1 rule: contractions every 5 minutes, lasting 1 minute, for at least 1 hour. Always call your provider if you are unsure.",
        };
      },
    },
  ],
  relatedSlugs: ["pregnancy-due-date-calculator", "pregnancy-week-calculator"],
  faq: [
    {
      question: "What is the 5-1-1 rule for contractions?",
      answer:
        "The 5-1-1 rule means contractions are coming every 5 minutes, each lasting about 1 minute, and this pattern has continued for at least 1 hour. This is typically when providers recommend heading to the hospital.",
    },
    {
      question: "How do I tell real contractions from Braxton Hicks?",
      answer:
        "Real labor contractions become more frequent, longer, and stronger over time. They don't go away when you change positions. Braxton Hicks are irregular, don't increase in intensity, and often stop when you rest or move.",
    },
  ],
  formula:
    "5-1-1 Rule: Contractions every 5 minutes, lasting 1 minute each, for 1 hour signals active labor. Frequency = 60 / number of contractions per hour.",
};
