import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fluidBalanceCalculator: CalculatorDefinition = {
  slug: "fluid-balance-calculator",
  title: "Fluid Balance Calculator",
  description:
    "Free fluid balance calculator. Track fluid intake and output (I&O) for clinical monitoring. Calculate net fluid balance and assess hydration status.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "fluid balance",
    "intake output",
    "I and O",
    "fluid status",
    "hydration monitoring",
    "clinical fluid balance",
    "net fluid balance",
  ],
  variants: [
    {
      id: "io-balance",
      name: "Fluid Intake & Output Balance",
      description: "Calculate net fluid balance from intake and output totals",
      fields: [
        {
          name: "oralIntake",
          label: "Oral Fluid Intake",
          type: "number",
          placeholder: "e.g. 1500",
          suffix: "mL",
          min: 0,
          max: 10000,
        },
        {
          name: "ivIntake",
          label: "IV Fluid Intake",
          type: "number",
          placeholder: "e.g. 1000",
          suffix: "mL",
          min: 0,
          max: 10000,
        },
        {
          name: "otherIntake",
          label: "Other Intake (tube feeds, blood, etc.)",
          type: "number",
          placeholder: "e.g. 0",
          suffix: "mL",
          min: 0,
          max: 10000,
        },
        {
          name: "urineOutput",
          label: "Urine Output",
          type: "number",
          placeholder: "e.g. 1200",
          suffix: "mL",
          min: 0,
          max: 10000,
        },
        {
          name: "otherOutput",
          label: "Other Output (drains, emesis, stool, etc.)",
          type: "number",
          placeholder: "e.g. 200",
          suffix: "mL",
          min: 0,
          max: 10000,
        },
        {
          name: "weight",
          label: "Patient Weight (for urine output assessment)",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 1,
          max: 300,
        },
        {
          name: "hours",
          label: "Time Period",
          type: "number",
          placeholder: "e.g. 24",
          suffix: "hours",
          min: 1,
          max: 72,
        },
      ],
      calculate: (inputs) => {
        const oral = (inputs.oralIntake as number) || 0;
        const iv = (inputs.ivIntake as number) || 0;
        const other = (inputs.otherIntake as number) || 0;
        const urine = (inputs.urineOutput as number) || 0;
        const otherOut = (inputs.otherOutput as number) || 0;
        const weight = inputs.weight as number;
        const hours = inputs.hours as number;
        if (!hours) return null;

        const totalIntake = oral + iv + other;
        const totalOutput = urine + otherOut;
        // Insensible losses estimate: ~10 mL/kg/day for adults
        const insensibleLoss = weight ? (weight * 10 * hours) / 24 : 0;
        const adjustedOutput = totalOutput + insensibleLoss;
        const netBalance = totalIntake - adjustedOutput;
        const simpleBalance = totalIntake - totalOutput;

        // Urine output assessment
        let urineAssessment = "";
        if (weight && hours) {
          const urinePerKgPerHr = urine / weight / hours;
          if (urinePerKgPerHr < 0.5) urineAssessment = "Oliguria (<0.5 mL/kg/hr) — evaluate for AKI, dehydration";
          else if (urinePerKgPerHr < 1.0) urineAssessment = "Low-normal (0.5-1.0 mL/kg/hr)";
          else if (urinePerKgPerHr < 2.0) urineAssessment = "Normal (1.0-2.0 mL/kg/hr)";
          else urineAssessment = "High urine output (>2.0 mL/kg/hr) — monitor for polyuria";
        }

        let balanceAssessment: string;
        if (simpleBalance > 1000) balanceAssessment = "Significantly positive — risk of fluid overload";
        else if (simpleBalance > 500) balanceAssessment = "Moderately positive";
        else if (simpleBalance > -500) balanceAssessment = "Approximately balanced";
        else if (simpleBalance > -1000) balanceAssessment = "Moderately negative";
        else balanceAssessment = "Significantly negative — risk of dehydration";

        return {
          primary: { label: "Net Balance (measured)", value: `${simpleBalance > 0 ? "+" : ""}${formatNumber(simpleBalance, 0)} mL` },
          details: [
            { label: "Total intake", value: `${formatNumber(totalIntake, 0)} mL` },
            { label: "Total measured output", value: `${formatNumber(totalOutput, 0)} mL` },
            { label: "Net balance (measured)", value: `${simpleBalance > 0 ? "+" : ""}${formatNumber(simpleBalance, 0)} mL` },
            ...(weight ? [{ label: "Estimated insensible losses", value: `~${formatNumber(insensibleLoss, 0)} mL` }] : []),
            ...(weight ? [{ label: "Adjusted net balance", value: `${netBalance > 0 ? "+" : ""}${formatNumber(netBalance, 0)} mL` }] : []),
            { label: "Assessment", value: balanceAssessment },
            ...(urineAssessment ? [{ label: "Urine output assessment", value: urineAssessment }] : []),
          ],
          note: "Insensible losses (skin evaporation, respiration) are approximately 10 mL/kg/day in adults but increase with fever, burns, and mechanical ventilation. This is an estimation tool — clinical assessment including physical exam, weight trends, and labs is essential.",
        };
      },
    },
    {
      id: "maintenance",
      name: "Maintenance Fluid Calculation (4-2-1 Rule)",
      description: "Calculate maintenance IV fluid rate using the Holliday-Segar method",
      fields: [
        {
          name: "weight",
          label: "Patient Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 1,
          max: 300,
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        if (!weight) return null;

        // 4-2-1 rule (Holliday-Segar)
        let hourlyRate: number;
        if (weight <= 10) {
          hourlyRate = weight * 4;
        } else if (weight <= 20) {
          hourlyRate = 40 + (weight - 10) * 2;
        } else {
          hourlyRate = 60 + (weight - 20) * 1;
        }

        const dailyVolume = hourlyRate * 24;

        return {
          primary: { label: "Maintenance Rate", value: `${formatNumber(hourlyRate, 0)} mL/hr` },
          details: [
            { label: "Hourly rate", value: `${formatNumber(hourlyRate, 0)} mL/hr` },
            { label: "Daily volume", value: `${formatNumber(dailyVolume, 0)} mL/day` },
            { label: "Patient weight", value: `${weight} kg` },
            { label: "Method", value: "4-2-1 rule (Holliday-Segar)" },
            { label: "Rule", value: "4 mL/kg/hr for first 10 kg + 2 mL/kg/hr for next 10 kg + 1 mL/kg/hr for each kg above 20" },
          ],
          note: "The 4-2-1 rule provides a starting point for maintenance IV fluids. Adjust for clinical conditions: fever (increase 10% per degree C above 37), dehydration, renal failure, heart failure, etc. Always individualize therapy.",
        };
      },
    },
  ],
  relatedSlugs: ["iv-flow-rate-calculator", "blood-volume-calculator", "hydration-calculator"],
  faq: [
    {
      question: "What is fluid balance?",
      answer:
        "Fluid balance is the difference between total fluid intake and total fluid output over a period (usually 24 hours). A positive balance means more intake than output; negative means more output than intake.",
    },
    {
      question: "What is the 4-2-1 rule?",
      answer:
        "The 4-2-1 rule (Holliday-Segar method) calculates maintenance IV fluid rates: 4 mL/kg/hr for the first 10 kg, 2 mL/kg/hr for the next 10 kg, and 1 mL/kg/hr for each kg above 20 kg.",
    },
    {
      question: "What is oliguria?",
      answer:
        "Oliguria is urine output less than 0.5 mL/kg/hr in adults (or <1 mL/kg/hr in children). It may indicate dehydration, acute kidney injury, or decreased renal perfusion. It requires clinical evaluation.",
    },
    {
      question: "What are insensible losses?",
      answer:
        "Insensible losses are fluid lost through skin evaporation and respiration that cannot be measured. They average about 10 mL/kg/day in adults but increase with fever, tachypnea, burns, and low humidity.",
    },
  ],
  formula:
    "Net balance = Total intake - Total output | Adjusted balance = Total intake - (Measured output + Insensible losses) | Insensible losses ~10 mL/kg/day | 4-2-1 rule: 4 mL/kg/hr (first 10 kg) + 2 mL/kg/hr (next 10 kg) + 1 mL/kg/hr (remaining kg)",
};
