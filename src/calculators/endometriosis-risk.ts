import type { CalculatorDefinition } from "./types";

export const endometriosisRiskCalculator: CalculatorDefinition = {
  slug: "endometriosis-risk-calculator",
  title: "Endometriosis Symptom Calculator",
  description:
    "Free endometriosis symptom calculator. Assess your endometriosis risk level based on common symptoms, pain patterns, and family history to help guide conversations with your doctor.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "endometriosis calculator",
    "endometriosis symptoms",
    "endometriosis risk",
    "pelvic pain calculator",
    "endometriosis screening",
  ],
  variants: [
    {
      id: "endometriosis-risk",
      name: "Endometriosis Symptom Assessment",
      description: "Assess symptom pattern for endometriosis risk",
      fields: [
        {
          name: "periodPain",
          label: "Period Pain Severity",
          type: "select",
          options: [
            { label: "None / Mild (manageable with OTC meds)", value: "mild" },
            { label: "Moderate (affects daily activities)", value: "moderate" },
            { label: "Severe (debilitating, misses work/school)", value: "severe" },
          ],
          defaultValue: "mild",
        },
        {
          name: "painTiming",
          label: "Pelvic Pain Timing",
          type: "select",
          options: [
            { label: "Only during period", value: "period-only" },
            { label: "Before and during period", value: "before-during" },
            { label: "Throughout the month (chronic)", value: "chronic" },
          ],
          defaultValue: "period-only",
        },
        {
          name: "painIntercourse",
          label: "Pain During or After Intercourse",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Occasionally", value: "occasional" },
            { label: "Frequently / Always", value: "frequent" },
          ],
          defaultValue: "no",
        },
        {
          name: "bowelBladder",
          label: "Bowel or Bladder Pain During Period",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes, bowel pain or changes", value: "bowel" },
            { label: "Yes, bladder pain or urgency", value: "bladder" },
            { label: "Both bowel and bladder symptoms", value: "both" },
          ],
          defaultValue: "no",
        },
        {
          name: "heavyBleeding",
          label: "Heavy or Prolonged Periods",
          type: "select",
          options: [
            { label: "Normal flow and duration", value: "normal" },
            { label: "Heavy flow or periods > 7 days", value: "heavy" },
            { label: "Very heavy with clots, flooding", value: "very-heavy" },
          ],
          defaultValue: "normal",
        },
        {
          name: "infertility",
          label: "Difficulty Getting Pregnant",
          type: "select",
          options: [
            { label: "No / Not trying", value: "no" },
            { label: "Yes, trying for 6+ months", value: "yes6" },
            { label: "Yes, trying for 12+ months", value: "yes12" },
          ],
          defaultValue: "no",
        },
        {
          name: "familyHistory",
          label: "Family History of Endometriosis",
          type: "select",
          options: [
            { label: "No / Unknown", value: "no" },
            { label: "Yes (mother, sister, aunt)", value: "yes" },
          ],
          defaultValue: "no",
        },
        {
          name: "fatigue",
          label: "Chronic Fatigue (especially around period)",
          type: "select",
          options: [
            { label: "No", value: "no" },
            { label: "Yes", value: "yes" },
          ],
          defaultValue: "no",
        },
      ],
      calculate: (inputs) => {
        const pain = inputs.periodPain as string;
        const timing = inputs.painTiming as string;
        const intercourse = inputs.painIntercourse as string;
        const bowelBladder = inputs.bowelBladder as string;
        const bleeding = inputs.heavyBleeding as string;
        const infertility = inputs.infertility as string;
        const family = inputs.familyHistory as string;
        const fatigue = inputs.fatigue as string;

        let score = 0;
        const symptoms: string[] = [];

        if (pain === "severe") { score += 4; symptoms.push("Severe period pain (dysmenorrhea)"); }
        else if (pain === "moderate") { score += 2; symptoms.push("Moderate period pain"); }

        if (timing === "chronic") { score += 3; symptoms.push("Chronic pelvic pain (throughout cycle)"); }
        else if (timing === "before-during") { score += 1; symptoms.push("Extended pain before and during period"); }

        if (intercourse === "frequent") { score += 3; symptoms.push("Frequent pain during/after intercourse (dyspareunia)"); }
        else if (intercourse === "occasional") { score += 1; symptoms.push("Occasional pain during intercourse"); }

        if (bowelBladder === "both") { score += 3; symptoms.push("Bowel and bladder symptoms during period"); }
        else if (bowelBladder !== "no") { score += 2; symptoms.push("Bowel or bladder symptoms during period"); }

        if (bleeding === "very-heavy") { score += 2; symptoms.push("Very heavy menstrual bleeding"); }
        else if (bleeding === "heavy") { score += 1; symptoms.push("Heavy or prolonged periods"); }

        if (infertility === "yes12") { score += 3; symptoms.push("Infertility (12+ months trying)"); }
        else if (infertility === "yes6") { score += 2; symptoms.push("Difficulty conceiving (6+ months)"); }

        if (family === "yes") { score += 2; symptoms.push("Family history of endometriosis"); }
        if (fatigue === "yes") { score += 1; symptoms.push("Chronic fatigue around period"); }

        let riskLevel: string;
        let guidance: string;
        if (score <= 3) {
          riskLevel = "Low Risk";
          guidance = "Your symptoms don't strongly suggest endometriosis, but mention any pelvic pain concerns at your next appointment.";
        } else if (score <= 7) {
          riskLevel = "Moderate Risk";
          guidance = "Several symptoms are consistent with endometriosis. Consider discussing screening with your OB-GYN, including pelvic exam and possibly imaging.";
        } else if (score <= 12) {
          riskLevel = "Elevated Risk";
          guidance = "Multiple symptoms strongly suggest possible endometriosis. Recommend scheduling a specialist appointment (OB-GYN or endometriosis specialist).";
        } else {
          riskLevel = "High Risk";
          guidance = "Symptom profile is highly consistent with endometriosis. Please seek evaluation from a specialist. The average diagnosis delay is 7-10 years - early evaluation is important.";
        }

        return {
          primary: {
            label: "Endometriosis Risk Level",
            value: riskLevel,
          },
          details: [
            { label: "Symptom Score", value: `${score} / 22` },
            { label: "Guidance", value: guidance },
            ...symptoms.map((s, i) => ({ label: `Symptom ${i + 1}`, value: s })),
          ],
          note: "This is a symptom screening tool, NOT a diagnosis. Endometriosis can only be definitively diagnosed through laparoscopic surgery, though MRI and specialized ultrasound can suggest it. If you suspect endometriosis, keep a pain diary and seek a specialist. Endometriosis affects approximately 1 in 10 women of reproductive age.",
        };
      },
    },
  ],
  relatedSlugs: ["period-calculator", "pcos-risk-calculator", "fertility-window-calculator"],
  faq: [
    {
      question: "What is endometriosis?",
      answer:
        "Endometriosis is a condition where tissue similar to the uterine lining grows outside the uterus, commonly on the ovaries, fallopian tubes, bowel, and pelvic lining. It affects about 10% of reproductive-age women and can cause pain, heavy periods, and infertility. It is a chronic inflammatory condition.",
    },
    {
      question: "How is endometriosis diagnosed?",
      answer:
        "Definitive diagnosis requires laparoscopic surgery (keyhole surgery to visualize and biopsy lesions). However, MRI, transvaginal ultrasound (especially for endometriomas), clinical history, and pelvic exam can strongly suggest the diagnosis. The average time from symptom onset to diagnosis is 7-10 years.",
    },
    {
      question: "What are the treatment options for endometriosis?",
      answer:
        "Treatments include: pain management (NSAIDs, heat), hormonal therapies (birth control pills, IUD, GnRH agonists), excision surgery (gold standard for removing lesions), pelvic floor physical therapy, and for infertility, IVF may be recommended. Treatment is individualized based on symptoms, severity, and fertility goals.",
    },
  ],
  formula:
    "Risk Score = Sum of weighted symptom indicators (0-22) | Risk Level = Low (0-3), Moderate (4-7), Elevated (8-12), High (13+)",
};
