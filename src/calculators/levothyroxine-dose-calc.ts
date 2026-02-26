import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const levothyroxineDoseCalculator: CalculatorDefinition = {
  slug: "levothyroxine-dose-calculator",
  title: "Levothyroxine Dosage Calculator",
  description:
    "Estimate levothyroxine (Synthroid) dosing based on body weight and indication. Calculate initial thyroid replacement doses for hypothyroidism and TSH suppression.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "levothyroxine dosage calculator",
    "synthroid dosing",
    "thyroid medication",
    "hypothyroidism dose",
    "T4 replacement",
    "thyroid dose by weight",
    "TSH suppression",
  ],
  variants: [
    {
      id: "full-replacement",
      name: "Full Replacement Dosing",
      description: "Calculate levothyroxine dose for full thyroid replacement based on body weight",
      fields: [
        {
          name: "weight",
          label: "Body Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 20,
          max: 250,
          step: 0.5,
        },
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "Young adult (under 50, no cardiac disease)", value: "young" },
            { label: "Middle-aged (50-65)", value: "middle" },
            { label: "Elderly (over 65) or cardiac disease", value: "elderly" },
          ],
        },
        {
          name: "indication",
          label: "Indication",
          type: "select",
          options: [
            { label: "Hypothyroidism (primary)", value: "hypo" },
            { label: "Post-thyroidectomy (total)", value: "postop" },
            { label: "TSH Suppression (thyroid cancer)", value: "suppress" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const ageGroup = inputs.ageGroup as string;
        const indication = inputs.indication as string;

        if (isNaN(weight) || !ageGroup || !indication) return null;

        let dosePerKg: number;
        let startingDose: number;
        let targetDose: number;

        // Full replacement: 1.6 mcg/kg/day (range 1.5-1.8)
        // TSH suppression: 2.0-2.5 mcg/kg/day
        if (indication === "suppress") {
          dosePerKg = 2.2;
          targetDose = dosePerKg * weight;
        } else if (indication === "postop") {
          dosePerKg = 1.7;
          targetDose = dosePerKg * weight;
        } else {
          dosePerKg = 1.6;
          targetDose = dosePerKg * weight;
        }

        // Starting dose based on age/cardiac status
        if (ageGroup === "young") {
          startingDose = targetDose; // Can start at full dose
        } else if (ageGroup === "middle") {
          startingDose = Math.min(50, targetDose); // Start 50 mcg or less
        } else {
          startingDose = 25; // Start very low for elderly/cardiac
        }

        // Round to nearest available tablet strength
        const availableStrengths = [25, 50, 75, 88, 100, 112, 125, 137, 150, 175, 200, 300];
        let nearestStrength = availableStrengths[0];
        let minDiff = Math.abs(targetDose - availableStrengths[0]);
        for (const s of availableStrengths) {
          if (Math.abs(targetDose - s) < minDiff) {
            minDiff = Math.abs(targetDose - s);
            nearestStrength = s;
          }
        }

        let nearestStarting = availableStrengths[0];
        minDiff = Math.abs(startingDose - availableStrengths[0]);
        for (const s of availableStrengths) {
          if (Math.abs(startingDose - s) < minDiff) {
            minDiff = Math.abs(startingDose - s);
            nearestStarting = s;
          }
        }

        const titrationNote = ageGroup === "young"
          ? "Can start at full replacement dose. Recheck TSH in 6-8 weeks."
          : `Start at ${formatNumber(nearestStarting, 0)} mcg/day, increase by 12.5-25 mcg every 4-6 weeks until target TSH reached.`;

        return {
          primary: { label: "Target Dose", value: `${formatNumber(targetDose, 0)} mcg/day` },
          details: [
            { label: "Weight", value: `${formatNumber(weight, 1)} kg` },
            { label: "Dose Calculation", value: `${formatNumber(dosePerKg, 1)} mcg/kg/day` },
            { label: "Calculated Target", value: `${formatNumber(targetDose, 0)} mcg/day` },
            { label: "Nearest Tablet Strength", value: `${formatNumber(nearestStrength, 0)} mcg` },
            { label: "Starting Dose", value: `${formatNumber(nearestStarting, 0)} mcg/day` },
            { label: "Titration", value: titrationNote },
            { label: "Available Strengths", value: "25, 50, 75, 88, 100, 112, 125, 137, 150, 175, 200, 300 mcg" },
          ],
          note: "Take on an empty stomach, 30-60 minutes before breakfast. Recheck TSH every 6-8 weeks during titration. Separate from calcium, iron, and antacids by 4 hours. This is an estimate — your prescriber will individualize your dose.",
        };
      },
    },
    {
      id: "dose-adjustment",
      name: "TSH-Based Dose Adjustment",
      description: "Estimate dose adjustment based on current TSH level",
      fields: [
        {
          name: "currentDose",
          label: "Current Levothyroxine Dose",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "mcg",
          min: 12.5,
          max: 400,
          step: 12.5,
        },
        {
          name: "tshLevel",
          label: "Current TSH Level",
          type: "number",
          placeholder: "e.g. 6.5",
          suffix: "mIU/L",
          min: 0.01,
          max: 100,
          step: 0.01,
        },
        {
          name: "target",
          label: "TSH Target",
          type: "select",
          options: [
            { label: "0.5 - 2.5 mIU/L (standard)", value: "standard" },
            { label: "0.1 - 0.5 mIU/L (moderate suppression)", value: "moderate" },
            { label: "< 0.1 mIU/L (full suppression)", value: "full" },
          ],
        },
      ],
      calculate: (inputs) => {
        const currentDose = parseFloat(inputs.currentDose as string);
        const tshLevel = parseFloat(inputs.tshLevel as string);
        const target = inputs.target as string;

        if (isNaN(currentDose) || isNaN(tshLevel) || !target) return null;

        let targetLow: number;
        let targetHigh: number;
        if (target === "full") { targetLow = 0; targetHigh = 0.1; }
        else if (target === "moderate") { targetLow = 0.1; targetHigh = 0.5; }
        else { targetLow = 0.5; targetHigh = 2.5; }

        let adjustment: string;
        let newDose: number;
        let action: string;

        if (tshLevel > targetHigh) {
          // TSH too high — need more levothyroxine
          if (tshLevel > 10) {
            newDose = currentDose + 25;
            adjustment = "Increase by 25 mcg";
          } else {
            newDose = currentDose + 12.5;
            adjustment = "Increase by 12.5-25 mcg";
          }
          action = "TSH above target — dose increase recommended";
        } else if (tshLevel < targetLow) {
          // TSH too low — reduce levothyroxine
          if (tshLevel < 0.05 && target === "standard") {
            newDose = currentDose - 25;
            adjustment = "Decrease by 25 mcg";
          } else {
            newDose = currentDose - 12.5;
            adjustment = "Decrease by 12.5-25 mcg";
          }
          action = "TSH below target — dose decrease recommended";
        } else {
          newDose = currentDose;
          adjustment = "No change needed";
          action = "TSH within target range — maintain current dose";
        }

        newDose = Math.max(newDose, 12.5);

        return {
          primary: { label: "Suggested Adjustment", value: adjustment },
          details: [
            { label: "Current Dose", value: `${formatNumber(currentDose, 0)} mcg/day` },
            { label: "Current TSH", value: `${formatNumber(tshLevel, 2)} mIU/L` },
            { label: "Target TSH Range", value: `${formatNumber(targetLow, 1)} - ${formatNumber(targetHigh, 1)} mIU/L` },
            { label: "Action", value: action },
            { label: "Suggested New Dose", value: `${formatNumber(newDose, 0)} mcg/day` },
          ],
          note: "Dose adjustments should always be made by your prescriber. TSH should be rechecked 6-8 weeks after any dose change. Many factors affect absorption (food, medications, GI conditions).",
        };
      },
    },
  ],
  relatedSlugs: ["ibuprofen-dosage-calculator", "adderall-dosage-calculator", "a1c-calculator"],
  faq: [
    {
      question: "How is levothyroxine dose calculated?",
      answer:
        "Full thyroid replacement is typically dosed at 1.6 mcg/kg/day of ideal body weight. For TSH suppression in thyroid cancer, higher doses of 2.0-2.5 mcg/kg/day may be needed. Elderly patients and those with cardiac disease start at lower doses (25-50 mcg) with gradual titration.",
    },
    {
      question: "How should I take levothyroxine?",
      answer:
        "Take on an empty stomach, 30-60 minutes before breakfast (or at bedtime, 3+ hours after eating). Separate from calcium, iron, antacids, and other medications by at least 4 hours. Take consistently at the same time daily.",
    },
    {
      question: "How often should TSH be checked?",
      answer:
        "TSH should be rechecked 6-8 weeks after starting or changing the dose. Once stable, check TSH every 6-12 months. More frequent monitoring during pregnancy, after significant weight changes, or when starting interacting medications.",
    },
  ],
  formula:
    "Full Replacement: 1.6 mcg/kg/day | Post-thyroidectomy: 1.7 mcg/kg/day | TSH Suppression: 2.0-2.5 mcg/kg/day | Elderly/cardiac: Start 25 mcg, titrate by 12.5-25 mcg every 4-6 weeks",
};
