import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mounjaroDosageCalculator: CalculatorDefinition = {
  slug: "mounjaro-dosage-calculator",
  title: "Mounjaro Dosage Calculator",
  description:
    "Calculate your Mounjaro (tirzepatide) dosing schedule, titration timeline, and pen supply needs. Covers all dose levels from 2.5mg to 15mg.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "mounjaro dosage calculator",
    "tirzepatide dosing schedule",
    "mounjaro titration",
    "mounjaro dose schedule",
    "zepbound dosage",
  ],
  variants: [
    {
      id: "titration",
      name: "Titration Schedule",
      description: "Full dose escalation timeline from 2.5mg to target dose",
      fields: [
        {
          name: "targetDose",
          label: "Target Dose",
          type: "select",
          options: [
            { label: "5 mg", value: "5" },
            { label: "7.5 mg", value: "7.5" },
            { label: "10 mg", value: "10" },
            { label: "12.5 mg", value: "12.5" },
            { label: "15 mg", value: "15" },
          ],
          defaultValue: "15",
        },
        {
          name: "startDate",
          label: "Weeks Since Starting",
          type: "number",
          placeholder: "e.g. 0",
          suffix: "weeks",
          min: 0,
          max: 100,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const targetDose = parseFloat(inputs.targetDose as string);
        const weeksSinceStart = parseFloat(inputs.startDate as string) || 0;
        if (!targetDose) return null;

        // Mounjaro titration: each dose level is 4 weeks minimum
        const doseSteps = [2.5, 5, 7.5, 10, 12.5, 15];
        const targetIndex = doseSteps.indexOf(targetDose);
        const totalWeeks = (targetIndex + 1) * 4;
        const totalPens = Math.ceil(totalWeeks / 4) * 4; // 4 pens per box (1 month)

        let currentDose = 2.5;
        for (let i = 0; i < doseSteps.length; i++) {
          if (weeksSinceStart >= (i + 1) * 4 && doseSteps[i + 1] && doseSteps[i + 1] <= targetDose) {
            currentDose = doseSteps[i + 1];
          } else if (weeksSinceStart < (i + 1) * 4) {
            currentDose = doseSteps[i];
            break;
          }
        }

        const weeksRemaining = Math.max(0, totalWeeks - weeksSinceStart);
        const pensNeeded = Math.ceil(weeksRemaining / 4);

        return {
          primary: { label: "Current Dose Level", value: `${formatNumber(currentDose, 1)} mg` },
          details: [
            { label: "Target Dose", value: `${formatNumber(targetDose, 1)} mg` },
            { label: "Weeks to Reach Target", value: `${formatNumber(totalWeeks, 0)} weeks` },
            { label: "Weeks Remaining", value: `${formatNumber(weeksRemaining, 0)} weeks` },
            { label: "Monthly Boxes Needed", value: formatNumber(pensNeeded, 0) },
            { label: "Injection Frequency", value: "Once weekly" },
          ],
          note: "Standard titration is 4 weeks at each dose. Your provider may adjust timing based on tolerability. Each box contains 4 single-dose pens (1 month supply).",
        };
      },
    },
    {
      id: "supply",
      name: "Supply Calculator",
      description: "Calculate how many pens/boxes you need",
      fields: [
        {
          name: "currentDose",
          label: "Current Dose",
          type: "select",
          options: [
            { label: "2.5 mg", value: "2.5" },
            { label: "5 mg", value: "5" },
            { label: "7.5 mg", value: "7.5" },
            { label: "10 mg", value: "10" },
            { label: "12.5 mg", value: "12.5" },
            { label: "15 mg", value: "15" },
          ],
          defaultValue: "5",
        },
        {
          name: "months",
          label: "Months of Supply",
          type: "number",
          placeholder: "e.g. 3",
          suffix: "months",
          min: 1,
          max: 24,
        },
      ],
      calculate: (inputs) => {
        const dose = parseFloat(inputs.currentDose as string);
        const months = parseFloat(inputs.months as string);
        if (!dose || !months) return null;

        const totalInjections = months * 4; // ~4 per month (weekly)
        const totalBoxes = Math.ceil(months); // 1 box = 4 pens = 1 month
        const totalPens = totalInjections;

        return {
          primary: { label: "Total Pens Needed", value: formatNumber(totalPens, 0) },
          details: [
            { label: "Monthly Boxes", value: formatNumber(totalBoxes, 0) },
            { label: "Dose per Injection", value: `${formatNumber(dose, 1)} mg` },
            { label: "Total Injections", value: formatNumber(totalInjections, 0) },
            { label: "Total mg Used", value: `${formatNumber(dose * totalInjections, 1)} mg` },
          ],
          note: "Each Mounjaro box contains 4 single-dose pens. Pens are used once weekly. Do not share pens between patients.",
        };
      },
    },
  ],
  relatedSlugs: ["glp1-weight-loss-calculator", "wegovy-cost-calculator", "bmi-calculator"],
  faq: [
    {
      question: "What is the standard Mounjaro titration schedule?",
      answer:
        "Mounjaro starts at 2.5mg weekly for 4 weeks, then increases to 5mg. After that, dose may increase by 2.5mg every 4 weeks (5mg, 7.5mg, 10mg, 12.5mg, 15mg) based on response and tolerability. Maximum dose is 15mg weekly.",
    },
    {
      question: "Can you skip doses when titrating Mounjaro?",
      answer:
        "You should not skip dose levels during titration. Each 4-week period allows your body to adjust. If you miss a dose, take it within 4 days; otherwise skip and take the next scheduled dose. Never double up on doses.",
    },
    {
      question: "How long does a Mounjaro pen last?",
      answer:
        "Each Mounjaro pen is a single-use device containing one dose. A box of 4 pens lasts one month (4 weekly injections). Unused pens should be refrigerated and used before the expiration date.",
    },
  ],
  formula:
    "Titration Weeks = (Target Dose Step Index + 1) x 4 weeks | Pens Needed = Treatment Months x 4",
};
