import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const noiseLevelCalculator: CalculatorDefinition = {
  slug: "noise-level-calculator",
  title: "Noise Level Calculator",
  description: "Free noise level calculator. Add decibels, compare noise levels, and check safe exposure times for hearing protection.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["noise level calculator", "decibel calculator", "dB calculator", "sound level", "hearing damage calculator"],
  variants: [
    {
      id: "addDb",
      name: "Add Two Sound Sources (dB)",
      fields: [
        { name: "db1", label: "Source 1 (dB)", type: "number", placeholder: "e.g. 80" },
        { name: "db2", label: "Source 2 (dB)", type: "number", placeholder: "e.g. 80" },
      ],
      calculate: (inputs) => {
        const db1 = inputs.db1 as number, db2 = inputs.db2 as number;
        if (db1 === undefined || db2 === undefined) return null;
        const combined = 10 * Math.log10(Math.pow(10, db1 / 10) + Math.pow(10, db2 / 10));
        return {
          primary: { label: "Combined Level", value: `${formatNumber(combined, 1)} dB` },
          details: [
            { label: "Source 1", value: `${db1} dB` },
            { label: "Source 2", value: `${db2} dB` },
            { label: "Increase", value: `+${formatNumber(combined - Math.max(db1, db2), 1)} dB` },
          ],
        };
      },
    },
    {
      id: "exposure",
      name: "Safe Exposure Time",
      fields: [
        { name: "db", label: "Noise Level (dB)", type: "number", placeholder: "e.g. 90" },
      ],
      calculate: (inputs) => {
        const db = inputs.db as number;
        if (!db) return null;
        const maxHours = db <= 85 ? Infinity : 8 / Math.pow(2, (db - 85) / 3);
        let timeStr: string;
        if (maxHours === Infinity) timeStr = "Unlimited (below 85 dB)";
        else if (maxHours >= 1) timeStr = `${formatNumber(maxHours, 1)} hours`;
        else if (maxHours * 60 >= 1) timeStr = `${formatNumber(maxHours * 60, 1)} minutes`;
        else timeStr = `${formatNumber(maxHours * 3600, 1)} seconds`;
        let example = "";
        if (db <= 30) example = "Whisper, quiet library";
        else if (db <= 50) example = "Quiet office, rainfall";
        else if (db <= 60) example = "Normal conversation";
        else if (db <= 70) example = "Vacuum cleaner, busy traffic";
        else if (db <= 80) example = "Alarm clock, busy restaurant";
        else if (db <= 90) example = "Lawn mower, motorcycle";
        else if (db <= 100) example = "Chainsaw, concert";
        else if (db <= 110) example = "Rock concert front row";
        else if (db <= 120) example = "Thunderclap, siren";
        else example = "Jet engine, gunshot";
        return {
          primary: { label: "Safe Exposure Time", value: timeStr },
          details: [
            { label: "Noise level", value: `${db} dB` },
            { label: "Similar to", value: example },
            { label: "Hearing protection", value: db >= 85 ? "Required" : "Not required" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["frequency-calculator", "scientific-calculator", "unit-converter"],
  faq: [{ question: "How loud is too loud?", answer: "85 dB and above can cause hearing damage with prolonged exposure. Safe exposure at 85 dB: 8 hours. At 88 dB: 4 hours. At 91 dB: 2 hours. At 100 dB: 15 minutes. At 110 dB: ~2 minutes. Always wear hearing protection above 85 dB." }],
  formula: "Combined dB = 10 × log₁₀(10^(dB₁/10) + 10^(dB₂/10)) | Exposure halves every 3 dB above 85",
};
