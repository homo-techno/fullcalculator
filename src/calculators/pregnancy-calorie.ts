import type { CalculatorDefinition } from "./types";

export const pregnancyCalorieCalculator: CalculatorDefinition = {
  slug: "pregnancy-calorie-calculator",
  title: "Pregnancy Calorie Needs Calculator",
  description:
    "Free pregnancy calorie calculator. Estimate your daily calorie needs during each trimester of pregnancy based on your age, weight, height, and activity level.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pregnancy calories",
    "calories during pregnancy",
    "pregnancy nutrition calculator",
    "how many calories pregnant",
    "pregnancy diet calculator",
  ],
  variants: [
    {
      id: "pregnancy-calorie",
      name: "Pregnancy Calorie Needs",
      description: "Calculate daily calorie requirements during pregnancy",
      fields: [
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "years",
          min: 18,
          max: 50,
        },
        {
          name: "weight",
          label: "Pre-Pregnancy Weight",
          type: "number",
          placeholder: "e.g. 140",
          suffix: "lbs",
          min: 80,
          max: 400,
        },
        {
          name: "heightFeet",
          label: "Height (feet)",
          type: "number",
          placeholder: "e.g. 5",
          min: 4,
          max: 7,
        },
        {
          name: "heightInches",
          label: "Height (inches)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 11,
          defaultValue: 0,
        },
        {
          name: "activity",
          label: "Activity Level",
          type: "select",
          options: [
            { label: "Sedentary (little or no exercise)", value: "sedentary" },
            { label: "Lightly Active (1-3 days/week)", value: "light" },
            { label: "Moderately Active (3-5 days/week)", value: "moderate" },
            { label: "Very Active (6-7 days/week)", value: "active" },
          ],
          defaultValue: "light",
        },
        {
          name: "trimester",
          label: "Current Trimester",
          type: "select",
          options: [
            { label: "First Trimester (Weeks 1-12)", value: "1" },
            { label: "Second Trimester (Weeks 13-26)", value: "2" },
            { label: "Third Trimester (Weeks 27-40)", value: "3" },
          ],
          defaultValue: "1",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const weight = inputs.weight as number;
        const feet = inputs.heightFeet as number;
        const inches = (inputs.heightInches as number) || 0;
        const activity = inputs.activity as string;
        const trimester = inputs.trimester as string;
        if (!age || !weight || !feet) return null;

        // Mifflin-St Jeor for women
        const weightKg = weight * 0.453592;
        const heightCm = (feet * 12 + inches) * 2.54;
        const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

        let activityMultiplier: number;
        if (activity === "sedentary") activityMultiplier = 1.2;
        else if (activity === "light") activityMultiplier = 1.375;
        else if (activity === "moderate") activityMultiplier = 1.55;
        else activityMultiplier = 1.725;

        const maintenance = Math.round(bmr * activityMultiplier);

        let extraCalories: number;
        let trimesterName: string;
        if (trimester === "1") {
          extraCalories = 0;
          trimesterName = "First Trimester";
        } else if (trimester === "2") {
          extraCalories = 340;
          trimesterName = "Second Trimester";
        } else {
          extraCalories = 450;
          trimesterName = "Third Trimester";
        }

        const pregnancyCalories = maintenance + extraCalories;
        const proteinGrams = Math.round(weightKg * 1.1);
        const proteinCalories = proteinGrams * 4;

        return {
          primary: {
            label: "Daily Calories Needed",
            value: `${pregnancyCalories}`,
            suffix: "cal/day",
          },
          details: [
            { label: "Trimester", value: trimesterName },
            { label: "Base Maintenance Calories", value: `${maintenance} cal/day` },
            { label: "Extra Pregnancy Calories", value: `+${extraCalories} cal/day` },
            { label: "Protein Recommendation", value: `${proteinGrams}g/day (${proteinCalories} cal)` },
            { label: "BMR (Basal Metabolic Rate)", value: `${Math.round(bmr)} cal/day` },
            { label: "1st Trimester Need", value: `${maintenance} cal/day (+0)` },
            { label: "2nd Trimester Need", value: `${maintenance + 340} cal/day (+340)` },
            { label: "3rd Trimester Need", value: `${maintenance + 450} cal/day (+450)` },
          ],
          note: "ACOG recommends no extra calories in the first trimester, approximately 340 extra in the second, and 450 extra in the third trimester. Individual needs vary based on pre-pregnancy BMI. Consult your healthcare provider for personalized nutrition advice.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "pregnancy-bmi-calculator", "pregnancy-calculator"],
  faq: [
    {
      question: "How many extra calories do I need during pregnancy?",
      answer:
        "According to ACOG guidelines: First trimester: no additional calories needed. Second trimester: approximately 340 extra calories per day. Third trimester: approximately 450 extra calories per day. The old saying of 'eating for two' is a myth.",
    },
    {
      question: "What should I eat during pregnancy?",
      answer:
        "Focus on nutrient-dense foods: lean protein, whole grains, fruits and vegetables, dairy, and healthy fats. Key nutrients include folate (leafy greens, fortified grains), iron (lean meat, beans), calcium (dairy, fortified foods), DHA omega-3 (fatty fish), and fiber.",
    },
    {
      question: "Should I eat more if I'm carrying twins?",
      answer:
        "Yes. For a twin pregnancy, you generally need about 600 additional calories per day beyond your baseline, totaling about 300 extra calories per baby. Protein needs are also higher at about 100-120g per day. Discuss specifics with your OB-GYN.",
    },
  ],
  formula:
    "BMR = 10 x Weight(kg) + 6.25 x Height(cm) - 5 x Age - 161 | TDEE = BMR x Activity Factor | Pregnancy Calories = TDEE + Trimester Extra (0/340/450)",
};
