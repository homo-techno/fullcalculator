import type { CalculatorDefinition } from "./types";

export const babyGenderCalculator: CalculatorDefinition = {
  slug: "baby-gender-calculator",
  title: "Baby Gender Prediction Calculator",
  description:
    "Free baby gender prediction calculator. Explore multiple folk methods and old wives' tales to predict whether you're having a boy or girl - for entertainment only.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby gender predictor",
    "boy or girl calculator",
    "gender prediction",
    "baby sex predictor",
    "am I having a boy or girl",
  ],
  variants: [
    {
      id: "folk-method",
      name: "Folk Method Gender Predictor",
      description: "Predict gender using popular old wives' tales scoring",
      fields: [
        {
          name: "motherAge",
          label: "Mother's Age at Conception",
          type: "number",
          placeholder: "e.g. 28",
          min: 18,
          max: 50,
        },
        {
          name: "conceptionMonth",
          label: "Conception Month (1-12)",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 12,
        },
        {
          name: "heartRate",
          label: "Baby's Heart Rate (BPM, if known)",
          type: "select",
          options: [
            { label: "Below 140 BPM", value: "below140" },
            { label: "140 BPM or Above", value: "above140" },
            { label: "Don't Know Yet", value: "unknown" },
          ],
          defaultValue: "unknown",
        },
        {
          name: "cravings",
          label: "Food Cravings",
          type: "select",
          options: [
            { label: "Salty / Savory", value: "salty" },
            { label: "Sweet / Fruity", value: "sweet" },
            { label: "No Strong Cravings", value: "none" },
          ],
          defaultValue: "none",
        },
        {
          name: "morningSickness",
          label: "Morning Sickness Severity",
          type: "select",
          options: [
            { label: "Severe / Frequent", value: "severe" },
            { label: "Mild / None", value: "mild" },
          ],
          defaultValue: "mild",
        },
        {
          name: "skinCondition",
          label: "Skin Changes During Pregnancy",
          type: "select",
          options: [
            { label: "More Acne / Breakouts", value: "acne" },
            { label: "Glowing / Clear Skin", value: "glowing" },
            { label: "No Change", value: "none" },
          ],
          defaultValue: "none",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.motherAge as number;
        const month = inputs.conceptionMonth as number;
        const heartRate = inputs.heartRate as string;
        const cravings = inputs.cravings as string;
        const sickness = inputs.morningSickness as string;
        const skin = inputs.skinCondition as string;
        if (!age || !month) return null;

        let boyScore = 0;
        let girlScore = 0;
        const factors: string[] = [];

        // Mayan method: both even or both odd = girl; mixed = boy
        if ((age % 2 === 0 && month % 2 === 0) || (age % 2 !== 0 && month % 2 !== 0)) {
          girlScore += 1;
          factors.push("Mayan method (age+month parity) suggests Girl");
        } else {
          boyScore += 1;
          factors.push("Mayan method (age+month parity) suggests Boy");
        }

        // Heart rate myth
        if (heartRate === "above140") {
          girlScore += 1;
          factors.push("Heart rate >=140 suggests Girl (old wives' tale)");
        } else if (heartRate === "below140") {
          boyScore += 1;
          factors.push("Heart rate <140 suggests Boy (old wives' tale)");
        }

        // Cravings myth
        if (cravings === "salty") {
          boyScore += 1;
          factors.push("Salty cravings suggest Boy (old wives' tale)");
        } else if (cravings === "sweet") {
          girlScore += 1;
          factors.push("Sweet cravings suggest Girl (old wives' tale)");
        }

        // Morning sickness
        if (sickness === "severe") {
          girlScore += 1;
          factors.push("Severe morning sickness suggests Girl (some research supports this)");
        } else {
          boyScore += 1;
          factors.push("Mild morning sickness suggests Boy (old wives' tale)");
        }

        // Skin changes
        if (skin === "acne") {
          girlScore += 1;
          factors.push("Skin breakouts suggest Girl (old wives' tale)");
        } else if (skin === "glowing") {
          boyScore += 1;
          factors.push("Glowing skin suggests Boy (old wives' tale)");
        }

        const total = boyScore + girlScore;
        const boyPercent = total > 0 ? Math.round((boyScore / total) * 100) : 50;
        const girlPercent = 100 - boyPercent;
        const prediction = boyScore > girlScore ? "Boy" : boyScore < girlScore ? "Girl" : "Could Be Either!";

        return {
          primary: {
            label: "Folk Prediction",
            value: prediction,
          },
          details: [
            { label: "Boy Indicators", value: `${boyScore} of ${total} factors (${boyPercent}%)` },
            { label: "Girl Indicators", value: `${girlScore} of ${total} factors (${girlPercent}%)` },
            ...factors.map((f, i) => ({ label: `Factor ${i + 1}`, value: f })),
          ],
          note: "This calculator is for ENTERTAINMENT ONLY and has no scientific basis. The only reliable methods for determining baby's sex are ultrasound (18-22 weeks), NIPT blood test (10+ weeks), CVS, or amniocentesis.",
        };
      },
    },
  ],
  relatedSlugs: ["chinese-gender-calculator", "pregnancy-calculator", "pregnancy-due-date-calculator"],
  faq: [
    {
      question: "Can old wives' tales predict baby gender?",
      answer:
        "No, old wives' tales and folk methods for predicting baby gender are not scientifically accurate. They have approximately 50% accuracy, the same as flipping a coin. These methods are fun traditions but should not be relied upon.",
    },
    {
      question: "Does heart rate predict baby gender?",
      answer:
        "The myth claims that a fetal heart rate above 140 BPM indicates a girl, while below 140 indicates a boy. However, studies show no significant difference in fetal heart rate between sexes during pregnancy. Heart rate varies based on gestational age and the baby's activity level.",
    },
    {
      question: "What is the most reliable way to determine baby's sex?",
      answer:
        "The most reliable methods include: Non-Invasive Prenatal Testing (NIPT) blood test at 10+ weeks (99%+ accurate), anatomy ultrasound at 18-22 weeks (95-99% accurate), CVS at 10-13 weeks, and amniocentesis at 15-20 weeks.",
    },
  ],
  formula:
    "Folk Score = Sum of boy/girl indicators from various myths | Prediction = Higher scoring gender | Accuracy ≈ 50% (random chance)",
};
