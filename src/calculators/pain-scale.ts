import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const painScaleCalculator: CalculatorDefinition = {
  slug: "pain-scale-calculator",
  title: "Pain Scale Assessment Calculator",
  description:
    "Free pain scale assessment calculator. Evaluate pain severity using standardized pain scales including Numeric Rating Scale (NRS), Wong-Baker FACES, and functional assessment.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pain scale",
    "pain assessment",
    "pain level",
    "NRS pain",
    "Wong-Baker faces",
    "pain score",
    "pain rating",
    "pain management",
  ],
  variants: [
    {
      id: "nrs",
      name: "Numeric Rating Scale (NRS)",
      description: "Rate pain on the standard 0-10 numeric scale",
      fields: [
        {
          name: "currentPain",
          label: "Current Pain Level (0 = no pain, 10 = worst possible)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 10,
        },
        {
          name: "bestPain",
          label: "Best Pain in Last 24 Hours",
          type: "number",
          placeholder: "e.g. 2",
          min: 0,
          max: 10,
        },
        {
          name: "worstPain",
          label: "Worst Pain in Last 24 Hours",
          type: "number",
          placeholder: "e.g. 8",
          min: 0,
          max: 10,
        },
        {
          name: "painType",
          label: "Pain Type",
          type: "select",
          options: [
            { label: "Acute (recent onset)", value: "acute" },
            { label: "Chronic (3+ months)", value: "chronic" },
            { label: "Post-surgical", value: "postsurg" },
            { label: "Cancer-related", value: "cancer" },
            { label: "Neuropathic (nerve pain)", value: "neuropathic" },
          ],
        },
      ],
      calculate: (inputs) => {
        const current = inputs.currentPain as number;
        const best = inputs.bestPain as number;
        const worst = inputs.worstPain as number;
        const painType = inputs.painType as string;
        if (current === undefined || best === undefined || worst === undefined || !painType) return null;

        const average = (current + best + worst) / 3;

        let severity: string;
        if (current === 0) severity = "No pain";
        else if (current <= 3) severity = "Mild pain";
        else if (current <= 6) severity = "Moderate pain";
        else if (current <= 9) severity = "Severe pain";
        else severity = "Worst possible pain";

        let managementLevel: string;
        if (current <= 3) managementLevel = "Non-pharmacological measures and/or non-opioid analgesics";
        else if (current <= 6) managementLevel = "Non-opioid analgesics +/- weak opioid; reassess in 1-2 hours";
        else managementLevel = "Strong analgesics; urgent pain management reassessment needed";

        const painRange = worst - best;
        let variability: string;
        if (painRange <= 2) variability = "Stable pain pattern";
        else if (painRange <= 4) variability = "Moderate variability";
        else variability = "High variability — identify triggers and breakthrough patterns";

        const functionalImpact = current >= 4
          ? "Likely impacting daily activities, sleep, and quality of life"
          : "Minimal functional impact expected";

        return {
          primary: { label: "Pain Level", value: `${current}/10 — ${severity}` },
          details: [
            { label: "Current pain", value: `${current}/10 (${severity})` },
            { label: "Best (24hr)", value: `${best}/10` },
            { label: "Worst (24hr)", value: `${worst}/10` },
            { label: "Average (24hr)", value: `${formatNumber(average, 1)}/10` },
            { label: "Variability", value: variability },
            { label: "Pain type", value: painType },
            { label: "Functional impact", value: functionalImpact },
            { label: "Management consideration", value: managementLevel },
          ],
          note: "The NRS is a subjective self-report tool. Pain is whatever the patient says it is. The goal of pain management is to achieve functional improvement, not necessarily zero pain. WHO Pain Ladder: Step 1 (mild) = non-opioids, Step 2 (moderate) = weak opioids, Step 3 (severe) = strong opioids. Always consult a healthcare provider.",
        };
      },
    },
    {
      id: "functional",
      name: "Functional Pain Assessment",
      description: "Assess how pain affects daily activities and function",
      fields: [
        {
          name: "activityLevel",
          label: "Pain Impact on General Activity",
          type: "select",
          options: [
            { label: "0 - No interference", value: "0" },
            { label: "2 - Slight interference", value: "2" },
            { label: "4 - Moderate interference", value: "4" },
            { label: "6 - Significant interference", value: "6" },
            { label: "8 - Nearly prevents activity", value: "8" },
            { label: "10 - Completely prevents activity", value: "10" },
          ],
        },
        {
          name: "sleep",
          label: "Pain Impact on Sleep",
          type: "select",
          options: [
            { label: "0 - No interference", value: "0" },
            { label: "2 - Slight interference", value: "2" },
            { label: "4 - Moderate interference", value: "4" },
            { label: "6 - Significant interference", value: "6" },
            { label: "8 - Nearly prevents sleep", value: "8" },
            { label: "10 - Completely prevents sleep", value: "10" },
          ],
        },
        {
          name: "mood",
          label: "Pain Impact on Mood",
          type: "select",
          options: [
            { label: "0 - No impact", value: "0" },
            { label: "2 - Slight impact", value: "2" },
            { label: "4 - Moderate impact", value: "4" },
            { label: "6 - Significant impact", value: "6" },
            { label: "8 - Severe impact", value: "8" },
            { label: "10 - Overwhelming impact", value: "10" },
          ],
        },
        {
          name: "walking",
          label: "Pain Impact on Walking/Mobility",
          type: "select",
          options: [
            { label: "0 - No interference", value: "0" },
            { label: "2 - Slight interference", value: "2" },
            { label: "4 - Moderate interference", value: "4" },
            { label: "6 - Significant interference", value: "6" },
            { label: "8 - Nearly prevents walking", value: "8" },
            { label: "10 - Cannot walk", value: "10" },
          ],
        },
        {
          name: "enjoyment",
          label: "Pain Impact on Enjoyment of Life",
          type: "select",
          options: [
            { label: "0 - No interference", value: "0" },
            { label: "2 - Slight interference", value: "2" },
            { label: "4 - Moderate interference", value: "4" },
            { label: "6 - Significant interference", value: "6" },
            { label: "8 - Nearly prevents enjoyment", value: "8" },
            { label: "10 - No enjoyment possible", value: "10" },
          ],
        },
      ],
      calculate: (inputs) => {
        const activity = parseInt(inputs.activityLevel as string);
        const sleep = parseInt(inputs.sleep as string);
        const mood = parseInt(inputs.mood as string);
        const walking = parseInt(inputs.walking as string);
        const enjoyment = parseInt(inputs.enjoyment as string);
        if (isNaN(activity) || isNaN(sleep) || isNaN(mood) || isNaN(walking) || isNaN(enjoyment)) return null;

        const totalScore = activity + sleep + mood + walking + enjoyment;
        const avgScore = totalScore / 5;
        const maxPossible = 50;
        const percentImpact = (totalScore / maxPossible) * 100;

        let overallImpact: string;
        if (avgScore <= 2) overallImpact = "Minimal functional impact";
        else if (avgScore <= 4) overallImpact = "Mild functional impact";
        else if (avgScore <= 6) overallImpact = "Moderate functional impact — consider multimodal treatment";
        else if (avgScore <= 8) overallImpact = "Severe functional impact — comprehensive pain management needed";
        else overallImpact = "Debilitating — urgent multidisciplinary assessment recommended";

        return {
          primary: { label: "Functional Impact Score", value: `${formatNumber(avgScore, 1)}/10` },
          details: [
            { label: "Average interference score", value: `${formatNumber(avgScore, 1)}/10` },
            { label: "Total score", value: `${totalScore}/${maxPossible}` },
            { label: "Functional impact", value: `${formatNumber(percentImpact, 0)}%` },
            { label: "Most affected domain", value: (() => {
              const scores = { "Activity": activity, "Sleep": sleep, "Mood": mood, "Walking": walking, "Enjoyment": enjoyment };
              const max = Math.max(activity, sleep, mood, walking, enjoyment);
              return Object.entries(scores).filter(([, v]) => v === max).map(([k]) => k).join(", ");
            })() },
            { label: "Overall assessment", value: overallImpact },
          ],
          note: "This functional assessment is adapted from the Brief Pain Inventory (BPI) interference subscale. Pain that significantly interferes with function warrants comprehensive pain management including physical, psychological, and pharmacological approaches. Consult your healthcare provider.",
        };
      },
    },
  ],
  relatedSlugs: ["wound-size-calculator", "mental-health-score-calculator", "fall-risk-calculator"],
  faq: [
    {
      question: "What is the pain scale?",
      answer:
        "The Numeric Rating Scale (NRS) rates pain from 0-10, where 0 = no pain and 10 = worst possible pain. Mild: 1-3, Moderate: 4-6, Severe: 7-10. It is the most widely used pain assessment tool in clinical settings.",
    },
    {
      question: "What is a 'good' pain score?",
      answer:
        "The goal is not always zero pain, especially for chronic pain. Generally, pain management aims for a level that allows functional activity and sleep. For acute pain, a score of 3 or below is often considered acceptable.",
    },
    {
      question: "Why is pain assessed using multiple measures?",
      answer:
        "Pain intensity alone does not capture the full picture. Functional assessment evaluates how pain affects daily life, sleep, mood, and activities. This guides treatment decisions beyond just pain medication.",
    },
    {
      question: "What is the WHO Pain Ladder?",
      answer:
        "The WHO Pain Ladder is a stepwise approach: Step 1 (mild pain): non-opioid analgesics (acetaminophen, NSAIDs). Step 2 (moderate): weak opioids + non-opioids. Step 3 (severe): strong opioids + non-opioids. Adjuvants can be added at any step.",
    },
  ],
  formula:
    "NRS: 0-10 scale (0 = no pain, 10 = worst pain) | Severity: Mild (1-3), Moderate (4-6), Severe (7-10) | Functional impact score: Average of interference ratings across domains (0-10 each)",
};
