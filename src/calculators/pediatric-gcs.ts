import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pediatricGcsCalculator: CalculatorDefinition = {
  slug: "pediatric-gcs",
  title: "Pediatric Glasgow Coma Scale Calculator",
  description: "Free pediatric Glasgow Coma Scale calculator. Assess level of consciousness in infants and young children using modified eye, verbal, and motor responses.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pediatric gcs", "pediatric glasgow coma scale", "infant gcs", "child consciousness", "pediatric neuro assessment", "modified gcs"],
  variants: [
    {
      id: "pediatric-gcs",
      name: "Pediatric GCS (< 2 years)",
      fields: [
        { name: "eye", label: "Eye Opening", type: "select", options: [
          { label: "4 - Spontaneous", value: "4" },
          { label: "3 - To voice/sound", value: "3" },
          { label: "2 - To pressure/pain", value: "2" },
          { label: "1 - None", value: "1" },
        ] },
        { name: "verbal", label: "Verbal Response (Infant)", type: "select", options: [
          { label: "5 - Coos, babbles normally", value: "5" },
          { label: "4 - Irritable, crying", value: "4" },
          { label: "3 - Cries to pain", value: "3" },
          { label: "2 - Moans to pain", value: "2" },
          { label: "1 - None", value: "1" },
        ] },
        { name: "motor", label: "Motor Response", type: "select", options: [
          { label: "6 - Normal spontaneous movements", value: "6" },
          { label: "5 - Localizes pain / withdraws to touch", value: "5" },
          { label: "4 - Withdraws from pain", value: "4" },
          { label: "3 - Abnormal flexion", value: "3" },
          { label: "2 - Extension", value: "2" },
          { label: "1 - None", value: "1" },
        ] },
      ],
      calculate: (inputs) => {
        const eye = parseInt(inputs.eye as string);
        const verbal = parseInt(inputs.verbal as string);
        const motor = parseInt(inputs.motor as string);
        if (isNaN(eye) || isNaN(verbal) || isNaN(motor)) return null;
        const total = eye + verbal + motor;
        let severity = "";
        let action = "";
        if (total <= 8) { severity = "Severe brain injury"; action = "Intubation likely needed; neurosurgical consultation; ICU admission"; }
        else if (total <= 12) { severity = "Moderate brain injury"; action = "Close monitoring; consider CT imaging; neurosurgical consultation"; }
        else { severity = "Mild brain injury"; action = "Observation; reassess frequently; consider CT if mechanism warrants"; }
        return {
          primary: { label: "Pediatric GCS", value: formatNumber(total, 0) + " / 15" },
          details: [
            { label: "Total Score", value: formatNumber(total, 0) + " / 15" },
            { label: "Severity", value: severity },
            { label: "Recommended Action", value: action },
            { label: "Eye Opening (E)", value: formatNumber(eye, 0) + " / 4" },
            { label: "Verbal Response (V)", value: formatNumber(verbal, 0) + " / 5" },
            { label: "Motor Response (M)", value: formatNumber(motor, 0) + " / 6" },
            { label: "GCS Notation", value: "E" + eye + "V" + verbal + "M" + motor },
          ],
          note: "Pediatric GCS uses modified verbal scale for pre-verbal children. 13-15: mild, 9-12: moderate, 3-8: severe (consider intubation). Always document individual components, not just total.",
        };
      },
    },
  ],
  relatedSlugs: ["revised-trauma", "apache-score", "news-score"],
  faq: [
    { question: "How does pediatric GCS differ from adult?", answer: "The pediatric GCS modifies the verbal scale for pre-verbal children: 5 = coos/babbles, 4 = irritable cry, 3 = cries to pain, 2 = moans, 1 = none. Eye and motor scales are similar." },
    { question: "What pediatric GCS score is concerning?", answer: "GCS <= 8 indicates severe injury requiring intubation and ICU care. GCS 9-12 is moderate. GCS 13-15 is mild but may still need imaging depending on mechanism." },
    { question: "At what age should adult GCS be used?", answer: "The pediatric modified verbal scale is used for children under 2 years. Children over 5 years can typically use the standard adult GCS verbal scale." },
  ],
  formula: "Pediatric GCS = Eye (1-4) + Verbal (1-5, modified) + Motor (1-6) | Range: 3-15",
};
