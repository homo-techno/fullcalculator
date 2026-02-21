import type { CalculatorDefinition } from "./types";

export const fallRiskCalculator: CalculatorDefinition = {
  slug: "fall-risk-calculator",
  title: "Fall Risk Assessment Calculator",
  description:
    "Free fall risk assessment calculator. Evaluate fall risk using the Morse Fall Scale. Identify risk factors for falls in clinical and home settings.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "fall risk calculator",
    "fall risk assessment",
    "Morse Fall Scale",
    "fall prevention",
    "elderly fall risk",
    "patient safety",
    "fall risk score",
  ],
  variants: [
    {
      id: "morse",
      name: "Morse Fall Scale",
      description: "Assess fall risk using the Morse Fall Scale (clinical)",
      fields: [
        {
          name: "fallHistory",
          label: "History of Falling (within 3 months)?",
          type: "select",
          options: [
            { label: "No (0 points)", value: "0" },
            { label: "Yes (25 points)", value: "25" },
          ],
        },
        {
          name: "secondaryDx",
          label: "Secondary Diagnosis (2+ medical diagnoses)?",
          type: "select",
          options: [
            { label: "No (0 points)", value: "0" },
            { label: "Yes (15 points)", value: "15" },
          ],
        },
        {
          name: "ambulatoryAid",
          label: "Ambulatory Aid",
          type: "select",
          options: [
            { label: "None / Bed rest / Nurse assist (0 points)", value: "0" },
            { label: "Crutches / Cane / Walker (15 points)", value: "15" },
            { label: "Furniture for support (30 points)", value: "30" },
          ],
        },
        {
          name: "ivTherapy",
          label: "IV Therapy / Heparin Lock?",
          type: "select",
          options: [
            { label: "No (0 points)", value: "0" },
            { label: "Yes (20 points)", value: "20" },
          ],
        },
        {
          name: "gait",
          label: "Gait / Transferring",
          type: "select",
          options: [
            { label: "Normal / Bed rest / Immobile (0 points)", value: "0" },
            { label: "Weak (10 points)", value: "10" },
            { label: "Impaired (20 points)", value: "20" },
          ],
        },
        {
          name: "mentalStatus",
          label: "Mental Status",
          type: "select",
          options: [
            { label: "Aware of own limitations (0 points)", value: "0" },
            { label: "Overestimates or forgets limitations (15 points)", value: "15" },
          ],
        },
      ],
      calculate: (inputs) => {
        const fallHistory = parseInt(inputs.fallHistory as string);
        const secondary = parseInt(inputs.secondaryDx as string);
        const ambulatory = parseInt(inputs.ambulatoryAid as string);
        const iv = parseInt(inputs.ivTherapy as string);
        const gait = parseInt(inputs.gait as string);
        const mental = parseInt(inputs.mentalStatus as string);

        if (isNaN(fallHistory) || isNaN(secondary) || isNaN(ambulatory) || isNaN(iv) || isNaN(gait) || isNaN(mental)) return null;

        const totalScore = fallHistory + secondary + ambulatory + iv + gait + mental;

        let riskLevel: string;
        let actionRequired: string;
        if (totalScore <= 24) {
          riskLevel = "Low risk";
          actionRequired = "Standard fall prevention: good basic nursing care";
        } else if (totalScore <= 44) {
          riskLevel = "Moderate risk";
          actionRequired = "Implement standard fall prevention interventions";
        } else {
          riskLevel = "High risk";
          actionRequired = "Implement high-risk fall prevention interventions immediately";
        }

        const interventions: string[] = [];
        if (totalScore > 24) {
          interventions.push("Fall risk signage");
          interventions.push("Non-slip footwear");
          interventions.push("Call bell within reach");
          interventions.push("Bed in lowest position with brakes locked");
        }
        if (totalScore > 44) {
          interventions.push("Consider bed alarm / chair alarm");
          interventions.push("Frequent rounding (every 1-2 hours)");
          interventions.push("Assistive devices within reach");
          interventions.push("Toileting schedule");
          interventions.push("Review medications for fall risk");
        }

        return {
          primary: { label: "Morse Fall Scale Score", value: `${totalScore}` },
          details: [
            { label: "Total score", value: `${totalScore} / 125` },
            { label: "Risk level", value: riskLevel },
            { label: "Action required", value: actionRequired },
            { label: "Recommended interventions", value: interventions.length > 0 ? interventions.join("; ") : "Standard nursing care" },
          ],
          note: "The Morse Fall Scale is a clinical tool used in hospital settings. Scores: 0-24 = low risk, 25-44 = moderate risk, 45+ = high risk. Reassess with any change in patient condition, after a fall, and at regular intervals per institutional policy. This is an educational tool — consult nursing and clinical protocols.",
        };
      },
    },
    {
      id: "home",
      name: "Home Fall Risk Assessment",
      description: "Assess fall risk factors in the home environment",
      fields: [
        {
          name: "age",
          label: "Age",
          type: "number",
          placeholder: "e.g. 72",
          suffix: "years",
          min: 18,
          max: 120,
        },
        {
          name: "fallsLastYear",
          label: "Falls in the Past Year",
          type: "select",
          options: [
            { label: "None", value: "0" },
            { label: "1 fall", value: "1" },
            { label: "2+ falls", value: "2" },
          ],
        },
        {
          name: "medications",
          label: "Number of Prescription Medications",
          type: "select",
          options: [
            { label: "0-3 medications", value: "0" },
            { label: "4-6 medications", value: "1" },
            { label: "7+ medications (polypharmacy)", value: "2" },
          ],
        },
        {
          name: "balanceProblems",
          label: "Balance or Walking Difficulties?",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes", value: "2" },
          ],
        },
        {
          name: "visionImpairment",
          label: "Vision Impairment?",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ],
        },
        {
          name: "homeHazards",
          label: "Home Hazards (loose rugs, poor lighting, clutter)?",
          type: "select",
          options: [
            { label: "No / Minimal", value: "0" },
            { label: "Some hazards present", value: "1" },
            { label: "Multiple hazards", value: "2" },
          ],
        },
        {
          name: "fearOfFalling",
          label: "Fear of Falling?",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes", value: "1" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        if (!age) return null;

        let riskScore = 0;
        const riskFactors: string[] = [];

        if (age >= 80) { riskScore += 3; riskFactors.push("Age 80+"); }
        else if (age >= 65) { riskScore += 2; riskFactors.push("Age 65-79"); }

        const falls = parseInt(inputs.fallsLastYear as string) || 0;
        if (falls >= 2) { riskScore += 3; riskFactors.push("2+ falls in past year"); }
        else if (falls >= 1) { riskScore += 2; riskFactors.push("1 fall in past year"); }

        const meds = parseInt(inputs.medications as string) || 0;
        riskScore += meds;
        if (meds >= 2) riskFactors.push("Polypharmacy (7+ medications)");
        else if (meds >= 1) riskFactors.push("Multiple medications (4-6)");

        const balance = parseInt(inputs.balanceProblems as string) || 0;
        riskScore += balance;
        if (balance > 0) riskFactors.push("Balance/walking difficulties");

        const vision = parseInt(inputs.visionImpairment as string) || 0;
        riskScore += vision;
        if (vision > 0) riskFactors.push("Vision impairment");

        const hazards = parseInt(inputs.homeHazards as string) || 0;
        riskScore += hazards;
        if (hazards > 0) riskFactors.push("Home environmental hazards");

        const fear = parseInt(inputs.fearOfFalling as string) || 0;
        riskScore += fear;
        if (fear > 0) riskFactors.push("Fear of falling");

        let riskLevel: string;
        if (riskScore <= 3) riskLevel = "Low risk";
        else if (riskScore <= 7) riskLevel = "Moderate risk";
        else riskLevel = "High risk";

        return {
          primary: { label: "Fall Risk Level", value: riskLevel },
          details: [
            { label: "Risk score", value: `${riskScore} points` },
            { label: "Risk level", value: riskLevel },
            { label: "Risk factors", value: riskFactors.length > 0 ? riskFactors.join(", ") : "None identified" },
            { label: "Modifiable factors", value: "Home hazards, medications, exercise/balance training, vision correction, footwear" },
            { label: "Key recommendation", value: riskScore > 3 ? "Discuss fall prevention with healthcare provider; consider physical therapy for balance training" : "Maintain regular exercise and home safety practices" },
          ],
          note: "This is a simplified home-based fall risk screening tool. CDC's STEADI initiative recommends annual fall risk screening for all adults 65+. Key interventions include exercise programs (tai chi, balance training), medication review, vision checks, and home safety modifications.",
        };
      },
    },
  ],
  relatedSlugs: ["pain-scale-calculator", "mental-health-score-calculator", "bmi-calculator"],
  faq: [
    {
      question: "What is the Morse Fall Scale?",
      answer:
        "The Morse Fall Scale is a clinical tool used in hospitals to assess a patient's risk of falling. It evaluates six factors: fall history, secondary diagnosis, ambulatory aid, IV therapy, gait, and mental status. Scores range from 0-125.",
    },
    {
      question: "Who is at highest risk for falls?",
      answer:
        "Highest risk groups include adults over 65, people with a fall history, those taking 4+ medications (especially sedatives, blood pressure medications, and antidepressants), individuals with balance/gait disorders, and those with cognitive impairment.",
    },
    {
      question: "How can falls be prevented?",
      answer:
        "Key prevention strategies include regular exercise (especially balance and strength training), medication review, vision correction, home hazard removal (loose rugs, poor lighting), non-slip footwear, and assistive devices when needed.",
    },
    {
      question: "What should I do after a fall?",
      answer:
        "After a fall: check for injuries, get up safely (or call for help), report the fall to your healthcare provider, and request a fall risk assessment. Even falls without injury should be reported, as they indicate increased future fall risk.",
    },
  ],
  formula:
    "Morse Fall Scale: Fall History (0/25) + Secondary Dx (0/15) + Ambulatory Aid (0/15/30) + IV Therapy (0/20) + Gait (0/10/20) + Mental Status (0/15) = Total (0-125) | Low: 0-24, Moderate: 25-44, High: 45+",
};
