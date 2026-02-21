import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const glasgowComaCalculator: CalculatorDefinition = {
  slug: "glasgow-coma-calculator",
  title: "Glasgow Coma Scale Calculator",
  description:
    "Free Glasgow Coma Scale (GCS) calculator. Assess level of consciousness using eye, verbal, and motor response scores.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["Glasgow Coma Scale", "GCS", "consciousness", "neurological assessment"],
  variants: [
    {
      id: "gcs",
      name: "GCS Score",
      fields: [
        {
          name: "eye",
          label: "Eye Opening Response",
          type: "select",
          options: [
            { label: "4 \u2013 Spontaneous", value: "4" },
            { label: "3 \u2013 To voice", value: "3" },
            { label: "2 \u2013 To pressure", value: "2" },
            { label: "1 \u2013 None", value: "1" },
          ],
        },
        {
          name: "verbal",
          label: "Verbal Response",
          type: "select",
          options: [
            { label: "5 \u2013 Oriented", value: "5" },
            { label: "4 \u2013 Confused", value: "4" },
            { label: "3 \u2013 Inappropriate words", value: "3" },
            { label: "2 \u2013 Incomprehensible sounds", value: "2" },
            { label: "1 \u2013 None", value: "1" },
          ],
        },
        {
          name: "motor",
          label: "Motor Response",
          type: "select",
          options: [
            { label: "6 \u2013 Obeys commands", value: "6" },
            { label: "5 \u2013 Localizing", value: "5" },
            { label: "4 \u2013 Normal flexion", value: "4" },
            { label: "3 \u2013 Abnormal flexion", value: "3" },
            { label: "2 \u2013 Extension", value: "2" },
            { label: "1 \u2013 None", value: "1" },
          ],
        },
      ],
      calculate: (inputs) => {
        const eye = parseInt(inputs.eye as string);
        const verbal = parseInt(inputs.verbal as string);
        const motor = parseInt(inputs.motor as string);
        if (!eye || !verbal || !motor) return null;

        const total = eye + verbal + motor;

        let severity: string;
        if (total >= 13) {
          severity = "Mild brain injury";
        } else if (total >= 9) {
          severity = "Moderate brain injury";
        } else {
          severity = "Severe brain injury";
        }

        let intubation = "";
        if (total <= 8) {
          intubation = "Consider intubation (GCS \u2264 8)";
        }

        const details = [
          { label: "Severity", value: severity },
          { label: "Eye Opening (E)", value: `${formatNumber(eye, 0)} / 4` },
          { label: "Verbal Response (V)", value: `${formatNumber(verbal, 0)} / 5` },
          { label: "Motor Response (M)", value: `${formatNumber(motor, 0)} / 6` },
        ];

        if (intubation) {
          details.push({ label: "Clinical Note", value: intubation });
        }

        return {
          primary: {
            label: "GCS Score",
            value: `${formatNumber(total, 0)} / 15`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["apgar-score-calculator", "burns-calculator"],
  faq: [
    {
      question: "What is the Glasgow Coma Scale?",
      answer:
        "The Glasgow Coma Scale (GCS) is a neurological scale that assesses a patient's level of consciousness based on three components: eye opening (1\u20134), verbal response (1\u20135), and motor response (1\u20136). Total score ranges from 3 to 15.",
    },
    {
      question: "What do GCS scores mean?",
      answer:
        "GCS 13\u201315 indicates mild brain injury, 9\u201312 indicates moderate brain injury, and 3\u20138 indicates severe brain injury. A GCS of 8 or less typically warrants intubation.",
    },
  ],
  formula:
    "GCS = Eye (1\u20134) + Verbal (1\u20135) + Motor (1\u20136). Range: 3\u201315. Mild: 13\u201315, Moderate: 9\u201312, Severe: 3\u20138.",
};
