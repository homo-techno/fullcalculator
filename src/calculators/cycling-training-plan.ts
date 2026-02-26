import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cyclingTrainingPlanCalculator: CalculatorDefinition = {
  slug: "cycling-training-plan-calculator",
  title: "Cycling Training Plan Builder",
  description: "Free cycling training plan builder. Calculate FTP-based training zones, weekly structure, and TSS targets for structured cycling training.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["cycling training plan", "ftp zones", "cycling tss", "bike training", "cycling power zones"],
  variants: [
    {
      id: "ftp-zones",
      name: "FTP Power Zones",
      description: "Calculate your training zones from FTP",
      fields: [
        { name: "ftp", label: "FTP (watts)", type: "number", placeholder: "e.g. 250", min: 50, max: 500 },
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 165" },
        { name: "testType", label: "FTP Test Used", type: "select", options: [
          { label: "20-minute test (multiply by 0.95)", value: "20min" },
          { label: "Ramp test", value: "ramp" },
          { label: "60-minute test (actual FTP)", value: "60min" },
        ], defaultValue: "20min" },
      ],
      calculate: (inputs) => {
        let ftp = parseFloat(inputs.ftp as string);
        const weight = parseFloat(inputs.weight as string);
        const testType = inputs.testType as string;
        if (isNaN(ftp) || isNaN(weight)) return null;

        if (testType === "20min") ftp = ftp * 0.95;
        else if (testType === "ramp") ftp = ftp * 0.75;

        const weightKg = weight * 0.4536;
        const wpk = ftp / weightKg;

        let level = "Untrained";
        if (wpk >= 5.5) level = "World Class";
        else if (wpk >= 4.6) level = "Exceptional";
        else if (wpk >= 4.0) level = "Very Good";
        else if (wpk >= 3.4) level = "Good";
        else if (wpk >= 2.5) level = "Moderate";
        else if (wpk >= 2.0) level = "Fair";

        return {
          primary: { label: "FTP", value: `${formatNumber(ftp, 0)} watts` },
          details: [
            { label: "W/kg", value: formatNumber(wpk, 2) },
            { label: "Fitness Level", value: level },
            { label: "Z1 Active Recovery", value: `< ${formatNumber(ftp * 0.55, 0)}w` },
            { label: "Z2 Endurance", value: `${formatNumber(ftp * 0.56, 0)}-${formatNumber(ftp * 0.75, 0)}w` },
            { label: "Z3 Tempo", value: `${formatNumber(ftp * 0.76, 0)}-${formatNumber(ftp * 0.90, 0)}w` },
            { label: "Z4 Threshold", value: `${formatNumber(ftp * 0.91, 0)}-${formatNumber(ftp * 1.05, 0)}w` },
            { label: "Z5 VO2max", value: `${formatNumber(ftp * 1.06, 0)}-${formatNumber(ftp * 1.20, 0)}w` },
            { label: "Z6 Anaerobic", value: `${formatNumber(ftp * 1.21, 0)}-${formatNumber(ftp * 1.50, 0)}w` },
            { label: "Z7 Neuromuscular", value: `> ${formatNumber(ftp * 1.50, 0)}w` },
          ],
        };
      },
    },
    {
      id: "weekly-plan",
      name: "Weekly Training Plan",
      description: "Get a weekly cycling training structure",
      fields: [
        { name: "ftp", label: "FTP (watts)", type: "number", placeholder: "e.g. 250" },
        { name: "hoursPerWeek", label: "Available Hours/Week", type: "number", placeholder: "e.g. 8", min: 3, max: 25 },
        { name: "phase", label: "Training Phase", type: "select", options: [
          { label: "Base (aerobic foundation)", value: "base" },
          { label: "Build (increasing intensity)", value: "build" },
          { label: "Peak (race preparation)", value: "peak" },
          { label: "Recovery", value: "recovery" },
        ] },
        { name: "daysPerWeek", label: "Riding Days/Week", type: "number", placeholder: "e.g. 5", min: 3, max: 7, defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const ftp = parseFloat(inputs.ftp as string);
        const hours = parseFloat(inputs.hoursPerWeek as string);
        const phase = inputs.phase as string;
        const days = parseFloat(inputs.daysPerWeek as string);
        if (isNaN(ftp) || isNaN(hours) || isNaN(days)) return null;

        const tssPerHourZ2 = 55;
        const tssPerHourZ3 = 75;
        const tssPerHourZ4 = 90;

        let z2Pct = 0.8; let z3Pct = 0.15; let z4Pct = 0.05;
        if (phase === "build") { z2Pct = 0.65; z3Pct = 0.2; z4Pct = 0.15; }
        else if (phase === "peak") { z2Pct = 0.55; z3Pct = 0.2; z4Pct = 0.25; }
        else if (phase === "recovery") { z2Pct = 0.9; z3Pct = 0.1; z4Pct = 0; }

        const weeklyTSS = hours * (z2Pct * tssPerHourZ2 + z3Pct * tssPerHourZ3 + z4Pct * tssPerHourZ4);
        const avgTSSPerDay = weeklyTSS / days;
        const longRideHrs = hours * 0.35;

        return {
          primary: { label: "Weekly TSS Target", value: formatNumber(weeklyTSS, 0) },
          details: [
            { label: "Weekly Hours", value: formatNumber(hours, 1) },
            { label: "Riding Days", value: formatNumber(days, 0) },
            { label: "Avg TSS/Day", value: formatNumber(avgTSSPerDay, 0) },
            { label: "Z2 Endurance Time", value: `${formatNumber(hours * z2Pct, 1)} hrs (${formatNumber(z2Pct * 100, 0)}%)` },
            { label: "Z3 Tempo Time", value: `${formatNumber(hours * z3Pct, 1)} hrs (${formatNumber(z3Pct * 100, 0)}%)` },
            { label: "Z4+ Intensity Time", value: `${formatNumber(hours * z4Pct, 1)} hrs (${formatNumber(z4Pct * 100, 0)}%)` },
            { label: "Long Ride", value: `${formatNumber(longRideHrs, 1)} hrs (1x/week)` },
            { label: "Training Phase", value: phase.charAt(0).toUpperCase() + phase.slice(1) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pace-calculator", "heart-rate-calculator", "calorie-calculator"],
  faq: [
    { question: "What is FTP in cycling?", answer: "Functional Threshold Power (FTP) is the highest average power you can sustain for approximately one hour. It's the foundation of power-based training zones. Most riders estimate FTP from a 20-minute test (result x 0.95) or ramp test." },
    { question: "What is a good FTP?", answer: "FTP varies hugely. Untrained: 1.5-2.5 W/kg, recreational: 2.5-3.5 W/kg, competitive amateur: 3.5-4.5 W/kg, elite: 4.5-5.5 W/kg, professional: 5.5-7.0 W/kg. W/kg (watts per kilogram) is more meaningful than raw watts." },
    { question: "What is TSS?", answer: "Training Stress Score (TSS) quantifies workout load relative to your FTP. One hour at FTP = 100 TSS. Easy rides earn ~40-60 TSS/hr, tempo ~70-80, and threshold intervals ~85-100. Weekly TSS helps plan training load." },
  ],
  formula: "FTP Zones: Z1 <55%, Z2 56-75%, Z3 76-90%, Z4 91-105%, Z5 106-120%, Z6 121-150%, Z7 >150% | W/kg = FTP / Weight(kg)",
};
