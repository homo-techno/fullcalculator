import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const apgarScoreCalculator: CalculatorDefinition = {
  slug: "apgar-score-calculator",
  title: "APGAR Score Calculator",
  description:
    "Free APGAR score calculator. Assess newborn health using the five criteria: Appearance, Pulse, Grimace, Activity, and Respiration.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["APGAR score", "newborn assessment", "neonatal", "birth score"],
  variants: [
    {
      id: "apgar",
      name: "APGAR Score",
      fields: [
        {
          name: "appearance",
          label: "Appearance (Skin Color)",
          type: "select",
          options: [
            { label: "0 \u2013 Blue/pale all over", value: "0" },
            { label: "1 \u2013 Blue extremities, pink body", value: "1" },
            { label: "2 \u2013 Completely pink", value: "2" },
          ],
        },
        {
          name: "pulse",
          label: "Pulse (Heart Rate)",
          type: "select",
          options: [
            { label: "0 \u2013 Absent", value: "0" },
            { label: "1 \u2013 Below 100 bpm", value: "1" },
            { label: "2 \u2013 100 bpm or above", value: "2" },
          ],
        },
        {
          name: "grimace",
          label: "Grimace (Reflex Irritability)",
          type: "select",
          options: [
            { label: "0 \u2013 No response", value: "0" },
            { label: "1 \u2013 Grimace/feeble cry", value: "1" },
            { label: "2 \u2013 Cry or pull away", value: "2" },
          ],
        },
        {
          name: "activity",
          label: "Activity (Muscle Tone)",
          type: "select",
          options: [
            { label: "0 \u2013 Limp", value: "0" },
            { label: "1 \u2013 Some flexion", value: "1" },
            { label: "2 \u2013 Active motion", value: "2" },
          ],
        },
        {
          name: "respiration",
          label: "Respiration",
          type: "select",
          options: [
            { label: "0 \u2013 Absent", value: "0" },
            { label: "1 \u2013 Slow/irregular", value: "1" },
            { label: "2 \u2013 Good, crying", value: "2" },
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
          isNaN(appearance) ||
          isNaN(pulse) ||
          isNaN(grimace) ||
          isNaN(activity) ||
          isNaN(respiration)
        )
          return null;

        const total = appearance + pulse + grimace + activity + respiration;

        let interpretation: string;
        if (total >= 7) {
          interpretation = "Normal \u2013 baby is in good condition";
        } else if (total >= 4) {
          interpretation = "Moderately low \u2013 may need some medical intervention";
        } else {
          interpretation = "Critically low \u2013 immediate medical attention needed";
        }

        return {
          primary: {
            label: "APGAR Score",
            value: `${formatNumber(total, 0)} / 10`,
          },
          details: [
            { label: "Interpretation", value: interpretation },
            { label: "Appearance", value: `${formatNumber(appearance, 0)} / 2` },
            { label: "Pulse", value: `${formatNumber(pulse, 0)} / 2` },
            { label: "Grimace", value: `${formatNumber(grimace, 0)} / 2` },
            { label: "Activity", value: `${formatNumber(activity, 0)} / 2` },
            { label: "Respiration", value: `${formatNumber(respiration, 0)} / 2` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["glasgow-coma-calculator", "pediatric-dose-calculator"],
  faq: [
    {
      question: "What is the APGAR score?",
      answer:
        "The APGAR score is a quick assessment performed on newborns at 1 and 5 minutes after birth. It evaluates five criteria \u2013 Appearance, Pulse, Grimace, Activity, and Respiration \u2013 each scored 0\u20132, for a total of 0\u201310.",
    },
    {
      question: "What is a good APGAR score?",
      answer:
        "A score of 7\u201310 is considered normal. A score of 4\u20136 is moderately low and may require some intervention. A score below 4 is critically low and indicates the newborn needs immediate medical attention.",
    },
  ],
  formula:
    "APGAR = Appearance (0\u20132) + Pulse (0\u20132) + Grimace (0\u20132) + Activity (0\u20132) + Respiration (0\u20132). Total: 0\u201310.",
};
