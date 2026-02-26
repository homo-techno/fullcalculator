import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drugHalfLifeCalculator: CalculatorDefinition = {
  slug: "drug-half-life",
  title: "Drug Half-Life Elimination Calculator",
  description:
    "Free online drug half-life calculator to estimate how long a medication stays in your system.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "drug half-life",
    "elimination",
    "pharmacokinetics",
    "medication",
    "clearance",
    "washout",
    "drug testing",
    "plasma concentration",
  ],
  variants: [
    {
      id: "elimination",
      name: "Drug Elimination Timeline",
      description:
        "Calculate how much of a drug remains after a given time based on its half-life.",
      fields: [
        {
          name: "initialDose",
          label: "Initial Dose/Concentration",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "mg",
        },
        {
          name: "halfLife",
          label: "Half-Life",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "halfLifeUnit",
          label: "Half-Life Unit",
          type: "select",
          options: [
            { label: "Hours", value: "hours" },
            { label: "Minutes", value: "minutes" },
            { label: "Days", value: "days" },
          ],
        },
        {
          name: "timeElapsed",
          label: "Time Elapsed",
          type: "number",
          placeholder: "e.g. 24",
        },
        {
          name: "timeUnit",
          label: "Time Unit",
          type: "select",
          options: [
            { label: "Hours", value: "hours" },
            { label: "Minutes", value: "minutes" },
            { label: "Days", value: "days" },
          ],
        },
      ],
      calculate: (inputs) => {
        const initialDose = parseFloat(inputs.initialDose as string) || 0;
        let halfLife = parseFloat(inputs.halfLife as string) || 0;
        let timeElapsed = parseFloat(inputs.timeElapsed as string) || 0;
        const halfLifeUnit = inputs.halfLifeUnit as string;
        const timeUnit = inputs.timeUnit as string;

        if (initialDose <= 0 || halfLife <= 0 || timeElapsed < 0) return null;

        // Convert everything to hours for calculation
        const toHours = (value: number, unit: string): number => {
          if (unit === "minutes") return value / 60;
          if (unit === "days") return value * 24;
          return value;
        };

        const halfLifeHours = toHours(halfLife, halfLifeUnit);
        const timeHours = toHours(timeElapsed, timeUnit);

        // Amount remaining: A = A₀ × (1/2)^(t / t½)
        const halfLives = timeHours / halfLifeHours;
        const remaining = initialDose * Math.pow(0.5, halfLives);
        const eliminated = initialDose - remaining;
        const percentRemaining = (remaining / initialDose) * 100;
        const percentEliminated = 100 - percentRemaining;

        // Time to reach specific thresholds
        const timeTo97 = halfLifeHours * 5; // 5 half-lives ≈ 96.875% eliminated
        const timeTo99 = halfLifeHours * Math.log2(100); // ~6.64 half-lives
        const timeTo999 = halfLifeHours * Math.log2(1000); // ~9.97 half-lives

        const formatTime = (hours: number): string => {
          if (hours < 1) return formatNumber(hours * 60) + " minutes";
          if (hours < 48) return formatNumber(hours) + " hours";
          return formatNumber(hours / 24) + " days";
        };

        return {
          primary: {
            label: "Amount Remaining",
            value: formatNumber(remaining),
            suffix: "mg",
          },
          details: [
            {
              label: "Percent Remaining",
              value: formatNumber(percentRemaining) + "%",
            },
            {
              label: "Amount Eliminated",
              value: formatNumber(eliminated) + " mg",
            },
            {
              label: "Percent Eliminated",
              value: formatNumber(percentEliminated) + "%",
            },
            {
              label: "Number of Half-Lives Elapsed",
              value: formatNumber(halfLives),
            },
            {
              label: "Time to ~97% Eliminated (5 half-lives)",
              value: formatTime(timeTo97),
            },
            {
              label: "Time to ~99% Eliminated",
              value: formatTime(timeTo99),
            },
            {
              label: "Time to ~99.9% Eliminated",
              value: formatTime(timeTo999),
            },
          ],
          note: "This assumes first-order (exponential) elimination kinetics. Actual drug elimination can be affected by liver function, kidney function, age, drug interactions, and other factors.",
        };
      },
    },
    {
      id: "common-drugs",
      name: "Common Drug Half-Lives",
      description:
        "Look up the half-life of common medications and calculate elimination time.",
      fields: [
        {
          name: "drug",
          label: "Medication",
          type: "select",
          options: [
            { label: "Acetaminophen (Tylenol) - 2-3 hrs", value: "2.5" },
            { label: "Ibuprofen (Advil) - 2-4 hrs", value: "3" },
            { label: "Aspirin - 3-6 hrs (dose-dependent)", value: "4.5" },
            { label: "Amoxicillin - 1-1.5 hrs", value: "1.25" },
            { label: "Azithromycin (Z-pack) - 68 hrs", value: "68" },
            { label: "Metformin - 5-6 hrs", value: "5.5" },
            { label: "Lisinopril - 12 hrs", value: "12" },
            { label: "Atorvastatin (Lipitor) - 14 hrs", value: "14" },
            { label: "Sertraline (Zoloft) - 26 hrs", value: "26" },
            { label: "Fluoxetine (Prozac) - 1-3 days", value: "48" },
            { label: "Diazepam (Valium) - 20-100 hrs", value: "60" },
            { label: "Alprazolam (Xanax) - 6-12 hrs", value: "9" },
            { label: "Caffeine - 3-7 hrs", value: "5" },
            { label: "Alcohol (ethanol) - ~1 hr", value: "1" },
          ],
        },
        {
          name: "dose",
          label: "Dose Taken",
          type: "number",
          placeholder: "e.g. 500",
          suffix: "mg",
        },
        {
          name: "hoursAgo",
          label: "Hours Since Last Dose",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "hours",
        },
      ],
      calculate: (inputs) => {
        const halfLife = parseFloat(inputs.drug as string) || 0;
        const dose = parseFloat(inputs.dose as string) || 0;
        const hours = parseFloat(inputs.hoursAgo as string) || 0;

        if (halfLife <= 0 || dose <= 0) return null;

        const halfLives = hours / halfLife;
        const remaining = dose * Math.pow(0.5, halfLives);
        const percentRemaining = (remaining / dose) * 100;
        const timeTo97 = halfLife * 5;

        const formatTime = (h: number): string => {
          if (h < 1) return formatNumber(h * 60) + " min";
          if (h < 48) return formatNumber(h) + " hrs";
          return formatNumber(h / 24) + " days";
        };

        return {
          primary: {
            label: "Amount Remaining",
            value: formatNumber(remaining),
            suffix: "mg",
          },
          details: [
            { label: "Percent Remaining", value: formatNumber(percentRemaining) + "%" },
            { label: "Half-Life", value: formatTime(halfLife) },
            { label: "Half-Lives Elapsed", value: formatNumber(halfLives) },
            { label: "Effectively Cleared (5 half-lives)", value: formatTime(timeTo97) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["caffeine-calc", "tylenol-dosage", "pediatric-dosage"],
  faq: [
    {
      question: "What is a drug's half-life?",
      answer:
        "A drug's half-life is the time it takes for the concentration of the drug in the body to decrease by half. After one half-life, 50% remains; after two half-lives, 25% remains; after five half-lives, less than 3.2% remains, which is considered effectively eliminated.",
    },
    {
      question: "How many half-lives until a drug is out of your system?",
      answer:
        "It takes approximately 5 half-lives for a drug to be considered effectively eliminated from the body (96.875% cleared). For practical purposes, 5-7 half-lives is the standard pharmacological washout period.",
    },
    {
      question: "Does half-life affect how often I take medication?",
      answer:
        "Yes. Drugs with short half-lives (e.g., ibuprofen at 2-4 hours) need to be taken more frequently, while drugs with long half-lives (e.g., fluoxetine at 1-3 days) can be taken once daily. Dosing intervals are typically designed to maintain therapeutic drug levels.",
    },
  ],
  formula:
    "Amount Remaining = Initial_Dose × (1/2)^(Time / Half_Life). Percent Remaining = (Remaining / Initial) × 100. Time to ~97% elimination = 5 × Half_Life.",
};
