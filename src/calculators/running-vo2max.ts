import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const runningVo2maxCalculator: CalculatorDefinition = {
  slug: "running-vo2max-calculator",
  title: "Running VO2max Calculator",
  description:
    "Free VO2max calculator from running pace. Estimate your VO2max from race results using the Jack Daniels and Cooper formulas without lab testing.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "vo2max from running",
    "running vo2max calculator",
    "jack daniels vdot",
    "cooper test vo2max",
    "vo2max from race time",
  ],
  variants: [
    {
      id: "race-result",
      name: "From Race Result",
      description: "Estimate VO2max from a race distance and time (Jack Daniels VDOT)",
      fields: [
        {
          name: "distance",
          label: "Race Distance",
          type: "select",
          options: [
            { label: "1500m", value: "1.5" },
            { label: "1 Mile", value: "1.60934" },
            { label: "3000m", value: "3" },
            { label: "5K", value: "5" },
            { label: "10K", value: "10" },
            { label: "Half Marathon", value: "21.0975" },
            { label: "Marathon", value: "42.195" },
          ],
          defaultValue: "5",
        },
        { name: "hours", label: "Hours", type: "number", placeholder: "0", min: 0 },
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 25", min: 0, max: 59 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 0", min: 0, max: 59 },
      ],
      calculate: (inputs) => {
        const distKm = parseFloat(inputs.distance as string);
        const hours = (inputs.hours as number) || 0;
        const mins = (inputs.minutes as number) || 0;
        const secs = (inputs.seconds as number) || 0;
        if (!distKm) return null;

        const totalMin = hours * 60 + mins + secs / 60;
        if (totalMin <= 0) return null;

        const distMeters = distKm * 1000;
        const velocity = distMeters / totalMin; // meters per minute

        // Jack Daniels VO2max estimation
        // Percent VO2max = 0.8 + 0.1894393 × e^(-0.012778 × t) + 0.2989558 × e^(-0.1932605 × t)
        const pctVO2 = 0.8 + 0.1894393 * Math.exp(-0.012778 * totalMin) +
          0.2989558 * Math.exp(-0.1932605 * totalMin);

        // VO2 at velocity = -4.6 + 0.182258 × v + 0.000104 × v²
        const vo2AtVelocity = -4.6 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);

        const vo2max = vo2AtVelocity / pctVO2;

        let level = "Below Average";
        if (vo2max >= 60) level = "Superior / Elite";
        else if (vo2max >= 52) level = "Excellent";
        else if (vo2max >= 44) level = "Good";
        else if (vo2max >= 36) level = "Average";
        else if (vo2max >= 28) level = "Below Average";
        else level = "Poor";

        const pacePerKm = totalMin / distKm;
        const paceMin = Math.floor(pacePerKm);
        const paceSec = Math.round((pacePerKm - paceMin) * 60);

        return {
          primary: { label: "Estimated VO2max", value: formatNumber(vo2max, 1), suffix: "ml/kg/min" },
          details: [
            { label: "Fitness Level", value: level },
            { label: "Race Pace", value: `${paceMin}:${paceSec.toString().padStart(2, "0")} /km` },
            { label: "Velocity", value: `${formatNumber(velocity, 1)} m/min` },
            { label: "% VO2max Used", value: `${formatNumber(pctVO2 * 100, 1)}%` },
          ],
        };
      },
    },
    {
      id: "cooper",
      name: "Cooper 12-Min Run Test",
      description: "Estimate VO2max from distance covered in 12 minutes",
      fields: [
        { name: "distance", label: "Distance Covered (meters)", type: "number", placeholder: "e.g. 2400", min: 1 },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        if (!distance) return null;

        // Cooper formula: VO2max = (d - 504.9) / 44.73
        const vo2max = (distance - 504.9) / 44.73;

        let level = "Below Average";
        if (vo2max >= 60) level = "Superior / Elite";
        else if (vo2max >= 52) level = "Excellent";
        else if (vo2max >= 44) level = "Good";
        else if (vo2max >= 36) level = "Average";
        else if (vo2max >= 28) level = "Below Average";
        else level = "Poor";

        const pacePerKm = 12 / (distance / 1000);
        const paceMin = Math.floor(pacePerKm);
        const paceSec = Math.round((pacePerKm - paceMin) * 60);

        return {
          primary: { label: "Estimated VO2max", value: formatNumber(vo2max, 1), suffix: "ml/kg/min" },
          details: [
            { label: "Distance", value: `${formatNumber(distance, 0)} m` },
            { label: "Fitness Level", value: level },
            { label: "Avg Pace", value: `${paceMin}:${paceSec.toString().padStart(2, "0")} /km` },
            { label: "Avg Speed", value: `${formatNumber(distance / 12 * 60 / 1000, 1)} km/h` },
          ],
          note: "The Cooper test is most accurate for well-paced efforts where you maintain a steady speed throughout the 12 minutes.",
        };
      },
    },
  ],
  relatedSlugs: ["vo2max-calculator", "pace-calculator", "race-predictor-calculator"],
  faq: [
    {
      question: "How is VO2max estimated from running?",
      answer:
        "The Jack Daniels VDOT formula uses your race distance and time to estimate VO2max. It accounts for the percentage of VO2max you can sustain over different durations. Shorter races use a higher percentage of VO2max than longer ones.",
    },
    {
      question: "What is a good VO2max for runners?",
      answer:
        "For males: 36-44 is average, 44-52 is good, 52-60 is excellent, 60+ is elite. For females: 30-38 is average, 38-46 is good, 46-56 is excellent, 56+ is elite. Elite marathon runners typically have VO2max values of 70-85.",
    },
    {
      question: "How accurate is VO2max from a race result?",
      answer:
        "The Jack Daniels formula is quite accurate (within 2-3 ml/kg/min of lab testing) for well-paced race efforts from 1500m to marathon. It is less accurate for undertrained runners or poorly paced races.",
    },
  ],
  formula: "Daniels: VO2max = VO2(v) / %VO2max | VO2(v) = -4.6 + 0.182258v + 0.000104v² | Cooper: VO2max = (d - 504.9) / 44.73",
};
