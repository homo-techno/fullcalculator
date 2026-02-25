import type { CalculatorDefinition } from "./types";

export const toddlerHeightCalculator: CalculatorDefinition = {
  slug: "toddler-height-predictor",
  title: "Toddler Height Predictor",
  description:
    "Free toddler height predictor calculator. Estimate your child's adult height based on current measurements and parent heights using proven prediction methods.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "toddler height predictor",
    "child height prediction",
    "adult height calculator",
    "how tall will my child be",
    "height predictor",
  ],
  variants: [
    {
      id: "mid-parent",
      name: "Mid-Parent Method",
      description: "Predict adult height using parents' heights",
      fields: [
        {
          name: "gender",
          label: "Child's Gender",
          type: "select",
          options: [
            { label: "Boy", value: "boy" },
            { label: "Girl", value: "girl" },
          ],
        },
        {
          name: "fatherHeightIn",
          label: "Father's Height (inches)",
          type: "number",
          placeholder: "e.g. 70",
          min: 55,
          max: 84,
        },
        {
          name: "motherHeightIn",
          label: "Mother's Height (inches)",
          type: "number",
          placeholder: "e.g. 64",
          min: 50,
          max: 78,
        },
        {
          name: "childHeightIn",
          label: "Child's Current Height (inches, optional)",
          type: "number",
          placeholder: "e.g. 34",
          min: 15,
          max: 50,
        },
        {
          name: "childAgeMonths",
          label: "Child's Age (months)",
          type: "number",
          placeholder: "e.g. 24",
          min: 0,
          max: 60,
        },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const fatherIn = inputs.fatherHeightIn as number;
        const motherIn = inputs.motherHeightIn as number;
        const childIn = inputs.childHeightIn as number;
        const ageMonths = inputs.childAgeMonths as number;
        if (!gender || !fatherIn || !motherIn) return null;

        let predictedIn: number;
        if (gender === "boy") {
          predictedIn = (fatherIn + motherIn + 5) / 2;
        } else {
          predictedIn = (fatherIn + motherIn - 5) / 2;
        }

        const predictedFt = Math.floor(predictedIn / 12);
        const predictedRemIn = (predictedIn % 12).toFixed(1);
        const predictedCm = (predictedIn * 2.54).toFixed(1);

        const rangeMin = predictedIn - 2;
        const rangeMax = predictedIn + 2;
        const rangeMinFt = Math.floor(rangeMin / 12);
        const rangeMinIn = (rangeMin % 12).toFixed(1);
        const rangeMaxFt = Math.floor(rangeMax / 12);
        const rangeMaxIn = (rangeMax % 12).toFixed(1);

        const details: { label: string; value: string }[] = [
          {
            label: "Predicted range",
            value: `${rangeMinFt}'${rangeMinIn}" to ${rangeMaxFt}'${rangeMaxIn}" (±2 inches)`,
          },
          {
            label: "Predicted height (cm)",
            value: `${predictedCm} cm`,
          },
          {
            label: "Father's height",
            value: `${Math.floor(fatherIn / 12)}'${(fatherIn % 12).toFixed(0)}" (${(fatherIn * 2.54).toFixed(1)} cm)`,
          },
          {
            label: "Mother's height",
            value: `${Math.floor(motherIn / 12)}'${(motherIn % 12).toFixed(0)}" (${(motherIn * 2.54).toFixed(1)} cm)`,
          },
        ];

        if (childIn && ageMonths) {
          // Doubling method: height at age 2 doubled = approx adult height
          if (ageMonths >= 18 && ageMonths <= 30) {
            const doubledIn = childIn * 2;
            const dblFt = Math.floor(doubledIn / 12);
            const dblRemIn = (doubledIn % 12).toFixed(1);
            details.push({
              label: "Doubling method estimate",
              value: `${dblFt}'${dblRemIn}" (height at ~2 yrs x 2)`,
            });
          }
          details.push({
            label: "Current height",
            value: `${childIn} inches at ${ageMonths} months`,
          });
        }

        return {
          primary: {
            label: "Predicted Adult Height",
            value: `${predictedFt}'${predictedRemIn}"`,
          },
          details,
          note: "Predictions have a margin of error of about ±2 inches. Genetics, nutrition, and health all influence final height.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-growth-calculator", "baby-height-percentile-calculator"],
  faq: [
    {
      question: "How accurate are height predictions for toddlers?",
      answer:
        "The mid-parent method is accurate within about ±2 inches (5 cm) for most children. The 'doubling method' (doubling height at age 2) is a rough estimate. Genetics plays a major role, but nutrition, health, and activity also matter.",
    },
    {
      question: "What is the mid-parent height formula?",
      answer:
        "For boys: (father's height + mother's height + 5 inches) / 2. For girls: (father's height + mother's height - 5 inches) / 2. This estimates the average expected adult height based on parental genetics.",
    },
  ],
  formula:
    "Mid-Parent Method: Boys = (father height + mother height + 5\") / 2. Girls = (father height + mother height - 5\") / 2. Doubling method: height at age 2 x 2 ≈ adult height.",
};
