import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metabolicAgeCalculator: CalculatorDefinition = {
  slug: "metabolic-age-calculator",
  title: "Metabolic Age Calculator",
  description:
    "Free metabolic age calculator. Compare your Basal Metabolic Rate (BMR) to age-group averages to estimate your metabolic age. Understand if your metabolism is younger or older than your actual age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "metabolic age",
    "metabolism age",
    "BMR age",
    "metabolic rate age",
    "body metabolism",
    "metabolic age calculator",
    "metabolism calculator",
  ],
  variants: [
    {
      id: "metric",
      name: "Metabolic Age (Metric)",
      description: "Calculate metabolic age using metric measurements",
      fields: [
        {
          name: "age",
          label: "Actual Age",
          type: "number",
          placeholder: "e.g. 35",
          suffix: "years",
          min: 18,
          max: 100,
        },
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
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 70",
          suffix: "kg",
          min: 30,
          max: 300,
          step: 0.5,
        },
        {
          name: "height",
          label: "Height",
          type: "number",
          placeholder: "e.g. 175",
          suffix: "cm",
          min: 100,
          max: 250,
        },
        {
          name: "activityLevel",
          label: "Physical Activity Level",
          type: "select",
          options: [
            { label: "Sedentary (little/no exercise)", value: "1.2" },
            { label: "Lightly active (1-3 days/week)", value: "1.375" },
            { label: "Moderately active (3-5 days/week)", value: "1.55" },
            { label: "Very active (6-7 days/week)", value: "1.725" },
            { label: "Extra active (athlete/physical job)", value: "1.9" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        const weight = inputs.weight as number;
        const height = inputs.height as number;
        const activityStr = inputs.activityLevel as string;
        if (!age || !sex || !weight || !height || !activityStr) return null;
        const activityMultiplier = parseFloat(activityStr);

        // Mifflin-St Jeor BMR
        let bmr: number;
        if (sex === "male") {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const tdee = bmr * activityMultiplier;

        // Calculate expected BMR for the person's age using average body composition
        // Then find what age would produce this BMR with average stats
        // Average reference: male 78kg/176cm, female 65kg/163cm
        const refWeight = sex === "male" ? 78 : 65;
        const refHeight = sex === "male" ? 176 : 163;
        const sConstant = sex === "male" ? 5 : -161;

        // Expected BMR at their age with reference stats
        const expectedBmr = 10 * refWeight + 6.25 * refHeight - 5 * age + sConstant;

        // What age would produce their actual BMR with their stats
        // BMR = 10*W + 6.25*H - 5*metaAge + constant
        // metaAge = (10*W + 6.25*H + constant - BMR) / 5
        const metabolicAge = Math.round((10 * weight + 6.25 * height + sConstant - bmr) / 5);

        // Alternative: comparing their BMR to age-expected BMR
        // If BMR is higher than expected for age, metabolic age is younger
        const bmrDifference = bmr - expectedBmr;
        const adjustedMetaAge = Math.round(age - bmrDifference / 5);
        const clampedMetaAge = Math.max(15, Math.min(90, adjustedMetaAge));

        const ageDiff = age - clampedMetaAge;
        let assessment: string;
        if (ageDiff >= 5) assessment = "Excellent — your metabolism is significantly younger than your chronological age";
        else if (ageDiff >= 1) assessment = "Good — your metabolism is slightly younger than your age";
        else if (ageDiff >= -2) assessment = "Average — your metabolic age matches your chronological age";
        else if (ageDiff >= -5) assessment = "Below average — your metabolic age is older than your actual age";
        else assessment = "Consider lifestyle changes — significant gap between metabolic and actual age";

        return {
          primary: { label: "Metabolic Age", value: `${clampedMetaAge} years` },
          details: [
            { label: "Metabolic age", value: `${clampedMetaAge} years` },
            { label: "Chronological age", value: `${age} years` },
            { label: "Difference", value: `${ageDiff > 0 ? ageDiff + " years younger" : ageDiff < 0 ? Math.abs(ageDiff) + " years older" : "Same as actual age"}` },
            { label: "Your BMR", value: `${formatNumber(bmr, 0)} calories/day` },
            { label: "Your TDEE", value: `${formatNumber(tdee, 0)} calories/day` },
            { label: "Assessment", value: assessment },
          ],
          note: "Metabolic age is an estimated concept comparing your BMR to population averages. It is not a standardized clinical measurement. A lower metabolic age generally indicates a more active metabolism, often associated with higher muscle mass and regular physical activity. This is an estimate, not medical advice.",
        };
      },
    },
    {
      id: "imperial",
      name: "Metabolic Age (Imperial)",
      description: "Calculate metabolic age using imperial measurements",
      fields: [
        {
          name: "age",
          label: "Actual Age",
          type: "number",
          placeholder: "e.g. 35",
          suffix: "years",
          min: 18,
          max: 100,
        },
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
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 154",
          suffix: "lbs",
          min: 66,
          max: 660,
        },
        {
          name: "feet",
          label: "Height (feet)",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "ft",
          min: 3,
          max: 8,
        },
        {
          name: "inches",
          label: "Height (inches)",
          type: "number",
          placeholder: "e.g. 9",
          suffix: "in",
          min: 0,
          max: 11,
        },
        {
          name: "activityLevel",
          label: "Physical Activity Level",
          type: "select",
          options: [
            { label: "Sedentary (little/no exercise)", value: "1.2" },
            { label: "Lightly active (1-3 days/week)", value: "1.375" },
            { label: "Moderately active (3-5 days/week)", value: "1.55" },
            { label: "Very active (6-7 days/week)", value: "1.725" },
            { label: "Extra active (athlete/physical job)", value: "1.9" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        const weightLbs = inputs.weight as number;
        const feet = inputs.feet as number;
        const inches = (inputs.inches as number) || 0;
        const activityStr = inputs.activityLevel as string;
        if (!age || !sex || !weightLbs || !feet || !activityStr) return null;

        const weight = weightLbs * 0.453592;
        const height = (feet * 12 + inches) * 2.54;
        const activityMultiplier = parseFloat(activityStr);

        let bmr: number;
        if (sex === "male") {
          bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
          bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        const tdee = bmr * activityMultiplier;
        const refWeight = sex === "male" ? 78 : 65;
        const refHeight = sex === "male" ? 176 : 163;
        const sConstant = sex === "male" ? 5 : -161;
        const expectedBmr = 10 * refWeight + 6.25 * refHeight - 5 * age + sConstant;
        const bmrDifference = bmr - expectedBmr;
        const adjustedMetaAge = Math.round(age - bmrDifference / 5);
        const clampedMetaAge = Math.max(15, Math.min(90, adjustedMetaAge));
        const ageDiff = age - clampedMetaAge;

        let assessment: string;
        if (ageDiff >= 5) assessment = "Excellent — metabolism significantly younger";
        else if (ageDiff >= 1) assessment = "Good — metabolism slightly younger";
        else if (ageDiff >= -2) assessment = "Average — matches chronological age";
        else if (ageDiff >= -5) assessment = "Below average — metabolism older than age";
        else assessment = "Consider lifestyle changes to improve metabolic health";

        return {
          primary: { label: "Metabolic Age", value: `${clampedMetaAge} years` },
          details: [
            { label: "Metabolic age", value: `${clampedMetaAge} years` },
            { label: "Actual age", value: `${age} years` },
            { label: "Difference", value: `${ageDiff > 0 ? ageDiff + " years younger" : ageDiff < 0 ? Math.abs(ageDiff) + " years older" : "Same"}` },
            { label: "BMR", value: `${formatNumber(bmr, 0)} cal/day` },
            { label: "TDEE", value: `${formatNumber(tdee, 0)} cal/day` },
            { label: "Assessment", value: assessment },
          ],
          note: "Metabolic age compares your BMR to age-group averages. To improve metabolic age: increase muscle mass through strength training, maintain regular cardio exercise, eat adequate protein, stay hydrated, and get enough sleep. This is an estimate, not a clinical measurement.",
        };
      },
    },
  ],
  relatedSlugs: ["bmr-calculator", "tdee-calculator", "biological-age-calculator", "bmi-calculator"],
  faq: [
    {
      question: "What is metabolic age?",
      answer:
        "Metabolic age compares your Basal Metabolic Rate (BMR) to the average BMR of different age groups. If your metabolic age is lower than your actual age, your metabolism is more efficient than average. It is an estimated concept, not a standardized medical test.",
    },
    {
      question: "How can I lower my metabolic age?",
      answer:
        "Build muscle mass through strength training (muscle burns more calories at rest), maintain regular cardiovascular exercise, eat a balanced diet with adequate protein, stay hydrated, get 7-9 hours of sleep, and manage stress.",
    },
    {
      question: "What factors affect metabolic rate?",
      answer:
        "BMR is influenced by: body composition (muscle vs fat), age, sex, height, weight, hormones (thyroid function), genetics, and physical fitness level. Muscle tissue burns about 3x more calories at rest than fat tissue.",
    },
    {
      question: "Is metabolic age the same as biological age?",
      answer:
        "No. Metabolic age focuses specifically on metabolism (calorie burning). Biological age is a broader concept that considers cardiovascular health, cellular aging, fitness, and multiple biomarkers. Both are estimates comparing your health to population averages.",
    },
  ],
  formula:
    "BMR (Mifflin-St Jeor): Males = 10×weight(kg) + 6.25×height(cm) - 5×age + 5 | Females = 10×weight(kg) + 6.25×height(cm) - 5×age - 161 | TDEE = BMR × Activity factor | Metabolic age estimated by comparing personal BMR to age-group reference BMR values",
};
