import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marathonTrainingCalculator: CalculatorDefinition = {
  slug: "marathon-training-calculator",
  title: "Marathon Training Plan Calculator",
  description: "Free marathon training plan calculator. Get personalized training paces, weekly mileage, and race predictions based on your current fitness and goal time.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["marathon training calculator", "marathon pace", "running plan", "race predictor", "marathon training"],
  variants: [
    {
      id: "race-predictor",
      name: "Race Time Predictor",
      description: "Predict marathon time from a recent shorter race",
      fields: [
        { name: "raceDistance", label: "Recent Race Distance", type: "select", options: [
          { label: "5K", value: "5" },
          { label: "10K", value: "10" },
          { label: "Half Marathon", value: "21.1" },
        ] },
        { name: "raceMinutes", label: "Race Time - Minutes", type: "number", placeholder: "e.g. 25", min: 0, max: 300 },
        { name: "raceSeconds", label: "Race Time - Seconds", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
        { name: "weeksToRace", label: "Weeks Until Marathon", type: "number", placeholder: "e.g. 16", min: 4, max: 30 },
      ],
      calculate: (inputs) => {
        const dist = parseFloat(inputs.raceDistance as string);
        const min = parseFloat(inputs.raceMinutes as string);
        const sec = parseFloat(inputs.raceSeconds as string);
        const weeks = parseFloat(inputs.weeksToRace as string);
        if (isNaN(dist) || isNaN(min) || isNaN(sec) || isNaN(weeks)) return null;

        const totalSec = min * 60 + sec;
        const marathonDist = 42.195;
        const riegelsExponent = 1.06;
        const predictedSec = totalSec * Math.pow(marathonDist / dist, riegelsExponent);
        const predictedMin = predictedSec / 60;
        const predictedHrs = Math.floor(predictedMin / 60);
        const predictedRemMin = Math.floor(predictedMin % 60);
        const predictedRemSec = Math.round((predictedMin % 1) * 60);

        const pacePerMile = predictedSec / 26.2;
        const paceMin = Math.floor(pacePerMile / 60);
        const paceSec = Math.round(pacePerMile % 60);

        const pacePerKm = predictedSec / 42.195;
        const paceKmMin = Math.floor(pacePerKm / 60);
        const paceKmSec = Math.round(pacePerKm % 60);

        const easyPace = pacePerMile * 1.25;
        const easyMin = Math.floor(easyPace / 60);
        const easySec = Math.round(easyPace % 60);

        const tempoPace = pacePerMile * 0.93;
        const tempoMin = Math.floor(tempoPace / 60);
        const tempoSec = Math.round(tempoPace % 60);

        const peakMileage = weeks >= 16 ? 50 : weeks >= 12 ? 40 : 30;

        return {
          primary: { label: "Predicted Marathon Time", value: `${predictedHrs}:${String(predictedRemMin).padStart(2, "0")}:${String(predictedRemSec).padStart(2, "0")}` },
          details: [
            { label: "Race Pace /mile", value: `${paceMin}:${String(paceSec).padStart(2, "0")}` },
            { label: "Race Pace /km", value: `${paceKmMin}:${String(paceKmSec).padStart(2, "0")}` },
            { label: "Easy Run Pace /mile", value: `${easyMin}:${String(easySec).padStart(2, "0")}` },
            { label: "Tempo Pace /mile", value: `${tempoMin}:${String(tempoSec).padStart(2, "0")}` },
            { label: "Peak Weekly Mileage", value: `~${formatNumber(peakMileage, 0)} miles` },
            { label: "Weeks to Train", value: formatNumber(weeks, 0) },
            { label: "Training Plan Weeks", value: weeks >= 16 ? "Full 16-week plan" : weeks >= 12 ? "12-week plan" : "Accelerated plan" },
          ],
          note: "Riegel's formula works best for well-trained runners. Add 5-10% for first-time marathoners.",
        };
      },
    },
    {
      id: "training-paces",
      name: "Training Paces from Goal",
      description: "Calculate all training paces from your marathon goal time",
      fields: [
        { name: "goalHours", label: "Goal Time - Hours", type: "number", placeholder: "e.g. 3", min: 2, max: 7 },
        { name: "goalMinutes", label: "Goal Time - Minutes", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const hrs = parseFloat(inputs.goalHours as string);
        const mins = parseFloat(inputs.goalMinutes as string);
        if (isNaN(hrs) || isNaN(mins)) return null;

        const totalMin = hrs * 60 + mins;
        const pacePerMile = (totalMin * 60) / 26.2;
        const paceMin = Math.floor(pacePerMile / 60);
        const paceSec = Math.round(pacePerMile % 60);

        const fmt = (secs: number) => {
          const m = Math.floor(secs / 60);
          const s = Math.round(secs % 60);
          return `${m}:${String(s).padStart(2, "0")}`;
        };

        const easyPace = pacePerMile * 1.25;
        const longRunPace = pacePerMile * 1.15;
        const tempoPace = pacePerMile * 0.92;
        const intervalPace = pacePerMile * 0.85;
        const recoveryPace = pacePerMile * 1.35;

        const halfPred = totalMin * 0.47;
        const halfHr = Math.floor(halfPred / 60);
        const halfMin = Math.round(halfPred % 60);

        return {
          primary: { label: "Marathon Pace", value: `${paceMin}:${String(paceSec).padStart(2, "0")} /mile` },
          details: [
            { label: "Recovery Pace", value: `${fmt(recoveryPace)} /mile` },
            { label: "Easy Pace", value: `${fmt(easyPace)} /mile` },
            { label: "Long Run Pace", value: `${fmt(longRunPace)} /mile` },
            { label: "Tempo Pace", value: `${fmt(tempoPace)} /mile` },
            { label: "Interval Pace (800m-1mi)", value: `${fmt(intervalPace)} /mile` },
            { label: "Equiv. Half Marathon", value: `${halfHr}:${String(halfMin).padStart(2, "0")}` },
            { label: "Goal Time", value: `${formatNumber(hrs, 0)}:${String(Math.round(mins)).padStart(2, "0")}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pace-calculator", "calorie-calculator", "heart-rate-calculator"],
  faq: [
    { question: "How accurate is the Riegel formula?", answer: "Riegel's formula (T2 = T1 x (D2/D1)^1.06) is most accurate for well-trained runners using races within a factor of 4 in distance. Predicting a marathon from a 5K tends to be slightly optimistic; half marathon predictions are more reliable." },
    { question: "How many weeks do I need to train for a marathon?", answer: "Most plans are 16-20 weeks for first-timers and 12-16 weeks for experienced runners. You should be able to comfortably run 15-20 miles/week before starting a plan. The longest long run is typically 20-22 miles, 2-3 weeks before race day." },
    { question: "What should my easy run pace be?", answer: "Easy runs should be 1-2 minutes per mile slower than marathon pace. They should feel conversational. Most runners make the mistake of running easy days too fast, which hampers recovery and gains from hard workouts." },
  ],
  formula: "Riegel Prediction: T2 = T1 x (D2/D1)^1.06 | Easy Pace ≈ Marathon Pace x 1.25 | Tempo ≈ Marathon Pace x 0.92",
};
