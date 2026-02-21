import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gestationalDiabetesCalculator: CalculatorDefinition = {
  slug: "gestational-diabetes-calculator",
  title: "Gestational Diabetes Risk Calculator",
  description:
    "Free gestational diabetes risk calculator. Assess your risk factors for gestational diabetes mellitus (GDM) during pregnancy based on clinical guidelines.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "gestational diabetes",
    "pregnancy diabetes risk",
    "GDM risk calculator",
    "gestational diabetes screening",
    "pregnancy blood sugar",
    "diabetes during pregnancy",
  ],
  variants: [
    {
      id: "risk-assessment",
      name: "GDM Risk Assessment",
      description: "Evaluate your risk factors for gestational diabetes",
      fields: [
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "years",
          min: 15,
          max: 55,
        },
        {
          name: "bmi",
          label: "Pre-pregnancy BMI",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "kg/m²",
          min: 12,
          max: 60,
          step: 0.1,
        },
        {
          name: "familyDiabetes",
          label: "Family History of Diabetes (first degree)?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "priorGdm",
          label: "Prior Gestational Diabetes?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "priorMacrosomia",
          label: "Prior Baby Over 9 lbs (4 kg)?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "pcos",
          label: "Polycystic Ovary Syndrome (PCOS)?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
        {
          name: "ethnicity",
          label: "High-risk Ethnicity (Hispanic, African American, Native American, South/East Asian, Pacific Islander)?",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const bmi = inputs.bmi as number;
        if (!age || !bmi) return null;

        let riskScore = 0;
        const riskFactors: string[] = [];

        // Age risk
        if (age >= 35) { riskScore += 2; riskFactors.push("Age 35+"); }
        else if (age >= 25) { riskScore += 1; }

        // BMI risk
        if (bmi >= 35) { riskScore += 3; riskFactors.push("BMI 35+ (class II/III obesity)"); }
        else if (bmi >= 30) { riskScore += 2; riskFactors.push("BMI 30-34.9 (obesity)"); }
        else if (bmi >= 25) { riskScore += 1; riskFactors.push("BMI 25-29.9 (overweight)"); }

        // Family history
        if (inputs.familyDiabetes === "yes") { riskScore += 2; riskFactors.push("Family history of diabetes"); }

        // Prior GDM
        if (inputs.priorGdm === "yes") { riskScore += 3; riskFactors.push("Prior gestational diabetes"); }

        // Prior macrosomia
        if (inputs.priorMacrosomia === "yes") { riskScore += 1; riskFactors.push("Prior macrosomic baby"); }

        // PCOS
        if (inputs.pcos === "yes") { riskScore += 2; riskFactors.push("PCOS"); }

        // Ethnicity
        if (inputs.ethnicity === "yes") { riskScore += 1; riskFactors.push("High-risk ethnicity"); }

        let riskLevel: string;
        let screeningRec: string;
        if (riskScore <= 1) {
          riskLevel = "Low risk";
          screeningRec = "Standard glucose screening at 24-28 weeks";
        } else if (riskScore <= 4) {
          riskLevel = "Average risk";
          screeningRec = "Glucose screening at 24-28 weeks";
        } else if (riskScore <= 7) {
          riskLevel = "High risk";
          screeningRec = "Early glucose screening (first prenatal visit) and repeat at 24-28 weeks if normal";
        } else {
          riskLevel = "Very high risk";
          screeningRec = "Early glucose screening strongly recommended; close monitoring throughout pregnancy";
        }

        return {
          primary: { label: "GDM Risk Level", value: riskLevel },
          details: [
            { label: "Risk score", value: `${riskScore} points` },
            { label: "Risk level", value: riskLevel },
            { label: "Risk factors identified", value: riskFactors.length > 0 ? riskFactors.join(", ") : "None identified" },
            { label: "Screening recommendation", value: screeningRec },
            { label: "Pre-pregnancy BMI", value: formatNumber(bmi, 1) },
          ],
          note: "This is a risk assessment tool, not a diagnostic test. Gestational diabetes is diagnosed through glucose tolerance testing (OGTT). The American Diabetes Association recommends screening at 24-28 weeks, or earlier if risk factors are present. Consult your OB/GYN for proper screening.",
        };
      },
    },
    {
      id: "glucose-results",
      name: "Glucose Test Results Interpreter",
      description: "Interpret your gestational diabetes screening results",
      fields: [
        {
          name: "testType",
          label: "Test Type",
          type: "select",
          options: [
            { label: "1-hour GCT (50g)", value: "gct" },
            { label: "3-hour OGTT (100g) - Carpenter-Coustan", value: "ogtt" },
          ],
        },
        {
          name: "fasting",
          label: "Fasting Glucose (OGTT only, enter 0 for GCT)",
          type: "number",
          placeholder: "e.g. 92",
          suffix: "mg/dL",
          min: 0,
          max: 400,
        },
        {
          name: "oneHour",
          label: "1-Hour Glucose",
          type: "number",
          placeholder: "e.g. 140",
          suffix: "mg/dL",
          min: 40,
          max: 400,
        },
        {
          name: "twoHour",
          label: "2-Hour Glucose (OGTT only, enter 0 for GCT)",
          type: "number",
          placeholder: "e.g. 155",
          suffix: "mg/dL",
          min: 0,
          max: 400,
        },
        {
          name: "threeHour",
          label: "3-Hour Glucose (OGTT only, enter 0 for GCT)",
          type: "number",
          placeholder: "e.g. 140",
          suffix: "mg/dL",
          min: 0,
          max: 400,
        },
      ],
      calculate: (inputs) => {
        const testType = inputs.testType as string;
        const oneHour = inputs.oneHour as number;
        if (!testType || !oneHour) return null;

        if (testType === "gct") {
          let result: string;
          let detail: string;
          if (oneHour < 130) { result = "Normal"; detail = "Passed — GDM screening negative"; }
          else if (oneHour < 140) { result = "Borderline"; detail = "May need 3-hour OGTT (depends on provider threshold)"; }
          else if (oneHour < 200) { result = "Abnormal"; detail = "3-hour OGTT recommended for diagnosis"; }
          else { result = "Highly Abnormal"; detail = "May be diagnostic of GDM without further testing"; }
          return {
            primary: { label: "GCT Result", value: result },
            details: [
              { label: "1-hour glucose", value: `${oneHour} mg/dL` },
              { label: "Interpretation", value: detail },
              { label: "Normal threshold", value: "< 130-140 mg/dL (varies by provider)" },
            ],
            note: "The 50g GCT is a screening test, not diagnostic. An abnormal result requires a 3-hour OGTT for diagnosis. Consult your healthcare provider for proper interpretation.",
          };
        }

        // 3-hour OGTT (Carpenter-Coustan criteria)
        const fasting = inputs.fasting as number;
        const twoHour = inputs.twoHour as number;
        const threeHour = inputs.threeHour as number;
        if (!fasting) return null;

        // Carpenter-Coustan thresholds
        let abnormalCount = 0;
        const results: { label: string; value: string }[] = [];

        if (fasting >= 95) { abnormalCount++; results.push({ label: "Fasting", value: `${fasting} mg/dL (ABNORMAL, threshold: 95)` }); }
        else results.push({ label: "Fasting", value: `${fasting} mg/dL (normal)` });

        if (oneHour >= 180) { abnormalCount++; results.push({ label: "1-hour", value: `${oneHour} mg/dL (ABNORMAL, threshold: 180)` }); }
        else results.push({ label: "1-hour", value: `${oneHour} mg/dL (normal)` });

        if (twoHour && twoHour > 0) {
          if (twoHour >= 155) { abnormalCount++; results.push({ label: "2-hour", value: `${twoHour} mg/dL (ABNORMAL, threshold: 155)` }); }
          else results.push({ label: "2-hour", value: `${twoHour} mg/dL (normal)` });
        }

        if (threeHour && threeHour > 0) {
          if (threeHour >= 140) { abnormalCount++; results.push({ label: "3-hour", value: `${threeHour} mg/dL (ABNORMAL, threshold: 140)` }); }
          else results.push({ label: "3-hour", value: `${threeHour} mg/dL (normal)` });
        }

        const diagnosed = abnormalCount >= 2;

        return {
          primary: { label: "OGTT Result", value: diagnosed ? "GDM Diagnosed" : "Normal" },
          details: [
            ...results,
            { label: "Abnormal values", value: `${abnormalCount} of 4` },
            { label: "Diagnosis", value: diagnosed ? "GDM is diagnosed (2+ abnormal values)" : "GDM not diagnosed (fewer than 2 abnormal values)" },
            { label: "Criteria", value: "Carpenter-Coustan" },
          ],
          note: "Carpenter-Coustan criteria: GDM is diagnosed when 2 or more values meet or exceed thresholds (fasting >= 95, 1h >= 180, 2h >= 155, 3h >= 140 mg/dL). This tool is for educational purposes — confirm with your OB/GYN.",
        };
      },
    },
  ],
  relatedSlugs: ["a1c-calculator", "blood-sugar-calculator", "due-date-calculator", "pregnancy-calculator"],
  faq: [
    {
      question: "What is gestational diabetes?",
      answer:
        "Gestational diabetes mellitus (GDM) is diabetes first diagnosed during pregnancy. It affects 6-9% of pregnancies and usually resolves after delivery, but increases future type 2 diabetes risk.",
    },
    {
      question: "When is gestational diabetes screening done?",
      answer:
        "Screening is typically done at 24-28 weeks of pregnancy. Women with risk factors may be screened earlier at the first prenatal visit. The most common approach is the 1-hour glucose challenge test (50g GCT).",
    },
    {
      question: "Can gestational diabetes be prevented?",
      answer:
        "Risk can be reduced through maintaining a healthy weight before pregnancy, regular exercise, and a balanced diet. However, some risk factors like age and family history cannot be modified.",
    },
    {
      question: "What are the risks of gestational diabetes?",
      answer:
        "Untreated GDM can lead to macrosomia (large baby), birth injuries, neonatal hypoglycemia, preeclampsia, increased cesarean delivery risk, and long-term diabetes risk for both mother and child.",
    },
  ],
  formula:
    "Risk assessment based on ADA/ACOG guidelines considering age, BMI, family history, obstetric history, and ethnicity. Diagnosis: Carpenter-Coustan criteria (3h 100g OGTT: fasting >= 95, 1h >= 180, 2h >= 155, 3h >= 140 mg/dL; GDM if 2+ abnormal values).",
};
