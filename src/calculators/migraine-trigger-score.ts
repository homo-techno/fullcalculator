import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const migraineTriggerScoreCalculator: CalculatorDefinition = {
  slug: "migraine-trigger-score-calculator",
  title: "Migraine Trigger Scoring Calculator",
  description:
    "Score your migraine trigger exposure and risk factors. Identify your top triggers and get a daily risk assessment based on sleep, stress, diet, and environmental factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "migraine trigger calculator",
    "migraine risk score",
    "migraine trigger tracker",
    "headache trigger calculator",
    "migraine prevention",
    "migraine risk factors",
  ],
  variants: [
    {
      id: "dailyRisk",
      name: "Daily Trigger Score",
      description: "Score your daily migraine trigger exposure",
      fields: [
        {
          name: "sleepHours",
          label: "Hours of Sleep Last Night",
          type: "number",
          placeholder: "e.g. 7",
          suffix: "hours",
          min: 0,
          max: 16,
          step: 0.5,
        },
        {
          name: "stressLevel",
          label: "Current Stress Level",
          type: "select",
          options: [
            { label: "Low (calm, relaxed)", value: "0" },
            { label: "Mild (slightly stressed)", value: "1" },
            { label: "Moderate (noticeably stressed)", value: "2" },
            { label: "High (very stressed)", value: "3" },
            { label: "Extreme (overwhelmed)", value: "4" },
          ],
          defaultValue: "1",
        },
        {
          name: "hydration",
          label: "Water Intake Today",
          type: "select",
          options: [
            { label: "Well-hydrated (8+ cups)", value: "0" },
            { label: "Adequate (5-7 cups)", value: "1" },
            { label: "Low (2-4 cups)", value: "2" },
            { label: "Very low (< 2 cups)", value: "3" },
          ],
          defaultValue: "0",
        },
        {
          name: "caffeine",
          label: "Caffeine Status",
          type: "select",
          options: [
            { label: "Normal intake (consistent)", value: "0" },
            { label: "More than usual", value: "1" },
            { label: "Less than usual / skipped", value: "2" },
            { label: "Withdrawal (quit recently)", value: "3" },
          ],
          defaultValue: "0",
        },
        {
          name: "mealSkipped",
          label: "Meals Skipped Today",
          type: "select",
          options: [
            { label: "None (eating regularly)", value: "0" },
            { label: "Skipped one meal", value: "1" },
            { label: "Skipped 2+ meals", value: "3" },
          ],
          defaultValue: "0",
        },
        {
          name: "weather",
          label: "Weather Changes",
          type: "select",
          options: [
            { label: "Stable weather", value: "0" },
            { label: "Barometric pressure change", value: "2" },
            { label: "Major weather front / storm", value: "3" },
          ],
          defaultValue: "0",
        },
        {
          name: "screenTime",
          label: "Extended Screen Time / Bright Lights",
          type: "select",
          options: [
            { label: "Normal / minimal", value: "0" },
            { label: "Extended screen time (4+ hours)", value: "1" },
            { label: "Bright/flickering lights exposure", value: "2" },
          ],
          defaultValue: "0",
        },
        {
          name: "hormonal",
          label: "Hormonal Factors",
          type: "select",
          options: [
            { label: "Not applicable / no change", value: "0" },
            { label: "Near menstruation (2 days before/after)", value: "2" },
            { label: "Ovulation", value: "1" },
            { label: "Hormonal medication change", value: "2" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const sleepHours = parseFloat(inputs.sleepHours as string);
        const stress = parseFloat(inputs.stressLevel as string);
        const hydration = parseFloat(inputs.hydration as string);
        const caffeine = parseFloat(inputs.caffeine as string);
        const meals = parseFloat(inputs.mealSkipped as string);
        const weather = parseFloat(inputs.weather as string);
        const screen = parseFloat(inputs.screenTime as string);
        const hormonal = parseFloat(inputs.hormonal as string);
        if (isNaN(sleepHours)) return null;

        // Sleep scoring: both too little and too much sleep are triggers
        let sleepScore: number;
        if (sleepHours >= 7 && sleepHours <= 9) sleepScore = 0;
        else if (sleepHours >= 6 && sleepHours < 7) sleepScore = 1;
        else if (sleepHours >= 5 && sleepHours < 6) sleepScore = 2;
        else if (sleepHours < 5) sleepScore = 4;
        else if (sleepHours > 9 && sleepHours <= 10) sleepScore = 1;
        else sleepScore = 2; // Oversleep > 10 hours

        const totalScore = sleepScore + stress + hydration + caffeine + meals + weather + screen + hormonal;
        const maxScore = 24;
        const percentage = (totalScore / maxScore) * 100;

        let riskLevel: string;
        if (totalScore <= 3) riskLevel = "Low risk -- minimal trigger exposure";
        else if (totalScore <= 7) riskLevel = "Moderate risk -- some triggers present";
        else if (totalScore <= 12) riskLevel = "High risk -- multiple triggers active";
        else riskLevel = "Very high risk -- take preventive action now";

        // Identify top triggers
        const triggers: { name: string; score: number }[] = [
          { name: "Sleep", score: sleepScore },
          { name: "Stress", score: stress },
          { name: "Dehydration", score: hydration },
          { name: "Caffeine", score: caffeine },
          { name: "Skipped meals", score: meals },
          { name: "Weather", score: weather },
          { name: "Screen/light", score: screen },
          { name: "Hormonal", score: hormonal },
        ];
        triggers.sort((a, b) => b.score - a.score);
        const topTrigger = triggers[0].score > 0 ? triggers[0].name : "None identified";

        // Preventive suggestions
        const suggestions: string[] = [];
        if (sleepScore > 1) suggestions.push("Prioritize sleep tonight");
        if (stress > 1) suggestions.push("Practice stress reduction (breathing, meditation)");
        if (hydration > 1) suggestions.push("Increase water intake immediately");
        if (caffeine > 1) suggestions.push("Normalize caffeine intake");
        if (meals > 0) suggestions.push("Eat a balanced meal soon");

        return {
          primary: { label: "Trigger Score", value: `${formatNumber(totalScore, 0)} / ${formatNumber(maxScore, 0)}` },
          details: [
            { label: "Risk Level", value: riskLevel },
            { label: "Top Trigger Today", value: topTrigger },
            { label: "Sleep Score", value: `${formatNumber(sleepScore, 0)}/4` },
            { label: "Stress Score", value: `${formatNumber(stress, 0)}/4` },
            { label: "Action Item", value: suggestions[0] || "Maintain current habits" },
            { label: "Trigger Load", value: `${formatNumber(percentage, 0)}%` },
          ],
          note: "Migraines often result from cumulative trigger exposure rather than a single trigger. Tracking your triggers daily can help identify patterns. This tool is for awareness -- it cannot predict individual migraine attacks. Consult a neurologist for persistent or severe migraines.",
        };
      },
    },
    {
      id: "frequency",
      name: "Migraine Frequency Assessment",
      description: "Assess if your migraine frequency warrants preventive treatment",
      fields: [
        {
          name: "migrainesPerMonth",
          label: "Migraine Days Per Month",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "days",
          min: 0,
          max: 31,
        },
        {
          name: "headacheDays",
          label: "Total Headache Days Per Month",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "days",
          min: 0,
          max: 31,
        },
        {
          name: "severity",
          label: "Average Pain Severity",
          type: "select",
          options: [
            { label: "Mild (can function normally)", value: "mild" },
            { label: "Moderate (functioning impaired)", value: "moderate" },
            { label: "Severe (cannot function)", value: "severe" },
          ],
          defaultValue: "moderate",
        },
        {
          name: "acuteMedUse",
          label: "Acute Medication Days Per Month",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "days",
          min: 0,
          max: 31,
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const migraines = parseFloat(inputs.migrainesPerMonth as string);
        const headacheDays = parseFloat(inputs.headacheDays as string);
        const severity = inputs.severity as string;
        const acuteMeds = parseFloat(inputs.acuteMedUse as string) || 0;
        if (isNaN(migraines) || isNaN(headacheDays)) return null;

        // Classification
        let classification: string;
        if (headacheDays >= 15 && migraines >= 8) {
          classification = "Chronic migraine (15+ headache days, 8+ migraine days/month)";
        } else if (migraines >= 8) {
          classification = "High-frequency episodic migraine";
        } else if (migraines >= 4) {
          classification = "Moderate-frequency episodic migraine";
        } else {
          classification = "Low-frequency episodic migraine";
        }

        // Preventive treatment recommendation
        let preventiveRecommended: string;
        if (migraines >= 4 || (migraines >= 2 && severity === "severe")) {
          preventiveRecommended = "Yes -- preventive treatment recommended";
        } else if (migraines >= 2) {
          preventiveRecommended = "Consider -- discuss with neurologist";
        } else {
          preventiveRecommended = "Not typically needed for acute treatment only";
        }

        // Medication overuse risk
        const overuseRisk = acuteMeds >= 10 ? "High risk -- medication overuse headache possible" :
          acuteMeds >= 8 ? "Moderate risk -- monitor usage" : "Low risk";

        const annualMigraineDays = migraines * 12;

        return {
          primary: { label: "Classification", value: migraines >= 8 ? "High frequency" : migraines >= 4 ? "Moderate frequency" : "Low frequency" },
          details: [
            { label: "Full Classification", value: classification },
            { label: "Preventive Treatment", value: preventiveRecommended },
            { label: "Medication Overuse Risk", value: overuseRisk },
            { label: "Annual Migraine Days", value: `~${formatNumber(annualMigraineDays, 0)} days` },
            { label: "Migraine Days/Month", value: formatNumber(migraines, 0) },
            { label: "Total Headache Days", value: formatNumber(headacheDays, 0) },
          ],
          note: "Chronic migraine is defined as 15+ headache days per month with at least 8 migraine days. Preventive treatment (daily medication, CGRP antibodies, or Botox) is recommended for 4+ migraine days per month. Medication overuse (10+ days/month) can worsen headache frequency.",
        };
      },
    },
  ],
  relatedSlugs: ["sleep-calculator", "water-intake-calculator", "blood-pressure-calculator"],
  faq: [
    {
      question: "What are the most common migraine triggers?",
      answer:
        "The most common triggers are: stress (70%), hormonal changes (65% of women), sleep disruption (50%), weather/barometric pressure changes (50%), skipped meals (40%), dehydration (40%), caffeine withdrawal (30%), and bright/flickering lights (30%). Most migraines result from multiple simultaneous triggers.",
    },
    {
      question: "When should I see a doctor about migraines?",
      answer:
        "See a doctor if you have 4+ migraine days per month, migraines significantly affect your daily life, over-the-counter medications are not effective, you use acute medications more than 10 days/month, or you experience new or changing headache patterns. A neurologist specializing in headache medicine can offer the most comprehensive care.",
    },
    {
      question: "How does the trigger threshold model work?",
      answer:
        "The trigger threshold theory suggests everyone has a migraine threshold -- an accumulation of triggers needed to provoke an attack. Individual triggers may not cause a migraine alone, but combined exposure (poor sleep + stress + weather change) can push you over threshold. Managing controllable triggers raises your effective threshold.",
    },
  ],
  formula:
    "Trigger Score = Sleep Score + Stress + Dehydration + Caffeine + Meal Skip + Weather + Screen/Light + Hormonal (max 24)",
};
