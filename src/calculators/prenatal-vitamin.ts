import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const prenatalVitaminCalculator: CalculatorDefinition = {
  slug: "prenatal-vitamin-calculator",
  title: "Prenatal Vitamin Needs Calculator",
  description:
    "Calculate your prenatal vitamin and nutrient requirements by trimester. Covers folate, iron, calcium, DHA, and other essential nutrients for a healthy pregnancy.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "prenatal vitamin calculator",
    "prenatal nutrient needs",
    "pregnancy vitamin requirements",
    "folate pregnancy",
    "iron pregnancy",
    "dha pregnancy",
    "trimester nutrition",
  ],
  variants: [
    {
      id: "byTrimester",
      name: "Nutrient Needs by Trimester",
      description: "See recommended nutrient intakes for each pregnancy stage",
      fields: [
        {
          name: "trimester",
          label: "Trimester / Stage",
          type: "select",
          options: [
            { label: "Pre-conception (planning)", value: "preconception" },
            { label: "First trimester (weeks 1-12)", value: "first" },
            { label: "Second trimester (weeks 13-26)", value: "second" },
            { label: "Third trimester (weeks 27-40)", value: "third" },
            { label: "Postpartum / breastfeeding", value: "postpartum" },
          ],
          defaultValue: "first",
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "years",
          min: 15,
          max: 50,
        },
        {
          name: "riskFactors",
          label: "Risk Factors",
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "History of neural tube defect", value: "ntd" },
            { label: "Multiple pregnancy (twins+)", value: "multiples" },
            { label: "Vegetarian / vegan", value: "vegan" },
            { label: "Bariatric surgery history", value: "bariatric" },
          ],
          defaultValue: "none",
        },
      ],
      calculate: (inputs) => {
        const trimester = inputs.trimester as string;
        const age = parseFloat(inputs.age as string);
        const riskFactor = inputs.riskFactors as string;
        if (!age) return null;

        // Base nutrient needs by trimester (standard adult)
        const nutrients: Record<string, Record<string, number>> = {
          preconception: { folate: 400, iron: 18, calcium: 1000, vitD: 600, dha: 200, iodine: 150, choline: 425, b12: 2.4 },
          first: { folate: 600, iron: 27, calcium: 1000, vitD: 600, dha: 300, iodine: 220, choline: 450, b12: 2.6 },
          second: { folate: 600, iron: 27, calcium: 1000, vitD: 600, dha: 300, iodine: 220, choline: 450, b12: 2.6 },
          third: { folate: 600, iron: 27, calcium: 1200, vitD: 600, dha: 300, iodine: 220, choline: 450, b12: 2.6 },
          postpartum: { folate: 500, iron: 9, calcium: 1000, vitD: 600, dha: 300, iodine: 290, choline: 550, b12: 2.8 },
        };

        const needs = { ...(nutrients[trimester] || nutrients.first) };

        // Risk factor adjustments
        if (riskFactor === "ntd") needs.folate = 4000; // 4mg for history of NTD
        if (riskFactor === "multiples") {
          needs.iron = Math.round(needs.iron * 1.3);
          needs.calcium = Math.round(needs.calcium * 1.2);
        }
        if (riskFactor === "vegan") {
          needs.b12 = Math.round(needs.b12 * 1.5 * 10) / 10;
          needs.iron = Math.round(needs.iron * 1.5);
        }
        if (riskFactor === "bariatric") {
          needs.iron = Math.round(needs.iron * 1.5);
          needs.calcium = 1500;
          needs.vitD = 1000;
          needs.b12 = 1000; // Much higher due to absorption issues
        }

        // Teens need more calcium
        if (age < 19) needs.calcium = 1300;

        return {
          primary: { label: "Folate / Folic Acid", value: `${formatNumber(needs.folate, 0)} mcg/day` },
          details: [
            { label: "Iron", value: `${formatNumber(needs.iron, 0)} mg/day` },
            { label: "Calcium", value: `${formatNumber(needs.calcium, 0)} mg/day` },
            { label: "Vitamin D", value: `${formatNumber(needs.vitD, 0)} IU/day` },
            { label: "DHA (Omega-3)", value: `${formatNumber(needs.dha, 0)} mg/day` },
            { label: "Iodine", value: `${formatNumber(needs.iodine, 0)} mcg/day` },
            { label: "Choline", value: `${formatNumber(needs.choline, 0)} mg/day` },
            { label: "Vitamin B12", value: `${formatNumber(needs.b12, 1)} mcg/day` },
          ],
          note: "These are recommended daily intakes from food plus supplements combined. Many prenatal vitamins do not contain enough DHA, calcium, or choline -- check labels carefully. Always consult your OB/GYN or midwife for personalized recommendations.",
        };
      },
    },
  ],
  relatedSlugs: ["postpartum-calorie-calculator", "calorie-calculator", "protein-calculator"],
  faq: [
    {
      question: "When should I start taking prenatal vitamins?",
      answer:
        "Ideally, start prenatal vitamins at least 1-3 months before conception. Neural tube development occurs in the first 28 days, often before pregnancy is confirmed. Folate (400-800mcg) is the most critical early nutrient. If pregnancy is unplanned, start as soon as you find out.",
    },
    {
      question: "Do I need separate DHA and calcium supplements?",
      answer:
        "Most prenatal vitamins contain insufficient DHA (need 200-300mg) and calcium (need 1000mg). A separate DHA/omega-3 supplement and calcium-rich diet or supplement are usually recommended. Take calcium separately from iron, as they compete for absorption.",
    },
    {
      question: "Why is folate important during pregnancy?",
      answer:
        "Folate (vitamin B9) is essential for neural tube development, preventing birth defects like spina bifida and anencephaly. The neural tube forms in the first 28 days. Methylfolate (5-MTHF) may be better for women with MTHFR gene variants. Women with prior NTD history need 4,000mcg daily.",
    },
  ],
  formula:
    "Daily Needs = Base Trimester Requirement x Risk Factor Adjustment | Folate: 400mcg (pre) to 600mcg (pregnancy) | Iron: 27mg (pregnancy)",
};
