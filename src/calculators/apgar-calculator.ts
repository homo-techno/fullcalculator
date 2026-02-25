import type { CalculatorDefinition } from "./types";

export const apgarCalculator: CalculatorDefinition = {
  slug: "apgar-score-calculator",
  title: "APGAR Score Calculator",
  description:
    "Free APGAR score calculator. Calculate and interpret your newborn's APGAR score based on the five standard assessment criteria at birth.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "APGAR score",
    "newborn assessment",
    "birth score",
    "APGAR calculator",
    "baby APGAR",
  ],
  variants: [
    {
      id: "score",
      name: "Calculate APGAR Score",
      description: "Enter each APGAR component to calculate the total score",
      fields: [
        {
          name: "appearance",
          label: "A - Appearance (Skin Color)",
          type: "select",
          options: [
            { label: "0 - Blue/pale all over", value: "0" },
            { label: "1 - Body pink, extremities blue", value: "1" },
            { label: "2 - Completely pink", value: "2" },
          ],
        },
        {
          name: "pulse",
          label: "P - Pulse (Heart Rate)",
          type: "select",
          options: [
            { label: "0 - Absent (no heartbeat)", value: "0" },
            { label: "1 - Below 100 bpm", value: "1" },
            { label: "2 - Above 100 bpm", value: "2" },
          ],
        },
        {
          name: "grimace",
          label: "G - Grimace (Reflex Response)",
          type: "select",
          options: [
            { label: "0 - No response to stimulation", value: "0" },
            { label: "1 - Grimace/weak cry with stimulation", value: "1" },
            { label: "2 - Cry or pull away with stimulation", value: "2" },
          ],
        },
        {
          name: "activity",
          label: "A - Activity (Muscle Tone)",
          type: "select",
          options: [
            { label: "0 - Limp, no movement", value: "0" },
            { label: "1 - Some flexion of arms/legs", value: "1" },
            { label: "2 - Active motion, well-flexed", value: "2" },
          ],
        },
        {
          name: "respiration",
          label: "R - Respiration (Breathing)",
          type: "select",
          options: [
            { label: "0 - Not breathing", value: "0" },
            { label: "1 - Weak, irregular, gasping", value: "1" },
            { label: "2 - Strong cry, regular breathing", value: "2" },
          ],
        },
      ],
      calculate: (inputs) => {
        const appearance = parseInt(inputs.appearance as string);
        const pulse = parseInt(inputs.pulse as string);
        const grimace = parseInt(inputs.grimace as string);
        const activity = parseInt(inputs.activity as string);
        const respiration = parseInt(inputs.respiration as string);

        if (
          isNaN(appearance) || isNaN(pulse) || isNaN(grimace) ||
          isNaN(activity) || isNaN(respiration)
        ) return null;

        const total = appearance + pulse + grimace + activity + respiration;

        let interpretation = "";
        let action = "";
        if (total >= 7) {
          interpretation = "Normal - Baby is in good condition";
          action = "Routine newborn care. Baby is healthy and vigorous.";
        } else if (total >= 4) {
          interpretation = "Moderately Depressed - Needs some assistance";
          action = "May need some intervention such as suctioning, stimulation, or supplemental oxygen. Usually improves with basic resuscitation.";
        } else {
          interpretation = "Severely Depressed - Needs immediate intervention";
          action = "Requires immediate resuscitation and medical attention. Aggressive intervention needed.";
        }

        const componentLabels = [
          `Appearance: ${appearance}`,
          `Pulse: ${pulse}`,
          `Grimace: ${grimace}`,
          `Activity: ${activity}`,
          `Respiration: ${respiration}`,
        ];

        return {
          primary: { label: "APGAR Score", value: `${total}/10 - ${total >= 7 ? "Normal" : total >= 4 ? "Low" : "Critical"}` },
          details: [
            { label: "Interpretation", value: interpretation },
            { label: "Recommended action", value: action },
            { label: "Score breakdown", value: componentLabels.join(" | ") },
            {
              label: "Scoring reference",
              value: "7-10: Normal | 4-6: Moderately low | 0-3: Critically low",
            },
            {
              label: "When scored",
              value: "Typically at 1 minute and 5 minutes after birth",
            },
          ],
          note: "APGAR scores are a quick assessment of newborn health. A low 1-minute score that improves at 5 minutes is usually not concerning. The 5-minute score is more predictive of outcome.",
        };
      },
    },
  ],
  relatedSlugs: ["fetal-weight-calculator", "nicu-stay-calculator"],
  faq: [
    {
      question: "What is the APGAR score?",
      answer:
        "APGAR stands for Appearance, Pulse, Grimace, Activity, and Respiration. It's a quick assessment done at 1 and 5 minutes after birth to evaluate a newborn's health. Each category is scored 0-2, with a maximum total of 10.",
    },
    {
      question: "What is a good APGAR score?",
      answer:
        "A score of 7-10 is considered normal. Very few babies score a perfect 10 at 1 minute because most have slightly blue extremities. A score of 4-6 may mean the baby needs some medical assistance. Below 4 indicates a need for immediate life-saving intervention.",
    },
  ],
  formula:
    "APGAR = Appearance (0-2) + Pulse (0-2) + Grimace (0-2) + Activity (0-2) + Respiration (0-2). Maximum score: 10. Normal: 7-10. Low: 4-6. Critical: 0-3.",
};
