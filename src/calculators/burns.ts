import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const burnsCalculator: CalculatorDefinition = {
  slug: "burns-calculator",
  title: "Burns Calculator",
  description:
    "Free burns calculator using the Rule of Nines and Parkland formula. Estimate fluid resuscitation needs based on TBSA and body weight.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["burns calculator", "Parkland formula", "Rule of Nines", "TBSA", "fluid resuscitation"],
  variants: [
    {
      id: "parkland",
      name: "Parkland Formula",
      fields: [
        {
          name: "tbsa",
          label: "Total Body Surface Area Burned (%)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "weight",
          label: "Body Weight (kg)",
          type: "number",
          placeholder: "e.g. 70",
        },
      ],
      calculate: (inputs) => {
        const tbsa = inputs.tbsa as number;
        const weight = inputs.weight as number;
        if (!tbsa || !weight) return null;

        const totalFluid24hr = 4 * weight * tbsa; // mL in 24 hours
        const first8hr = totalFluid24hr / 2;
        const next16hr = totalFluid24hr / 2;
        const hourlyFirst8 = first8hr / 8;
        const hourlyNext16 = next16hr / 16;

        let severity: string;
        if (tbsa < 10) {
          severity = "Minor burn";
        } else if (tbsa < 20) {
          severity = "Moderate burn";
        } else if (tbsa < 40) {
          severity = "Major burn";
        } else {
          severity = "Critical burn";
        }

        return {
          primary: {
            label: "24-Hour Fluid Requirement",
            value: `${formatNumber(totalFluid24hr, 0)} mL`,
          },
          details: [
            { label: "Burn Severity", value: severity },
            { label: "TBSA Burned", value: `${formatNumber(tbsa, 0)}%` },
            { label: "Body Weight", value: `${formatNumber(weight, 1)} kg` },
            { label: "First 8 Hours", value: `${formatNumber(first8hr, 0)} mL (${formatNumber(hourlyFirst8, 0)} mL/hr)` },
            { label: "Next 16 Hours", value: `${formatNumber(next16hr, 0)} mL (${formatNumber(hourlyNext16, 0)} mL/hr)` },
            { label: "Fluid Type", value: "Lactated Ringer's solution" },
          ],
        };
      },
    },
    {
      id: "ruleOfNines",
      name: "Rule of Nines Reference",
      fields: [
        {
          name: "head",
          label: "Head & Neck (%)",
          type: "number",
          placeholder: "max 9",
        },
        {
          name: "chest",
          label: "Anterior Trunk (%)",
          type: "number",
          placeholder: "max 18",
        },
        {
          name: "back",
          label: "Posterior Trunk (%)",
          type: "number",
          placeholder: "max 18",
        },
        {
          name: "leftArm",
          label: "Left Arm (%)",
          type: "number",
          placeholder: "max 9",
        },
        {
          name: "rightArm",
          label: "Right Arm (%)",
          type: "number",
          placeholder: "max 9",
        },
        {
          name: "leftLeg",
          label: "Left Leg (%)",
          type: "number",
          placeholder: "max 18",
        },
        {
          name: "rightLeg",
          label: "Right Leg (%)",
          type: "number",
          placeholder: "max 18",
        },
        {
          name: "perineum",
          label: "Perineum (%)",
          type: "number",
          placeholder: "max 1",
        },
      ],
      calculate: (inputs) => {
        const head = (inputs.head as number) || 0;
        const chest = (inputs.chest as number) || 0;
        const back = (inputs.back as number) || 0;
        const leftArm = (inputs.leftArm as number) || 0;
        const rightArm = (inputs.rightArm as number) || 0;
        const leftLeg = (inputs.leftLeg as number) || 0;
        const rightLeg = (inputs.rightLeg as number) || 0;
        const perineum = (inputs.perineum as number) || 0;

        const totalTBSA = head + chest + back + leftArm + rightArm + leftLeg + rightLeg + perineum;

        if (totalTBSA === 0) return null;

        return {
          primary: {
            label: "Total TBSA Burned",
            value: `${formatNumber(totalTBSA, 0)}%`,
          },
          details: [
            { label: "Head & Neck", value: `${formatNumber(head, 0)}% (of 9%)` },
            { label: "Anterior Trunk", value: `${formatNumber(chest, 0)}% (of 18%)` },
            { label: "Posterior Trunk", value: `${formatNumber(back, 0)}% (of 18%)` },
            { label: "Left Arm", value: `${formatNumber(leftArm, 0)}% (of 9%)` },
            { label: "Right Arm", value: `${formatNumber(rightArm, 0)}% (of 9%)` },
            { label: "Left Leg", value: `${formatNumber(leftLeg, 0)}% (of 18%)` },
            { label: "Right Leg", value: `${formatNumber(rightLeg, 0)}% (of 18%)` },
            { label: "Perineum", value: `${formatNumber(perineum, 0)}% (of 1%)` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["body-surface-area-calculator", "iv-drip-rate-calculator"],
  faq: [
    {
      question: "What is the Parkland formula?",
      answer:
        "The Parkland formula estimates fluid resuscitation for burn patients: Total fluid (mL) = 4 \u00D7 body weight (kg) \u00D7 %TBSA burned. Half is given in the first 8 hours, and the remaining half over the next 16 hours.",
    },
    {
      question: "What is the Rule of Nines?",
      answer:
        "The Rule of Nines divides the adult body into regions each representing 9% (or multiples) of total body surface area: head 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, and perineum 1%.",
    },
  ],
  formula:
    "Parkland: Fluid (mL) = 4 \u00D7 Weight (kg) \u00D7 TBSA%. First 8 hrs: 50% of total. Next 16 hrs: remaining 50%.",
};
