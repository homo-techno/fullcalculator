import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trainingLoadCalculator: CalculatorDefinition = {
  slug: "training-load-calculator",
  title: "Training Load / TRIMP Calculator",
  description: "Free training load and TRIMP calculator. Quantify your workout stress using heart rate-based TRIMP, session RPE, and acute-to-chronic workload ratio.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["training load calculator", "trimp calculator", "session rpe", "acute chronic workload", "training stress"],
  variants: [
    {
      id: "trimp",
      name: "TRIMP (Training Impulse)",
      description: "Calculate heart rate-based training impulse",
      fields: [
        { name: "duration", label: "Exercise Duration (minutes)", type: "number", placeholder: "e.g. 45" },
        { name: "avgHR", label: "Average Heart Rate (bpm)", type: "number", placeholder: "e.g. 145" },
        { name: "restHR", label: "Resting Heart Rate (bpm)", type: "number", placeholder: "e.g. 60" },
        { name: "maxHR", label: "Max Heart Rate (bpm)", type: "number", placeholder: "e.g. 190" },
        { name: "sex", label: "Sex", type: "select", options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ] },
      ],
      calculate: (inputs) => {
        const dur = parseFloat(inputs.duration as string);
        const avgHR = parseFloat(inputs.avgHR as string);
        const restHR = parseFloat(inputs.restHR as string);
        const maxHR = parseFloat(inputs.maxHR as string);
        const sex = inputs.sex as string;
        if (isNaN(dur) || isNaN(avgHR) || isNaN(restHR) || isNaN(maxHR)) return null;

        const hrReserve = (avgHR - restHR) / (maxHR - restHR);
        const k = sex === "male" ? 1.92 : 1.67;
        const trimp = dur * hrReserve * 0.64 * Math.exp(k * hrReserve);

        let intensity = "Easy";
        if (hrReserve > 0.85) intensity = "Very Hard";
        else if (hrReserve > 0.7) intensity = "Hard";
        else if (hrReserve > 0.55) intensity = "Moderate";
        else if (hrReserve > 0.4) intensity = "Light";

        const hrZone = hrReserve <= 0.5 ? "Zone 1-2" : hrReserve <= 0.7 ? "Zone 3" : hrReserve <= 0.85 ? "Zone 4" : "Zone 5";

        return {
          primary: { label: "TRIMP Score", value: formatNumber(trimp, 1) },
          details: [
            { label: "Heart Rate Reserve", value: `${formatNumber(hrReserve * 100, 1)}%` },
            { label: "Heart Rate Zone", value: hrZone },
            { label: "Intensity", value: intensity },
            { label: "Duration", value: `${formatNumber(dur, 0)} min` },
            { label: "Gender Constant (k)", value: formatNumber(k, 2) },
            { label: "Typical TRIMP Range", value: "50-150 (moderate workout)" },
          ],
        };
      },
    },
    {
      id: "session-rpe",
      name: "Session RPE Training Load",
      description: "Calculate training load using the simpler session RPE method",
      fields: [
        { name: "duration", label: "Session Duration (minutes)", type: "number", placeholder: "e.g. 60" },
        { name: "rpe", label: "Session RPE (1-10)", type: "select", options: [
          { label: "1 - Very Light", value: "1" },
          { label: "2 - Light", value: "2" },
          { label: "3 - Moderate", value: "3" },
          { label: "4 - Somewhat Hard", value: "4" },
          { label: "5 - Hard", value: "5" },
          { label: "6 - Hard+", value: "6" },
          { label: "7 - Very Hard", value: "7" },
          { label: "8 - Very Hard+", value: "8" },
          { label: "9 - Near Maximal", value: "9" },
          { label: "10 - Maximal", value: "10" },
        ] },
      ],
      calculate: (inputs) => {
        const dur = parseFloat(inputs.duration as string);
        const rpe = parseFloat(inputs.rpe as string);
        if (isNaN(dur) || isNaN(rpe)) return null;

        const load = dur * rpe;
        let category = "Easy";
        if (load > 600) category = "Very High";
        else if (load > 400) category = "High";
        else if (load > 200) category = "Moderate";
        else if (load > 100) category = "Light";

        return {
          primary: { label: "Session Training Load", value: formatNumber(load, 0) },
          details: [
            { label: "Load Category", value: category },
            { label: "Duration", value: `${formatNumber(dur, 0)} min` },
            { label: "RPE", value: `${formatNumber(rpe, 0)} / 10` },
            { label: "Typical Light Day", value: "< 200 AU" },
            { label: "Typical Hard Day", value: "400-600 AU" },
          ],
        };
      },
    },
    {
      id: "acwr",
      name: "Acute:Chronic Workload Ratio",
      description: "Calculate your ACWR to monitor injury risk",
      fields: [
        { name: "week1", label: "This Week's Load", type: "number", placeholder: "e.g. 2000" },
        { name: "week2", label: "Last Week's Load", type: "number", placeholder: "e.g. 1800" },
        { name: "week3", label: "2 Weeks Ago Load", type: "number", placeholder: "e.g. 1600" },
        { name: "week4", label: "3 Weeks Ago Load", type: "number", placeholder: "e.g. 1500" },
      ],
      calculate: (inputs) => {
        const w1 = parseFloat(inputs.week1 as string);
        const w2 = parseFloat(inputs.week2 as string);
        const w3 = parseFloat(inputs.week3 as string);
        const w4 = parseFloat(inputs.week4 as string);
        if (isNaN(w1) || isNaN(w2) || isNaN(w3) || isNaN(w4)) return null;

        const acute = w1;
        const chronic = (w1 + w2 + w3 + w4) / 4;
        const acwr = chronic > 0 ? acute / chronic : 0;
        const weekChange = w2 > 0 ? ((w1 - w2) / w2) * 100 : 0;

        let risk = "Optimal (Sweet Spot)";
        if (acwr > 1.5) risk = "High Injury Risk (too much too soon)";
        else if (acwr > 1.3) risk = "Elevated Injury Risk";
        else if (acwr < 0.8) risk = "Detraining Zone (too little)";

        return {
          primary: { label: "ACWR", value: formatNumber(acwr, 2) },
          details: [
            { label: "Risk Level", value: risk },
            { label: "Acute Load (this week)", value: formatNumber(acute, 0) },
            { label: "Chronic Load (4-wk avg)", value: formatNumber(chronic, 0) },
            { label: "Week-over-Week Change", value: `${formatNumber(weekChange, 1)}%` },
            { label: "Optimal ACWR Range", value: "0.8 - 1.3" },
          ],
          note: acwr > 1.3 ? "ACWR above 1.3 is associated with increased injury risk. Consider reducing training load." : undefined,
        };
      },
    },
  ],
  relatedSlugs: ["heart-rate-calculator", "muscle-recovery-calculator", "vo2max-calculator"],
  faq: [
    { question: "What is TRIMP?", answer: "Training Impulse (TRIMP) is a method to quantify training load using duration and heart rate intensity. It accounts for the exponential nature of physiological stress at higher heart rates. Higher TRIMP means more training stress." },
    { question: "What is a good ACWR?", answer: "The acute-to-chronic workload ratio (ACWR) sweet spot is 0.8-1.3. Below 0.8 may lead to detraining, and above 1.5 significantly increases injury risk. Aim to increase weekly training load by no more than 10% per week." },
    { question: "Session RPE vs TRIMP?", answer: "Session RPE (duration x perceived exertion) is simpler and requires no heart rate monitor. TRIMP is more objective. Both are valid for monitoring training load. Session RPE correlates well with TRIMP in most studies." },
  ],
  formula: "TRIMP = Duration x HRR x 0.64 x e^(k x HRR) | Session Load = Duration x RPE | ACWR = Acute Load / Chronic Load (4-wk avg)",
};
