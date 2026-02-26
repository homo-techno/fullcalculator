import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const caffeineNapCalculator: CalculatorDefinition = {
  slug: "caffeine-nap-calculator",
  title: "Caffeine Timing Optimizer",
  description: "Free caffeine timing optimizer for sleep. Calculate your caffeine cutoff time, half-life, and optimal intake schedule to avoid sleep disruption.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["caffeine calculator", "caffeine half-life", "coffee sleep", "caffeine timing", "caffeine cutoff time"],
  variants: [
    {
      id: "cutoff",
      name: "Caffeine Cutoff Time",
      description: "Find when to stop consuming caffeine for good sleep",
      fields: [
        { name: "bedtime", label: "Planned Bedtime (24h format, e.g. 22 for 10 PM)", type: "number", placeholder: "e.g. 22", min: 0, max: 23 },
        { name: "sensitivity", label: "Caffeine Sensitivity", type: "select", options: [
          { label: "Low (fast metabolizer)", value: "low" },
          { label: "Normal", value: "normal" },
          { label: "High (slow metabolizer)", value: "high" },
        ], defaultValue: "normal" },
        { name: "dailyIntake", label: "Daily Caffeine (mg)", type: "number", placeholder: "e.g. 200", min: 0, max: 1000 },
      ],
      calculate: (inputs) => {
        const bedtime = parseFloat(inputs.bedtime as string);
        const sensitivity = inputs.sensitivity as string;
        const daily = parseFloat(inputs.dailyIntake as string);
        if (isNaN(bedtime) || isNaN(daily)) return null;

        const halfLife: Record<string, number> = { low: 4, normal: 5, high: 7 };
        const hl = halfLife[sensitivity] || 5;
        const clearanceHours = hl * 2;
        let cutoffHour = bedtime - clearanceHours;
        if (cutoffHour < 0) cutoffHour += 24;

        const cutoffAmPm = cutoffHour >= 12 ? `${cutoffHour === 12 ? 12 : cutoffHour - 12}:00 PM` : `${cutoffHour === 0 ? 12 : cutoffHour}:00 AM`;
        const bedAmPm = bedtime >= 12 ? `${bedtime === 12 ? 12 : bedtime - 12}:00 PM` : `${bedtime === 0 ? 12 : bedtime}:00 AM`;

        const atBedtime = daily * Math.pow(0.5, clearanceHours / hl);
        const mgAtBed25 = daily * 0.25;

        let sleepImpact = "Minimal";
        if (daily > 600) sleepImpact = "Severe - consider reducing intake";
        else if (daily > 400) sleepImpact = "Moderate - near FDA max";
        else if (daily > 200) sleepImpact = "Low if timing is correct";

        return {
          primary: { label: "Caffeine Cutoff Time", value: cutoffAmPm },
          details: [
            { label: "Bedtime", value: bedAmPm },
            { label: "Caffeine Half-Life", value: `${formatNumber(hl, 0)} hours` },
            { label: "Hours Before Bed", value: `${formatNumber(clearanceHours, 0)} hours` },
            { label: "Caffeine at Bedtime (if cutoff followed)", value: `~${formatNumber(atBedtime, 0)} mg` },
            { label: "Daily Intake", value: `${formatNumber(daily, 0)} mg` },
            { label: "Sleep Impact Risk", value: sleepImpact },
            { label: "FDA Recommended Max", value: "400 mg/day" },
          ],
        };
      },
    },
    {
      id: "caffeine-nap",
      name: "Caffeine Nap Timer",
      description: "Optimize the caffeine nap strategy for maximum alertness",
      fields: [
        { name: "caffeineAmount", label: "Caffeine Amount (mg)", type: "number", placeholder: "e.g. 100", min: 25, max: 400, defaultValue: 100 },
        { name: "currentTime", label: "Current Hour (24h)", type: "number", placeholder: "e.g. 14", min: 0, max: 23 },
        { name: "napDuration", label: "Nap Duration (minutes)", type: "number", placeholder: "e.g. 20", min: 10, max: 30, defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const caffeine = parseFloat(inputs.caffeineAmount as string);
        const hour = parseFloat(inputs.currentTime as string);
        const napMin = parseFloat(inputs.napDuration as string);
        if (isNaN(caffeine) || isNaN(hour) || isNaN(napMin)) return null;

        const peakHour = hour + (napMin / 60) + 0.5;
        const peakAmPm = Math.floor(peakHour) >= 12
          ? `${Math.floor(peakHour) === 12 ? 12 : Math.floor(peakHour) - 12}:${String(Math.round((peakHour % 1) * 60)).padStart(2, "0")} PM`
          : `${Math.floor(peakHour) === 0 ? 12 : Math.floor(peakHour)}:${String(Math.round((peakHour % 1) * 60)).padStart(2, "0")} AM`;

        const wakeUpMin = hour * 60 + napMin;
        const wakeHour = Math.floor(wakeUpMin / 60) % 24;
        const wakeMin = wakeUpMin % 60;
        const wakeAmPm = wakeHour >= 12
          ? `${wakeHour === 12 ? 12 : wakeHour - 12}:${String(wakeMin).padStart(2, "0")} PM`
          : `${wakeHour === 0 ? 12 : wakeHour}:${String(wakeMin).padStart(2, "0")} AM`;

        const alertDuration = 3;
        const endAlertHour = peakHour + alertDuration;

        return {
          primary: { label: "Wake-Up Time", value: wakeAmPm },
          details: [
            { label: "Step 1", value: `Drink ${formatNumber(caffeine, 0)} mg caffeine NOW` },
            { label: "Step 2", value: `Nap for ${formatNumber(napMin, 0)} minutes` },
            { label: "Step 3", value: `Wake at ${wakeAmPm}` },
            { label: "Peak Alertness", value: peakAmPm },
            { label: "Alertness Window", value: `~${formatNumber(alertDuration, 0)} hours after peak` },
            { label: "Why It Works", value: "Sleep clears adenosine while caffeine blocks its receptors" },
          ],
          note: "Caffeine naps work best with 100-200mg caffeine and 15-20 minute naps. Don't nap longer than 25 minutes to avoid deep sleep inertia.",
        };
      },
    },
  ],
  relatedSlugs: ["sleep-quality-score-calculator", "sleep-calculator", "calorie-calculator"],
  faq: [
    { question: "How long before bed should I stop drinking coffee?", answer: "For most people (normal metabolizers), stop caffeine 8-10 hours before bed. Fast metabolizers can cut off 6-8 hours before, while slow metabolizers should stop 10-14 hours before. Caffeine's half-life is 5 hours on average." },
    { question: "What is a caffeine nap?", answer: "A caffeine nap involves drinking coffee immediately before a 15-20 minute nap. The nap clears adenosine (sleepiness molecule) from your brain, and the caffeine kicks in right as you wake, resulting in enhanced alertness compared to either alone." },
    { question: "How much caffeine is too much?", answer: "The FDA recommends no more than 400mg/day for healthy adults (about 4 cups of coffee). Pregnant women should limit to 200mg. Sensitivity varies by genetics, medications, and tolerance." },
  ],
  formula: "Cutoff Time = Bedtime - (Half-Life x 2) | Caffeine at Bedtime = Dose x 0.5^(Hours/Half-Life) | Half-Life ≈ 5 hours (avg)",
};
