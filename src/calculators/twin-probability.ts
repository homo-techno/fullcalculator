import type { CalculatorDefinition } from "./types";

export const twinProbabilityCalculator: CalculatorDefinition = {
  slug: "twin-probability-calculator",
  title: "Twin Probability Calculator",
  description:
    "Free twin probability calculator. Estimate your chances of having twins based on age, family history, fertility treatments, and other known risk factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "twin probability",
    "chances of twins",
    "twin calculator",
    "having twins",
    "twin pregnancy odds",
  ],
  variants: [
    {
      id: "twin-probability",
      name: "Twin Probability Estimator",
      description: "Estimate your likelihood of conceiving twins",
      fields: [
        {
          name: "age",
          label: "Mother's Age at Conception",
          type: "number",
          placeholder: "e.g. 33",
          min: 18,
          max: 50,
        },
        {
          name: "familyHistory",
          label: "Family History of Fraternal Twins",
          type: "select",
          options: [
            { label: "No family history", value: "none" },
            { label: "Mother's side (mother, sister, aunt)", value: "maternal" },
            { label: "Father's side", value: "paternal" },
            { label: "Both sides", value: "both" },
            { label: "I am a twin", value: "self" },
          ],
          defaultValue: "none",
        },
        {
          name: "fertility",
          label: "Fertility Treatment",
          type: "select",
          options: [
            { label: "No fertility treatment", value: "none" },
            { label: "Clomid / Letrozole", value: "clomid" },
            { label: "Injectable Gonadotropins", value: "injectables" },
            { label: "IVF (single embryo transfer)", value: "ivf-single" },
            { label: "IVF (double embryo transfer)", value: "ivf-double" },
            { label: "IUI", value: "iui" },
          ],
          defaultValue: "none",
        },
        {
          name: "previousPregnancies",
          label: "Number of Previous Pregnancies",
          type: "select",
          options: [
            { label: "None (first pregnancy)", value: "0" },
            { label: "1-2 previous", value: "1-2" },
            { label: "3-4 previous", value: "3-4" },
            { label: "5+ previous", value: "5+" },
          ],
          defaultValue: "0",
        },
        {
          name: "bmi",
          label: "BMI Category",
          type: "select",
          options: [
            { label: "Normal / Underweight (BMI < 25)", value: "normal" },
            { label: "Overweight (BMI 25-30)", value: "overweight" },
            { label: "Obese (BMI 30+)", value: "obese" },
          ],
          defaultValue: "normal",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const family = inputs.familyHistory as string;
        const fertility = inputs.fertility as string;
        const previous = inputs.previousPregnancies as string;
        const bmi = inputs.bmi as string;
        if (!age) return null;

        // Base rate: ~3.3% (33 per 1000 births in the US, includes all types)
        // Natural fraternal twin rate: ~1.2%
        let probability = 1.2;

        // Age: twins increase with age (peak at 35-39) due to higher FSH
        if (age >= 35 && age <= 39) probability *= 1.7;
        else if (age >= 30 && age < 35) probability *= 1.3;
        else if (age >= 40) probability *= 1.5; // Slightly lower than 35-39

        // Family history (maternal side for fraternal twins)
        if (family === "self") probability *= 2.5;
        else if (family === "both") probability *= 2.0;
        else if (family === "maternal") probability *= 1.7;
        else if (family === "paternal") probability *= 1.1; // Paternal side less impactful for fraternal

        // Fertility treatments
        if (fertility === "ivf-double") probability = Math.max(probability, 25); // ~25% with DET
        else if (fertility === "ivf-single") probability = Math.max(probability, 2); // ~2% (MZ twins)
        else if (fertility === "injectables") probability *= 5; // ~15-20% risk
        else if (fertility === "clomid") probability *= 3; // ~5-10% risk
        else if (fertility === "iui") probability *= 2;

        // Previous pregnancies increase odds slightly
        if (previous === "3-4") probability *= 1.3;
        else if (previous === "5+") probability *= 1.5;
        else if (previous === "1-2") probability *= 1.1;

        // Higher BMI increases fraternal twin odds
        if (bmi === "obese") probability *= 1.4;
        else if (bmi === "overweight") probability *= 1.2;

        // Cap at reasonable maximum
        probability = Math.min(35, probability);

        // Identical twin rate is constant at ~0.4%
        const identicalRate = 0.4;

        return {
          primary: {
            label: "Twin Probability",
            value: `${probability.toFixed(1)}%`,
          },
          details: [
            { label: "Your Estimated Rate", value: `~${probability.toFixed(1)}% (1 in ${Math.round(100 / probability)})` },
            { label: "Fraternal Twin Estimate", value: `~${(probability - identicalRate).toFixed(1)}%` },
            { label: "Identical Twin Rate", value: `~${identicalRate}% (constant, not affected by factors)` },
            { label: "US Average Twin Rate", value: "~3.3% of all births" },
            { label: "Natural Twin Rate (no treatment)", value: "~1.2% (fraternal) + 0.4% (identical)" },
            { label: "Age Factor", value: age >= 35 && age <= 39 ? "Peak twin probability age range" : age >= 30 ? "Moderately increased" : "Baseline" },
          ],
          note: "Fraternal (dizygotic) twins are influenced by genetics, age, and fertility treatments. Identical (monozygotic) twins occur randomly at ~0.4% and are not affected by these factors. This calculator provides rough estimates; actual probabilities depend on individual physiology.",
        };
      },
    },
  ],
  relatedSlugs: ["pregnancy-calculator", "ivf-success-calculator", "fertility-window-calculator"],
  faq: [
    {
      question: "What increases the chances of having twins?",
      answer:
        "Factors that increase fraternal twin probability: maternal age over 30 (especially 35-39), family history of fraternal twins (mother's side), fertility treatments (especially IVF with multiple embryo transfer), higher BMI, having had previous pregnancies, and being taller than average. African American women have higher rates than other ethnicities.",
    },
    {
      question: "What is the difference between identical and fraternal twins?",
      answer:
        "Identical (monozygotic) twins occur when one fertilized egg splits into two, resulting in genetically identical babies. This occurs randomly at ~0.4% and isn't influenced by genetics or age. Fraternal (dizygotic) twins occur when two separate eggs are fertilized, resulting in siblings who share ~50% of DNA, like any siblings.",
    },
    {
      question: "Does IVF increase the chance of twins?",
      answer:
        "Yes, significantly if multiple embryos are transferred. Single embryo transfer (SET) has ~2% twin rate (from embryo splitting). Double embryo transfer (DET) has ~25% twin rate. Current best practice favors SET to avoid twin pregnancy risks. Fertility medications (Clomid, gonadotropins) also increase twin rates.",
    },
  ],
  formula:
    "Twin Probability = Base Rate (1.2%) x Age Factor x Family Factor x Fertility Factor x Parity Factor x BMI Factor | Identical rate = 0.4% (constant)",
};
