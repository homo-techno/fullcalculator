import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nutritionGapCalculator: CalculatorDefinition = {
  slug: "nutrition-gap-calculator",
  title: "Daily Nutrition Gap Analyzer",
  description:
    "Compare your daily nutrient intake against Recommended Dietary Allowances (RDA). Identify nutritional gaps in vitamins, minerals, and macronutrients.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "nutrition gap calculator",
    "daily nutrition analyzer",
    "RDA calculator",
    "nutrient deficiency",
    "vitamin intake",
    "mineral intake",
    "dietary reference intake",
  ],
  variants: [
    {
      id: "macro-gap",
      name: "Macronutrient Gap Analysis",
      description: "Compare your macronutrient intake against recommended values",
      fields: [
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "19-30 years", value: "young" },
            { label: "31-50 years", value: "middle" },
            { label: "51-70 years", value: "older" },
            { label: "71+ years", value: "elderly" },
          ],
        },
        {
          name: "calories",
          label: "Daily Calorie Intake",
          type: "number",
          placeholder: "e.g. 2000",
          suffix: "kcal",
          min: 500,
          max: 8000,
        },
        {
          name: "protein",
          label: "Daily Protein Intake",
          type: "number",
          placeholder: "e.g. 60",
          suffix: "g",
          min: 0,
          max: 500,
        },
        {
          name: "fiber",
          label: "Daily Fiber Intake",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "g",
          min: 0,
          max: 100,
        },
        {
          name: "calcium",
          label: "Daily Calcium Intake",
          type: "number",
          placeholder: "e.g. 800",
          suffix: "mg",
          min: 0,
          max: 5000,
        },
        {
          name: "iron",
          label: "Daily Iron Intake",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "mg",
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        const ageGroup = inputs.ageGroup as string;
        const calories = parseFloat(inputs.calories as string);
        const protein = parseFloat(inputs.protein as string);
        const fiber = parseFloat(inputs.fiber as string);
        const calcium = parseFloat(inputs.calcium as string);
        const iron = parseFloat(inputs.iron as string);

        if (!sex || !ageGroup || isNaN(calories)) return null;

        // RDA values by sex and age
        let rdaProtein: number;
        let rdaFiber: number;
        let rdaCalcium: number;
        let rdaIron: number;

        if (sex === "male") {
          rdaProtein = 56; // g/day
          rdaFiber = ageGroup === "elderly" ? 28 : 38; // g/day
          rdaCalcium = (ageGroup === "older" || ageGroup === "elderly") ? 1200 : 1000; // mg
          rdaIron = 8; // mg
        } else {
          rdaProtein = 46; // g/day
          rdaFiber = ageGroup === "elderly" ? 21 : 25; // g/day
          rdaCalcium = (ageGroup === "older" || ageGroup === "elderly") ? 1200 : 1000; // mg
          rdaIron = ageGroup === "young" ? 18 : 8; // mg (higher for premenopausal women)
        }

        const gaps: { label: string; value: string }[] = [];
        const deficiencies: string[] = [];

        // Protein analysis
        if (!isNaN(protein)) {
          const proteinPct = (protein / rdaProtein) * 100;
          const proteinGap = protein - rdaProtein;
          gaps.push({ label: "Protein", value: `${formatNumber(protein, 0)}g / ${formatNumber(rdaProtein, 0)}g RDA (${formatNumber(proteinPct, 0)}%)` });
          if (proteinPct < 90) deficiencies.push(`Protein (need ${formatNumber(Math.abs(proteinGap), 0)}g more)`);
        }

        // Fiber analysis
        if (!isNaN(fiber)) {
          const fiberPct = (fiber / rdaFiber) * 100;
          const fiberGap = fiber - rdaFiber;
          gaps.push({ label: "Fiber", value: `${formatNumber(fiber, 0)}g / ${formatNumber(rdaFiber, 0)}g AI (${formatNumber(fiberPct, 0)}%)` });
          if (fiberPct < 90) deficiencies.push(`Fiber (need ${formatNumber(Math.abs(fiberGap), 0)}g more)`);
        }

        // Calcium analysis
        if (!isNaN(calcium)) {
          const calciumPct = (calcium / rdaCalcium) * 100;
          const calciumGap = calcium - rdaCalcium;
          gaps.push({ label: "Calcium", value: `${formatNumber(calcium, 0)}mg / ${formatNumber(rdaCalcium, 0)}mg RDA (${formatNumber(calciumPct, 0)}%)` });
          if (calciumPct < 90) deficiencies.push(`Calcium (need ${formatNumber(Math.abs(calciumGap), 0)}mg more)`);
        }

        // Iron analysis
        if (!isNaN(iron)) {
          const ironPct = (iron / rdaIron) * 100;
          const ironGap = iron - rdaIron;
          gaps.push({ label: "Iron", value: `${formatNumber(iron, 0)}mg / ${formatNumber(rdaIron, 0)}mg RDA (${formatNumber(ironPct, 0)}%)` });
          if (ironPct < 90) deficiencies.push(`Iron (need ${formatNumber(Math.abs(ironGap), 0)}mg more)`);
        }

        const overallScore = gaps.length > 0
          ? deficiencies.length === 0 ? "All tracked nutrients meet RDA" : `${formatNumber(deficiencies.length, 0)} nutrient gap(s) identified`
          : "Enter nutrient values to analyze";

        return {
          primary: { label: "Nutrition Gaps", value: overallScore },
          details: [
            { label: "Daily Calories", value: `${formatNumber(calories, 0)} kcal` },
            ...gaps,
            { label: "Gaps Found", value: deficiencies.length > 0 ? deficiencies.join("; ") : "None — all nutrients meet or exceed RDA" },
          ],
          note: "RDA values are for generally healthy adults. Individual needs vary based on health conditions, pregnancy, lactation, and activity level. This is not a substitute for professional dietary assessment.",
        };
      },
    },
    {
      id: "vitamin-check",
      name: "Key Vitamin Check",
      description: "Check intake of key vitamins against daily recommendations",
      fields: [
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "vitaminD",
          label: "Vitamin D Intake",
          type: "number",
          placeholder: "e.g. 400",
          suffix: "IU",
          min: 0,
          max: 10000,
        },
        {
          name: "vitaminC",
          label: "Vitamin C Intake",
          type: "number",
          placeholder: "e.g. 60",
          suffix: "mg",
          min: 0,
          max: 5000,
        },
        {
          name: "vitaminB12",
          label: "Vitamin B12 Intake",
          type: "number",
          placeholder: "e.g. 2.5",
          suffix: "mcg",
          min: 0,
          max: 1000,
          step: 0.1,
        },
        {
          name: "folate",
          label: "Folate Intake",
          type: "number",
          placeholder: "e.g. 300",
          suffix: "mcg DFE",
          min: 0,
          max: 2000,
        },
        {
          name: "magnesium",
          label: "Magnesium Intake",
          type: "number",
          placeholder: "e.g. 300",
          suffix: "mg",
          min: 0,
          max: 2000,
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        const vitD = parseFloat(inputs.vitaminD as string);
        const vitC = parseFloat(inputs.vitaminC as string);
        const b12 = parseFloat(inputs.vitaminB12 as string);
        const folate = parseFloat(inputs.folate as string);
        const mag = parseFloat(inputs.magnesium as string);

        if (!sex) return null;

        const rdaVitD = 600; // IU (15 mcg) for adults under 70
        const rdaVitC = sex === "male" ? 90 : 75; // mg
        const rdaB12 = 2.4; // mcg
        const rdaFolate = 400; // mcg DFE
        const rdaMag = sex === "male" ? 420 : 320; // mg

        const results: { label: string; value: string }[] = [];
        const deficiencies: string[] = [];
        const adequate: string[] = [];

        if (!isNaN(vitD)) {
          const pct = (vitD / rdaVitD) * 100;
          results.push({ label: "Vitamin D", value: `${formatNumber(vitD, 0)} IU / ${formatNumber(rdaVitD, 0)} IU (${formatNumber(pct, 0)}%)` });
          if (pct < 90) deficiencies.push("Vitamin D");
          else adequate.push("Vitamin D");
        }
        if (!isNaN(vitC)) {
          const pct = (vitC / rdaVitC) * 100;
          results.push({ label: "Vitamin C", value: `${formatNumber(vitC, 0)} mg / ${formatNumber(rdaVitC, 0)} mg (${formatNumber(pct, 0)}%)` });
          if (pct < 90) deficiencies.push("Vitamin C");
          else adequate.push("Vitamin C");
        }
        if (!isNaN(b12)) {
          const pct = (b12 / rdaB12) * 100;
          results.push({ label: "Vitamin B12", value: `${formatNumber(b12, 1)} mcg / ${formatNumber(rdaB12, 1)} mcg (${formatNumber(pct, 0)}%)` });
          if (pct < 90) deficiencies.push("Vitamin B12");
          else adequate.push("Vitamin B12");
        }
        if (!isNaN(folate)) {
          const pct = (folate / rdaFolate) * 100;
          results.push({ label: "Folate", value: `${formatNumber(folate, 0)} mcg / ${formatNumber(rdaFolate, 0)} mcg (${formatNumber(pct, 0)}%)` });
          if (pct < 90) deficiencies.push("Folate");
          else adequate.push("Folate");
        }
        if (!isNaN(mag)) {
          const pct = (mag / rdaMag) * 100;
          results.push({ label: "Magnesium", value: `${formatNumber(mag, 0)} mg / ${formatNumber(rdaMag, 0)} mg (${formatNumber(pct, 0)}%)` });
          if (pct < 90) deficiencies.push("Magnesium");
          else adequate.push("Magnesium");
        }

        if (results.length === 0) return null;

        return {
          primary: { label: "Vitamin Status", value: deficiencies.length === 0 ? "All adequate" : `${formatNumber(deficiencies.length, 0)} gap(s)` },
          details: [
            ...results,
            { label: "Adequate", value: adequate.length > 0 ? adequate.join(", ") : "None checked" },
            { label: "Below RDA", value: deficiencies.length > 0 ? deficiencies.join(", ") : "None" },
          ],
          note: "The most commonly deficient nutrients in the US diet are Vitamin D, calcium, fiber, potassium, and magnesium. Consider a blood test for accurate vitamin D and B12 status. Supplements should complement — not replace — a balanced diet.",
        };
      },
    },
  ],
  relatedSlugs: ["meal-calorie-calculator", "weight-watchers-calculator", "child-growth-chart-calculator"],
  faq: [
    {
      question: "What is the RDA (Recommended Dietary Allowance)?",
      answer:
        "The RDA is the average daily intake sufficient to meet the nutrient requirements of 97-98% of healthy individuals. It is set by the National Academies of Sciences. RDAs vary by age, sex, pregnancy, and lactation status.",
    },
    {
      question: "What are the most common nutritional deficiencies?",
      answer:
        "The most common nutrient shortfalls in the American diet are Vitamin D, calcium, potassium, dietary fiber, magnesium, and iron (especially in premenopausal women). Vitamin B12 deficiency is common in vegetarians/vegans and older adults.",
    },
    {
      question: "Should I take a multivitamin?",
      answer:
        "Most nutrition experts recommend getting nutrients from food first. A multivitamin may benefit those with restricted diets, older adults, pregnant women, or those with diagnosed deficiencies. Consult your healthcare provider for personalized supplementation advice.",
    },
  ],
  formula:
    "Nutrient Gap = RDA - Actual Intake | % of RDA = (Intake / RDA) x 100 | Gap exists if intake < 90% of RDA | RDA values from National Academies DRI tables",
};
