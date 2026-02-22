import type { CalculatorDefinition } from "./types";

export const menopauseAgeCalculator: CalculatorDefinition = {
  slug: "menopause-age-calculator",
  title: "Menopause Age Predictor Calculator",
  description:
    "Free menopause age predictor calculator. Estimate when menopause may begin based on family history, lifestyle factors, and known risk indicators.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "menopause age calculator",
    "when will menopause start",
    "menopause predictor",
    "perimenopause calculator",
    "average menopause age",
  ],
  variants: [
    {
      id: "menopause-age",
      name: "Menopause Age Estimator",
      description: "Estimate when menopause may begin based on key factors",
      fields: [
        {
          name: "currentAge",
          label: "Your Current Age",
          type: "number",
          placeholder: "e.g. 42",
          min: 25,
          max: 65,
        },
        {
          name: "motherMenopauseAge",
          label: "Mother's Age at Menopause",
          type: "select",
          options: [
            { label: "Before 40 (premature)", value: "38" },
            { label: "40-44 (early)", value: "42" },
            { label: "45-49", value: "47" },
            { label: "50-54 (average)", value: "51" },
            { label: "55+ (late)", value: "56" },
            { label: "Don't Know", value: "unknown" },
          ],
          defaultValue: "unknown",
        },
        {
          name: "smoking",
          label: "Smoking Status",
          type: "select",
          options: [
            { label: "Never Smoked", value: "never" },
            { label: "Former Smoker", value: "former" },
            { label: "Current Smoker", value: "current" },
          ],
          defaultValue: "never",
        },
        {
          name: "bmi",
          label: "BMI Category",
          type: "select",
          options: [
            { label: "Underweight (BMI < 18.5)", value: "under" },
            { label: "Normal (BMI 18.5-24.9)", value: "normal" },
            { label: "Overweight (BMI 25-29.9)", value: "over" },
            { label: "Obese (BMI 30+)", value: "obese" },
          ],
          defaultValue: "normal",
        },
        {
          name: "firstPeriodAge",
          label: "Age at First Period",
          type: "select",
          options: [
            { label: "Before 11", value: "early" },
            { label: "11-13 (average)", value: "average" },
            { label: "After 13", value: "late" },
          ],
          defaultValue: "average",
        },
      ],
      calculate: (inputs) => {
        const currentAge = inputs.currentAge as number;
        const motherAge = inputs.motherMenopauseAge as string;
        const smoking = inputs.smoking as string;
        const bmi = inputs.bmi as string;
        const firstPeriod = inputs.firstPeriodAge as string;
        if (!currentAge) return null;

        // Start with average menopause age
        let estimatedAge = 51;

        // Family history (strongest predictor)
        if (motherAge !== "unknown") {
          const motherAgeNum = parseInt(motherAge);
          estimatedAge = Math.round((estimatedAge + motherAgeNum) / 2);
        }

        // Smoking lowers menopause age by 1-2 years
        if (smoking === "current") {
          estimatedAge -= 2;
        } else if (smoking === "former") {
          estimatedAge -= 1;
        }

        // BMI: underweight tends to lower, higher BMI slightly raises
        if (bmi === "under") {
          estimatedAge -= 1;
        } else if (bmi === "obese") {
          estimatedAge += 1;
        }

        // Early menarche may correlate with slightly earlier menopause
        if (firstPeriod === "early") {
          estimatedAge -= 0.5;
        } else if (firstPeriod === "late") {
          estimatedAge += 0.5;
        }

        estimatedAge = Math.round(estimatedAge);
        const perimenopauseStart = estimatedAge - 4;
        const yearsUntil = Math.max(0, estimatedAge - currentAge);
        const periYearsUntil = Math.max(0, perimenopauseStart - currentAge);

        let stage: string;
        if (currentAge >= estimatedAge) {
          stage = "Likely in menopause or postmenopause";
        } else if (currentAge >= perimenopauseStart) {
          stage = "Likely in perimenopause";
        } else {
          stage = "Pre-menopause";
        }

        return {
          primary: {
            label: "Estimated Menopause Age",
            value: `~${estimatedAge} years`,
          },
          details: [
            { label: "Current Stage", value: stage },
            { label: "Perimenopause May Begin", value: `~Age ${perimenopauseStart}` },
            { label: "Years Until Menopause (est.)", value: yearsUntil > 0 ? `~${yearsUntil} years` : "May have reached menopause" },
            { label: "Years Until Perimenopause (est.)", value: periYearsUntil > 0 ? `~${periYearsUntil} years` : "May have reached perimenopause" },
            { label: "Average Menopause Age (US)", value: "51 years" },
            { label: "Normal Range", value: "45-55 years" },
          ],
          note: "This is a rough estimate based on known risk factors. The strongest predictor is family history. Menopause is officially diagnosed after 12 consecutive months without a period. Talk to your doctor if you experience symptoms like irregular periods, hot flashes, or sleep changes before age 45.",
        };
      },
    },
  ],
  relatedSlugs: ["period-calculator", "bmi-calculator", "age-calculator"],
  faq: [
    {
      question: "What is the average age of menopause?",
      answer:
        "The average age of natural menopause in the US is 51 years. The normal range is 45-55 years. Menopause before age 40 is considered premature ovarian insufficiency, and before 45 is considered early menopause.",
    },
    {
      question: "What are the first signs of perimenopause?",
      answer:
        "Common early signs include: irregular periods (shorter, longer, heavier, or lighter), hot flashes, night sweats, sleep disturbances, mood changes, vaginal dryness, and decreased libido. Perimenopause typically begins 4-8 years before menopause.",
    },
    {
      question: "What factors affect when menopause starts?",
      answer:
        "Key factors include: genetics/family history (strongest predictor), smoking (lowers age by 1-2 years), BMI (very low BMI may cause earlier menopause), ethnicity, history of chemotherapy or radiation, surgical removal of ovaries, and certain autoimmune conditions.",
    },
  ],
  formula:
    "Estimated Age = 51 (base) adjusted by: Family History, Smoking (-1 to -2), BMI, Age at Menarche | Perimenopause Start ≈ Menopause Age - 4 years",
};
