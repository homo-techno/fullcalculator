import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const adderallDosageCalculator: CalculatorDefinition = {
  slug: "adderall-dosage-calculator",
  title: "Adderall Dosage Reference Guide",
  description:
    "Reference guide for Adderall (amphetamine/dextroamphetamine) dosing by age and condition. Understand standard dosing ranges for ADHD and narcolepsy.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "adderall dosage",
    "adderall dose calculator",
    "ADHD medication dosing",
    "amphetamine dosage",
    "adderall XR dosing",
    "stimulant medication",
    "ADHD treatment",
  ],
  variants: [
    {
      id: "adhd-dosing",
      name: "ADHD Dosing Reference",
      description: "Standard Adderall dosing ranges for ADHD by age group and formulation",
      fields: [
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "Children (6-12 years)", value: "child" },
            { label: "Adolescents (13-17 years)", value: "adolescent" },
            { label: "Adults (18+ years)", value: "adult" },
          ],
        },
        {
          name: "formulation",
          label: "Formulation",
          type: "select",
          options: [
            { label: "Adderall IR (Immediate Release)", value: "ir" },
            { label: "Adderall XR (Extended Release)", value: "xr" },
          ],
        },
        {
          name: "currentDose",
          label: "Current Daily Dose (0 if starting new)",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "mg",
          min: 0,
          max: 60,
          step: 2.5,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const ageGroup = inputs.ageGroup as string;
        const formulation = inputs.formulation as string;
        const currentDose = parseFloat(inputs.currentDose as string) || 0;

        if (!ageGroup || !formulation) return null;

        let startDose: number;
        let maxDose: number;
        let titrationStep: number;
        let frequency: string;
        let startingInfo: string;

        if (formulation === "ir") {
          switch (ageGroup) {
            case "child":
              startDose = 5;
              maxDose = 30;
              titrationStep = 5;
              frequency = "1-3 times daily (first dose on waking)";
              startingInfo = "Start 5 mg once or twice daily; increase by 5 mg weekly";
              break;
            case "adolescent":
              startDose = 5;
              maxDose = 40;
              titrationStep = 5;
              frequency = "1-3 times daily";
              startingInfo = "Start 5 mg once or twice daily; increase by 5 mg weekly";
              break;
            default:
              startDose = 5;
              maxDose = 40;
              titrationStep = 5;
              frequency = "1-3 times daily (typically twice daily)";
              startingInfo = "Start 5 mg once or twice daily; increase by 5 mg weekly";
          }
        } else {
          switch (ageGroup) {
            case "child":
              startDose = 10;
              maxDose = 30;
              titrationStep = 5;
              frequency = "Once daily in the morning";
              startingInfo = "Start 10 mg once daily; increase by 5-10 mg weekly";
              break;
            case "adolescent":
              startDose = 10;
              maxDose = 30;
              titrationStep = 10;
              frequency = "Once daily in the morning";
              startingInfo = "Start 10 mg once daily; increase by 10 mg weekly";
              break;
            default:
              startDose = 20;
              maxDose = 60;
              titrationStep = 10;
              frequency = "Once daily in the morning";
              startingInfo = "Start 20 mg once daily; titrate as needed";
          }
        }

        let nextDose: number | null = null;
        let nextDoseText: string;
        if (currentDose === 0) {
          nextDoseText = `Starting dose: ${formatNumber(startDose, 0)} mg`;
        } else if (currentDose < maxDose) {
          nextDose = Math.min(currentDose + titrationStep, maxDose);
          nextDoseText = `Next titration step: ${formatNumber(nextDose, 0)} mg (if clinically indicated)`;
        } else {
          nextDoseText = "Already at maximum recommended dose";
        }

        const formulationName = formulation === "ir" ? "Adderall IR (Immediate Release)" : "Adderall XR (Extended Release)";

        return {
          primary: { label: "Starting Dose", value: `${formatNumber(startDose, 0)} mg` },
          details: [
            { label: "Formulation", value: formulationName },
            { label: "Age Group", value: ageGroup === "child" ? "6-12 years" : ageGroup === "adolescent" ? "13-17 years" : "18+ years" },
            { label: "Starting Dose", value: `${formatNumber(startDose, 0)} mg/day` },
            { label: "Maximum Dose", value: `${formatNumber(maxDose, 0)} mg/day` },
            { label: "Titration Step", value: `${formatNumber(titrationStep, 0)} mg increments` },
            { label: "Frequency", value: frequency },
            { label: "Current Dose", value: currentDose > 0 ? `${formatNumber(currentDose, 0)} mg/day` : "Not currently taking" },
            { label: "Titration Guidance", value: nextDoseText },
            { label: "Protocol", value: startingInfo },
          ],
          note: "This is a reference guide only — NOT a prescription. Adderall is a Schedule II controlled substance. Dosing must be individualized by a licensed healthcare provider. Never adjust doses without medical supervision.",
        };
      },
    },
    {
      id: "ir-to-xr-conversion",
      name: "IR to XR Conversion",
      description: "Estimate equivalent Adderall XR dose from current IR dosing",
      fields: [
        {
          name: "irDose",
          label: "Current Total Daily IR Dose",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "mg/day",
          min: 5,
          max: 60,
          step: 5,
        },
        {
          name: "timesPerDay",
          label: "Times Per Day (IR)",
          type: "select",
          options: [
            { label: "Twice daily", value: "2" },
            { label: "Three times daily", value: "3" },
          ],
        },
      ],
      calculate: (inputs) => {
        const irDose = parseFloat(inputs.irDose as string);
        const timesPerDay = parseFloat(inputs.timesPerDay as string);

        if (isNaN(irDose) || isNaN(timesPerDay)) return null;

        // Adderall XR equivalent is approximately equal to total daily IR dose
        const xrEquivalent = irDose;
        const dosePerIrAdmin = irDose / timesPerDay;

        // XR capsule available strengths
        const xrStrengths = [5, 10, 15, 20, 25, 30];
        let nearestXR = xrStrengths[0];
        let minDiff = Math.abs(xrEquivalent - xrStrengths[0]);
        for (const s of xrStrengths) {
          const diff = Math.abs(xrEquivalent - s);
          if (diff < minDiff) {
            minDiff = diff;
            nearestXR = s;
          }
        }

        return {
          primary: { label: "Equivalent XR Dose", value: `${formatNumber(xrEquivalent, 0)} mg once daily` },
          details: [
            { label: "Current IR Regimen", value: `${formatNumber(dosePerIrAdmin, 1)} mg x ${formatNumber(timesPerDay, 0)}/day = ${formatNumber(irDose, 0)} mg total` },
            { label: "Equivalent XR Dose", value: `${formatNumber(xrEquivalent, 0)} mg once daily` },
            { label: "Nearest Available XR Capsule", value: `${formatNumber(nearestXR, 0)} mg` },
            { label: "Available XR Strengths", value: "5, 10, 15, 20, 25, 30 mg" },
          ],
          note: "Adderall XR provides approximately 50% immediate release and 50% delayed release (~4 hours later). The total daily dose of IR can generally be given as a single XR dose. Final dosing must be determined by your prescriber.",
        };
      },
    },
  ],
  relatedSlugs: ["ibuprofen-dosage-calculator", "levothyroxine-dose-calculator", "phq9-depression-calculator"],
  faq: [
    {
      question: "What is the typical starting dose of Adderall for ADHD?",
      answer:
        "For children ages 6-12, the typical starting dose is 5 mg IR once or twice daily, or 10 mg XR once daily. For adults, starting doses are typically 5 mg IR twice daily or 20 mg XR once daily. Doses are then titrated upward as needed under medical supervision.",
    },
    {
      question: "What is the difference between Adderall IR and Adderall XR?",
      answer:
        "Adderall IR (Immediate Release) works for about 4-6 hours and is typically taken 1-3 times daily. Adderall XR (Extended Release) lasts about 10-12 hours and is taken once daily in the morning. XR contains both immediate and delayed-release beads.",
    },
    {
      question: "What are the maximum recommended doses?",
      answer:
        "For ADHD: Children (6-12) max 30 mg/day, adolescents max 30-40 mg/day, adults max 40 mg/day (IR) or 60 mg/day (XR). These are general guidelines — individual dosing should be determined by a healthcare provider based on response and tolerability.",
    },
  ],
  formula:
    "IR Starting: 5 mg/day (children), 5-10 mg/day (adults) | XR Starting: 10 mg/day (children), 20 mg/day (adults) | Titrate by 5-10 mg weekly | IR to XR: Total daily IR dose = equivalent once-daily XR dose",
};
