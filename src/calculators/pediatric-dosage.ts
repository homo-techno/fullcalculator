import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pediatricDosageCalculator: CalculatorDefinition = {
  slug: "pediatric-dosage",
  title: "Pediatric Medication Dosage Calculator",
  description:
    "Free online pediatric medication dosage calculator by weight using standard mg/kg dosing.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pediatric",
    "dosage",
    "children",
    "medication",
    "mg per kg",
    "weight based",
    "drug dosing",
    "infant",
  ],
  variants: [
    {
      id: "weight-based",
      name: "Weight-Based Dosing (mg/kg)",
      description:
        "Calculate pediatric dose from a prescribed mg/kg dose and child's weight.",
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
          name: "dosePerKg",
          label: "Prescribed Dose",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "mg/kg",
        },
        {
          name: "maxSingleDose",
          label: "Max Single Dose (adult dose)",
          type: "number",
          placeholder: "e.g. 500",
          suffix: "mg",
        },
        {
          name: "frequency",
          label: "Dosing Frequency",
          type: "select",
          options: [
            { label: "Once daily", value: "1" },
            { label: "Twice daily (q12h)", value: "2" },
            { label: "Three times daily (q8h)", value: "3" },
            { label: "Four times daily (q6h)", value: "4" },
            { label: "Every 4 hours (max 6/day)", value: "6" },
          ],
        },
        {
          name: "concentration",
          label: "Liquid Concentration (mg/mL, optional)",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "mg/mL",
        },
      ],
      calculate: (inputs) => {
        let weight = parseFloat(inputs.weight as string) || 0;
        const unit = inputs.weightUnit as string;
        const dosePerKg = parseFloat(inputs.dosePerKg as string) || 0;
        const maxSingle = parseFloat(inputs.maxSingleDose as string) || 0;
        const frequency = parseFloat(inputs.frequency as string) || 1;
        const concentration = parseFloat(inputs.concentration as string) || 0;

        if (weight <= 0 || dosePerKg <= 0) return null;

        if (unit === "lbs") {
          weight = weight * 0.453592;
        }

        let singleDose = weight * dosePerKg;
        if (maxSingle > 0) {
          singleDose = Math.min(singleDose, maxSingle);
        }

        const dailyDose = singleDose * frequency;
        const dailyDosePerKg = dailyDose / weight;

        const details = [
          { label: "Single Dose", value: formatNumber(singleDose) + " mg" },
          { label: "Daily Total Dose", value: formatNumber(dailyDose) + " mg" },
          { label: "Daily Dose per kg", value: formatNumber(dailyDosePerKg) + " mg/kg/day" },
          { label: "Doses per Day", value: formatNumber(frequency) },
          { label: "Weight Used", value: formatNumber(weight) + " kg" },
        ];

        if (maxSingle > 0 && weight * dosePerKg > maxSingle) {
          details.push({ label: "Note", value: "Dose capped at max single dose of " + formatNumber(maxSingle) + " mg" });
        }

        if (concentration > 0) {
          const volumeMl = singleDose / concentration;
          details.push({ label: "Volume per Dose", value: formatNumber(volumeMl) + " mL" });
          details.push({ label: "Concentration", value: formatNumber(concentration) + " mg/mL" });
        }

        return {
          primary: {
            label: "Dose per Administration",
            value: formatNumber(singleDose),
            suffix: "mg",
          },
          details,
          note: "Always verify dosing with a pharmacist or physician. Double-check concentration and units before administering medication to children.",
        };
      },
    },
    {
      id: "common-medications",
      name: "Common Pediatric Medications",
      description:
        "Quick reference dosing for common pediatric medications by weight.",
      fields: [
        {
          name: "medication",
          label: "Medication",
          type: "select",
          options: [
            { label: "Amoxicillin (standard: 25 mg/kg/day divided q12h)", value: "amoxicillin_std" },
            { label: "Amoxicillin (high-dose: 90 mg/kg/day divided q12h)", value: "amoxicillin_high" },
            { label: "Azithromycin (10 mg/kg day 1, 5 mg/kg days 2-5)", value: "azithromycin" },
            { label: "Cephalexin (25-50 mg/kg/day divided q6-8h)", value: "cephalexin" },
            { label: "Ibuprofen (10 mg/kg q6-8h)", value: "ibuprofen" },
            { label: "Prednisolone (1-2 mg/kg/day)", value: "prednisolone" },
          ],
        },
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
          name: "childWeight",
          label: "Child's Weight",
          type: "number",
          placeholder: "e.g. 15",
        },
      ],
      calculate: (inputs) => {
        let weight = parseFloat(inputs.childWeight as string) || 0;
        const unit = inputs.weightUnit as string;
        const med = inputs.medication as string;

        if (weight <= 0) return null;

        if (unit === "lbs") {
          weight = weight * 0.453592;
        }

        let dosePerKgPerDay: number;
        let maxDailyDose: number;
        let frequency: string;
        let medName: string;
        let notes: string;

        switch (med) {
          case "amoxicillin_std":
            dosePerKgPerDay = 25;
            maxDailyDose = 1500;
            frequency = "Divided twice daily (q12h)";
            medName = "Amoxicillin (standard dose)";
            notes = "Standard dose for non-resistant infections. Suspension: 250 mg/5 mL or 400 mg/5 mL.";
            break;
          case "amoxicillin_high":
            dosePerKgPerDay = 90;
            maxDailyDose = 4000;
            frequency = "Divided twice daily (q12h)";
            medName = "Amoxicillin (high dose)";
            notes = "High dose for AOM or suspected resistant organisms. Suspension: 400 mg/5 mL preferred.";
            break;
          case "azithromycin":
            dosePerKgPerDay = 10;
            maxDailyDose = 500;
            frequency = "Once daily (Day 1: 10 mg/kg, Days 2-5: 5 mg/kg)";
            medName = "Azithromycin";
            notes = "Day 1 loading dose is double. Suspension: 200 mg/5 mL.";
            break;
          case "cephalexin":
            dosePerKgPerDay = 50;
            maxDailyDose = 4000;
            frequency = "Divided 3-4 times daily (q6-8h)";
            medName = "Cephalexin";
            notes = "Suspension: 250 mg/5 mL. Common for skin/soft tissue infections.";
            break;
          case "ibuprofen":
            dosePerKgPerDay = 30;
            maxDailyDose = 1200;
            frequency = "Divided 3 times daily (q6-8h), 10 mg/kg per dose";
            medName = "Ibuprofen";
            notes = "Give with food. Not recommended under 6 months. Suspension: 100 mg/5 mL.";
            break;
          case "prednisolone":
            dosePerKgPerDay = 2;
            maxDailyDose = 60;
            frequency = "Once daily or divided twice daily";
            medName = "Prednisolone";
            notes = "Short courses (3-5 days) for asthma/croup. Suspension: 15 mg/5 mL.";
            break;
          default:
            return null;
        }

        const dailyDose = Math.min(weight * dosePerKgPerDay, maxDailyDose);
        let dosesPerDay: number;
        if (med === "azithromycin") dosesPerDay = 1;
        else if (med === "amoxicillin_std" || med === "amoxicillin_high") dosesPerDay = 2;
        else if (med === "prednisolone") dosesPerDay = 1;
        else if (med === "cephalexin") dosesPerDay = 4;
        else dosesPerDay = 3;

        const singleDose = dailyDose / dosesPerDay;

        return {
          primary: {
            label: medName + " - Single Dose",
            value: formatNumber(singleDose),
            suffix: "mg",
          },
          details: [
            { label: "Daily Total", value: formatNumber(dailyDose) + " mg/day" },
            { label: "Frequency", value: frequency },
            { label: "Dose/kg/day", value: formatNumber(dosePerKgPerDay) + " mg/kg/day" },
            { label: "Max Daily Dose", value: formatNumber(maxDailyDose) + " mg" },
            { label: "Weight", value: formatNumber(weight) + " kg" },
            { label: "Notes", value: notes },
          ],
          note: "Always verify pediatric dosing with current references and a pharmacist. Doses may vary based on indication and local resistance patterns.",
        };
      },
    },
  ],
  relatedSlugs: ["tylenol-dosage", "benadryl-dosage", "body-surface-area"],
  faq: [
    {
      question: "Why is weight-based dosing important for children?",
      answer:
        "Children vary enormously in size, and fixed-dose (adult) dosing can lead to underdosing (ineffective treatment) or overdosing (toxicity). Weight-based dosing (mg/kg) ensures each child receives an appropriate amount of medication for their body size.",
    },
    {
      question: "Should I use actual or ideal body weight?",
      answer:
        "For most pediatric medications, actual body weight is used. However, for certain drugs with narrow therapeutic windows or in obese patients, ideal or adjusted body weight may be preferred. Consult the prescribing physician or pharmacist for guidance.",
    },
    {
      question: "What if the calculated dose exceeds the adult dose?",
      answer:
        "Pediatric doses should generally not exceed the maximum adult dose. If a weight-based calculation exceeds the adult maximum, cap the dose at the adult maximum. This commonly occurs with larger adolescents.",
    },
  ],
  formula:
    "Single Dose = Weight (kg) × Dose (mg/kg), capped at max adult dose. Daily Dose = Single Dose × Frequency. Volume = Single Dose / Concentration (mg/mL).",
};
