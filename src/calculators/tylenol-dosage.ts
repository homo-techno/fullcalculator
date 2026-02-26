import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tylenolDosageCalculator: CalculatorDefinition = {
  slug: "tylenol-dosage",
  title: "Tylenol (Acetaminophen) Dosage Calculator",
  description:
    "Free online Tylenol dosage calculator by weight and age for children and adults.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "tylenol",
    "acetaminophen",
    "paracetamol",
    "fever",
    "pain relief",
    "dosage",
    "pediatric",
    "analgesic",
  ],
  variants: [
    {
      id: "pediatric",
      name: "Pediatric Dosage (by Weight)",
      description:
        "Calculate acetaminophen dose for children based on body weight (10-15 mg/kg per dose).",
      fields: [
        {
          name: "weightUnit",
          label: "Weight Unit",
          type: "select",
          options: [
            { label: "kg", value: "kg" },
            { label: "lbs", value: "lbs" },
          ],
        },
        {
          name: "weight",
          label: "Child's Weight",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "formulation",
          label: "Formulation",
          type: "select",
          options: [
            { label: "Infant Drops (80 mg/0.8 mL)", value: "infant_drops" },
            { label: "Children's Liquid (160 mg/5 mL)", value: "childrens_liquid" },
            { label: "Children's Chewable (160 mg)", value: "chewable" },
            { label: "Junior Tabs (160 mg)", value: "junior" },
            { label: "Regular Tablets (325 mg)", value: "regular" },
            { label: "Extra Strength (500 mg)", value: "extra" },
          ],
        },
      ],
      calculate: (inputs) => {
        let weight = parseFloat(inputs.weight as string) || 0;
        const unit = inputs.weightUnit as string;
        const formulation = inputs.formulation as string;

        if (weight <= 0) return null;

        if (unit === "lbs") {
          weight = weight * 0.453592;
        }

        // Standard pediatric dose: 10-15 mg/kg per dose
        const doseLow = weight * 10;
        const doseHigh = weight * 15;
        const recommendedDose = weight * 15; // Use 15 mg/kg standard

        // Max single dose: 1000 mg for adults, 15 mg/kg for children up to 1000 mg
        const maxSingleDose = Math.min(recommendedDose, 1000);
        const dose = Math.min(recommendedDose, maxSingleDose);

        // Max daily dose: 75 mg/kg/day or 4000 mg, whichever is less
        const maxDailyByWeight = weight * 75;
        const maxDaily = Math.min(maxDailyByWeight, 4000);

        // Formulation-specific amounts
        let formAmount: string;
        let formNote = "";
        if (formulation === "infant_drops") {
          const ml = (dose / 80) * 0.8;
          formAmount = formatNumber(ml) + " mL";
          formNote = "80 mg per 0.8 mL";
        } else if (formulation === "childrens_liquid") {
          const ml = (dose / 160) * 5;
          formAmount = formatNumber(ml) + " mL";
          formNote = "160 mg per 5 mL";
        } else if (formulation === "chewable") {
          const tabs = dose / 160;
          formAmount = formatNumber(tabs) + " tablet(s)";
          formNote = "160 mg per chewable tablet";
        } else if (formulation === "junior") {
          const tabs = dose / 160;
          formAmount = formatNumber(tabs) + " tablet(s)";
          formNote = "160 mg per tablet";
        } else if (formulation === "regular") {
          const tabs = dose / 325;
          formAmount = formatNumber(tabs) + " tablet(s)";
          formNote = "325 mg per tablet";
        } else {
          const tabs = dose / 500;
          formAmount = formatNumber(tabs) + " tablet(s)";
          formNote = "500 mg per tablet";
        }

        return {
          primary: {
            label: "Recommended Dose",
            value: formatNumber(dose),
            suffix: "mg",
          },
          details: [
            { label: "Formulation Amount", value: formAmount },
            { label: "Formulation Strength", value: formNote },
            { label: "Dose Range", value: formatNumber(doseLow) + " - " + formatNumber(doseHigh) + " mg" },
            { label: "Frequency", value: "Every 4-6 hours as needed" },
            { label: "Max Doses per Day", value: "5 (do not exceed)" },
            { label: "Max Daily Dose", value: formatNumber(maxDaily) + " mg" },
            { label: "Weight Used", value: formatNumber(weight) + " kg" },
          ],
          note: "Do not exceed 5 doses in 24 hours. Acetaminophen overdose can cause severe liver damage. Do not combine with other acetaminophen-containing products. Consult a physician for children under 2 years.",
        };
      },
    },
    {
      id: "adult",
      name: "Adult Dosage",
      description:
        "Standard adult acetaminophen dosing guidelines.",
      fields: [
        {
          name: "indication",
          label: "Indication",
          type: "select",
          options: [
            { label: "Mild-moderate pain/fever", value: "standard" },
            { label: "Arthritis (extended release)", value: "arthritis" },
          ],
        },
        {
          name: "formulation",
          label: "Formulation",
          type: "select",
          options: [
            { label: "Regular Strength (325 mg)", value: "regular" },
            { label: "Extra Strength (500 mg)", value: "extra" },
            { label: "Arthritis (650 mg ER)", value: "arthritis" },
          ],
        },
        {
          name: "liverDisease",
          label: "Liver Disease or Heavy Alcohol Use?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
      ],
      calculate: (inputs) => {
        const indication = inputs.indication as string;
        const formulation = inputs.formulation as string;
        const liverRisk = inputs.liverDisease === "yes";

        let singleDose: number;
        let frequency: string;
        let maxDaily: number;

        if (indication === "arthritis" || formulation === "arthritis") {
          singleDose = 1300;
          frequency = "Every 8 hours";
          maxDaily = 3900;
        } else if (formulation === "extra") {
          singleDose = 1000;
          frequency = "Every 6 hours";
          maxDaily = 4000;
        } else {
          singleDose = 650;
          frequency = "Every 4-6 hours";
          maxDaily = 4000;
        }

        if (liverRisk) {
          maxDaily = Math.min(maxDaily, 2000);
          singleDose = Math.min(singleDose, 650);
        }

        let tabCount: number;
        let mgPerTab: number;
        if (formulation === "regular") {
          mgPerTab = 325;
        } else if (formulation === "extra") {
          mgPerTab = 500;
        } else {
          mgPerTab = 650;
        }
        tabCount = singleDose / mgPerTab;

        return {
          primary: {
            label: "Single Dose",
            value: formatNumber(singleDose),
            suffix: "mg",
          },
          details: [
            { label: "Tablets per Dose", value: formatNumber(tabCount) },
            { label: "Frequency", value: frequency },
            { label: "Max Daily Dose", value: formatNumber(maxDaily) + " mg" },
            {
              label: "Liver/Alcohol Risk",
              value: liverRisk ? "Yes - reduced max daily dose to 2000 mg" : "No",
            },
          ],
          note: "Never exceed 4000 mg/day (2000 mg/day with liver disease). Acetaminophen is present in many combination products. Always check all medications for acetaminophen content.",
        };
      },
    },
  ],
  relatedSlugs: ["benadryl-dosage", "pediatric-dosage", "drug-half-life"],
  faq: [
    {
      question: "What is the correct Tylenol dose for children?",
      answer:
        "The standard pediatric acetaminophen dose is 10-15 mg/kg per dose, given every 4-6 hours as needed, not to exceed 5 doses in 24 hours. Always use the dosing device provided with the product and measure by weight rather than age when possible.",
    },
    {
      question: "What happens if you take too much acetaminophen?",
      answer:
        "Acetaminophen overdose can cause severe, potentially fatal liver damage. Symptoms may not appear for 24-72 hours. If overdose is suspected, seek emergency medical attention immediately. The antidote (N-acetylcysteine) is most effective when given within 8 hours of ingestion.",
    },
    {
      question: "Can I take Tylenol with other medications?",
      answer:
        "Many prescription and OTC products contain acetaminophen (cold medicines, sleep aids, opioid combinations). Taking multiple products can lead to overdose. Always check ingredient labels. Acetaminophen is generally safe with NSAIDs like ibuprofen, and they can be alternated for pain/fever.",
    },
  ],
  formula:
    "Pediatric dose = 10-15 mg/kg per dose, every 4-6 hours, max 75 mg/kg/day or 4000 mg. Adult dose = 325-1000 mg per dose, max 4000 mg/day (2000 mg with liver disease).",
};
