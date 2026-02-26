import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ibuprofenDosageCalculator: CalculatorDefinition = {
  slug: "ibuprofen-dosage-calculator",
  title: "Ibuprofen Dosage Calculator",
  description:
    "Calculate proper ibuprofen dosing by weight and age. Get pediatric and adult dosing guidelines with maximum daily dose limits and dosing intervals.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "ibuprofen dosage calculator",
    "ibuprofen dose by weight",
    "advil dosing",
    "motrin dosage",
    "pediatric ibuprofen",
    "ibuprofen for children",
    "NSAID dosing",
  ],
  variants: [
    {
      id: "pediatric",
      name: "Pediatric Ibuprofen Dosing",
      description: "Calculate ibuprofen dose for children by weight (6 months to 12 years)",
      fields: [
        {
          name: "weight",
          label: "Child's Weight",
          type: "number",
          placeholder: "e.g. 22",
          suffix: "lbs",
          min: 10,
          max: 200,
          step: 0.5,
        },
        {
          name: "formulation",
          label: "Formulation",
          type: "select",
          options: [
            { label: "Infant Drops (50 mg/1.25 mL)", value: "drops" },
            { label: "Children's Liquid (100 mg/5 mL)", value: "liquid" },
            { label: "Junior Chewable (100 mg/tablet)", value: "chewable" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weightLbs = parseFloat(inputs.weight as string);
        const formulation = inputs.formulation as string;

        if (isNaN(weightLbs) || !formulation) return null;

        const weightKg = weightLbs / 2.205;

        // Standard pediatric dose: 5-10 mg/kg every 6-8 hours, max 40 mg/kg/day
        const doseLow = 5 * weightKg;
        const doseHigh = 10 * weightKg;
        const standardDose = 7.5 * weightKg; // midpoint
        const maxSingleDose = Math.min(10 * weightKg, 400); // capped at adult single dose
        const maxDailyDose = Math.min(40 * weightKg, 1200);

        let volumeOrTablets: string;
        let doseDisplay: string;
        if (formulation === "drops") {
          const mlLow = doseLow / (50 / 1.25);
          const mlHigh = Math.min(doseHigh, maxSingleDose) / (50 / 1.25);
          volumeOrTablets = `${formatNumber(mlLow, 1)} - ${formatNumber(mlHigh, 1)} mL`;
          doseDisplay = `Infant Drops: ${volumeOrTablets}`;
        } else if (formulation === "liquid") {
          const mlLow = doseLow / (100 / 5);
          const mlHigh = Math.min(doseHigh, maxSingleDose) / (100 / 5);
          volumeOrTablets = `${formatNumber(mlLow, 1)} - ${formatNumber(mlHigh, 1)} mL`;
          doseDisplay = `Children's Liquid: ${volumeOrTablets}`;
        } else {
          const tabletsLow = Math.ceil(doseLow / 100);
          const tabletsHigh = Math.min(Math.ceil(Math.min(doseHigh, maxSingleDose) / 100), 4);
          volumeOrTablets = `${formatNumber(tabletsLow, 0)} - ${formatNumber(tabletsHigh, 0)} tablets`;
          doseDisplay = `Chewable Tablets: ${volumeOrTablets}`;
        }

        return {
          primary: { label: "Recommended Dose", value: `${formatNumber(standardDose, 0)} mg` },
          details: [
            { label: "Weight", value: `${formatNumber(weightLbs, 1)} lbs (${formatNumber(weightKg, 1)} kg)` },
            { label: "Dose Range", value: `${formatNumber(doseLow, 0)} - ${formatNumber(Math.min(doseHigh, maxSingleDose), 0)} mg per dose` },
            { label: doseDisplay, value: volumeOrTablets },
            { label: "Dosing Interval", value: "Every 6-8 hours as needed" },
            { label: "Max Single Dose", value: `${formatNumber(maxSingleDose, 0)} mg` },
            { label: "Max Daily Dose", value: `${formatNumber(maxDailyDose, 0)} mg/day` },
          ],
          note: "Ibuprofen is NOT recommended for infants under 6 months of age. Always use the dosing device provided with the product. Do not exceed recommended doses. Consult a pediatrician for children under 2 years.",
        };
      },
    },
    {
      id: "adult",
      name: "Adult Ibuprofen Dosing",
      description: "Adult ibuprofen dosing guidelines for different conditions",
      fields: [
        {
          name: "condition",
          label: "Condition",
          type: "select",
          options: [
            { label: "Mild Pain / Headache", value: "mild" },
            { label: "Moderate Pain / Dental Pain", value: "moderate" },
            { label: "Menstrual Cramps", value: "menstrual" },
            { label: "Fever Reduction", value: "fever" },
            { label: "Arthritis / Inflammation", value: "arthritis" },
          ],
        },
        {
          name: "weight",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 150",
          suffix: "lbs",
          min: 80,
          max: 500,
        },
      ],
      calculate: (inputs) => {
        const condition = inputs.condition as string;
        const weightLbs = parseFloat(inputs.weight as string);

        if (!condition || isNaN(weightLbs)) return null;

        const weightKg = weightLbs / 2.205;

        let recommendedDose: number;
        let interval: string;
        let maxDaily: number;
        let notes: string;

        switch (condition) {
          case "mild":
            recommendedDose = 200;
            interval = "Every 4-6 hours";
            maxDaily = 1200;
            notes = "Start with 200 mg; increase to 400 mg if needed";
            break;
          case "moderate":
            recommendedDose = 400;
            interval = "Every 4-6 hours";
            maxDaily = 1200;
            notes = "400 mg is effective for most moderate pain";
            break;
          case "menstrual":
            recommendedDose = 400;
            interval = "Every 4-6 hours";
            maxDaily = 1200;
            notes = "Start at onset of symptoms. 400 mg initial dose recommended.";
            break;
          case "fever":
            recommendedDose = 200;
            interval = "Every 4-6 hours";
            maxDaily = 1200;
            notes = "200-400 mg per dose for fever. Use lowest effective dose.";
            break;
          case "arthritis":
            recommendedDose = 400;
            interval = "Every 6-8 hours (prescription doses up to 800 mg)";
            maxDaily = 2400;
            notes = "Higher doses (up to 2400 mg/day) only under medical supervision";
            break;
          default:
            recommendedDose = 200;
            interval = "Every 4-6 hours";
            maxDaily = 1200;
            notes = "Use lowest effective dose for shortest duration";
        }

        const otcMaxDaily = 1200;

        return {
          primary: { label: "Recommended Dose", value: `${formatNumber(recommendedDose, 0)} mg` },
          details: [
            { label: "Condition", value: condition.charAt(0).toUpperCase() + condition.slice(1) },
            { label: "Dose per Interval", value: `${formatNumber(recommendedDose, 0)} mg` },
            { label: "Dosing Interval", value: interval },
            { label: "OTC Max Daily", value: `${formatNumber(otcMaxDaily, 0)} mg/day` },
            { label: "Rx Max Daily (if applicable)", value: `${formatNumber(maxDaily, 0)} mg/day` },
            { label: "Guidance", value: notes },
          ],
          note: "OTC ibuprofen maximum is 1200 mg/day (3 x 400 mg). Prescription doses up to 3200 mg/day exist for specific conditions. Take with food to reduce GI side effects. Avoid in kidney disease, heart failure, or active GI bleeding.",
        };
      },
    },
  ],
  relatedSlugs: ["antibiotic-dose-calculator", "levothyroxine-dose-calculator", "adderall-dosage-calculator"],
  faq: [
    {
      question: "How much ibuprofen can I give my child?",
      answer:
        "Pediatric ibuprofen is dosed at 5-10 mg/kg per dose, given every 6-8 hours, with a maximum of 40 mg/kg/day. Always dose by weight rather than age for accuracy. Ibuprofen should not be given to infants under 6 months of age.",
    },
    {
      question: "What is the maximum daily dose of ibuprofen for adults?",
      answer:
        "The OTC maximum is 1200 mg/day (e.g., three 400 mg doses). Under medical supervision, prescription doses can go up to 2400-3200 mg/day for conditions like rheumatoid arthritis. Always use the lowest effective dose.",
    },
    {
      question: "Can I take ibuprofen with other medications?",
      answer:
        "Ibuprofen can interact with blood thinners, aspirin, ACE inhibitors, diuretics, lithium, and methotrexate. Do not combine with other NSAIDs (naproxen, aspirin). Consult your doctor or pharmacist about drug interactions.",
    },
  ],
  formula:
    "Pediatric Dose = 5-10 mg/kg per dose, every 6-8 hours | Max Pediatric Daily = 40 mg/kg/day | Adult OTC Max = 1200 mg/day | Adult Rx Max = 2400-3200 mg/day",
};
