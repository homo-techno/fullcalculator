import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const melatoninDosageCalculator: CalculatorDefinition = {
  slug: "melatonin-dosage",
  title: "Melatonin Dosage Calculator",
  description:
    "Free online melatonin dosage calculator by age to help determine appropriate melatonin supplementation.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "melatonin",
    "sleep",
    "insomnia",
    "dosage",
    "sleep aid",
    "circadian rhythm",
    "jet lag",
    "supplement",
  ],
  variants: [
    {
      id: "melatonin-dose",
      name: "Melatonin Dosage by Age",
      description:
        "Determine an appropriate melatonin dose based on age and purpose.",
      fields: [
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "Child (3-5 years)", value: "child_young" },
            { label: "Child (6-12 years)", value: "child_older" },
            { label: "Teenager (13-17 years)", value: "teen" },
            { label: "Adult (18-64 years)", value: "adult" },
            { label: "Older Adult (65+ years)", value: "senior" },
          ],
        },
        {
          name: "purpose",
          label: "Purpose",
          type: "select",
          options: [
            { label: "Difficulty falling asleep", value: "onset" },
            { label: "Jet lag", value: "jetlag" },
            { label: "Shift work", value: "shift" },
            { label: "General sleep quality", value: "general" },
          ],
        },
        {
          name: "previousUse",
          label: "Previous Melatonin Use",
          type: "select",
          options: [
            { label: "First time / New user", value: "new" },
            { label: "Used before at low dose", value: "low" },
            { label: "Regular user", value: "regular" },
          ],
        },
        {
          name: "weightKg",
          label: "Body Weight (optional, for reference)",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
        },
      ],
      calculate: (inputs) => {
        const ageGroup = inputs.ageGroup as string;
        const purpose = inputs.purpose as string;
        const previousUse = inputs.previousUse as string;
        const weight = parseFloat(inputs.weightKg as string) || 0;

        // Base dose ranges by age group (mg)
        let minDose: number;
        let maxDose: number;
        let recommendedDose: number;

        switch (ageGroup) {
          case "child_young":
            minDose = 0.5;
            maxDose = 1.0;
            recommendedDose = 0.5;
            break;
          case "child_older":
            minDose = 0.5;
            maxDose = 3.0;
            recommendedDose = 1.0;
            break;
          case "teen":
            minDose = 0.5;
            maxDose = 5.0;
            recommendedDose = 1.0;
            break;
          case "adult":
            minDose = 0.5;
            maxDose = 5.0;
            recommendedDose = 1.0;
            break;
          case "senior":
            minDose = 0.3;
            maxDose = 2.0;
            recommendedDose = 0.5;
            break;
          default:
            minDose = 0.5;
            maxDose = 3.0;
            recommendedDose = 1.0;
        }

        // Adjust for purpose
        if (purpose === "jetlag") {
          recommendedDose = Math.min(recommendedDose * 2, maxDose);
        } else if (purpose === "shift") {
          recommendedDose = Math.min(recommendedDose * 1.5, maxDose);
        }

        // Adjust for previous use
        if (previousUse === "new") {
          recommendedDose = Math.max(minDose, recommendedDose * 0.5);
        } else if (previousUse === "regular") {
          recommendedDose = Math.min(recommendedDose * 1.5, maxDose);
        }

        // Round to nearest 0.25 mg
        recommendedDose = Math.round(recommendedDose * 4) / 4;

        let timing: string;
        if (purpose === "onset") timing = "30-60 minutes before bedtime";
        else if (purpose === "jetlag") timing = "At desired bedtime in the new time zone, starting the night of arrival";
        else if (purpose === "shift") timing = "30-60 minutes before desired sleep time";
        else timing = "30-60 minutes before bedtime";

        let duration: string;
        if (purpose === "jetlag") duration = "3-5 days";
        else if (purpose === "shift") duration = "As needed during shift work periods";
        else duration = "2-4 weeks, then reassess (not intended for long-term use without medical advice)";

        const details = [
          { label: "Dose Range for Age", value: formatNumber(minDose) + " - " + formatNumber(maxDose) + " mg" },
          { label: "Timing", value: timing },
          { label: "Recommended Duration", value: duration },
          { label: "Start Low", value: "Always start with the lowest effective dose" },
        ];

        if (weight > 0) {
          const dosePerKg = recommendedDose / weight;
          details.push({ label: "Dose per kg", value: formatNumber(dosePerKg) + " mg/kg" });
        }

        return {
          primary: {
            label: "Suggested Starting Dose",
            value: formatNumber(recommendedDose),
            suffix: "mg",
          },
          details,
          note: "Melatonin is not FDA-regulated as a drug. Quality varies between brands. Start with the lowest dose and increase only if needed. Consult a physician before giving melatonin to children or if you have medical conditions.",
        };
      },
    },
  ],
  relatedSlugs: ["epworth-sleepiness", "caffeine-calc", "drug-half-life"],
  faq: [
    {
      question: "What is the right melatonin dose?",
      answer:
        "Most sleep experts recommend starting with 0.5-1 mg for adults and as low as 0.25-0.5 mg for children. Studies show that lower doses (0.5-1 mg) are often as effective as higher doses, with fewer side effects. More is not always better with melatonin.",
    },
    {
      question: "When should I take melatonin?",
      answer:
        "Take melatonin 30-60 minutes before your desired bedtime. For jet lag, take it at bedtime in the new time zone. Taking it too early or too late can disrupt your circadian rhythm rather than help it.",
    },
    {
      question: "Is melatonin safe for children?",
      answer:
        "Short-term melatonin use appears to be safe for most children, but long-term safety data is limited. The American Academy of Pediatrics suggests using it only after establishing good sleep hygiene. Always consult a pediatrician before giving melatonin to children, especially those under 3 years old.",
    },
  ],
  formula:
    "Dose recommendation based on age group, purpose, and experience level. Starting doses: Children 3-5 (0.5 mg), Children 6-12 (0.5-3 mg), Teens (0.5-5 mg), Adults (0.5-5 mg), Seniors (0.3-2 mg). Always start at lowest effective dose.",
};
