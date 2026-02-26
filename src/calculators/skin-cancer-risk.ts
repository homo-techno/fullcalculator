import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skinCancerRiskCalculator: CalculatorDefinition = {
  slug: "skin-cancer-risk-calculator",
  title: "Skin Cancer / Melanoma Risk Assessment",
  description:
    "Assess your risk for skin cancer and melanoma based on known risk factors. Evaluate skin type, sun exposure history, family history, and mole characteristics.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "skin cancer risk calculator",
    "melanoma risk assessment",
    "skin cancer screening",
    "UV exposure risk",
    "mole assessment",
    "fitzpatrick skin type",
    "skin cancer prevention",
  ],
  variants: [
    {
      id: "melanoma-risk",
      name: "Melanoma Risk Assessment",
      description: "Assess melanoma risk based on personal and family risk factors",
      fields: [
        {
          name: "skinType",
          label: "Fitzpatrick Skin Type",
          type: "select",
          options: [
            { label: "Type I — Always burns, never tans (very fair)", value: "4" },
            { label: "Type II — Usually burns, tans minimally (fair)", value: "3" },
            { label: "Type III — Sometimes burns, tans gradually (medium)", value: "2" },
            { label: "Type IV — Rarely burns, tans easily (olive)", value: "1" },
            { label: "Type V — Very rarely burns, tans very easily (brown)", value: "0.5" },
            { label: "Type VI — Never burns (dark brown/black)", value: "0" },
          ],
        },
        {
          name: "moleCount",
          label: "Number of Moles (whole body estimate)",
          type: "select",
          options: [
            { label: "Less than 20", value: "0" },
            { label: "20-50", value: "1" },
            { label: "50-100", value: "2" },
            { label: "More than 100", value: "3" },
          ],
        },
        {
          name: "atypicalMoles",
          label: "Atypical/Dysplastic Moles",
          type: "select",
          options: [
            { label: "None", value: "0" },
            { label: "1-4 atypical moles", value: "1" },
            { label: "5 or more atypical moles", value: "3" },
          ],
        },
        {
          name: "familyHistory",
          label: "Family History of Melanoma (first-degree relative)",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes — one relative", value: "2" },
            { label: "Yes — two or more relatives", value: "4" },
          ],
        },
        {
          name: "personalHistory",
          label: "Personal History of Skin Cancer",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Prior non-melanoma skin cancer", value: "1" },
            { label: "Prior melanoma", value: "4" },
          ],
        },
        {
          name: "sunburns",
          label: "History of Blistering Sunburns",
          type: "select",
          options: [
            { label: "None or 1-2 in lifetime", value: "0" },
            { label: "3-5 blistering sunburns", value: "1" },
            { label: "More than 5 blistering sunburns", value: "2" },
          ],
        },
        {
          name: "sunExposure",
          label: "Chronic Sun/UV Exposure",
          type: "select",
          options: [
            { label: "Mostly indoor work, minimal sun", value: "0" },
            { label: "Moderate outdoor exposure", value: "1" },
            { label: "Significant outdoor work/recreation", value: "2" },
            { label: "Tanning bed use (current or past)", value: "3" },
          ],
        },
        {
          name: "immunosuppression",
          label: "Immunosuppression",
          type: "select",
          options: [
            { label: "No", value: "0" },
            { label: "Yes (organ transplant, medication, etc.)", value: "2" },
          ],
        },
      ],
      calculate: (inputs) => {
        const skinType = parseFloat(inputs.skinType as string);
        const moleCount = parseFloat(inputs.moleCount as string);
        const atypicalMoles = parseFloat(inputs.atypicalMoles as string);
        const familyHistory = parseFloat(inputs.familyHistory as string);
        const personalHistory = parseFloat(inputs.personalHistory as string);
        const sunburns = parseFloat(inputs.sunburns as string);
        const sunExposure = parseFloat(inputs.sunExposure as string);
        const immunosuppression = parseFloat(inputs.immunosuppression as string);

        if ([skinType, moleCount, atypicalMoles, familyHistory, personalHistory, sunburns, sunExposure, immunosuppression].some(isNaN)) return null;

        const score = skinType + moleCount + atypicalMoles + familyHistory + personalHistory + sunburns + sunExposure + immunosuppression;

        let riskLevel: string;
        let screening: string;
        if (score <= 3) {
          riskLevel = "Low Risk";
          screening = "Annual skin self-exam. Professional skin check every 2-3 years (or as recommended by your doctor).";
        } else if (score <= 7) {
          riskLevel = "Moderate Risk";
          screening = "Monthly self-exams. Annual professional full-body skin exam. Sun protection essential.";
        } else if (score <= 12) {
          riskLevel = "High Risk";
          screening = "Monthly self-exams. Professional skin exam every 6-12 months. Consider dermatologist referral. Sun protection critical.";
        } else {
          riskLevel = "Very High Risk";
          screening = "Monthly self-exams with partner/mirror. Professional skin exam every 3-6 months by dermatologist. Total body photography may be recommended.";
        }

        const factors: string[] = [];
        if (skinType >= 3) factors.push("Fair skin type");
        if (moleCount >= 2) factors.push("Many moles (50+)");
        if (atypicalMoles >= 1) factors.push("Atypical moles");
        if (familyHistory >= 2) factors.push("Family history of melanoma");
        if (personalHistory >= 1) factors.push("Prior skin cancer");
        if (sunburns >= 1) factors.push("Blistering sunburns");
        if (sunExposure >= 2) factors.push("Significant UV exposure");
        if (immunosuppression >= 2) factors.push("Immunosuppression");

        return {
          primary: { label: "Risk Level", value: riskLevel },
          details: [
            { label: "Risk Score", value: `${formatNumber(score, 0)} / 21` },
            { label: "Risk Level", value: riskLevel },
            { label: "Key Risk Factors", value: factors.length > 0 ? factors.join(", ") : "No major risk factors identified" },
            { label: "Screening Recommendation", value: screening },
          ],
          note: "This is a risk assessment tool, NOT a diagnosis. Use the ABCDE rule to monitor moles: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolving. See a dermatologist immediately for any concerning skin changes. Skin cancer is highly treatable when caught early.",
        };
      },
    },
    {
      id: "abcde-check",
      name: "ABCDE Mole Assessment",
      description: "Evaluate a mole using the ABCDE criteria for melanoma warning signs",
      fields: [
        {
          name: "asymmetry",
          label: "A — Asymmetry (one half unlike the other)",
          type: "select",
          options: [
            { label: "Symmetric (normal)", value: "0" },
            { label: "Asymmetric (one half differs)", value: "1" },
          ],
        },
        {
          name: "border",
          label: "B — Border (irregular, ragged, blurred edges)",
          type: "select",
          options: [
            { label: "Smooth, even borders", value: "0" },
            { label: "Irregular or notched borders", value: "1" },
          ],
        },
        {
          name: "color",
          label: "C — Color (multiple colors or uneven distribution)",
          type: "select",
          options: [
            { label: "Uniform color", value: "0" },
            { label: "Multiple colors (brown, black, red, white, blue)", value: "1" },
          ],
        },
        {
          name: "diameter",
          label: "D — Diameter (larger than 6mm / pencil eraser)",
          type: "select",
          options: [
            { label: "Smaller than 6mm", value: "0" },
            { label: "6mm or larger", value: "1" },
          ],
        },
        {
          name: "evolving",
          label: "E — Evolving (changing in size, shape, or color)",
          type: "select",
          options: [
            { label: "No changes noticed", value: "0" },
            { label: "Has been changing recently", value: "1" },
          ],
        },
      ],
      calculate: (inputs) => {
        const a = parseFloat(inputs.asymmetry as string);
        const b = parseFloat(inputs.border as string);
        const c = parseFloat(inputs.color as string);
        const d = parseFloat(inputs.diameter as string);
        const e = parseFloat(inputs.evolving as string);

        if ([a, b, c, d, e].some(isNaN)) return null;

        const score = a + b + c + d + e;

        let urgency: string;
        let recommendation: string;
        if (score === 0) {
          urgency = "Low Concern";
          recommendation = "No ABCDE warning signs. Continue routine monitoring.";
        } else if (score <= 2) {
          urgency = "Moderate Concern";
          recommendation = "Some warning signs present. Schedule a dermatology appointment for evaluation within the next few weeks.";
        } else {
          urgency = "High Concern";
          recommendation = "Multiple warning signs. See a dermatologist as soon as possible for evaluation and possible biopsy.";
        }

        const positiveFlags: string[] = [];
        if (a === 1) positiveFlags.push("Asymmetry");
        if (b === 1) positiveFlags.push("Irregular border");
        if (c === 1) positiveFlags.push("Multiple colors");
        if (d === 1) positiveFlags.push("Large diameter");
        if (e === 1) positiveFlags.push("Evolving/changing");

        return {
          primary: { label: "ABCDE Assessment", value: `${formatNumber(score, 0)} / 5 warning signs` },
          details: [
            { label: "Warning Signs Present", value: `${formatNumber(score, 0)} of 5` },
            { label: "Positive Criteria", value: positiveFlags.length > 0 ? positiveFlags.join(", ") : "None" },
            { label: "Concern Level", value: urgency },
            { label: "Recommendation", value: recommendation },
          ],
          note: "The ABCDE rule is a guide for identifying potentially concerning moles but is not a substitute for professional evaluation. Not all melanomas follow ABCDE criteria, and some benign moles may have ABCDE features. When in doubt, get it checked.",
        };
      },
    },
  ],
  relatedSlugs: ["diabetes-risk-calculator", "blood-oxygen-calculator", "cha2ds2-vasc-calculator"],
  faq: [
    {
      question: "What are the ABCDE signs of melanoma?",
      answer:
        "A = Asymmetry (one half doesn't match the other), B = Border irregularity (edges are ragged, notched, or blurred), C = Color (uneven color with shades of brown, black, tan, red, white, or blue), D = Diameter (larger than 6mm, about the size of a pencil eraser), E = Evolving (the mole is changing in size, shape, or color).",
    },
    {
      question: "Who is most at risk for melanoma?",
      answer:
        "The highest risk factors include: fair skin that burns easily, many moles (50+), atypical/dysplastic moles, family history of melanoma, personal history of skin cancer, history of blistering sunburns, tanning bed use, and immunosuppression. However, melanoma can occur in anyone regardless of skin color.",
    },
    {
      question: "How often should I get a skin check?",
      answer:
        "The American Academy of Dermatology recommends annual self-exams for everyone and professional skin exams based on risk level. High-risk individuals should see a dermatologist every 6-12 months. Report any new, changing, or unusual spots to your doctor promptly.",
    },
  ],
  formula:
    "Risk Score = Sum of weighted risk factors (skin type, mole count, family history, personal history, UV exposure, sunburns, immunosuppression) | ABCDE Score = Count of positive warning signs (0-5)",
};
