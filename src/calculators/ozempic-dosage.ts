import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ozempicDosageCalculator: CalculatorDefinition = {
  slug: "ozempic-dosage",
  title: "GLP-1 / Ozempic Dosage Titration Calculator",
  description:
    "Free online Ozempic (semaglutide) dosage titration schedule calculator for diabetes and weight management.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "ozempic",
    "semaglutide",
    "GLP-1",
    "tirzepatide",
    "mounjaro",
    "wegovy",
    "weight loss",
    "diabetes",
    "titration",
  ],
  variants: [
    {
      id: "ozempic-titration",
      name: "Ozempic (Semaglutide) Titration Schedule",
      description:
        "View the recommended Ozempic dose titration schedule and track your current week.",
      fields: [
        {
          name: "indication",
          label: "Indication",
          type: "select",
          options: [
            { label: "Type 2 Diabetes (Ozempic)", value: "diabetes" },
            { label: "Weight Management (Wegovy)", value: "weight" },
          ],
        },
        {
          name: "currentWeek",
          label: "Current Week of Treatment",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "weeks",
          min: 1,
        },
        {
          name: "currentDose",
          label: "Current Weekly Dose",
          type: "select",
          options: [
            { label: "0.25 mg", value: "0.25" },
            { label: "0.5 mg", value: "0.5" },
            { label: "1.0 mg", value: "1.0" },
            { label: "1.7 mg", value: "1.7" },
            { label: "2.0 mg", value: "2.0" },
            { label: "2.4 mg", value: "2.4" },
          ],
        },
        {
          name: "weightKg",
          label: "Current Weight (optional)",
          type: "number",
          placeholder: "e.g. 95",
          suffix: "kg",
        },
      ],
      calculate: (inputs) => {
        const indication = inputs.indication as string;
        const currentWeek = parseFloat(inputs.currentWeek as string) || 1;
        const currentDose = parseFloat(inputs.currentDose as string) || 0.25;
        const weight = parseFloat(inputs.weightKg as string) || 0;

        // Titration schedules
        let schedule: { weeks: string; dose: number; note: string }[];

        if (indication === "diabetes") {
          // Ozempic for T2DM
          schedule = [
            { weeks: "Weeks 1-4", dose: 0.25, note: "Initiation dose (not therapeutic)" },
            { weeks: "Weeks 5-8", dose: 0.5, note: "First therapeutic dose" },
            { weeks: "Weeks 9-12", dose: 1.0, note: "Standard maintenance dose" },
            { weeks: "Week 13+", dose: 2.0, note: "Maximum dose if needed" },
          ];
        } else {
          // Wegovy for weight management
          schedule = [
            { weeks: "Weeks 1-4", dose: 0.25, note: "Initiation dose" },
            { weeks: "Weeks 5-8", dose: 0.5, note: "Titration" },
            { weeks: "Weeks 9-12", dose: 1.0, note: "Titration" },
            { weeks: "Weeks 13-16", dose: 1.7, note: "Titration" },
            { weeks: "Week 17+", dose: 2.4, note: "Maintenance dose" },
          ];
        }

        // Determine expected dose for current week
        let expectedDose: number;
        if (indication === "diabetes") {
          if (currentWeek <= 4) expectedDose = 0.25;
          else if (currentWeek <= 8) expectedDose = 0.5;
          else if (currentWeek <= 12) expectedDose = 1.0;
          else expectedDose = 2.0;
        } else {
          if (currentWeek <= 4) expectedDose = 0.25;
          else if (currentWeek <= 8) expectedDose = 0.5;
          else if (currentWeek <= 12) expectedDose = 1.0;
          else if (currentWeek <= 16) expectedDose = 1.7;
          else expectedDose = 2.4;
        }

        const onSchedule = Math.abs(currentDose - expectedDose) < 0.01;

        // Next dose escalation
        let nextDoseInfo = "At maximum dose";
        const maxDose = indication === "diabetes" ? 2.0 : 2.4;
        if (currentDose < maxDose) {
          const nextStep = schedule.find((s) => s.dose > currentDose);
          if (nextStep) {
            nextDoseInfo = `${nextStep.dose} mg - ${nextStep.weeks}`;
          }
        }

        // Monthly cost estimate (approximate)
        const monthlyCost = currentDose <= 1.0 ? 900 : 1000;

        const details = [
          { label: "Expected Dose for Week " + formatNumber(currentWeek), value: formatNumber(expectedDose) + " mg" },
          { label: "On Schedule?", value: onSchedule ? "Yes" : "No - consult prescriber" },
          { label: "Next Dose Escalation", value: nextDoseInfo },
          { label: "Maximum Dose", value: formatNumber(maxDose) + " mg/week" },
          { label: "Administration", value: "Subcutaneous injection, once weekly, same day each week" },
          { label: "Approximate Monthly Cost", value: "$" + formatNumber(monthlyCost) + " (before insurance)" },
        ];

        if (weight > 0) {
          const dosePerKg = currentDose / weight;
          details.push({ label: "Current Dose per kg", value: formatNumber(dosePerKg * 1000) + " mcg/kg" });
        }

        // Schedule summary
        for (const step of schedule) {
          const isCurrent = Math.abs(step.dose - currentDose) < 0.01;
          details.push({
            label: step.weeks,
            value: step.dose + " mg" + (isCurrent ? " (current)" : "") + " - " + step.note,
          });
        }

        return {
          primary: {
            label: "Current Weekly Dose",
            value: formatNumber(currentDose),
            suffix: "mg",
          },
          details,
          note: "This follows the FDA-approved titration schedule. Dose adjustments should only be made under medical supervision. Do not skip titration steps as this increases the risk of GI side effects.",
        };
      },
    },
  ],
  relatedSlugs: ["homa-ir-calc", "body-surface-area", "life-expectancy-calc"],
  faq: [
    {
      question: "What is the Ozempic titration schedule?",
      answer:
        "Ozempic (semaglutide for diabetes) starts at 0.25 mg weekly for 4 weeks (initiation), then increases to 0.5 mg weekly. After at least 4 weeks at 0.5 mg, it can be increased to 1.0 mg, then optionally to 2.0 mg. Each step should be maintained for at least 4 weeks before escalating.",
    },
    {
      question: "What is the difference between Ozempic and Wegovy?",
      answer:
        "Both contain semaglutide. Ozempic is FDA-approved for type 2 diabetes (max 2.0 mg/week), while Wegovy is approved for chronic weight management (max 2.4 mg/week). Wegovy has a more gradual 5-step titration schedule to minimize GI side effects at the higher maintenance dose.",
    },
    {
      question: "What are common side effects of GLP-1 medications?",
      answer:
        "The most common side effects are gastrointestinal: nausea (15-40%), vomiting, diarrhea, constipation, and abdominal pain. These are most common during dose titration and usually improve over time. Gradual dose escalation helps minimize these effects. Rare but serious risks include pancreatitis and medullary thyroid carcinoma (contraindicated in patients with MEN2 or family history of medullary thyroid cancer).",
    },
  ],
  formula:
    "Ozempic titration: 0.25 mg × 4 weeks → 0.5 mg × 4 weeks → 1.0 mg → optional 2.0 mg. Wegovy titration: 0.25 mg → 0.5 mg → 1.0 mg → 1.7 mg → 2.4 mg maintenance, each step for 4 weeks.",
};
