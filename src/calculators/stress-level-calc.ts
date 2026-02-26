import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stressLevelCalculator: CalculatorDefinition = {
  slug: "stress-level-calculator",
  title: "Perceived Stress Scale Calculator",
  description: "Free perceived stress scale (PSS) calculator. Assess your stress level using a validated psychological stress measurement tool based on Cohen's PSS-10.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["stress level calculator", "perceived stress scale", "pss calculator", "stress test", "stress assessment"],
  variants: [
    {
      id: "pss10",
      name: "Perceived Stress Scale (PSS-10)",
      description: "Rate how often you felt the following in the last month (0=Never, 1=Almost Never, 2=Sometimes, 3=Fairly Often, 4=Very Often)",
      fields: [
        { name: "q1", label: "Upset by unexpected events", type: "select", options: [
          { label: "Never (0)", value: "0" }, { label: "Almost Never (1)", value: "1" },
          { label: "Sometimes (2)", value: "2" }, { label: "Fairly Often (3)", value: "3" },
          { label: "Very Often (4)", value: "4" },
        ] },
        { name: "q2", label: "Unable to control important things", type: "select", options: [
          { label: "Never (0)", value: "0" }, { label: "Almost Never (1)", value: "1" },
          { label: "Sometimes (2)", value: "2" }, { label: "Fairly Often (3)", value: "3" },
          { label: "Very Often (4)", value: "4" },
        ] },
        { name: "q3", label: "Felt nervous and stressed", type: "select", options: [
          { label: "Never (0)", value: "0" }, { label: "Almost Never (1)", value: "1" },
          { label: "Sometimes (2)", value: "2" }, { label: "Fairly Often (3)", value: "3" },
          { label: "Very Often (4)", value: "4" },
        ] },
        { name: "q4pos", label: "Confident handling personal problems (positive)", type: "select", options: [
          { label: "Never (0)", value: "4" }, { label: "Almost Never (1)", value: "3" },
          { label: "Sometimes (2)", value: "2" }, { label: "Fairly Often (3)", value: "1" },
          { label: "Very Often (4)", value: "0" },
        ] },
        { name: "q5pos", label: "Things going your way (positive)", type: "select", options: [
          { label: "Never (0)", value: "4" }, { label: "Almost Never (1)", value: "3" },
          { label: "Sometimes (2)", value: "2" }, { label: "Fairly Often (3)", value: "1" },
          { label: "Very Often (4)", value: "0" },
        ] },
        { name: "q6", label: "Could not cope with everything", type: "select", options: [
          { label: "Never (0)", value: "0" }, { label: "Almost Never (1)", value: "1" },
          { label: "Sometimes (2)", value: "2" }, { label: "Fairly Often (3)", value: "3" },
          { label: "Very Often (4)", value: "4" },
        ] },
        { name: "q7pos", label: "Able to control irritations (positive)", type: "select", options: [
          { label: "Never (0)", value: "4" }, { label: "Almost Never (1)", value: "3" },
          { label: "Sometimes (2)", value: "2" }, { label: "Fairly Often (3)", value: "1" },
          { label: "Very Often (4)", value: "0" },
        ] },
        { name: "q8pos", label: "Felt on top of things (positive)", type: "select", options: [
          { label: "Never (0)", value: "4" }, { label: "Almost Never (1)", value: "3" },
          { label: "Sometimes (2)", value: "2" }, { label: "Fairly Often (3)", value: "1" },
          { label: "Very Often (4)", value: "0" },
        ] },
        { name: "q9", label: "Angered by things outside your control", type: "select", options: [
          { label: "Never (0)", value: "0" }, { label: "Almost Never (1)", value: "1" },
          { label: "Sometimes (2)", value: "2" }, { label: "Fairly Often (3)", value: "3" },
          { label: "Very Often (4)", value: "4" },
        ] },
        { name: "q10", label: "Difficulties piling up too high", type: "select", options: [
          { label: "Never (0)", value: "0" }, { label: "Almost Never (1)", value: "1" },
          { label: "Sometimes (2)", value: "2" }, { label: "Fairly Often (3)", value: "3" },
          { label: "Very Often (4)", value: "4" },
        ] },
      ],
      calculate: (inputs) => {
        const scores = [
          parseFloat(inputs.q1 as string), parseFloat(inputs.q2 as string),
          parseFloat(inputs.q3 as string), parseFloat(inputs.q4pos as string),
          parseFloat(inputs.q5pos as string), parseFloat(inputs.q6 as string),
          parseFloat(inputs.q7pos as string), parseFloat(inputs.q8pos as string),
          parseFloat(inputs.q9 as string), parseFloat(inputs.q10 as string),
        ];
        if (scores.some(isNaN)) return null;

        const total = scores.reduce((a, b) => a + b, 0);
        const pct = (total / 40) * 100;
        let level = "Low Stress";
        if (total >= 27) level = "High Perceived Stress";
        else if (total >= 14) level = "Moderate Stress";

        return {
          primary: { label: "PSS Score", value: `${formatNumber(total, 0)} / 40` },
          details: [
            { label: "Stress Level", value: level },
            { label: "Percentile (approx)", value: `${formatNumber(pct, 0)}%` },
            { label: "Negative Items Total", value: formatNumber(parseFloat(inputs.q1 as string) + parseFloat(inputs.q2 as string) + parseFloat(inputs.q3 as string) + parseFloat(inputs.q6 as string) + parseFloat(inputs.q9 as string) + parseFloat(inputs.q10 as string), 0) },
            { label: "Positive Items Total (reversed)", value: formatNumber(parseFloat(inputs.q4pos as string) + parseFloat(inputs.q5pos as string) + parseFloat(inputs.q7pos as string) + parseFloat(inputs.q8pos as string), 0) },
          ],
          note: total >= 27 ? "High stress scores are associated with increased health risks. Consider stress management techniques or consulting a professional." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["sleep-quality-score-calculator", "sleep-calculator", "calorie-calculator"],
  faq: [
    { question: "What is the Perceived Stress Scale?", answer: "The PSS-10 is a validated psychological tool developed by Sheldon Cohen. It measures the degree to which life situations are appraised as stressful over the last month. Scores range from 0-40, with higher scores indicating more perceived stress." },
    { question: "What do the PSS scores mean?", answer: "Scores of 0-13 indicate low stress, 14-26 moderate stress, and 27-40 high perceived stress. The average score in the U.S. population is around 13. Scores above 20 may warrant stress management intervention." },
    { question: "Is this a clinical diagnosis?", answer: "No, the PSS is a screening tool, not a diagnostic instrument. It measures perceived stress levels and can help identify when professional help may be beneficial. Always consult a healthcare provider for clinical concerns." },
  ],
  formula: "PSS Score = Sum of all 10 items (positive items reverse-scored) | Range: 0-40 | Low: 0-13, Moderate: 14-26, High: 27-40",
};
