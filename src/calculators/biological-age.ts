import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const biologicalAgeCalculator: CalculatorDefinition = {
  slug: "biological-age-calculator",
  title: "Biological Age Calculator",
  description:
    "Free biological age calculator. Estimate your biological age based on lifestyle, fitness, and health factors. Compare your body's functional age to your chronological age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "biological age",
    "real age calculator",
    "body age",
    "health age",
    "how old is my body",
    "functional age",
    "aging calculator",
    "longevity calculator",
  ],
  variants: [
    {
      id: "lifestyle",
      name: "Biological Age Assessment",
      description: "Estimate biological age based on lifestyle and health factors",
      fields: [
        {
          name: "age",
          label: "Chronological Age",
          type: "number",
          placeholder: "e.g. 40",
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
          name: "exercise",
          label: "Exercise Frequency",
          type: "select",
          options: [
            { label: "None / Sedentary", value: "4" },
            { label: "Light (1-2 days/week)", value: "2" },
            { label: "Moderate (3-4 days/week)", value: "0" },
            { label: "Regular (5+ days/week)", value: "-2" },
            { label: "Athlete level", value: "-4" },
          ],
        },
        {
          name: "smoking",
          label: "Smoking Status",
          type: "select",
          options: [
            { label: "Never smoked", value: "0" },
            { label: "Former smoker (quit 5+ years)", value: "1" },
            { label: "Former smoker (quit <5 years)", value: "3" },
            { label: "Current smoker (light)", value: "5" },
            { label: "Current smoker (heavy)", value: "8" },
          ],
        },
        {
          name: "alcohol",
          label: "Alcohol Consumption",
          type: "select",
          options: [
            { label: "None", value: "0" },
            { label: "Light (1-7 drinks/week)", value: "0" },
            { label: "Moderate (8-14 drinks/week)", value: "2" },
            { label: "Heavy (15+ drinks/week)", value: "5" },
          ],
        },
        {
          name: "diet",
          label: "Diet Quality",
          type: "select",
          options: [
            { label: "Excellent (whole foods, balanced)", value: "-3" },
            { label: "Good (mostly healthy)", value: "-1" },
            { label: "Average (mixed)", value: "1" },
            { label: "Poor (processed foods, fast food)", value: "3" },
          ],
        },
        {
          name: "sleep",
          label: "Average Sleep Duration",
          type: "select",
          options: [
            { label: "Less than 5 hours", value: "4" },
            { label: "5-6 hours", value: "2" },
            { label: "7-8 hours (optimal)", value: "-1" },
            { label: "9+ hours", value: "1" },
          ],
        },
        {
          name: "stress",
          label: "Chronic Stress Level",
          type: "select",
          options: [
            { label: "Low (well-managed)", value: "-1" },
            { label: "Moderate", value: "1" },
            { label: "High", value: "3" },
            { label: "Very high / Burnout", value: "5" },
          ],
        },
        {
          name: "bmi",
          label: "BMI Category",
          type: "select",
          options: [
            { label: "Underweight (<18.5)", value: "2" },
            { label: "Normal (18.5-24.9)", value: "-1" },
            { label: "Overweight (25-29.9)", value: "2" },
            { label: "Obese (30+)", value: "4" },
          ],
        },
        {
          name: "socialConnection",
          label: "Social Connections",
          type: "select",
          options: [
            { label: "Strong social network", value: "-2" },
            { label: "Average social connections", value: "0" },
            { label: "Somewhat isolated", value: "2" },
            { label: "Socially isolated", value: "4" },
          ],
        },
        {
          name: "chronicConditions",
          label: "Chronic Health Conditions",
          type: "select",
          options: [
            { label: "None", value: "0" },
            { label: "1 well-managed condition", value: "1" },
            { label: "2-3 conditions", value: "3" },
            { label: "4+ conditions", value: "5" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const sex = inputs.sex as string;
        if (!age || !sex) return null;

        const modifiers = [
          parseInt(inputs.exercise as string) || 0,
          parseInt(inputs.smoking as string) || 0,
          parseInt(inputs.alcohol as string) || 0,
          parseInt(inputs.diet as string) || 0,
          parseInt(inputs.sleep as string) || 0,
          parseInt(inputs.stress as string) || 0,
          parseInt(inputs.bmi as string) || 0,
          parseInt(inputs.socialConnection as string) || 0,
          parseInt(inputs.chronicConditions as string) || 0,
        ];

        const totalModifier = modifiers.reduce((sum, m) => sum + m, 0);
        const biologicalAge = Math.round(Math.max(18, Math.min(100, age + totalModifier)));
        const ageDiff = biologicalAge - age;

        // Identify strongest positive and negative factors
        const factorLabels = ["Exercise", "Smoking", "Alcohol", "Diet", "Sleep", "Stress", "BMI", "Social connections", "Chronic conditions"];
        const positiveFactors = factorLabels.filter((_, i) => modifiers[i] < 0);
        const negativeFactors = factorLabels.filter((_, i) => modifiers[i] > 2);

        let assessment: string;
        if (ageDiff <= -5) assessment = "Excellent — your body is significantly younger than your age";
        else if (ageDiff <= -1) assessment = "Good — your lifestyle supports youthful aging";
        else if (ageDiff <= 2) assessment = "Average — roughly matching your chronological age";
        else if (ageDiff <= 5) assessment = "Above average aging — consider lifestyle improvements";
        else assessment = "Accelerated aging — significant lifestyle changes recommended";

        const topImprovement = factorLabels
          .map((label, i) => ({ label, value: modifiers[i] }))
          .filter(f => f.value > 0)
          .sort((a, b) => b.value - a.value)
          .slice(0, 3)
          .map(f => f.label);

        return {
          primary: { label: "Biological Age", value: `${biologicalAge} years` },
          details: [
            { label: "Biological age", value: `${biologicalAge} years` },
            { label: "Chronological age", value: `${age} years` },
            { label: "Difference", value: `${ageDiff > 0 ? "+" + ageDiff + " years older" : ageDiff < 0 ? ageDiff + " years younger" : "Same as actual age"}` },
            { label: "Assessment", value: assessment },
            { label: "Strengths", value: positiveFactors.length > 0 ? positiveFactors.join(", ") : "None identified — room for improvement" },
            ...(negativeFactors.length > 0 ? [{ label: "Areas of concern", value: negativeFactors.join(", ") }] : []),
            { label: "Top areas to improve", value: topImprovement.length > 0 ? topImprovement.join(", ") : "Maintain current habits" },
          ],
          note: "Biological age is an estimate based on modifiable lifestyle factors associated with aging research. This is not a clinical biomarker test. Actual biological age assessment requires blood tests (epigenetic clocks, telomere length, etc.). This tool is for educational and motivational purposes only — not medical advice.",
        };
      },
    },
  ],
  relatedSlugs: ["metabolic-age-calculator", "bmi-calculator", "heart-disease-risk-calculator", "tdee-calculator"],
  faq: [
    {
      question: "What is biological age?",
      answer:
        "Biological age estimates how old your body functions compared to average population. It differs from chronological age (years since birth) and is influenced by genetics, lifestyle, diet, exercise, stress, and environmental factors.",
    },
    {
      question: "How is biological age measured clinically?",
      answer:
        "Clinical biological age uses biomarkers: epigenetic clocks (DNA methylation), telomere length, blood markers (inflammatory markers, metabolic markers), and functional tests (grip strength, VO2max, cognitive tests). This calculator uses lifestyle proxies.",
    },
    {
      question: "Can I reverse my biological age?",
      answer:
        "Research suggests biological age can be reduced through regular exercise, healthy diet, adequate sleep (7-8 hours), stress management, smoking cessation, moderate alcohol consumption, and strong social connections. Some studies show 3-5 years of biological age reduction with lifestyle changes.",
    },
    {
      question: "What has the biggest impact on biological age?",
      answer:
        "The factors with the largest evidence-based impact on aging are: smoking status (cessation can reduce biological age significantly), regular exercise (especially combined strength and cardio), diet quality, and sleep. Social connection and stress management also play important roles.",
    },
  ],
  formula:
    "Biological Age = Chronological Age + Sum of Lifestyle Modifiers | Each factor adds or subtracts years based on research-associated aging effects | Factors: exercise, smoking, alcohol, diet, sleep, stress, BMI, social connections, chronic conditions",
};
