import type { CalculatorDefinition } from "./types";

export const eggFreezingCalculator: CalculatorDefinition = {
  slug: "egg-freezing-calculator",
  title: "Egg Freezing Age & Success Calculator",
  description:
    "Free egg freezing calculator. Estimate success rates for egg freezing based on your age, number of eggs retrieved, and understand how age impacts outcomes.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "egg freezing calculator",
    "oocyte cryopreservation",
    "egg freezing success rate",
    "egg freezing age",
    "fertility preservation",
  ],
  variants: [
    {
      id: "egg-freezing-success",
      name: "Egg Freezing Success Estimator",
      description: "Estimate success rates based on age and egg count",
      fields: [
        {
          name: "age",
          label: "Age at Egg Freezing",
          type: "number",
          placeholder: "e.g. 33",
          min: 20,
          max: 45,
        },
        {
          name: "eggsRetrieved",
          label: "Number of Eggs Retrieved (or expected)",
          type: "number",
          placeholder: "e.g. 15",
          min: 1,
          max: 50,
          defaultValue: 15,
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const eggs = (inputs.eggsRetrieved as number) || 15;
        if (!age) return null;

        // Survival rate after thaw (vitrification)
        let survivalRate: number;
        let fertilizationRate: number;
        let blastocystRate: number;

        if (age <= 30) {
          survivalRate = 0.90; fertilizationRate = 0.75; blastocystRate = 0.50;
        } else if (age <= 33) {
          survivalRate = 0.88; fertilizationRate = 0.72; blastocystRate = 0.45;
        } else if (age <= 35) {
          survivalRate = 0.85; fertilizationRate = 0.70; blastocystRate = 0.40;
        } else if (age <= 37) {
          survivalRate = 0.82; fertilizationRate = 0.65; blastocystRate = 0.35;
        } else if (age <= 39) {
          survivalRate = 0.78; fertilizationRate = 0.60; blastocystRate = 0.28;
        } else if (age <= 41) {
          survivalRate = 0.75; fertilizationRate = 0.55; blastocystRate = 0.20;
        } else {
          survivalRate = 0.70; fertilizationRate = 0.50; blastocystRate = 0.15;
        }

        const survivedEggs = Math.round(eggs * survivalRate);
        const fertilized = Math.round(survivedEggs * fertilizationRate);
        const blastocysts = Math.max(1, Math.round(fertilized * blastocystRate));

        // Estimated live birth rate per egg (age-dependent)
        let liveBirthPerEgg: number;
        if (age <= 30) liveBirthPerEgg = 0.085;
        else if (age <= 33) liveBirthPerEgg = 0.07;
        else if (age <= 35) liveBirthPerEgg = 0.06;
        else if (age <= 37) liveBirthPerEgg = 0.045;
        else if (age <= 39) liveBirthPerEgg = 0.03;
        else if (age <= 41) liveBirthPerEgg = 0.02;
        else liveBirthPerEgg = 0.01;

        const liveBirthChance = (1 - Math.pow(1 - liveBirthPerEgg, eggs)) * 100;

        // Recommended number of eggs for 70%+ chance
        let recommendedEggs: number;
        if (age <= 30) recommendedEggs = 15;
        else if (age <= 33) recommendedEggs = 18;
        else if (age <= 35) recommendedEggs = 20;
        else if (age <= 37) recommendedEggs = 25;
        else if (age <= 39) recommendedEggs = 30;
        else recommendedEggs = 40;

        return {
          primary: {
            label: "Est. Live Birth Chance",
            value: `${liveBirthChance.toFixed(0)}%`,
          },
          details: [
            { label: "Age at Freezing", value: `${age} years` },
            { label: "Eggs Retrieved", value: `${eggs}` },
            { label: "Eggs Surviving Thaw (est.)", value: `~${survivedEggs} (${(survivalRate * 100).toFixed(0)}% survival)` },
            { label: "Successfully Fertilized (est.)", value: `~${fertilized}` },
            { label: "Blastocysts Formed (est.)", value: `~${blastocysts}` },
            { label: "Recommended Eggs for 70%+ Chance", value: `~${recommendedEggs} eggs` },
            { label: "Cycles Likely Needed", value: `${Math.ceil(recommendedEggs / (eggs || 15))}` },
          ],
          note: "These are population-level estimates and individual results vary significantly based on ovarian reserve (AMH levels), clinic quality, and other factors. Egg freezing technology (vitrification) has improved dramatically. Eggs frozen at younger ages have better quality. Consult a reproductive endocrinologist for personalized assessment.",
        };
      },
    },
  ],
  relatedSlugs: ["ivf-success-calculator", "fertility-window-calculator", "ovulation-calculator"],
  faq: [
    {
      question: "What is the best age to freeze eggs?",
      answer:
        "Ideally before age 35, with the best outcomes under 30. Egg quality and quantity decline with age, especially after 35. At 30, you might need 15 eggs for a good chance of one live birth; at 40, you may need 30+. However, egg freezing at any reproductive age can be beneficial.",
    },
    {
      question: "How many eggs should I freeze?",
      answer:
        "For a reasonable chance (60-70%+) of at least one live birth: age under 35: ~15-20 eggs, age 35-37: ~20-25 eggs, age 38-40: ~25-30 eggs, over 40: ~30+ eggs. Most women retrieve 10-20 eggs per cycle, so some may need 2+ cycles.",
    },
    {
      question: "How much does egg freezing cost?",
      answer:
        "In the US, one egg freezing cycle typically costs $6,000-$15,000 for the retrieval procedure, plus $3,000-$6,000 for medications, and annual storage fees of $500-$1,000. Many women need 2+ cycles. Some employers and insurance plans now cover egg freezing as a benefit.",
    },
  ],
  formula:
    "Survived Eggs = Retrieved x Survival Rate | Fertilized = Survived x Fertilization Rate | Live Birth Chance = 1 - (1 - Per-Egg Rate)^Total Eggs",
};
