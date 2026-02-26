import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concussionAssessmentCalculator: CalculatorDefinition = {
  slug: "concussion-assessment-calculator",
  title: "Concussion Assessment Tool",
  description:
    "Assess concussion symptoms using a SCAT-inspired screening tool. Evaluate symptom severity, cognitive function, and determine if medical evaluation is needed.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "concussion assessment",
    "SCAT tool",
    "concussion symptoms",
    "head injury assessment",
    "brain injury screening",
    "concussion severity",
    "return to play",
  ],
  variants: [
    {
      id: "symptom-checklist",
      name: "Concussion Symptom Severity",
      description: "Rate concussion symptoms on a severity scale (0-6 per symptom)",
      fields: [
        {
          name: "headache",
          label: "Headache",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1-2)", value: "2" },
            { label: "Moderate (3-4)", value: "4" },
            { label: "Severe (5-6)", value: "6" },
          ],
        },
        {
          name: "dizziness",
          label: "Dizziness",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1-2)", value: "2" },
            { label: "Moderate (3-4)", value: "4" },
            { label: "Severe (5-6)", value: "6" },
          ],
        },
        {
          name: "nausea",
          label: "Nausea or Vomiting",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild nausea (1-2)", value: "2" },
            { label: "Moderate nausea (3-4)", value: "4" },
            { label: "Severe nausea/vomiting (5-6)", value: "6" },
          ],
        },
        {
          name: "foggy",
          label: "Feeling like 'in a fog'",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1-2)", value: "2" },
            { label: "Moderate (3-4)", value: "4" },
            { label: "Severe (5-6)", value: "6" },
          ],
        },
        {
          name: "concentration",
          label: "Difficulty Concentrating",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1-2)", value: "2" },
            { label: "Moderate (3-4)", value: "4" },
            { label: "Severe (5-6)", value: "6" },
          ],
        },
        {
          name: "memory",
          label: "Difficulty Remembering",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1-2)", value: "2" },
            { label: "Moderate (3-4)", value: "4" },
            { label: "Severe (5-6)", value: "6" },
          ],
        },
        {
          name: "lightSensitivity",
          label: "Sensitivity to Light",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1-2)", value: "2" },
            { label: "Moderate (3-4)", value: "4" },
            { label: "Severe (5-6)", value: "6" },
          ],
        },
        {
          name: "noiseSensitivity",
          label: "Sensitivity to Noise",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1-2)", value: "2" },
            { label: "Moderate (3-4)", value: "4" },
            { label: "Severe (5-6)", value: "6" },
          ],
        },
        {
          name: "fatigue",
          label: "Fatigue / Low Energy",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1-2)", value: "2" },
            { label: "Moderate (3-4)", value: "4" },
            { label: "Severe (5-6)", value: "6" },
          ],
        },
        {
          name: "balance",
          label: "Balance Problems",
          type: "select",
          options: [
            { label: "None (0)", value: "0" },
            { label: "Mild (1-2)", value: "2" },
            { label: "Moderate (3-4)", value: "4" },
            { label: "Severe (5-6)", value: "6" },
          ],
        },
      ],
      calculate: (inputs) => {
        const symptoms = [
          { name: "Headache", score: parseFloat(inputs.headache as string) },
          { name: "Dizziness", score: parseFloat(inputs.dizziness as string) },
          { name: "Nausea/Vomiting", score: parseFloat(inputs.nausea as string) },
          { name: "Foggy feeling", score: parseFloat(inputs.foggy as string) },
          { name: "Concentration", score: parseFloat(inputs.concentration as string) },
          { name: "Memory", score: parseFloat(inputs.memory as string) },
          { name: "Light sensitivity", score: parseFloat(inputs.lightSensitivity as string) },
          { name: "Noise sensitivity", score: parseFloat(inputs.noiseSensitivity as string) },
          { name: "Fatigue", score: parseFloat(inputs.fatigue as string) },
          { name: "Balance", score: parseFloat(inputs.balance as string) },
        ];

        if (symptoms.some(s => isNaN(s.score))) return null;

        const totalScore = symptoms.reduce((sum, s) => sum + s.score, 0);
        const symptomCount = symptoms.filter(s => s.score > 0).length;
        const maxPossible = 60;
        const severePct = (totalScore / maxPossible) * 100;

        let severity: string;
        let guidance: string;
        if (totalScore === 0) {
          severity = "No Symptoms";
          guidance = "No concussion symptoms reported. If a head injury occurred, continue to monitor for delayed symptoms over the next 24-48 hours.";
        } else if (totalScore <= 10) {
          severity = "Mild Symptom Burden";
          guidance = "Mild symptoms present. Rest and monitor. Avoid screens and physical activity. If symptoms worsen or persist beyond 7 days, see a doctor.";
        } else if (totalScore <= 25) {
          severity = "Moderate Symptom Burden";
          guidance = "Moderate symptoms. Medical evaluation recommended. Avoid sports, driving, and strenuous mental/physical activity until evaluated by a healthcare provider.";
        } else {
          severity = "Severe Symptom Burden";
          guidance = "Significant symptoms present. Seek medical attention promptly. Do NOT return to sports or activity. Emergency evaluation if symptoms are worsening.";
        }

        const topSymptoms = symptoms
          .filter(s => s.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(s => `${s.name} (${s.score}/6)`);

        // Red flags check
        const hasVomiting = parseFloat(inputs.nausea as string) >= 4;
        const hasBalanceIssue = parseFloat(inputs.balance as string) >= 4;
        let redFlagNote = "";
        if (hasVomiting || hasBalanceIssue) {
          redFlagNote = "RED FLAG: Significant vomiting and/or balance problems detected. Seek emergency medical evaluation.";
        }

        return {
          primary: { label: "Symptom Severity Score", value: `${formatNumber(totalScore, 0)} / ${formatNumber(maxPossible, 0)}` },
          details: [
            { label: "Total Score", value: `${formatNumber(totalScore, 0)} / ${formatNumber(maxPossible, 0)} (${formatNumber(severePct, 0)}%)` },
            { label: "Symptoms Present", value: `${formatNumber(symptomCount, 0)} of 10` },
            { label: "Severity", value: severity },
            { label: "Top Symptoms", value: topSymptoms.length > 0 ? topSymptoms.join(", ") : "None" },
            { label: "Guidance", value: guidance },
            ...(redFlagNote ? [{ label: "Red Flags", value: redFlagNote }] : []),
          ],
          note: "This is a screening tool inspired by the SCAT (Sport Concussion Assessment Tool). It is NOT a diagnostic tool and does NOT replace medical evaluation. Any suspected concussion should be evaluated by a healthcare provider. Call 911 for loss of consciousness, worsening symptoms, seizures, or slurred speech.",
        };
      },
    },
    {
      id: "return-to-play",
      name: "Return-to-Play Readiness",
      description: "Assess readiness to return to activity after concussion",
      fields: [
        {
          name: "daysSinceInjury",
          label: "Days Since Concussion",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "days",
          min: 0,
          max: 365,
          step: 1,
        },
        {
          name: "symptomFree",
          label: "Currently Symptom-Free at Rest",
          type: "select",
          options: [
            { label: "No — still have symptoms at rest", value: "0" },
            { label: "Yes — symptom-free for less than 24 hours", value: "1" },
            { label: "Yes — symptom-free for 24-48 hours", value: "2" },
            { label: "Yes — symptom-free for more than 48 hours", value: "3" },
          ],
        },
        {
          name: "currentStep",
          label: "Current Return-to-Play Step Completed",
          type: "select",
          options: [
            { label: "Step 1: Complete rest (physical + cognitive)", value: "1" },
            { label: "Step 2: Light aerobic exercise (walking, swimming)", value: "2" },
            { label: "Step 3: Sport-specific exercise (no contact)", value: "3" },
            { label: "Step 4: Non-contact training drills", value: "4" },
            { label: "Step 5: Full-contact practice (with medical clearance)", value: "5" },
            { label: "Step 6: Return to competition", value: "6" },
          ],
        },
        {
          name: "medicalClearance",
          label: "Medical Clearance Received",
          type: "select",
          options: [
            { label: "Not yet", value: "0" },
            { label: "Yes — cleared by healthcare provider", value: "1" },
          ],
        },
      ],
      calculate: (inputs) => {
        const daysSince = parseFloat(inputs.daysSinceInjury as string);
        const symptomFree = parseFloat(inputs.symptomFree as string);
        const currentStep = parseFloat(inputs.currentStep as string);
        const medClearance = parseFloat(inputs.medicalClearance as string);

        if (isNaN(daysSince) || isNaN(symptomFree) || isNaN(currentStep) || isNaN(medClearance)) return null;

        const nextStep = Math.min(currentStep + 1, 6);
        const stepNames: Record<number, string> = {
          1: "Complete rest",
          2: "Light aerobic exercise",
          3: "Sport-specific exercise",
          4: "Non-contact training drills",
          5: "Full-contact practice",
          6: "Return to competition",
        };

        let readiness: string;
        let nextAction: string;
        if (symptomFree < 2) {
          readiness = "Not Ready — still symptomatic";
          nextAction = "Continue rest until symptom-free for at least 24 hours before progressing.";
        } else if (currentStep >= 5 && medClearance === 1) {
          readiness = "Ready for Return to Competition (Step 6)";
          nextAction = "Medical clearance obtained. Full return to competition allowed.";
        } else if (currentStep >= 5 && medClearance === 0) {
          readiness = "Awaiting Medical Clearance";
          nextAction = "Must obtain written medical clearance before full-contact practice or competition.";
        } else {
          readiness = `At Step ${formatNumber(currentStep, 0)} — Progress to Step ${formatNumber(nextStep, 0)}`;
          nextAction = `If symptom-free for 24+ hours at current step, advance to Step ${formatNumber(nextStep, 0)}: ${stepNames[nextStep]}. Each step takes minimum 24 hours.`;
        }

        const minimumDays = currentStep * 1; // At least 1 day per step
        const totalMinimumRecovery = Math.max(7, minimumDays); // Minimum 7 days recommended

        return {
          primary: { label: "Return-to-Play Status", value: readiness },
          details: [
            { label: "Days Since Injury", value: formatNumber(daysSince, 0) },
            { label: "Symptom Status", value: symptomFree >= 2 ? "Symptom-free" : "Still symptomatic" },
            { label: "Current Step", value: `Step ${formatNumber(currentStep, 0)}: ${stepNames[currentStep]}` },
            { label: "Next Step", value: nextAction },
            { label: "Medical Clearance", value: medClearance === 1 ? "Obtained" : "Not yet obtained (required before Step 5)" },
            { label: "Minimum Recovery", value: `At least ${formatNumber(totalMinimumRecovery, 0)} days from injury` },
          ],
          note: "The graduated return-to-play protocol requires minimum 24 hours at each step. If symptoms return at any step, drop back to the previous step and rest for 24 hours. Children and adolescents may require longer recovery. Always follow your healthcare provider's specific instructions.",
        };
      },
    },
  ],
  relatedSlugs: ["phq9-depression-calculator", "gad7-anxiety-calculator", "blood-oxygen-calculator"],
  faq: [
    {
      question: "What are the signs of a concussion?",
      answer:
        "Common signs include headache, dizziness, nausea, confusion, memory problems, sensitivity to light/noise, balance problems, fatigue, and feeling 'foggy'. Symptoms may appear immediately or develop over hours. Loss of consciousness occurs in less than 10% of concussions.",
    },
    {
      question: "How long does concussion recovery take?",
      answer:
        "Most adults recover within 10-14 days. Children and adolescents may take 2-4 weeks. About 10-30% of people experience symptoms lasting longer than expected (post-concussion syndrome). Factors affecting recovery include age, prior concussions, symptom severity, and rest compliance.",
    },
    {
      question: "When should I go to the ER for a head injury?",
      answer:
        "Seek emergency care for: loss of consciousness, repeated vomiting, seizures, worsening headache, slurred speech, weakness/numbness, pupils of unequal size, extreme drowsiness, inability to recognize people/places, increasing confusion, or any symptom that worsens over time.",
    },
  ],
  formula:
    "Symptom Severity Score = Sum of individual symptom ratings (each 0-6) across 10 symptoms | Max possible = 60 | Return-to-Play: 6-step graduated protocol, minimum 24 hours per step, minimum 7 days total",
};
