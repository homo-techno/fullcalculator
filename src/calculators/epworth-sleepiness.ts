import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const epworthSleepinessCalculator: CalculatorDefinition = {
  slug: "epworth-sleepiness",
  title: "Epworth Sleepiness Scale Calculator",
  description:
    "Free online Epworth Sleepiness Scale (ESS) calculator to assess daytime sleepiness levels.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "epworth",
    "sleepiness",
    "sleep apnea",
    "daytime sleepiness",
    "ESS",
    "sleep disorder",
    "somnolence",
  ],
  variants: [
    {
      id: "ess-score",
      name: "Epworth Sleepiness Scale",
      description:
        "Rate your chance of dozing in 8 common situations (0 = never, 1 = slight, 2 = moderate, 3 = high).",
      fields: [
        {
          name: "sitting",
          label: "Sitting and reading",
          type: "select",
          options: [
            { label: "0 - Would never doze", value: "0" },
            { label: "1 - Slight chance", value: "1" },
            { label: "2 - Moderate chance", value: "2" },
            { label: "3 - High chance", value: "3" },
          ],
        },
        {
          name: "tv",
          label: "Watching TV",
          type: "select",
          options: [
            { label: "0 - Would never doze", value: "0" },
            { label: "1 - Slight chance", value: "1" },
            { label: "2 - Moderate chance", value: "2" },
            { label: "3 - High chance", value: "3" },
          ],
        },
        {
          name: "publicPlace",
          label: "Sitting inactive in a public place (e.g., meeting)",
          type: "select",
          options: [
            { label: "0 - Would never doze", value: "0" },
            { label: "1 - Slight chance", value: "1" },
            { label: "2 - Moderate chance", value: "2" },
            { label: "3 - High chance", value: "3" },
          ],
        },
        {
          name: "passenger",
          label: "As a passenger in a car for an hour",
          type: "select",
          options: [
            { label: "0 - Would never doze", value: "0" },
            { label: "1 - Slight chance", value: "1" },
            { label: "2 - Moderate chance", value: "2" },
            { label: "3 - High chance", value: "3" },
          ],
        },
        {
          name: "afternoon",
          label: "Lying down to rest in the afternoon",
          type: "select",
          options: [
            { label: "0 - Would never doze", value: "0" },
            { label: "1 - Slight chance", value: "1" },
            { label: "2 - Moderate chance", value: "2" },
            { label: "3 - High chance", value: "3" },
          ],
        },
        {
          name: "talking",
          label: "Sitting and talking to someone",
          type: "select",
          options: [
            { label: "0 - Would never doze", value: "0" },
            { label: "1 - Slight chance", value: "1" },
            { label: "2 - Moderate chance", value: "2" },
            { label: "3 - High chance", value: "3" },
          ],
        },
        {
          name: "afterLunch",
          label: "Sitting quietly after lunch (no alcohol)",
          type: "select",
          options: [
            { label: "0 - Would never doze", value: "0" },
            { label: "1 - Slight chance", value: "1" },
            { label: "2 - Moderate chance", value: "2" },
            { label: "3 - High chance", value: "3" },
          ],
        },
        {
          name: "traffic",
          label: "In a car, stopped in traffic for a few minutes",
          type: "select",
          options: [
            { label: "0 - Would never doze", value: "0" },
            { label: "1 - Slight chance", value: "1" },
            { label: "2 - Moderate chance", value: "2" },
            { label: "3 - High chance", value: "3" },
          ],
        },
      ],
      calculate: (inputs) => {
        const scores = [
          parseFloat(inputs.sitting as string) || 0,
          parseFloat(inputs.tv as string) || 0,
          parseFloat(inputs.publicPlace as string) || 0,
          parseFloat(inputs.passenger as string) || 0,
          parseFloat(inputs.afternoon as string) || 0,
          parseFloat(inputs.talking as string) || 0,
          parseFloat(inputs.afterLunch as string) || 0,
          parseFloat(inputs.traffic as string) || 0,
        ];

        const total = scores.reduce((sum, s) => sum + s, 0);

        let interpretation: string;
        if (total <= 5) interpretation = "Lower normal daytime sleepiness";
        else if (total <= 9) interpretation = "Higher normal daytime sleepiness";
        else if (total <= 12) interpretation = "Mild excessive daytime sleepiness";
        else if (total <= 15) interpretation = "Moderate excessive daytime sleepiness";
        else if (total <= 18) interpretation = "Severe excessive daytime sleepiness";
        else interpretation = "Very severe excessive daytime sleepiness";

        const sleepStudyRecommended = total > 10 ? "Recommended" : "Not specifically indicated";

        return {
          primary: {
            label: "ESS Score",
            value: formatNumber(total),
            suffix: "/ 24",
          },
          details: [
            { label: "Interpretation", value: interpretation },
            {
              label: "Sleep Study",
              value: sleepStudyRecommended,
            },
            { label: "Reading", value: formatNumber(scores[0]) },
            { label: "TV", value: formatNumber(scores[1]) },
            { label: "Public Place", value: formatNumber(scores[2]) },
            { label: "Passenger", value: formatNumber(scores[3]) },
            { label: "Afternoon Rest", value: formatNumber(scores[4]) },
            { label: "Talking", value: formatNumber(scores[5]) },
            { label: "After Lunch", value: formatNumber(scores[6]) },
            { label: "Traffic", value: formatNumber(scores[7]) },
          ],
          note: "A score > 10 suggests excessive daytime sleepiness and warrants further evaluation. Scores > 15 indicate severe sleepiness.",
        };
      },
    },
  ],
  relatedSlugs: ["caffeine-calc", "life-expectancy-calc", "melatonin-dosage"],
  faq: [
    {
      question: "What is the Epworth Sleepiness Scale?",
      answer:
        "The ESS is a validated questionnaire developed by Dr. Murray Johns in 1991 that measures general daytime sleepiness. It asks how likely you are to doze off in 8 common daily situations, with scores from 0 to 24.",
    },
    {
      question: "What does a high ESS score mean?",
      answer:
        "An ESS score above 10 indicates excessive daytime sleepiness that may be caused by sleep disorders such as obstructive sleep apnea, narcolepsy, or chronic sleep deprivation. Scores above 15 indicate severe sleepiness that significantly impairs daily function.",
    },
    {
      question: "Should I see a doctor based on my ESS score?",
      answer:
        "If your score is above 10, consider consulting a sleep specialist. They may recommend a polysomnography (sleep study) to evaluate for conditions like sleep apnea. Excessive daytime sleepiness can also be a symptom of other medical conditions.",
    },
  ],
  formula:
    "ESS Total = Σ(situation_score_i) for i = 1 to 8. Each situation scored 0-3. Normal: 0-10, Mild EDS: 11-12, Moderate: 13-15, Severe: 16-24.",
};
