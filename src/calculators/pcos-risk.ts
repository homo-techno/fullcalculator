import type { CalculatorDefinition } from "./types";

export const pcosRiskCalculator: CalculatorDefinition = {
  slug: "pcos-risk-calculator",
  title: "PCOS Risk Assessment Calculator",
  description:
    "Free PCOS risk assessment calculator. Evaluate your risk for Polycystic Ovary Syndrome based on common symptoms, menstrual patterns, and risk factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pcos calculator",
    "pcos risk assessment",
    "polycystic ovary syndrome",
    "pcos symptoms checker",
    "pcos screening",
  ],
  variants: [
    {
      id: "pcos-risk",
      name: "PCOS Risk Assessment",
      description: "Evaluate your risk based on symptoms and history",
      fields: [
        {
          name: "periodRegularity",
          label: "Menstrual Cycle Pattern",
          type: "select",
          options: [
            { label: "Regular (every 21-35 days)", value: "regular" },
            { label: "Somewhat Irregular (cycles vary by 7+ days)", value: "somewhat" },
            { label: "Very Irregular (often skip months)", value: "irregular" },
            { label: "Absent (no period for 3+ months)", value: "absent" },
          ],
          defaultValue: "regular",
        },
        {
          name: "excessHair",
          label: "Excess Hair Growth (face, chest, back)",
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Mild", value: "mild" },
            { label: "Moderate to Severe", value: "severe" },
          ],
          defaultValue: "none",
        },
        {
          name: "acne",
          label: "Persistent Acne",
          type: "select",
          options: [
            { label: "No / Occasional", value: "no" },
            { label: "Yes, Moderate to Severe", value: "yes" },
          ],
          defaultValue: "no",
        },
        {
          name: "weightGain",
          label: "Unexplained Weight Gain (especially midsection)",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Some Weight Gain", value: "some" },
            { label: "Significant Weight Gain", value: "significant" },
          ],
          defaultValue: "no",
        },
        {
          name: "hairLoss",
          label: "Scalp Hair Thinning / Hair Loss",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
          defaultValue: "no",
        },
        {
          name: "familyHistory",
          label: "Family History of PCOS or Diabetes",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "PCOS in family", value: "pcos" },
            { label: "Type 2 Diabetes in family", value: "diabetes" },
            { label: "Both", value: "both" },
          ],
          defaultValue: "no",
        },
        {
          name: "skinDarkening",
          label: "Dark Skin Patches (neck, groin, underarms)",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
          defaultValue: "no",
        },
      ],
      calculate: (inputs) => {
        const period = inputs.periodRegularity as string;
        const hair = inputs.excessHair as string;
        const acne = inputs.acne as string;
        const weight = inputs.weightGain as string;
        const hairLoss = inputs.hairLoss as string;
        const family = inputs.familyHistory as string;
        const skin = inputs.skinDarkening as string;

        let riskScore = 0;
        const flags: string[] = [];

        // Menstrual irregularity (key Rotterdam criterion)
        if (period === "absent") { riskScore += 4; flags.push("Absent periods (strong indicator)"); }
        else if (period === "irregular") { riskScore += 3; flags.push("Very irregular periods (strong indicator)"); }
        else if (period === "somewhat") { riskScore += 1; flags.push("Somewhat irregular periods"); }

        // Hyperandrogenism signs
        if (hair === "severe") { riskScore += 3; flags.push("Significant excess hair growth (hirsutism)"); }
        else if (hair === "mild") { riskScore += 1; flags.push("Mild excess hair growth"); }

        if (acne === "yes") { riskScore += 2; flags.push("Persistent acne"); }
        if (hairLoss === "yes") { riskScore += 1; flags.push("Scalp hair thinning (androgenic alopecia)"); }

        // Metabolic indicators
        if (weight === "significant") { riskScore += 2; flags.push("Significant unexplained weight gain"); }
        else if (weight === "some") { riskScore += 1; flags.push("Some weight gain"); }

        if (skin === "yes") { riskScore += 2; flags.push("Dark skin patches (acanthosis nigricans - insulin resistance sign)"); }

        // Family history
        if (family === "both") { riskScore += 3; flags.push("Family history of both PCOS and diabetes"); }
        else if (family === "pcos") { riskScore += 2; flags.push("Family history of PCOS"); }
        else if (family === "diabetes") { riskScore += 1; flags.push("Family history of Type 2 diabetes"); }

        let riskLevel: string;
        let recommendation: string;
        if (riskScore <= 2) {
          riskLevel = "Low Risk";
          recommendation = "Your symptoms don't strongly suggest PCOS. Monitor any changes and mention concerns at your next well-woman visit.";
        } else if (riskScore <= 5) {
          riskLevel = "Moderate Risk";
          recommendation = "Some symptoms are consistent with PCOS. Consider scheduling an appointment to discuss screening with blood tests and possibly ultrasound.";
        } else if (riskScore <= 9) {
          riskLevel = "Elevated Risk";
          recommendation = "Multiple PCOS indicators present. Recommend scheduling an appointment with your OB-GYN or endocrinologist for evaluation including hormone blood panel and pelvic ultrasound.";
        } else {
          riskLevel = "High Risk";
          recommendation = "Strong symptom profile for PCOS. Please see a healthcare provider for comprehensive evaluation. PCOS is manageable with proper treatment.";
        }

        return {
          primary: {
            label: "PCOS Risk Level",
            value: riskLevel,
          },
          details: [
            { label: "Risk Score", value: `${riskScore} / 18` },
            { label: "Recommendation", value: recommendation },
            ...flags.map((f, i) => ({ label: `Finding ${i + 1}`, value: f })),
          ],
          note: "This is a screening tool, NOT a diagnosis. PCOS diagnosis requires meeting 2 of 3 Rotterdam criteria: irregular/absent periods, signs of excess androgens (blood test or physical symptoms), and polycystic ovaries on ultrasound. Only a healthcare provider can diagnose PCOS.",
        };
      },
    },
  ],
  relatedSlugs: ["period-calculator", "fertility-window-calculator", "bmi-calculator"],
  faq: [
    {
      question: "What is PCOS?",
      answer:
        "Polycystic Ovary Syndrome (PCOS) is a hormonal disorder affecting 6-12% of reproductive-age women. It is characterized by irregular periods, excess androgen hormones, and often (but not always) polycystic ovaries on ultrasound. PCOS can affect fertility, metabolism, and overall health.",
    },
    {
      question: "How is PCOS diagnosed?",
      answer:
        "PCOS is diagnosed using the Rotterdam criteria. You need at least 2 of these 3: 1) Irregular or absent periods, 2) Clinical or biochemical signs of excess androgens (hirsutism, acne, or elevated blood levels), 3) Polycystic ovaries on ultrasound (12+ follicles or increased ovarian volume). Other conditions must be ruled out first.",
    },
    {
      question: "Can PCOS be treated?",
      answer:
        "Yes. While there's no cure, PCOS is very manageable. Treatments include: lifestyle changes (diet, exercise, weight management), hormonal birth control (to regulate periods and reduce androgens), metformin (for insulin resistance), spironolactone (for hirsutism/acne), and fertility treatments if trying to conceive.",
    },
  ],
  formula:
    "Risk Score = Sum of weighted symptom indicators (0-18) | Risk Level = Low (<3), Moderate (3-5), Elevated (6-9), High (10+)",
};
